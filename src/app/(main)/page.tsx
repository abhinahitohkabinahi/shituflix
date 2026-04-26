'use client';

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import { LandingPage } from '@/components/landing/LandingPage';
import { MediaCarousel } from '@/components/media/MediaCarousel';
import { EnrichedCarousel } from '@/components/media/EnrichedCarousel';
import { MediaPageLayout } from '@/components/media/MediaPageLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { tmdbMovieToMediaItem, tmdbTVToMediaItem } from '@/utils/mediaMapping';
import {
  fetchTrendingMovies,
  fetchTrendingTVShows,
  fetchTopRatedMovies,
  fetchTopRatedTVShows,
  fetchTopHindiMovies,
  fetchTopHindiTVShows,
  fetchTopOTTContent,
  fetchMoviesByGenre,
  fetchKidsMovies,
  fetchKidsTVShows
} from '@/services/tmdb';
import { useMyList } from '@/hooks/useMyList';
import { useWatchHistory } from '@/hooks/useWatchHistory';

export default function Page() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <HomePage router={router} />;
}

function HomePage({ router }: { router: any }) {
  const { isKidsMode } = useSelector((state: RootState) => state.auth);

  // Core Data
  const { data: trendingMovies = [], isLoading: l1 } = useQuery({ queryKey: ['trending', 'movies'], queryFn: fetchTrendingMovies });
  const { data: trendingTV = [], isLoading: l2 } = useQuery({ queryKey: ['trending', 'tv'], queryFn: fetchTrendingTVShows });
  const { data: topMovies = [], isLoading: l3 } = useQuery({ queryKey: ['topRated', 'movies'], queryFn: fetchTopRatedMovies });
  const { data: topTV = [], isLoading: l4 } = useQuery({ queryKey: ['topRated', 'tv'], queryFn: fetchTopRatedTVShows });
  const { data: hindiMovies = [], isLoading: l5 } = useQuery({ queryKey: ['hindi', 'movies'], queryFn: fetchTopHindiMovies });
  const { data: hindiTV = [], isLoading: l6 } = useQuery({ queryKey: ['hindi', 'tv'], queryFn: fetchTopHindiTVShows });
  const { data: ottContent = [], isLoading: l7 } = useQuery({ queryKey: ['ott', 'content'], queryFn: fetchTopOTTContent });

  // Kids Data
  const { data: kidsMovies = [], isLoading: kl1 } = useQuery({ 
    queryKey: ['kids', 'movies'], 
    queryFn: () => fetchKidsMovies(),
    enabled: isKidsMode 
  });
  const { data: kidsTV = [], isLoading: kl2 } = useQuery({ 
    queryKey: ['kids', 'tv'], 
    queryFn: () => fetchKidsTVShows(),
    enabled: isKidsMode 
  });

  // Genre Data (Singular)
  const { data: action = [], isLoading: ga } = useQuery({ queryKey: ['genre', '28'], queryFn: () => fetchMoviesByGenre('28'), enabled: !isKidsMode });
  const { data: comedy = [], isLoading: gc } = useQuery({ queryKey: ['genre', '35'], queryFn: () => fetchMoviesByGenre('35'), enabled: !isKidsMode });
  const { data: horror = [], isLoading: gh } = useQuery({ queryKey: ['genre', '27'], queryFn: () => fetchMoviesByGenre('27'), enabled: !isKidsMode });
  const { data: scifi = [], isLoading: gs } = useQuery({ queryKey: ['genre', '878'], queryFn: () => fetchMoviesByGenre('878'), enabled: !isKidsMode });
  const { data: romance = [], isLoading: gr } = useQuery({ queryKey: ['genre', '10749'], queryFn: () => fetchMoviesByGenre('10749'), enabled: !isKidsMode });
  const { data: thriller = [], isLoading: gt } = useQuery({ queryKey: ['genre', '53'], queryFn: () => fetchMoviesByGenre('53'), enabled: !isKidsMode });

  const { data: myListItems = [], isLoading: myListLoading } = useMyList();
  const { data: watchHistoryItems = [], isLoading: historyLoading } = useWatchHistory();

  const heroItems = isKidsMode 
    ? kidsMovies.filter(m => m.backdrop_path).slice(0, 10).map(tmdbMovieToMediaItem)
    : [
        ...trendingMovies.filter(m => m.backdrop_path).slice(0, 5).map(tmdbMovieToMediaItem),
        ...trendingTV.filter(s => s.backdrop_path).slice(0, 5).map(tmdbTVToMediaItem),
      ];

  if (isKidsMode) {
    return (
      <MediaPageLayout heroItems={heroItems} showOTT={false}>
        <MediaCarousel
          title="Animation Hits"
          items={kidsMovies.map(tmdbMovieToMediaItem)}
          contentType="movie"
          isLoading={kl1}
        />
        <MediaCarousel
          title="Family TV Shows"
          items={kidsTV.map(tmdbTVToMediaItem)}
          contentType="tv"
          isLoading={kl2}
        />
        <MediaCarousel 
          title="Popular for Kids" 
          items={kidsMovies.slice(10).map(tmdbMovieToMediaItem)} 
          contentType="movie" 
          isLoading={kl1} 
        />
        <MediaCarousel 
          title="Cartoons & More" 
          items={kidsTV.slice(10).map(tmdbTVToMediaItem)} 
          contentType="tv" 
          isLoading={kl2} 
        />
      </MediaPageLayout>
    );
  }

  return (
    <MediaPageLayout heroItems={heroItems} showOTT={true}>
      <EnrichedCarousel
        title="Continue Watching"
        items={watchHistoryItems.slice(0, 20)}
        isLoading={historyLoading}
      />

      <EnrichedCarousel
        title="My List"
        items={myListItems.slice(0, 20)}
        isLoading={myListLoading}
      />

      <ErrorBoundary>
        <MediaCarousel title="Trending Movies" items={trendingMovies.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l1} />
      </ErrorBoundary>
      <ErrorBoundary>
        <MediaCarousel title="Trending TV Shows" items={trendingTV.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l2} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="TV Shows" items={topTV.map(tmdbTVToMediaItem)} contentType="tv" isLoading={l4} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="OTT Content" items={ottContent.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l7} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Action" items={action.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={ga} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Hindi" items={hindiMovies.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l5} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Horror" items={horror.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={gh} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Top Rated" items={topMovies.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={l3} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Comedy" items={comedy.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={gc} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Sci-Fi" items={scifi.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={gs} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Romance" items={romance.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={gr} />
      </ErrorBoundary>

      <ErrorBoundary>
        <MediaCarousel title="Thriller" items={thriller.map(tmdbMovieToMediaItem)} contentType="movie" isLoading={gt} />
      </ErrorBoundary>


    </MediaPageLayout>
  );
}
