import { Box, Text, Group, Button, ScrollArea } from '@mantine/core';
import styles from './ContactsHomeTab.module.css';
import sharedStyles from '../HomePanel.module.css';
import { IconPlus } from '@tabler/icons-react';
import { ContactList } from './ContactList/ContactList';
import { contacts } from '@/app/_mock/contacts';

export const ContactsHomeTab = () => {
  return (
    <Box
      className={`${sharedStyles.tabsPanelContainer} ${styles.mainContainer}`}
    >
      <Group justify="space-between" m="lg">
        <Text size="14px" mt="lg">
          Your contacts list
        </Text>
        <Button
          variant="light"
          size="xs"
          mt="lg"
          leftSection={<IconPlus size={14} />}
          className={sharedStyles.actionButton}
        >
          Add new
        </Button>
      </Group>
      <Box>
        <ContactList contacts={contacts} />
      </Box>
    </Box>
  );
};
