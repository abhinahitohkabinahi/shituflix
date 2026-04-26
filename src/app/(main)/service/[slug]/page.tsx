'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useParams, notFound } from 'next/navigation';
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

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  
  const provider = OTT_PROVIDERS.find(p => p.id === slug);
  if (!provider) return notFound();

  const networkId = provider.networkId;

  // Fetch all categories
  const queries = CATEGORIES.map((cat) => ({
    queryKey: ['network', networkId, cat.title],
    queryFn: () => fetchTVShowsByNetwork(networkId, 1, cat.genres),
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
      <div className="flex items-center gap-4">
        <div className="bg-white/10 backdrop-blur-md p-2 md:p-3 rounded-xl inline-block shadow-2xl border border-white/20">
          <Image 
            src={provider.logo} 
            alt={provider.name} 
            width={120} 
            height={45} 
            className="h-8 md:h-12 w-auto object-contain brightness-110"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-lg tracking-tight">
            {provider.name}
          </h1>
          <p className="text-gray-200 text-xs md:text-sm font-medium drop-shadow-md">
            Original series and exclusive content
          </p>
        </div>
      </div>
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
