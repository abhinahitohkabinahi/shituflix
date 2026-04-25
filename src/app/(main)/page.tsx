'use client';

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <HomePage router={router} />;
}

import { useMyList } from '@/hooks/useMyList';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { fetchMovieById, fetchTVShowById } from '@/services/tmdb';

function EnrichedCarousel({ 
  title, 
  items, 
  isLoading 
}: { 
  title: string; 
  items: { content_id: string; content_type: string }[]; 
  isLoading: boolean 
}) {
  const enrichedItems = useQuery({
    queryKey: ['enriched', title, items.map(i => i.content_id).join(',')],
    queryFn: async () => {
      const promises = items.map(async (item) => {
        try {
          const details = item.content_type === 'tv' 
            ? await fetchTVShowById(item.content_id) 
            : await fetchMovieById(item.content_id);
          
          const castDetails = details as any;
          const mediaItem: MediaItem = {
            id: String(castDetails.id),
            title: castDetails.title || castDetails.name,
            posterPath: castDetails.poster_path,
            backdropPath: castDetails.backdrop_path,
            contentType: item.content_type as any,
            rating: castDetails.vote_average,
          };
          return mediaItem;
        } catch (e) {
          return null;
        }
      });
      const results = await Promise.all(promises);
      return results.filter((r): r is MediaItem => r !== null);
    },
    enabled: items.length > 0,
  });

  if (items.length === 0 || (!isLoading && enrichedItems.data?.length === 0)) return null;

  return (
    <ErrorBoundary>
      <MediaCarousel 
        title={title} 
        items={enrichedItems.data || []} 
        contentType="movie" 
        isLoading={isLoading || enrichedItems.isLoading} 
      />
    </ErrorBoundary>
  );
}

function HomePage({ router }: { router: any }) {
  const { data: trendingMovies = [], isLoading: l1 } = useQuery({ queryKey: ['trending', 'movies'], queryFn: fetchTrendingMovies });
  const { data: trendingTV = [], isLoading: l2 } = useQuery({ queryKey: ['trending', 'tv'], queryFn: fetchTrendingTVShows });
  const { data: topMovies = [], isLoading: l3 } = useQuery({ queryKey: ['topRated', 'movies'], queryFn: fetchTopRatedMovies });
  const { data: topTV = [], isLoading: l4 } = useQuery({ queryKey: ['topRated', 'tv'], queryFn: fetchTopRatedTVShows });
  const { data: hindiMovies = [], isLoading: l5 } = useQuery({ queryKey: ['hindi', 'movies'], queryFn: fetchTopHindiMovies });
  const { data: hindiTV = [], isLoading: l6 } = useQuery({ queryKey: ['hindi', 'tv'], queryFn: fetchTopHindiTVShows });
  const { data: ottContent = [], isLoading: l7 } = useQuery({ queryKey: ['ott', 'content'], queryFn: fetchTopOTTContent });

  const { data: myListItems = [], isLoading: myListLoading } = useMyList();
  const { data: watchHistoryItems = [], isLoading: historyLoading } = useWatchHistory();

  const heroItems = [
    ...trendingMovies.filter(m => m.backdrop_path).slice(0, 5).map(tmdbMovieToMediaItem),
    ...trendingTV.filter(s => s.backdrop_path).slice(0, 5).map(tmdbTVToMediaItem),
  ];

  return (
    <div className="min-h-screen bg-[#141414]">
      {heroItems.length > 0 && <HeroBanner items={heroItems} />}

      <div className="relative z-10 -mt-12 md:-mt-8 space-y-0">
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

        <OTTProviderRow 
          providers={OTT_PROVIDERS} 
          onSelect={(providerId) => {
            const provider = OTT_PROVIDERS.find(p => p.id === providerId);
            if (provider) {
              router.push(`/service/${provider.id}`);
            }
          }} 
        />
      </div>

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
