import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Group,
  Text,
} from '@mantine/core';

type LoginForm = {
  login: string;
  password: string;
};

export function Login({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setError('');
    try {
      const res = await signIn('credentials', {
        redirect: false,
        login: data.login,
        password: data.password,
      });

      if (res?.ok) {
        queryClient.clear();
        router.replace('/dashboard');
      } else if (res?.error) {
        setError('Invalid login or password');
      } else {
        setError('No response from server');
      }
    } catch (e) {
      setError('Unexpected error');
      console.error(e);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        maw={340}
        w="100%"
        p="lg"
        style={{
          border: '1px solid #eee',
          borderRadius: 8,
          backgroundColor: 'white',
        }}
      >
        <Text size="lg" fw={700} mb="md" ta="center">
          Login
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Login"
            placeholder="Your login"
            {...register('login', { required: true })}
            mb="sm"
            error={errors.login && 'Login is required'}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...register('password', { required: true })}
            mb="md"
            error={errors.password && 'Password is required'}
          />
          <Group justify="space-between" mb="sm">
            <Button fullWidth type="submit" loading={isSubmitting}>
              Login
            </Button>
          </Group>
          <Text size="sm" ta="center">
            Don&apos;t have an account?{' '}
            <Button variant="subtle" size="xs" onClick={onSwitch} type="button">
              Register
            </Button>
          </Text>
          {error && (
            <Text c="red" ta="center">
              {error}
            </Text>
          )}
        </form>
      </Box>
    </Box>
  );
}
