import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import {
  Button,
  TextInput,
  PasswordInput,
  Box,
  Text,
  Group,
} from '@mantine/core';
import { useState } from 'react';

type LoginForm = {
  login: string;
  password: string;
};

export function Login({ onSwitch }: { onSwitch: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();
  const [error, setError] = useState('');

  const onSubmit = async (data: LoginForm) => {
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      login: data.login,
      password: data.password,
    });
    if (res?.error) setError('Invalid login or password');
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
          {error && (
            <Text c="red" ta="center">
              {error}
            </Text>
          )}
          <Text size="sm" ta="center">
            Don&apos;t have an account?{' '}
            <Button variant="subtle" size="xs" onClick={onSwitch} type="button">
              Register
            </Button>
          </Text>
        </form>
      </Box>
    </Box>
  );
}
