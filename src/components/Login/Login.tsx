'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  PasswordInput,
  TextInput,
  Text,
  Group,
} from '@mantine/core';

interface LoginProps {
  onSwitch: () => void;
  onLogin?: (login: string, password: string) => void;
}

export function Login({ onSwitch, onLogin }: LoginProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

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
        <TextInput
          label="Login"
          placeholder="Your login"
          value={login}
          onChange={(e) => setLogin(e.currentTarget.value)}
          mb="sm"
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          mb="md"
          required
        />
        <Group justify="space-between" mb="sm">
          <Button
            fullWidth
            onClick={() => onLogin?.(login, password)}
            disabled={!login || !password}
          >
            Login
          </Button>
        </Group>
        <Text size="sm" ta="center">
          Don&apos;t have an account?{' '}
          <Button variant="subtle" size="xs" onClick={onSwitch}>
            Register
          </Button>
        </Text>
      </Box>
    </Box>
  );
}
