import { useQuery } from '@tanstack/react-query';
import { Contact } from '@/types/types';

export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async (): Promise<{ contacts: Contact[] }> => {
      const res = await fetch('/api/contacts');
      if (!res.ok) throw new Error('Failed to fetch contacts');
      return res.json();
    },
    staleTime: 3 * 60 * 1000,
  });
}
