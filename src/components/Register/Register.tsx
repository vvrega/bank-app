import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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

const schema = z.object({
  login: z.string().min(1, 'Login is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain a capital letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a symbol'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  iban: z.string().optional(),
});

type RegisterForm = z.infer<typeof schema>;

export function Register({ onSwitch }: { onSwitch: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });
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
            {...register('login')}
            mb="sm"
            error={errors.login?.message}
          />
          <PasswordInput
            label="Password"
            {...register('password')}
            mb="sm"
            error={errors.password?.message}
          />
          <TextInput
            label="Email"
            {...register('email')}
            mb="sm"
            error={errors.email?.message}
          />
          <TextInput
            label="First Name"
            {...register('firstName')}
            mb="sm"
            error={errors.firstName?.message}
          />
          <TextInput
            label="Last Name"
            {...register('lastName')}
            mb="sm"
            error={errors.lastName?.message}
          />
          <TextInput
            label="IBAN"
            {...register('iban')}
            mb="md"
            error={errors.iban?.message}
          />
          <Group justify="space-between" mb="sm">
            <Button fullWidth type="submit" loading={isSubmitting}>
              Register
            </Button>
          </Group>
          {error && (
            <Text c="red" ta="center">
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
