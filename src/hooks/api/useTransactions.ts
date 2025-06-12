import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@/types/types';

export function useTransactions(enabled = true) {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async (): Promise<{ transactions: Transaction[] }> => {
      const res = await fetch('/api/transactions');
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return res.json();
    },
    enabled,
    staleTime: 30 * 1000,
  });
}

export function useContactTransactions(
  contactUserId: number | null,
  enabled = false
) {
  return useQuery({
    queryKey: ['transactions', 'contact', contactUserId],
    queryFn: async (): Promise<{ transactions: Transaction[] }> => {
      if (!contactUserId) return { transactions: [] };
      const res = await fetch(
        `/api/transactions?contactUserId=${contactUserId}`
      );
      if (!res.ok) throw new Error('Failed to fetch contact transactions');
      return res.json();
    },
    enabled: enabled && !!contactUserId,
    staleTime: 30 * 1000,
  });
}
