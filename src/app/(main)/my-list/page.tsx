'use client';

import { fetchMovieById, fetchTVShowById } from '@/services/tmdb';
import { useQuery } from '@tanstack/react-query';
import { MediaCard } from '@/components/media/MediaCard';
import { useAuth } from '@/hooks/useAuth';
import { useMyList } from '@/hooks/useMyList';
import { Spinner } from '@/components/ui/Spinner';
import type { MediaItem, ContentType } from '@/types/media';

function EnrichedMediaCard({ contentId, contentType }: { contentId: string; contentType: ContentType }) {
  const { data: details, isLoading } = useQuery<any>({
    queryKey: [contentType, contentId],
    queryFn: () => contentType === 'tv' ? fetchTVShowById(contentId) : fetchMovieById(contentId),
  });

  if (isLoading || !details) {
    return <div className="aspect-video bg-gray-800 animate-pulse rounded-sm" />;
  }

  const castDetails = details as any;
  const mediaItem: MediaItem = {
    id: String(castDetails.id),
    title: castDetails.title || castDetails.name,
    posterPath: castDetails.poster_path,
    backdropPath: castDetails.backdrop_path,
    contentType,
    rating: castDetails.vote_average,
  };

  return <MediaCard item={mediaItem} contentType={contentType} />;
}

export default function MyListPage() {
  const { isAuthenticated } = useAuth();
  const { data: items = [], isLoading } = useMyList();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <p className="text-gray-400">Sign in to view your list.</p>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center py-40"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16">
        <h1 className="text-3xl font-bold text-white mb-8">My List</h1>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <p className="text-gray-500 text-xl max-w-md">Your list is empty. Add movies, TV shows, or anime to watch later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {items.map(item => (
              <EnrichedMediaCard 
                key={item.content_id} 
                contentId={item.content_id} 
                contentType={item.content_type as ContentType} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
