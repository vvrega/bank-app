import { Box, Text, Group, Button } from '@mantine/core';
import styles from './ContactsHomeTab.module.css';
import sharedStyles from '../HomePanel.module.css';
import { IconPlus } from '@tabler/icons-react';
import { ContactList } from './ContactList/ContactList';
import { AddContactModal } from '@/components/Modals/AddContactModal';
import { useModal } from '@/hooks/useModal';
import { useContacts } from '@/hooks/api/useContacts';
import { useAccounts } from '@/hooks/api/useAccounts';

export const ContactsHomeTab = () => {
  const contactModal = useModal();

  const { data: contactsData = { contacts: [] }, refetch: refetchContacts } =
    useContacts();
  const { data: accountsData = [] } = useAccounts();

  const contacts = contactsData?.contacts || [];
  const accounts = accountsData || [];

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
          onClick={contactModal.open}
        >
          Add new
        </Button>
      </Group>
      <Box>
        <ContactList contacts={contacts} accounts={accounts} />
      </Box>
      <AddContactModal
        opened={contactModal.isOpen}
        onClose={contactModal.close}
        onContactAdded={refetchContacts}
      />
    </Box>
  );
};
