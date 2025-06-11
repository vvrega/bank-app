'use client';
import { useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';
import { signOut, useSession } from 'next-auth/react';

const MainLayout = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${768}px)`);
  const [tab, setTab] = useState<string | null>('home');

  if (!session) {
    router.replace('/');
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
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
          onClick={handleLogout}
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
                Hello, {session.user?.name}
              </Text>
            </Group>
            <Tabs value={tab} onChange={setTab} orientation="vertical">
              {navTabs}
            </Tabs>
          </Drawer>
        </>
      ) : (
        <Tabs value={tab} onChange={setTab} className={styles.tabsPanel}>
          {navTabs}
        </Tabs>
      )}
      <Box className={styles.panelsBox}>
        {tab === 'home' && <HomePanel />}
        {tab === 'stocks' && <div>Stocks panel</div>}
        {tab === 'settings' && <SettingsPanel />}
      </Box>
    </Box>
  );
};

export default MainLayout;
