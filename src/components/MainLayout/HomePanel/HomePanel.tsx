import { Text, Tabs } from '@mantine/core';
import { IconWallet, IconAddressBook } from '@tabler/icons-react';
import { AccountsHomeTab } from './AccountsHomeTab/AccountsHomeTab';
import styles from './HomePanel.module.css';
import { ContactsHomeTab } from './ContactsHomeTab/ContactsHomeTab';

export const HomePanel = () => {
  return (
    <>
      <Text className={styles.headerTitle}>Home</Text>
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

        <Tabs.Panel value="accounts">
          <AccountsHomeTab />
        </Tabs.Panel>

        <Tabs.Panel value="contacts">
          <ContactsHomeTab />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};
