'use client';

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { LandingPage } from '@/components/landing/LandingPage';
import { HeroBanner } from '@/components/media/HeroBanner';
import { MediaCarousel } from '@/components/media/MediaCarousel';
import { OTTProviderRow } from '@/components/media/OTTProviderRow';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { OTT_PROVIDERS } from '@/utils/constants';
import { fetchTrendingMovies, fetchTrendingTVShows, fetchTopRatedMovies, fetchTopRatedTVShows, fetchTopHindiMovies, fetchTopHindiTVShows, fetchTopOTTContent } from '@/services/tmdb';
import type { TmdbMovie, TmdbTVShow } from '@/types/tmdb';
import type { MediaItem } from '@/types/media';

function tmdbMovieToMediaItem(m: TmdbMovie): MediaItem {
  return {
    id: String(m.id),
    title: m.title,
    posterPath: m.poster_path,
    backdropPath: m.backdrop_path,
    contentType: 'movie',
    year: m.release_date?.slice(0, 4),
    rating: m.vote_average,
    overview: m.overview ?? undefined,
  };
}

function tmdbTVToMediaItem(s: TmdbTVShow): MediaItem {
  return {
    id: String(s.id),
    title: s.name,
    posterPath: s.poster_path,
    backdropPath: s.backdrop_path,
    contentType: 'tv',
    year: s.first_air_date?.slice(0, 4),
    rating: s.vote_average,
    overview: s.overview ?? undefined,
  };
}






export default function Page() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <HomePage />;
}

function HomePage() {
  const { data: trendingMovies = [], isLoading: l1 } = useQuery({ queryKey: ['trending', 'movies'], queryFn: fetchTrendingMovies });
  const { data: trendingTV = [], isLoading: l2 } = useQuery({ queryKey: ['trending', 'tv'], queryFn: fetchTrendingTVShows });
  const { data: topMovies = [], isLoading: l3 } = useQuery({ queryKey: ['topRated', 'movies'], queryFn: fetchTopRatedMovies });
  const { data: topTV = [], isLoading: l4 } = useQuery({ queryKey: ['topRated', 'tv'], queryFn: fetchTopRatedTVShows });
  const { data: hindiMovies = [], isLoading: l5 } = useQuery({ queryKey: ['hindi', 'movies'], queryFn: fetchTopHindiMovies });
  const { data: hindiTV = [], isLoading: l6 } = useQuery({ queryKey: ['hindi', 'tv'], queryFn: fetchTopHindiTVShows });
  const { data: ottContent = [], isLoading: l7 } = useQuery({ queryKey: ['ott', 'content'], queryFn: fetchTopOTTContent });

  const heroItems = [
    ...trendingMovies.filter(m => m.backdrop_path).slice(0, 5).map(tmdbMovieToMediaItem),
    ...trendingTV.filter(s => s.backdrop_path).slice(0, 5).map(tmdbTVToMediaItem),
  ];

  return (
    <div className="min-h-screen bg-[#141414]">
      {heroItems.length > 0 && <HeroBanner items={heroItems} />}

      <OTTProviderRow providers={OTT_PROVIDERS} onSelect={() => {}} />

      <ErrorBoundary>
        <MediaCarousel title="Trending Movies" items={trendingMovies.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l1} />
      </ErrorBoundary>
      <ErrorBoundary>
        <MediaCarousel title="Trending TV Shows" items={trendingTV.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l2} />
      </ErrorBoundary>
      <ErrorBoundary>
        <MediaCarousel title="Top Rated Movies" items={topMovies.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l3} />
      </ErrorBoundary>
      <ErrorBoundary>
        <MediaCarousel title="Top Rated TV Shows" items={topTV.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l4} />
      </ErrorBoundary>
      <ErrorBoundary>
        <MediaCarousel title="Top Hindi Movies" items={hindiMovies.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l5} />
      </ErrorBoundary>
      <ErrorBoundary>
        <MediaCarousel title="Top Hindi TV Shows" items={hindiTV.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l6} />
      </ErrorBoundary>
      <ErrorBoundary>
        <MediaCarousel title="Top OTT Content" items={ottContent.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l7} />
      </ErrorBoundary>
    </div>
  );
}
