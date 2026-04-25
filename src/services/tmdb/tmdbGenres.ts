import { tmdbFetch } from './tmdbClient';
import type { TmdbMovie, TmdbTVShow } from '@/types/tmdb';

export async function fetchMoviesByGenre(genreId: string, page = 1): Promise<TmdbMovie[]> {
  try {
    const data = await tmdbFetch<{ results: TmdbMovie[] }>('/discover/movie', {
      with_genres: genreId,
      page: String(page),
    });
    return data.results;
  } catch (e) { throw e; }
}

export async function fetchTVShowsByGenre(genreId: string, page = 1): Promise<TmdbTVShow[]> {
  try {
    const data = await tmdbFetch<{ results: TmdbTVShow[] }>('/discover/tv', {
      with_genres: genreId,
      page: String(page),
    });
    return data.results;
  } catch (e) { throw e; }
}
