import { gql } from './anilistClient';
import { ANIME_DETAILS } from './anilistQueries';
import type { AniListMedia } from '@/types/anilist';

interface MediaResponse { Media: AniListMedia }

export async function fetchAnimeById(id: number): Promise<AniListMedia> {
  try {
    const data = await gql<MediaResponse>(ANIME_DETAILS, { id });
    return data.Media;
  } catch (e) { throw e; }
}
