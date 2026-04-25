import { ContentType } from './media';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_banned: boolean;
  banned_reason: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface WatchHistoryRow {
  id: string;
  user_id: string;
  content_id: string;
  content_type: ContentType;
  watched_at: string;
}

export interface MyListRow {
  id: string;
  user_id: string;
  content_id: string;
  content_type: ContentType;
  added_at: string;
}

export interface SearchHistoryRow {
  id: string;
  user_id: string;
  search_query: string;
  searched_at: string;
}

export interface AppConfig {
  kill_switch_active: boolean;
  kill_switch_reason: string | null;
  maintenance_mode: boolean;
  maintenance_message: string | null;
}
