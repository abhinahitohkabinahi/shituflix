'use client';

import { useQuery } from '@tanstack/react-query';
import { MediaCarousel } from '@/components/media/MediaCarousel';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { fetchTrendingAnime, fetchMostPopularAnime, fetchRecentlyUpdatedAnime } from '@/services/anilist';
import { gql } from '@/services/anilist/anilistClient';
import { TOP_RATED_ANIME } from '@/services/anilist/anilistQueries';
import type { AniListMedia } from '@/types/anilist';
import type { MediaItem } from '@/types/media';

function anilistToMediaItem(a: AniListMedia): MediaItem {
  return {
    id: String(a.id),
    title: a.title.english ?? a.title.romaji,
    posterPath: null,
    backdropPath: a.bannerImage ?? null,
    contentType: 'anime',
    rating: a.averageScore ? a.averageScore / 10 : undefined,
  };
}

async function fetchTopRatedAnime(): Promise<AniListMedia[]> {
  const data = await gql<{ Page: { media: AniListMedia[] } }>(TOP_RATED_ANIME, { page: 1, perPage: 20 });
  return data.Page.media;
}

export default function AnimePage() {
  const { data: trending = [], isLoading: l1 } = useQuery({ queryKey: ['anime', 'trending'], queryFn: fetchTrendingAnime });
  const { data: topRated = [], isLoading: l2 } = useQuery({ queryKey: ['anime', 'topRated'], queryFn: fetchTopRatedAnime });
  const { data: popular = [], isLoading: l3 } = useQuery({ queryKey: ['anime', 'popular'], queryFn: fetchMostPopularAnime });
  const { data: recent = [], isLoading: l4 } = useQuery({ queryKey: ['anime', 'recent'], queryFn: fetchRecentlyUpdatedAnime });

  return (
    <div className="min-h-screen bg-[#141414] py-6">
      <h1 className="text-2xl font-bold text-white px-4 mb-4">Anime</h1>
      <ErrorBoundary>
        <MediaCarousel title="Trending Anime" items={trending.map(anilistToMediaItem)} contentType="anime" isLoading={l1} />
      </ErrorBoundary>
      <ErrorBoundary>
        <MediaCarousel title="Top Rated Anime" items={topRated.map(anilistToMediaItem)} contentType="anime" isLoading={l2} />
      </ErrorBoundary>
      <ErrorBoundary>
        <MediaCarousel title="Most Popular Anime" items={popular.map(anilistToMediaItem)} contentType="anime" isLoading={l3} />
      </ErrorBoundary>
      <ErrorBoundary>
        <MediaCarousel title="Recently Updated" items={recent.map(anilistToMediaItem)} contentType="anime" isLoading={l4} />
      </ErrorBoundary>
    </div>
  );
}
