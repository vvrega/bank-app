import { useMutation, useQueryClient } from '@tanstack/react-query';

type WithdrawParams = {
  amount: number;
  currency: string;
};

export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WithdrawParams) => {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Withdrawal failed');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
