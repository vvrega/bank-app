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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './SettingsPanel.module.css';
import sharedStyles from '../HomePanel/HomePanel.module.css';
import { useUserData } from '@/hooks/api/useUserData';
import { useChangePassword } from '@/hooks/api/useChangePassword';

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
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: userData } = useUserData();
  const changePassword = useChangePassword();

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

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setError(null);

      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      setPasswordChanged(true);
      setTimeout(() => setPasswordChanged(false), 2000);
      reset();
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === 'Current password is incorrect'
      ) {
        setFormError('currentPassword', {
          type: 'manual',
          message: 'Current password is incorrect',
        });
      } else {
        setError('Password change failed. Please try again.');
      }
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
          value={userData?.user?.iban || ''}
          disabled
          rightSection={
            <CopyButton value={userData?.user?.iban || ''} timeout={1500}>
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
              loading={changePassword.isPending}
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
