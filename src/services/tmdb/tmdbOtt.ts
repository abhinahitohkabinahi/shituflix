import { tmdbFetch } from './tmdbClient';
import type { TmdbMovie, TmdbTVShow } from '@/types/tmdb';

export async function fetchTopOTTContent(): Promise<TmdbMovie[]> {
  try {
    const data = await tmdbFetch<{ results: TmdbMovie[] }>('/discover/movie', {
      with_watch_providers: '8|9|337|15|384|2|531|315',
      watch_region: 'US',
      sort_by: 'popularity.desc',
    });
    return data.results;
  } catch (e) { throw e; }
}

export async function fetchTVShowsByNetwork(networkId: string, page = 1): Promise<TmdbTVShow[]> {
  try {
    const data = await tmdbFetch<{ results: TmdbTVShow[] }>('/discover/tv', {
      with_networks: networkId,
      page: String(page),
    });
    return data.results;
  } catch (e) { throw e; }
}

export async function fetchMoviesByCompany(companyId: string, page = 1): Promise<TmdbMovie[]> {
  try {
    const data = await tmdbFetch<{ results: TmdbMovie[] }>('/discover/movie', {
      with_companies: companyId,
      page: String(page),
    });
    return data.results;
  } catch (e) { throw e; }
}
