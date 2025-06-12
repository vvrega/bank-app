import { useState } from 'react';
import { Box, Text, Group, Button } from '@mantine/core';
import styles from './ContactsHomeTab.module.css';
import sharedStyles from '../HomePanel.module.css';
import { IconPlus } from '@tabler/icons-react';
import { ContactList } from './ContactList/ContactList';
import { AddContactModal } from '@/components/Modals/AddContactModal';
import { useQuery } from '@tanstack/react-query';

export const ContactsHomeTab = () => {
  const [modalOpened, setModalOpened] = useState(false);

  const { data: contactsData, refetch: refetchContacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const res = await fetch('/api/contacts');
      if (!res.ok) throw new Error('Failed to fetch contacts');
      return res.json();
    },
  });

  const { data: accountsData = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/accounts');
      if (!res.ok) throw new Error('Failed to fetch accounts');
      return res.json();
    },
  });

  const contacts = contactsData?.contacts || [];
  const accounts = accountsData?.accounts || accountsData || [];

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
        onContactAdded={() => refetchContacts()}
      />
    </Box>
  );
};
