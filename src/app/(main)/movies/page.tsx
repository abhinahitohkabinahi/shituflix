'use client';

import { useQuery } from '@tanstack/react-query';
import { MediaCarousel } from '@/components/media/MediaCarousel';
import { MediaPageLayout } from '@/components/media/MediaPageLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { fetchTrendingMovies, fetchTopRatedMovies, fetchTopHindiMovies, fetchMoviesByGenre } from '@/services/tmdb';
import { tmdbMovieToMediaItem } from '@/utils/mediaMapping';

export default function MoviesPage() {
  const { data: trending = [], isLoading: l1 } = useQuery({ queryKey: ['trending', 'movies', 'page'], queryFn: fetchTrendingMovies });
  const { data: topRated = [], isLoading: l2 } = useQuery({ queryKey: ['topRated', 'movies', 'page'], queryFn: fetchTopRatedMovies });
  const { data: hindi = [], isLoading: l3 } = useQuery({ queryKey: ['hindi', 'movies', 'page'], queryFn: fetchTopHindiMovies });
  const { data: action = [], isLoading: l4 } = useQuery({ queryKey: ['movies', 'genre', '28'], queryFn: () => fetchMoviesByGenre('28') });
  const { data: comedy = [], isLoading: l5 } = useQuery({ queryKey: ['movies', 'genre', '35'], queryFn: () => fetchMoviesByGenre('35') });
  const { data: horror = [], isLoading: l6 } = useQuery({ queryKey: ['movies', 'genre', '27'], queryFn: () => fetchMoviesByGenre('27') });
  const { data: scifi = [], isLoading: l7 } = useQuery({ queryKey: ['movies', 'genre', '878'], queryFn: () => fetchMoviesByGenre('878') });

  const heroItems = trending.filter(m => m.backdrop_path).slice(0, 10).map(tmdbMovieToMediaItem);

  return (
    <MediaPageLayout heroItems={heroItems} showOTT={true}>
      <ErrorBoundary>
        <MediaCarousel title="Trending" items={trending.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l1} />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <MediaCarousel title="Action" items={action.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l4} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Hindi" items={hindi.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l3} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Top Rated" items={topRated.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l2} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Comedy" items={comedy.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l5} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Sci-Fi" items={scifi.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l7} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Horror" items={horror.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l6} />
      </ErrorBoundary>
    </MediaPageLayout>
  );
}
