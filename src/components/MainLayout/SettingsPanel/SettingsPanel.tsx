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
import { useState, useEffect } from 'react';
import sharedStyles from '../HomePanel/HomePanel.module.css';

function isValidPassword(password: string) {
  return /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
    password
  );
}

export const SettingsPanel = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [iban, setIban] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user && data.user.iban) setIban(data.user.iban);
      });
  }, []);

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (!password || !newPassword || !confirmNewPassword) return;
    if (!isValidPassword(newPassword)) {
      setPasswordError(
        'Password must be at least 8 characters, contain a capital letter and a symbol'
      );
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: password,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordChanged(true);
        setTimeout(() => setPasswordChanged(false), 2000);
        setPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordError(data.error || 'Password change failed');
      }
    } catch {
      setPasswordError('Password change failed');
    }
  };

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
          error={
            newPassword && !isValidPassword(newPassword)
              ? 'Password must be at least 8 characters, contain a capital letter and a symbol'
              : undefined
          }
        />
        <PasswordInput
          label="Confirm new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
          mb="md"
          required
          error={
            passwordError ||
            (newPassword &&
            confirmNewPassword &&
            newPassword !== confirmNewPassword
              ? "Passwords don't match"
              : undefined)
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
              newPassword !== confirmNewPassword ||
              !isValidPassword(newPassword)
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
