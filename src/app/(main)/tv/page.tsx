'use client';

import { useQuery } from '@tanstack/react-query';
import { MediaCarousel } from '@/components/media/MediaCarousel';
import { MediaPageLayout } from '@/components/media/MediaPageLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { fetchTrendingTVShows, fetchTopRatedTVShows, fetchTopHindiTVShows, fetchTVShowsByGenre } from '@/services/tmdb';
import { tmdbTVToMediaItem } from '@/utils/mediaMapping';

export default function TVPage() {
  const { data: trending = [], isLoading: l1 } = useQuery({ queryKey: ['trending', 'tv', 'page'], queryFn: fetchTrendingTVShows });
  const { data: topRated = [], isLoading: l2 } = useQuery({ queryKey: ['topRated', 'tv', 'page'], queryFn: fetchTopRatedTVShows });
  const { data: hindi = [], isLoading: l3 } = useQuery({ queryKey: ['hindi', 'tv', 'page'], queryFn: fetchTopHindiTVShows });
  const { data: action = [], isLoading: l4 } = useQuery({ queryKey: ['tv', 'genre', '10759'], queryFn: () => fetchTVShowsByGenre('10759') });
  const { data: drama = [], isLoading: l5 } = useQuery({ queryKey: ['tv', 'genre', '18'], queryFn: () => fetchTVShowsByGenre('18') });
  const { data: mystery = [], isLoading: l6 } = useQuery({ queryKey: ['tv', 'genre', '9648'], queryFn: () => fetchTVShowsByGenre('9648') });
  const { data: scifi = [], isLoading: l7 } = useQuery({ queryKey: ['tv', 'genre', '10765'], queryFn: () => fetchTVShowsByGenre('10765') });

  const heroItems = trending.filter(s => s.backdrop_path).slice(0, 10).map(tmdbTVToMediaItem);

  return (
    <MediaPageLayout heroItems={heroItems} showOTT={true}>
      <ErrorBoundary>
        <MediaCarousel title="Trending TV Shows" items={trending.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l1} />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <MediaCarousel title="Action & Adventure" items={action.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l4} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Hindi TV Shows" items={hindi.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l3} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Top Rated" items={topRated.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l2} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="TV Dramas" items={drama.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l5} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Sci-Fi & Fantasy" items={scifi.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l7} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Mystery & Thriller" items={mystery.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l6} />
      </ErrorBoundary>
    </MediaPageLayout>
  );
}
