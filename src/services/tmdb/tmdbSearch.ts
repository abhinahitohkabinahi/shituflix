import { tmdbFetch } from './tmdbClient';
import type { TmdbMovie, TmdbTVShow } from '@/types/tmdb';

export async function searchMedia(query: string): Promise<(TmdbMovie | TmdbTVShow)[]> {
  try {
    const data = await tmdbFetch<{ results: (TmdbMovie | TmdbTVShow)[] }>('/search/multi', { query });
    return data.results;
  } catch (e) { throw e; }
}
