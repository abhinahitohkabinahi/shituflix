'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { MediaCarousel } from '@/components/media/MediaCarousel';
import { MediaPageLayout } from '@/components/media/MediaPageLayout';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { fetchTVShowsByNetwork } from '@/services/tmdb/tmdbOtt';
import { tmdbTVToMediaItem } from '@/utils/mediaMapping';
import { OTT_PROVIDERS } from '@/utils/constants';

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

  const topContent = (
    <div className="px-4 md:px-12 lg:px-16 pt-28 pb-4 bg-gradient-to-b from-black/60 to-transparent">
      <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl tracking-tight">
        {providerName}
      </h1>
      <p className="text-gray-200 mt-1 font-medium text-sm md:text-base drop-shadow-md">
        Original series and exclusive content
      </p>
    </div>
  );

  return (
    <MediaPageLayout heroItems={heroItems} topContent={topContent}>
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
    </MediaPageLayout>
  );
}
