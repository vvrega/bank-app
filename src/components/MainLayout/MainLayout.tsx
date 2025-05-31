'use client';
import styles from './MainLayout.module.css';
import { Group, Tabs, Text, Box } from '@mantine/core';
import {
  IconHome,
  IconDatabaseDollar,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { HomePanel } from './HomePanel/HomePanel';
import { SettingsPanel } from './SettingsPanel/SettingsPanel';
import { useRouter } from 'next/navigation';

const MainLayout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('http://localhost:4000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/');
  };

  return (
    <Box className={styles.mainContainer}>
      <Group w={200}>
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
            Hello,{' '}
          </Text>
          <Text size="16px" fw={700} w={200}>
            Firstname Lastname!
          </Text>
        </Group>
      </Group>
      <Tabs
        variant="pills"
        orientation="vertical"
        defaultValue="home"
        color="white"
      >
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
  );
};

export default MainLayout;
