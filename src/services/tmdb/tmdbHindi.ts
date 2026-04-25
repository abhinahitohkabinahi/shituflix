import { tmdbFetch } from './tmdbClient';
import type { TmdbMovie, TmdbTVShow } from '@/types/tmdb';

export async function fetchTopHindiMovies(): Promise<TmdbMovie[]> {
  try {
    const data = await tmdbFetch<{ results: TmdbMovie[] }>('/discover/movie', {
      with_original_language: 'hi',
      sort_by: 'popularity.desc',
    });
    return data.results;
  } catch (e) { throw e; }
}

export async function fetchTopHindiTVShows(): Promise<TmdbTVShow[]> {
  try {
    const data = await tmdbFetch<{ results: TmdbTVShow[] }>('/discover/tv', {
      with_original_language: 'hi',
      sort_by: 'popularity.desc',
    });
    return data.results;
  } catch (e) { throw e; }
}
