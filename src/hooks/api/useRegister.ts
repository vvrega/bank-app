import { useMutation } from '@tanstack/react-query';

type RegisterParams = {
  login: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
};

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterParams) => {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      return res.json();
    },
  });
}
