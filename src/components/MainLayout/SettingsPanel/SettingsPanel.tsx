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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './SettingsPanel.module.css';
import sharedStyles from '../HomePanel/HomePanel.module.css';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain a capital letter')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a symbol');

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Confirm new password is required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

type FormValues = z.infer<typeof schema>;

export const SettingsPanel = () => {
  const { data: session } = useSession();
  const [passwordChanged, setPasswordChanged] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const iban = session?.user?.iban || '';

  const onSubmit = async (data: FormValues) => {
    setPasswordChanged(false);
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
      reset();
    }
  };

  return (
    <Box className={styles.settingsContainer}>
      <Text fw={700} size="lg" mb="md">
        Settings
      </Text>
      <TextInput
        label="IBAN"
        value={iban}
        readOnly
        rightSection={
          <CopyButton value={iban}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? 'Copied' : 'Copy'}
                withArrow
                position="right"
              >
                <span onClick={copy}>
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </span>
              </Tooltip>
            )}
          </CopyButton>
        }
        mb="md"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <PasswordInput
          label="Current password"
          {...register('currentPassword')}
          mb="sm"
          error={errors.currentPassword?.message}
        />
        <PasswordInput
          label="New password"
          {...register('newPassword')}
          mb="sm"
          error={errors.newPassword?.message}
        />
        <PasswordInput
          label="Confirm new password"
          {...register('confirmNewPassword')}
          mb="md"
          error={errors.confirmNewPassword?.message}
        />
        <Group justify="center">
          <Button
            className={sharedStyles.actionButton}
            type="submit"
            loading={isSubmitting}
          >
            Change password
          </Button>
        </Group>
        {passwordChanged && (
          <Text c="green" mt="md" size="sm">
            Password changed successfully!
          </Text>
        )}
      </form>
    </Box>
  );
};
