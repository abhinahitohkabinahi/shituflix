import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWatchHistory, upsertWatchHistory, clearWatchHistory } from '@/services/supabase/watchHistory';
import { useAuth } from './useAuth';
import type { ContentType } from '@/types/media';

export function useWatchHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const query = useQuery({
    queryKey: ['watchHistory', userId],
    queryFn: () => getWatchHistory(userId!),
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  const upsertMutation = useMutation({
    mutationFn: ({ contentId, contentType }: { contentId: string; contentType: ContentType }) =>
      upsertWatchHistory(userId!, contentId, contentType),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchHistory', userId] }),
  });

  const clearMutation = useMutation({
    mutationFn: () => clearWatchHistory(userId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchHistory', userId] }),
  });

  return { ...query, upsertMutation, clearMutation };
}
