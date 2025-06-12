import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  TextInput,
  PasswordInput,
  Box,
  Text,
  Group,
} from '@mantine/core';
import { useState } from 'react';
import { useRegister } from '@/hooks/api/useRegister';

const schema = z
  .object({
    login: z.string().min(1, 'Login is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain a capital letter')
      .regex(/[^A-Za-z0-9]/, 'Password must contain a symbol'),
    confirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  });

type RegisterForm = z.infer<typeof schema>;

export function Register({ onSwitch }: { onSwitch: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState('');

  const registerMutation = useRegister();

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setError('');
    try {
      await registerMutation.mutateAsync({
        login: data.login,
        password: data.password,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      reset();
      onSwitch();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
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
          Register
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Login"
            placeholder="Choose a login"
            {...register('login')}
            mb="sm"
            error={errors.login?.message}
          />
          <TextInput
            label="First Name"
            placeholder="Enter Name"
            {...register('firstName')}
            mb="sm"
            error={errors.firstName?.message}
          />
          <TextInput
            label="Last Name"
            placeholder="Enter Surname"
            {...register('lastName')}
            mb="sm"
            error={errors.lastName?.message}
          />
          <TextInput
            label="Email"
            placeholder="you@email.com"
            {...register('email')}
            mb="sm"
            error={errors.email?.message}
          />
          <PasswordInput
            label="Password"
            placeholder="Create password"
            {...register('password')}
            mb="sm"
            error={errors.password?.message}
          />
          <PasswordInput
            label="Confirm password"
            placeholder="Repeat password"
            {...register('confirm')}
            mb="md"
            error={errors.confirm?.message}
          />
          <Group justify="space-between" mb="sm">
            <Button
              fullWidth
              type="submit"
              loading={registerMutation.isPending}
            >
              Register
            </Button>
          </Group>
          {error && (
            <Text c="red" ta="center" size="sm" mb="xs">
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
