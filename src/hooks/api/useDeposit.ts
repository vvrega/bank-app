import { useMutation, useQueryClient } from '@tanstack/react-query';

type DepositParams = {
  amount: number;
  currency: string;
};

export function useDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DepositParams) => {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Deposit failed');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
