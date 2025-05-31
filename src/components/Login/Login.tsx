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
import { useRouter } from 'next/navigation';

interface LoginProps {
  onSwitch: () => void;
}

export function Login({ onSwitch }: LoginProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
        credentials: 'include', // ważne dla sesji!
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard');
      } else {
        setErrorMsg(data.error || 'Login failed');
      }
    } catch (e) {
      setErrorMsg('Login failed');
    } finally {
      setLoading(false);
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
        {errorMsg && (
          <Text c="red" size="sm" mb="xs" ta="center">
            {errorMsg}
          </Text>
        )}
        <Group justify="space-between" mb="sm">
          <Button
            fullWidth
            onClick={handleLogin}
            disabled={!login || !password || loading}
            loading={loading}
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
