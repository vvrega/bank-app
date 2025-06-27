import { useSession } from 'next-auth/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useAuthSession() {
  const sessionResult = useSession();
  const { data: sessionData, status, update } = sessionResult;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      return Promise.resolve(sessionResult.data);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: status !== 'loading',
    refetchOnWindowFocus: false,
  });

  const refreshSession = async () => {
    await update();
    queryClient.invalidateQueries({ queryKey: ['session'] });
  };

  return {
    ...sessionResult,
    data: sessionData,
    refreshSession,
  };
}
