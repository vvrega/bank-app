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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import styles from './SettingsPanel.module.css';
import sharedStyles from '../HomePanel/HomePanel.module.css';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain a capital letter')
      .regex(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
        'Password must contain a symbol'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export const SettingsPanel = () => {
  const { data: session } = useSession();
  const [iban, setIban] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setError: setFormError,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (session?.user) {
      fetch('/api/me')
        .then((res) =>
          res.ok
            ? res.json()
            : Promise.reject(new Error('Failed to fetch user data'))
        )
        .then((data) => {
          if (data.user && data.user.iban) setIban(data.user.iban);
        })
        .catch((err) => {
          console.error('Error fetching user data:', err);
        });
    }
  }, [session]);

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setError(null);

      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (res.ok) {
        setPasswordChanged(true);
        setTimeout(() => setPasswordChanged(false), 2000);
        reset();
      } else {
        const errorData = await res.json();

        if (errorData.error === 'Current password is incorrect') {
          setFormError('currentPassword', {
            type: 'manual',
            message: 'Current password is incorrect',
          });
        } else {
          setError(errorData.error || 'Password change failed');
        }
      }
    } catch (error) {
      setError('Password change failed. Please try again.');
      console.error('Password change failed', error);
    }
  };

  return (
    <>
      <Text className={sharedStyles.headerTitle}>Account Settings</Text>
      <Box
        className={`${sharedStyles.tabsPanelContainer} ${styles.settingsContainer}`}
      >
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <PasswordInput
            label="Current password"
            {...register('currentPassword')}
            mb="sm"
            required
            error={errors.currentPassword?.message}
          />
          <PasswordInput
            label="New password"
            {...register('newPassword')}
            mb="sm"
            required
            error={errors.newPassword?.message}
          />
          <PasswordInput
            label="Confirm new password"
            {...register('confirmPassword')}
            mb="md"
            required
            error={errors.confirmPassword?.message}
          />
          {error && (
            <Text c="red" size="sm" mb="md" ta="center">
              {error}
            </Text>
          )}
          <Group justify="center">
            <Button
              className={sharedStyles.actionButton}
              type="submit"
              disabled={!isValid}
            >
              Change password
            </Button>
          </Group>
          {passwordChanged && (
            <Text c="green" mt="md" size="sm" ta="center">
              Password changed successfully!
            </Text>
          )}
        </form>
      </Box>
    </>
  );
};
