import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyList, addToMyList, removeFromMyList } from '@/services/supabase/myList';
import { useAuth } from './useAuth';
import type { ContentType } from '@/types/media';

export function useMyList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const query = useQuery({
    queryKey: ['myList', userId],
    queryFn: () => getMyList(userId!),
    enabled: !!userId,
  });

  const addMutation = useMutation({
    mutationFn: ({ contentId, contentType }: { contentId: string; contentType: ContentType }) =>
      addToMyList(userId!, contentId, contentType),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myList', userId] }),
  });

  const removeMutation = useMutation({
    mutationFn: (contentId: string) => removeFromMyList(userId!, contentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myList', userId] }),
  });

  function isInList(contentId: string): boolean {
    return query.data?.some(item => item.content_id === contentId) ?? false;
  }

  return { ...query, addMutation, removeMutation, isInList };
}
