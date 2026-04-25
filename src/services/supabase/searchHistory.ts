import { supabase } from '@/lib/supabaseClient';
import type { SearchHistoryRow } from '@/types/supabase';

export async function insertSearchHistory(userId: string, query: string) {
  const { error } = await supabase
    .from('user_search_history')
    .insert({ user_id: userId, search_query: query });
  if (error) throw error;
}

export async function getSearchHistory(userId: string): Promise<SearchHistoryRow[]> {
  const { data, error } = await supabase
    .from('user_search_history')
    .select('*')
    .eq('user_id', userId)
    .order('searched_at', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data ?? [];
}

export async function clearSearchHistory(userId: string) {
  const { error } = await supabase
    .from('user_search_history')
    .delete()
    .eq('user_id', userId);
  if (error) throw error;
}
