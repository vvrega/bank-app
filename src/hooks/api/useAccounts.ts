import { useQuery } from '@tanstack/react-query';
import { Account } from '@/types/types';

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async (): Promise<Account[]> => {
      const res = await fetch('/api/accounts');
      if (!res.ok) throw new Error('Failed to fetch accounts');
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}
