import { supabase } from '@/lib/supabaseClient';
import type { ContentType } from '@/types/media';
import type { WatchHistoryRow } from '@/types/supabase';

export async function upsertWatchHistory(userId: string, contentId: string, contentType: ContentType) {
  const { error } = await supabase
    .from('user_watch_history')
    .upsert({
      user_id: userId,
      content_id: contentId,
      content_type: contentType,
      watched_at: new Date().toISOString(),
    }, { onConflict: 'user_id,content_id' });
  if (error) throw error;
}

export async function getWatchHistory(userId: string): Promise<WatchHistoryRow[]> {
  const { data, error } = await supabase
    .from('user_watch_history')
    .select('*')
    .eq('user_id', userId)
    .order('watched_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function clearWatchHistory(userId: string) {
  const { error } = await supabase
    .from('user_watch_history')
    .delete()
    .eq('user_id', userId);
  if (error) throw error;
}
