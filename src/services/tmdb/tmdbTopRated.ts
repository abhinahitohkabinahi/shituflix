import { tmdbFetch } from './tmdbClient';
import type { TmdbMovie, TmdbTVShow } from '@/types/tmdb';

export async function fetchTopRatedMovies(): Promise<TmdbMovie[]> {
  try {
    const data = await tmdbFetch<{ results: TmdbMovie[] }>('/movie/top_rated');
    return data.results;
  } catch (e) { throw e; }
}

export async function fetchTopRatedTVShows(): Promise<TmdbTVShow[]> {
  try {
    const data = await tmdbFetch<{ results: TmdbTVShow[] }>('/tv/top_rated');
    return data.results;
  } catch (e) { throw e; }
}
