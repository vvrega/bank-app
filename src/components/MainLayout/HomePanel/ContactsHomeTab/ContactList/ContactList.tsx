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

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  iban: string;
}

interface ContactListProps {
  contacts: Contact[];
}

export function ContactList({ contacts }: ContactListProps) {
  return (
    <Box>
      <ScrollArea h="45vh">
        <Stack gap="sm" m="lg">
          {contacts.map((contact) => (
            <Paper
              key={contact.id}
              style={{
                borderBottom: '1px solid #e0e0e0',
                borderRadius: '0px',
                margin: '0 24px',
              }}
            >
              <Group justify="space-between" align="center">
                <Box>
                  <Text fw={500}>
                    {contact.firstName} {contact.lastName}
                  </Text>
                  <Group gap="xs" mt={4}>
                    <Text size="xs" c="dimmed" style={{ letterSpacing: 1 }}>
                      {contact.iban}
                    </Text>
                    <CopyButton value={contact.iban}>
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
                </Box>
                <Button
                  size="xs"
                  variant="light"
                  className={sharedStyles.stringButton}
                  style={{ fontSize: '12px' }}
                >
                  See transactions history
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      </ScrollArea>
    </Box>
  );
}
