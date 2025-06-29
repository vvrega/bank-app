'use client';
import { useState, useEffect } from 'react';
import styles from './MainLayout.module.css';
import { Group, Tabs, Text, Box, Burger, Drawer } from '@mantine/core';
import {
  IconHome,
  IconDatabaseDollar,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { HomePanel } from './HomePanel/HomePanel';
import { SettingsPanel } from './SettingsPanel/SettingsPanel';
import { StocksPanel } from './StocksPanel/StocksPanel';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';
import { signOut } from 'next-auth/react';
import { useAuthSession } from '@/hooks/api/useAuthSession';
import { useQueryClient } from '@tanstack/react-query';

interface MainLayoutProps {
  initialTab?: string;
}

const MainLayout = ({ initialTab = 'home' }: MainLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useAuthSession();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${768}px)`);
  const [tab, setTab] = useState<string | null>(initialTab);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (pathname === '/home') setTab('home');
    else if (pathname === '/stocks') setTab('stocks');
    else if (pathname === '/settings') setTab('settings');
  }, [pathname]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    queryClient.clear();
    router.replace('/');
  };

  const handleTabChange = (value: string | null) => {
    if (!value) return;

    setTab(value);

    if (value === 'logout') {
      handleLogout();
      return;
    }

    router.push(`/${value}`);
  };

  const navTabs = (
    <>
      <Tabs.List className={styles.tabsList}>
        <Tabs.Tab
          value="home"
          className={styles.tabElement}
          leftSection={<IconHome size={20} />}
        >
          Home
        </Tabs.Tab>
        <Tabs.Tab
          value="stocks"
          className={styles.tabElement}
          leftSection={<IconDatabaseDollar size={20} />}
        >
          Stocks
        </Tabs.Tab>
        <Tabs.Tab
          value="settings"
          className={styles.tabElement}
          leftSection={<IconSettings size={20} />}
        >
          Settings
        </Tabs.Tab>
        <Tabs.Tab
          color="#f1f3f5"
          value="logout"
          className={styles.tabElement}
          leftSection={<IconLogout size={20} />}
        >
          Log out
        </Tabs.Tab>
      </Tabs.List>
    </>
  );

  return (
    <Box className={styles.mainContainer}>
      {isMobile ? (
        <>
          <Burger
            opened={drawerOpened}
            onClick={() => setDrawerOpened((o) => !o)}
            aria-label="Open navigation"
            size="md"
          />
          <Drawer
            opened={drawerOpened}
            onClose={() => setDrawerOpened(false)}
            padding="md"
            size="xs"
            zIndex={1000}
          >
            <Group
              display="flex"
              dir="column"
              w={200}
              gap={5}
              align="flex-start"
              justify="flex-start"
              mb={27}
            >
              <Text size="16px" fw={700} w={200}>
                Hello,
              </Text>
              <Text size="16px" fw={700} w={200}>
                {session.user?.name}
              </Text>
            </Group>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="pills"
              orientation="vertical"
              color="white"
            >
              {navTabs}
            </Tabs>
          </Drawer>
        </>
      ) : (
        <>
          <Group
            display="flex"
            dir="column"
            w={200}
            gap={5}
            align="flex-start"
            justify="flex-start"
            mb={27}
          >
            <Text size="16px" fw={700} w={200}>
              Hello,
            </Text>
            <Text size="16px" fw={700} w={200}>
              {session.user?.name}
            </Text>
          </Group>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="pills"
            orientation="vertical"
            color="white"
          >
            {navTabs}
          </Tabs>
        </>
      )}
      <Box className={styles.panelsBox}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tabs.Panel value="home" className={styles.tabsPanel}>
            <HomePanel />
          </Tabs.Panel>
          <Tabs.Panel value="stocks" className={styles.tabsPanel}>
            <StocksPanel />
          </Tabs.Panel>
          <Tabs.Panel value="settings" className={styles.tabsPanel}>
            <SettingsPanel />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  );
};

export default MainLayout;
