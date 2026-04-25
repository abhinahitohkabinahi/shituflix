import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSearchHistory, insertSearchHistory, clearSearchHistory } from '@/services/supabase/searchHistory';
import { useAuth } from './useAuth';

export function useSearchHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const query = useQuery({
    queryKey: ['searchHistory', userId],
    queryFn: () => getSearchHistory(userId!),
    enabled: !!userId,
  });

  const insertMutation = useMutation({
    mutationFn: (searchQuery: string) => insertSearchHistory(userId!, searchQuery),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['searchHistory', userId] }),
  });

  const clearMutation = useMutation({
    mutationFn: () => clearSearchHistory(userId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['searchHistory', userId] }),
  });

  return { ...query, insertMutation, clearMutation };
}
