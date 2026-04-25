import { supabase } from '@/lib/supabaseClient';
import type { AppConfig } from '@/types/supabase';

export async function getAppConfig(): Promise<AppConfig> {
  const { data, error } = await supabase
    .from('app_config')
    .select('kill_switch_active, kill_switch_reason, maintenance_mode, maintenance_message')
    .single();
  if (error) throw error;
  return data;
}
