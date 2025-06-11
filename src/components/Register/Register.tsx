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

type RegisterForm = {
  login: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  iban: string;
};

export function Register({ onSwitch }: { onSwitch: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();
  const [error, setError] = useState('');

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await signIn('credentials', {
        redirect: false,
        login: data.login,
        password: data.password,
      });
    } else {
      const result = await res.json();
      setError(result.error || 'Registration error');
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Login"
            {...register('login', { required: true })}
            mb="sm"
            error={errors.login && 'Login is required'}
          />
          <PasswordInput
            label="Password"
            {...register('password', { required: true })}
            mb="sm"
            error={errors.password && 'Password is required'}
          />
          <TextInput
            label="Email"
            {...register('email', { required: true })}
            mb="sm"
            error={errors.email && 'Email is required'}
          />
          <TextInput label="First Name" {...register('firstName')} mb="sm" />
          <TextInput label="Last Name" {...register('lastName')} mb="sm" />
          <TextInput label="IBAN" {...register('iban')} mb="md" />
          <Group justify="space-between" mb="sm">
            <Button fullWidth type="submit" loading={isSubmitting}>
              Register
            </Button>
          </Group>
          {error && (
            <Text color="red" ta="center">
              {error}
            </Text>
          )}
          <Text size="sm" ta="center">
            Already have an account?{' '}
            <Button variant="subtle" size="xs" onClick={onSwitch} type="button">
              Login
            </Button>
          </Text>
        </form>
      </Box>
    </Box>
  );
}
