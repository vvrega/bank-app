import { useMutation, useQueryClient } from '@tanstack/react-query';

type TransferParams = {
  fromCurrency: string;
  amount: number;
  iban: string;
  title: string;
  name: string;
};

export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TransferParams) => {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Transfer failed');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
