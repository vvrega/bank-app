import { useSession } from 'next-auth/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useAuthSession() {
  const { data: sessionData, status, update } = useSession();
  const queryClient = useQueryClient();

  const refreshSession = async () => {
    await update();
    queryClient.invalidateQueries({ queryKey: ['session'] });
  };

  const query = useQuery({
    queryKey: ['session'],
    queryFn: () => Promise.resolve(sessionData),
    staleTime: Infinity,
    enabled: status !== 'loading',
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    refreshSession,
    status,
  };
}
