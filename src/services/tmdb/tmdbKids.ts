import { tmdbFetch } from './tmdbClient';
import type { TmdbMovie, TmdbTVShow } from '@/types/tmdb';

interface TMDBResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export async function fetchKidsMovies(page = 1): Promise<TmdbMovie[]> {
  const data = await tmdbFetch<TMDBResponse<TmdbMovie>>('/discover/movie', {
    with_genres: '10751,16', // Family and Animation
    certification_country: 'US',
    'certification.lte': 'PG',
    include_adult: 'false',
    sort_by: 'popularity.desc',
    page: page.toString(),
  });
  return data.results;
}

export async function fetchKidsTVShows(page = 1): Promise<TmdbTVShow[]> {
  // TMDB TV doesn't have certifications in discover the same way as movies sometimes,
  // but we can use genres and content ratings if available.
  const data = await tmdbFetch<TMDBResponse<TmdbTVShow>>('/discover/tv', {
    with_genres: '10751,16', // Family and Animation
    include_adult: 'false',
    sort_by: 'popularity.desc',
    page: page.toString(),
  });
  return data.results;
}
