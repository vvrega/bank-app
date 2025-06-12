import { useMutation } from '@tanstack/react-query';

type ChangePasswordParams = {
  currentPassword: string;
  newPassword: string;
};

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordParams) => {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Password change failed');
      }

      return res.json();
    },
  });
}
