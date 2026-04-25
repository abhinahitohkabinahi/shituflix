import { tmdbFetch } from './tmdbClient';
import type { TmdbMovie, TmdbTVShow } from '@/types/tmdb';

export async function fetchTrendingMovies(): Promise<TmdbMovie[]> {
  try {
    const data = await tmdbFetch<{ results: TmdbMovie[] }>('/trending/movie/week');
    return data.results;
  } catch (e) { throw e; }
}

export async function fetchTrendingTVShows(): Promise<TmdbTVShow[]> {
  try {
    const data = await tmdbFetch<{ results: TmdbTVShow[] }>('/trending/tv/week');
    return data.results;
  } catch (e) { throw e; }
}
