import { useQuery } from '@tanstack/react-query';
import { ExchangeRates } from '@/types/types';

export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchangeRates'],
    queryFn: async (): Promise<ExchangeRates> => {
      const res = await fetch('/api/exchangeRates');
      if (!res.ok) throw new Error('Failed to fetch exchange rates');
      return res.json();
    },
    staleTime: 60 * 60 * 1000,
  });
}
