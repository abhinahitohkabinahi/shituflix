import { gql } from './anilistClient';
import { SEARCH_ANIME } from './anilistQueries';
import type { AniListMedia } from '@/types/anilist';

interface PageResponse { Page: { media: AniListMedia[] } }

export async function searchAnime(query: string): Promise<AniListMedia[]> {
  try {
    const data = await gql<PageResponse>(SEARCH_ANIME, { search: query, page: 1, perPage: 20 });
    return data.Page.media;
  } catch (e) { throw e; }
}
