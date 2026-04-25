import { supabase } from '@/lib/supabaseClient';
import type { ContentType } from '@/types/media';
import type { MyListRow } from '@/types/supabase';

export async function addToMyList(userId: string, contentId: string, contentType: ContentType) {
  const { error } = await supabase
    .from('user_my_lists')
    .insert({ user_id: userId, content_id: contentId, content_type: contentType });
  if (error) throw error;
}

export async function removeFromMyList(userId: string, contentId: string) {
  const { error } = await supabase
    .from('user_my_lists')
    .delete()
    .eq('user_id', userId)
    .eq('content_id', contentId);
  if (error) throw error;
}

export async function getMyList(userId: string): Promise<MyListRow[]> {
  const { data, error } = await supabase
    .from('user_my_lists')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function isInMyList(userId: string, contentId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_my_lists')
    .select('id')
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .single();
  if (error) return false;
  return !!data;
}
