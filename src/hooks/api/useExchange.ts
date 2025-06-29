import { useMutation, useQueryClient } from '@tanstack/react-query';

type ExchangeParams = {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
};

export function useExchange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ExchangeParams) => {
      const res = await fetch('/api/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Exchange failed');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
