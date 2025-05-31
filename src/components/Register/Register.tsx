import { useState } from 'react';
import {
  Box,
  Button,
  PasswordInput,
  TextInput,
  Text,
  Group,
} from '@mantine/core';

interface RegisterProps {
  onSwitch: () => void;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password: string) {
  // At least 8 chars, one uppercase, one symbol
  return /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
    password
  );
}

export function Register({ onSwitch }: RegisterProps) {
  const [login, setLogin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loginError =
    login && login.length < 6
      ? 'Login must be at least 6 characters'
      : undefined;
  const emailError =
    email && !isValidEmail(email) ? 'Invalid email address' : undefined;
  const passwordError =
    password && !isValidPassword(password)
      ? 'Password must be at least 8 characters, contain a capital letter and a symbol'
      : undefined;
  const confirmError =
    password && confirm && password !== confirm
      ? "Passwords don't match"
      : undefined;
  const firstNameError =
    firstName && firstName.length < 2
      ? 'First name must be at least 2 characters'
      : undefined;
  const lastNameError =
    lastName && lastName.length < 2
      ? 'Last name must be at least 2 characters'
      : undefined;

  const isFormValid =
    !loginError &&
    !emailError &&
    !passwordError &&
    !confirmError &&
    !firstNameError &&
    !lastNameError &&
    login &&
    email &&
    password &&
    confirm &&
    firstName &&
    lastName;

  const handleRegister = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!isFormValid) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, email, password, firstName, lastName }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Registration successful! You can now log in.');
        setLogin('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirm('');
        setTimeout(() => onSwitch(), 1500);
      } else {
        setErrorMsg(data.error || 'Registration failed');
      }
    } catch (e) {
      setErrorMsg('Registration failed');
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
          Register
        </Text>
        <TextInput
          label="Login"
          placeholder="Choose a login"
          value={login}
          onChange={(e) => setLogin(e.currentTarget.value)}
          mb="sm"
          required
          error={loginError}
        />
        <TextInput
          label="First Name"
          placeholder="Enter Name"
          value={firstName}
          onChange={(e) => setFirstName(e.currentTarget.value)}
          mb="sm"
          required
          error={firstNameError}
        />
        <TextInput
          label="Last Name"
          placeholder="Enter Surname"
          value={lastName}
          onChange={(e) => setLastName(e.currentTarget.value)}
          mb="sm"
          required
          error={lastNameError}
        />
        <TextInput
          label="Email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          mb="sm"
          required
          error={emailError}
        />
        <PasswordInput
          label="Password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          mb="sm"
          required
          error={passwordError}
        />
        <PasswordInput
          label="Confirm password"
          placeholder="Repeat password"
          value={confirm}
          onChange={(e) => setConfirm(e.currentTarget.value)}
          mb="md"
          required
          error={confirmError}
        />
        {errorMsg && (
          <Text c="red" size="sm" mb="xs" ta="center">
            {errorMsg}
          </Text>
        )}
        {successMsg && (
          <Text c="green" size="sm" mb="xs" ta="center">
            {successMsg}
          </Text>
        )}
        <Group justify="space-between" mb="sm">
          <Button
            fullWidth
            onClick={handleRegister}
            disabled={!isFormValid || loading}
            loading={loading}
          >
            Register
          </Button>
        </Group>
        <Text size="sm" ta="center">
          Already have an account?{' '}
          <Button variant="subtle" size="xs" onClick={onSwitch}>
            Login
          </Button>
        </Text>
      </Box>
    </Box>
  );
}
