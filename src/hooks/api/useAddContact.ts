import { useMutation, useQueryClient } from '@tanstack/react-query';

type AddContactParams = {
  name: string;
  iban: string;
};

export function useAddContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddContactParams) => {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Adding contact failed');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}
