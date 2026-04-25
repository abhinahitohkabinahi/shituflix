import { gql } from './anilistClient';
import { TRENDING_ANIME, MOST_POPULAR_ANIME, RECENTLY_UPDATED_ANIME } from './anilistQueries';
import type { AniListMedia } from '@/types/anilist';

interface PageResponse { Page: { media: AniListMedia[] } }

export async function fetchTrendingAnime(): Promise<AniListMedia[]> {
  try {
    const data = await gql<PageResponse>(TRENDING_ANIME, { page: 1, perPage: 20 });
    return data.Page.media;
  } catch (e) { throw e; }
}

export async function fetchMostPopularAnime(): Promise<AniListMedia[]> {
  try {
    const data = await gql<PageResponse>(MOST_POPULAR_ANIME, { page: 1, perPage: 20 });
    return data.Page.media;
  } catch (e) { throw e; }
}

export async function fetchRecentlyUpdatedAnime(): Promise<AniListMedia[]> {
  try {
    const data = await gql<PageResponse>(RECENTLY_UPDATED_ANIME, { page: 1, perPage: 20 });
    return data.Page.media;
  } catch (e) { throw e; }
}
