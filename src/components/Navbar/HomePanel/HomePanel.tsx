import { Text, Tabs } from '@mantine/core';
import { IconWallet, IconAddressBook } from '@tabler/icons-react';
import { AccountsHomeTab } from './AccountsHomeTab/AccountsHomeTab';
import styles from './HomePanel.module.css';

export const HomePanel = () => {
  return (
    <>
      <Text size="40px" fw={700} mb="xl">
        Home
      </Text>
      <Tabs defaultValue="accounts">
        <Tabs.List bd="none" className={styles.homeTabsList}>
          <Tabs.Tab
            value="accounts"
            leftSection={<IconWallet size="18px" />}
            className={styles.homeTabElement}
          >
            Accounts
          </Tabs.Tab>
          <Tabs.Tab
            value="contacts"
            leftSection={<IconAddressBook size="18px" />}
            className={styles.homeTabElement}
          >
            Contacts
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="accounts" className={styles.homeTabPanel}>
          <AccountsHomeTab />
        </Tabs.Panel>

        <Tabs.Panel value="contacts" className={styles.homeTabPanel}>
          Contacts tab content
        </Tabs.Panel>
      </Tabs>
    </>
  );
};
