import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/types';
export function useUserData() {
  return useQuery({
    queryKey: ['userData'],
    queryFn: async (): Promise<{ user: User }> => {
      const res = await fetch('/api/me');
      if (!res.ok) throw new Error('Failed to fetch user data');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}
