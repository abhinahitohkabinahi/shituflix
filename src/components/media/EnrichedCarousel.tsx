'use client';

import { useQuery } from '@tanstack/react-query';
import { MediaCarousel } from './MediaCarousel';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { fetchMovieById, fetchTVShowById } from '@/services/tmdb';
import type { MediaItem } from '@/types/media';

interface EnrichedCarouselProps {
  title: string;
  items: { content_id: string; content_type: string }[];
  isLoading: boolean;
}

export function EnrichedCarousel({ 
  title, 
  items, 
  isLoading 
}: EnrichedCarouselProps) {
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
        contentType="movie" // This is just a fallback for the prop, card will use item.contentType if available
        isLoading={isLoading || enrichedItems.isLoading} 
      />
    </ErrorBoundary>
  );
}
