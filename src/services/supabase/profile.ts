import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/types/supabase';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, 'name' | 'email'>>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function checkBan(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_banned')
    .eq('id', userId)
    .single();
  if (error) return false; // fail open
  return data?.is_banned ?? false;
}
