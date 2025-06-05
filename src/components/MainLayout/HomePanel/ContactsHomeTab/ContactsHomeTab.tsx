import { useState, useEffect } from 'react';
import { Box, Text, Group, Button } from '@mantine/core';
import styles from './ContactsHomeTab.module.css';
import sharedStyles from '../HomePanel.module.css';
import { IconPlus } from '@tabler/icons-react';
import { ContactList } from './ContactList/ContactList';
import { AddContactModal } from '@/components/Modals/AddContactModal';

export interface Contact {
  id: number;
  name: string;
  contactUserIban: string;
  contactUserId: number;
  contactUser?: {
    firstName: string;
    lastName: string;
  };
}

export interface Account {
  id: number;
  userId: number;
  currency: string;
  balance: number;
}

export const ContactsHomeTab = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const fetchContacts = async () => {
    const res = await fetch('http://localhost:4000/api/contacts', {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setContacts(data.contacts);
    }
  };

  const fetchAccounts = async () => {
    const res = await fetch('http://localhost:4000/api/accounts', {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setAccounts(data.accounts);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchAccounts();
  }, []);

  return (
    <Box
      className={`${sharedStyles.tabsPanelContainer} ${styles.mainContainer}`}
    >
      <Group justify="space-between" m="lg">
        <Text size="18px" mt="lg" fw={700}>
          Your contacts list
        </Text>
        <Button
          variant="light"
          size="xs"
          mt="lg"
          leftSection={<IconPlus size={14} />}
          className={sharedStyles.actionButton}
          onClick={() => setModalOpened(true)}
        >
          Add new
        </Button>
      </Group>
      <Box>
        <ContactList contacts={contacts} accounts={accounts} />
      </Box>
      <AddContactModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onContactAdded={fetchContacts}
      />
    </Box>
  );
};
