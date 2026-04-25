'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { MediaCarousel } from '@/components/media/MediaCarousel';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { fetchTVShowsByNetwork } from '@/services/tmdb/tmdbOtt';
import { HeroBanner } from '@/components/media/HeroBanner';
import type { TmdbTVShow } from '@/types/tmdb';
import type { MediaItem } from '@/types/media';
import { OTT_PROVIDERS } from '@/utils/constants';

function tmdbTVToMediaItem(s: TmdbTVShow): MediaItem {
  return { 
    id: String(s.id), 
    title: s.name, 
    posterPath: s.poster_path, 
    backdropPath: s.backdrop_path, 
    contentType: 'tv', 
    rating: s.vote_average,
    overview: s.overview
  };
}

const CATEGORIES = [
  { title: 'Popular Shows', genres: '' },
  { title: 'Action & Adventure', genres: '10759' },
  { title: 'Crime & Mystery', genres: '80,96' },
  { title: 'Drama', genres: '18' },
  { title: 'Comedy', genres: '35' },
  { title: 'Sci-Fi & Fantasy', genres: '10765' },
];

export default function NetworkPage() {
  const { id } = useParams<{ id: string }>();
  
  const provider = OTT_PROVIDERS.find(p => p.networkId === id);
  const providerName = provider?.name || 'Streaming Service';

  // Fetch all categories
  const queries = CATEGORIES.map((cat) => ({
    queryKey: ['network', id, cat.title],
    queryFn: () => fetchTVShowsByNetwork(id, 1, cat.genres),
  }));

  const results = queries.map((q) => useQuery(q));
  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  if (isLoading) return <div className="flex justify-center py-40"><Spinner size="lg" /></div>;
  if (isError) return <ErrorMessage message="Failed to load content." onRetry={() => window.location.reload()} />;

  const popularItems = (results[0].data || []).map(tmdbTVToMediaItem);
  const heroItems = popularItems.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#141414] pb-12 pt-24">
      <div className="px-4 md:px-12 lg:px-16 mb-8">
         <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl">
           {providerName}
         </h1>
         <p className="text-gray-400 mt-2 font-medium">Original series and exclusive content</p>
      </div>

      {/* Hero Banner for the Network */}
      {heroItems.length > 0 && <HeroBanner items={heroItems} />}

      <div className="relative z-20 mt-8">
        {CATEGORIES.map((cat, index) => {
          const items = (results[index].data || []).map(tmdbTVToMediaItem);
          if (items.length === 0) return null;

          return (
            <ErrorBoundary key={cat.title}>
              <MediaCarousel 
                title={cat.title} 
                items={items} 
                contentType="tv" 
                isLoading={results[index].isLoading} 
              />
            </ErrorBoundary>
          );
        })}
      </div>
    </div>
  );
}
