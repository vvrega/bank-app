import {
  Box,
  Button,
  CopyButton,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useState } from 'react';
import sharedStyles from '../HomePanel/HomePanel.module.css';

export const SettingsPanel = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleChangePassword = () => {
    if (!password || !newPassword || !confirmNewPassword) return;
    if (newPassword !== confirmNewPassword) return;

    setPasswordChanged(true);
    setTimeout(() => setPasswordChanged(false), 2000);
    setPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const iban = 'PL61109010140000071219812874';

  return (
    <>
      <Text size="40px" fw={700} mb="xl">
        Account Settings
      </Text>
      <Box className={sharedStyles.tabsPanelContainer} maw="40vw" p="40px">
        <TextInput
          label="IBAN Number"
          value={iban}
          disabled
          rightSection={
            <CopyButton value={iban} timeout={1500}>
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
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </Button>
                </Tooltip>
              )}
            </CopyButton>
          }
          mb="lg"
        />
        <PasswordInput
          label="Current password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          mb="sm"
          required
        />
        <PasswordInput
          label="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value)}
          mb="sm"
          required
        />
        <PasswordInput
          label="Confirm new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
          mb="md"
          required
          error={
            newPassword &&
            confirmNewPassword &&
            newPassword !== confirmNewPassword
              ? "Passwords don't match"
              : undefined
          }
        />
        <Group justify="center">
          <Button
            className={sharedStyles.actionButton}
            onClick={handleChangePassword}
            disabled={
              !password ||
              !newPassword ||
              !confirmNewPassword ||
              newPassword !== confirmNewPassword
            }
          >
            Change password
          </Button>
        </Group>
        {passwordChanged && (
          <Text c="green" mt="md" size="sm">
            Password changed successfully!
          </Text>
        )}
      </Box>
    </>
  );
};
