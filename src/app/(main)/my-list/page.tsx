'use client';

import { useMyList } from '@/hooks/useMyList';
import { useAuth } from '@/hooks/useAuth';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Spinner } from '@/components/ui/Spinner';
import type { MediaItem, ContentType } from '@/types/media';
import type { MyListRow } from '@/types/supabase';

function rowToMediaItem(row: MyListRow): MediaItem {
  return {
    id: row.content_id,
    title: row.content_id, // title not stored; will show ID until enriched
    posterPath: null,
    backdropPath: null,
    contentType: row.content_type as ContentType,
  };
}

export default function MyListPage() {
  const { isAuthenticated } = useAuth();
  const { data: items = [], isLoading, removeMutation } = useMyList();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <p className="text-gray-400">Sign in to view your list.</p>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-[#141414] py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">My List</h1>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Your list is empty. Add movies, TV shows, or anime to watch later.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map(item => (
              <div key={item.id} className="relative group">
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-white text-xs truncate mb-2">{item.content_id}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.content_type === 'movie' ? 'bg-red-900 text-red-200' :
                    item.content_type === 'tv' ? 'bg-blue-900 text-blue-200' :
                    'bg-purple-900 text-purple-200'
                  }`}>
                    {item.content_type}
                  </span>
                  <button
                    onClick={() => removeMutation.mutate(item.content_id)}
                    className="mt-2 w-full text-xs text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
