import { useState, useEffect } from 'react';
import {
  Box,
  Group,
  Text,
  Button,
  Paper,
  Stack,
  CopyButton,
  ScrollArea,
  Tooltip,
} from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';

import sharedStyles from '@/components/MainLayout/HomePanel/HomePanel.module.css';
import { TransferModal } from '@/components/Modals/TransferModal';
import { ContactTransactionsModal } from '@/components/Modals/ContactTransactionsModal';
import { Contact, Account } from '@/types/types';
import { useUserData } from '@/hooks/api/useUserData';

interface ContactListProps {
  contacts: Contact[];
  accounts: Account[];
}

export function ContactList({
  contacts = [],
  accounts = [],
}: ContactListProps) {
  const [transferModalOpened, setTransferModalOpened] = useState(false);
  const [transferContact, setTransferContact] = useState<Contact | null>(null);
  const [historyModalOpened, setHistoryModalOpened] = useState(false);
  const [historyContact, setHistoryContact] = useState<Contact | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const { data: userData } = useUserData();

  useEffect(() => {
    if (accounts.length > 0 && accounts[0].userId) {
      setCurrentUserId(accounts[0].userId);
    } else if (userData && userData.user && userData.user.id) {
      setCurrentUserId(userData.user.id);
    } else {
      setCurrentUserId(null);
    }
  }, [accounts, userData]);

  const handleNewTransfer = (contact: Contact) => {
    setTransferContact(contact);
    setTransferModalOpened(true);
  };

  const handleSeeHistory = (contact: Contact) => {
    setHistoryContact(contact);
    setHistoryModalOpened(true);
  };

  const contactsArray = Array.isArray(contacts) ? contacts : [];

  return (
    <Box>
      <ScrollArea h="45vh" mb="sm">
        <Stack gap="sm" m="lg">
          {contactsArray.map((contact) => (
            <Paper
              key={contact.id}
              style={{
                borderBottom: '1px solid #e0e0e0',
                borderRadius: '0px',
                margin: '0 24px',
              }}
            >
              <Group>
                <Box>
                  <Text fw={500}>{contact.name}</Text>
                  {contact.contactUser && (
                    <Text size="xs" c="dimmed" mb={2}>
                      {contact.contactUser.firstName}{' '}
                      {contact.contactUser.lastName}
                    </Text>
                  )}
                  <Group gap="xs" mt={4}>
                    <Text size="xs" c="dimmed" lts={1}>
                      {contact.contactUserIban}
                    </Text>
                    <CopyButton value={contact.contactUserIban}>
                      {({ copied, copy }) => (
                        <Tooltip
                          label={copied ? 'Copied!' : 'Copy'}
                          withArrow
                          position="right"
                        >
                          <Button
                            variant="subtle"
                            size="xs"
                            color={copied ? 'teal' : 'blue'}
                            onClick={copy}
                            px={6}
                          >
                            {copied ? (
                              <IconCheck size={16} />
                            ) : (
                              <IconCopy size={16} />
                            )}
                          </Button>
                        </Tooltip>
                      )}
                    </CopyButton>
                  </Group>
                  <Group gap={0}>
                    <Button
                      size="xs"
                      variant="light"
                      className={sharedStyles.stringButton}
                      style={{ fontSize: '12px' }}
                      onClick={() => handleNewTransfer(contact)}
                    >
                      New transfer
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      className={sharedStyles.stringButton}
                      style={{ fontSize: '12px' }}
                      onClick={() => handleSeeHistory(contact)}
                    >
                      See transactions history
                    </Button>
                  </Group>
                </Box>
              </Group>
            </Paper>
          ))}
        </Stack>
      </ScrollArea>
      {transferContact && (
        <TransferModal
          opened={transferModalOpened}
          onClose={() => setTransferModalOpened(false)}
          accounts={accounts}
          initialIban={transferContact.contactUserIban}
          initialName={
            transferContact.contactUser
              ? `${transferContact.contactUser.firstName} ${transferContact.contactUser.lastName}`
              : transferContact.name
          }
        />
      )}
      {historyContact && currentUserId !== null && (
        <ContactTransactionsModal
          opened={historyModalOpened}
          onClose={() => setHistoryModalOpened(false)}
          contactUserId={historyContact.contactUserId}
          accounts={accounts}
          currentUserId={currentUserId}
        />
      )}
    </Box>
  );
}
