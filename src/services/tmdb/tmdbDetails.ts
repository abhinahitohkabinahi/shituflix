import { tmdbFetch } from './tmdbClient';
import type { TmdbMovie, TmdbTVShow, TmdbSeason } from '@/types/tmdb';

export async function fetchMovieById(id: string): Promise<TmdbMovie> {
  try {
    return await tmdbFetch<TmdbMovie>(`/movie/${id}`, { append_to_response: 'credits,release_dates' });
  } catch (e) { throw e; }
}

export async function fetchTVShowById(id: string): Promise<TmdbTVShow> {
  try {
    return await tmdbFetch<TmdbTVShow>(`/tv/${id}`, { append_to_response: 'credits,content_ratings' });
  } catch (e) { throw e; }
}

export async function fetchSeasonDetails(showId: string, season: number): Promise<TmdbSeason> {
  try {
    return await tmdbFetch<TmdbSeason>(`/tv/${showId}/season/${season}`);
  } catch (e) { throw e; }
}
