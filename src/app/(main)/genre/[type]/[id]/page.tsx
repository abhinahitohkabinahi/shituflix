'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { fetchMoviesByGenre, fetchTVShowsByGenre } from '@/services/tmdb';
import type { TmdbMovie, TmdbTVShow } from '@/types/tmdb';
import type { MediaItem, ContentType } from '@/types/media';

function tmdbMovieToMediaItem(m: TmdbMovie): MediaItem {
  return { id: String(m.id), title: m.title, posterPath: m.poster_path, backdropPath: m.backdrop_path, contentType: 'movie', rating: m.vote_average };
}

function tmdbTVToMediaItem(s: TmdbTVShow): MediaItem {
  return { id: String(s.id), title: s.name, posterPath: s.poster_path, backdropPath: s.backdrop_path, contentType: 'tv', rating: s.vote_average };
}

export default function GenrePage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<MediaItem[]>([]);

  const contentType: ContentType = type === 'tv' ? 'tv' : 'movie';

  const { isLoading, isError, refetch } = useQuery({
    queryKey: ['genre', type, id, page],
    queryFn: async () => {
      const results = contentType === 'movie'
        ? await fetchMoviesByGenre(id, page)
        : await fetchTVShowsByGenre(id, page);
      const items = contentType === 'movie'
        ? (results as TmdbMovie[]).map(tmdbMovieToMediaItem)
        : (results as TmdbTVShow[]).map(tmdbTVToMediaItem);
      setAllItems(prev => page === 1 ? items : [...prev, ...items]);
      return results;
    },
    enabled: !!id && !!type,
  });

  if (isLoading && page === 1) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (isError) return <ErrorMessage message="Failed to load content." onRetry={() => refetch()} />;

  return (
    <div className="min-h-screen bg-[#141414] py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6 capitalize">
          {contentType === 'movie' ? 'Movies' : 'TV Shows'} — Genre {id}
        </h1>
        <MediaGrid
          items={allItems}
          contentType={contentType}
          onLoadMore={() => setPage(p => p + 1)}
        />
        {isLoading && page > 1 && <div className="flex justify-center py-4"><Spinner /></div>}
      </div>
    </div>
  );
}
