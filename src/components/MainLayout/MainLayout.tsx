'use client';
import React, { useEffect, useState } from 'react';
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

const MainLayout = () => {
  const router = useRouter();
  const [user, setUser] = useState<{
    firstname: string;
    lastname: string;
  } | null>(null);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${768}px)`);
  const [tab, setTab] = useState<string | null>('home');

  useEffect(() => {
    fetch('http://localhost:4000/api/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user)
          setUser({
            firstname: data.user.firstName,
            lastname: data.user.lastName,
          });
      });
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:4000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/');
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
                Hello,
              </Text>
              <Text size="16px" fw={700} w={200}>
                {user ? `${user.firstname} ${user.lastname}!` : 'Loading...'}
              </Text>
            </Group>
            <Tabs
              value={tab}
              onChange={setTab}
              variant="pills"
              orientation="vertical"
              color="white"
            >
              {navTabs}
            </Tabs>
          </Drawer>
        </>
      ) : (
        <Group
          w={200}
          style={{ flexDirection: 'column', alignItems: 'flex-start' }}
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
              {user ? `${user.firstname} ${user.lastname}!` : 'Loading...'}
            </Text>
          </Group>
          <Tabs
            value={tab}
            onChange={setTab}
            variant="pills"
            orientation="vertical"
            color="white"
          >
            {navTabs}
          </Tabs>
        </Group>
      )}

      <Box className={styles.panelsBox}>
        <Tabs value={tab} onChange={setTab}>
          <Tabs.Panel value="home" className={styles.tabsPanel}>
            <HomePanel />
          </Tabs.Panel>
          <Tabs.Panel value="stocks" className={styles.tabsPanel}>
            Stocks tab content
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
