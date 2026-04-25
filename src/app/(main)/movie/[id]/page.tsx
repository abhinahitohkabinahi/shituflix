'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { Server } from 'lucide-react';
import { fetchMovieById } from '@/services/tmdb';
import { Badge } from '@/components/ui/Badge';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Spinner } from '@/components/ui/Spinner';
import { useMyList } from '@/hooks/useMyList';
import { useAuth } from '@/hooks/useAuth';
import { formatRuntime, formatRating } from '@/utils/formatters';
import { TMDB_BACKDROP_BASE_URL, TMDB_IMAGE_BASE_URL } from '@/utils/constants';
import { RootState } from '@/store/store';
import { setProvider } from '@/store/mediaSlice';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const selectedProvider = useSelector((state: RootState) => state.media.selectedProvider);
  const { isAuthenticated } = useAuth();
  const { isInList, addMutation, removeMutation } = useMyList();

  const { data: movie, isLoading, isError, refetch } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieById(id),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (isError || !movie) return <ErrorMessage message="Failed to load movie details." onRetry={() => refetch()} />;

  const inList = isAuthenticated ? isInList(String(movie.id)) : false;
  const backdropSrc = movie.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}` : null;
  const posterSrc = movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#141414]">
        {backdropSrc && (
          <div className="relative w-full h-64 md:h-96">
            <Image src={backdropSrc} alt={movie.title} fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
          </div>
        )}
        <div className="max-w-5xl mx-auto px-4 py-8 flex gap-8">
          {posterSrc && (
            <div className="hidden md:block flex-shrink-0">
              <Image src={posterSrc} alt={movie.title} width={200} height={300} className="rounded-lg object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
            <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-400">
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime > 0 && <span>· {formatRuntime(movie.runtime)}</span>}
              {movie.vote_average > 0 && <span>· ★ {formatRating(movie.vote_average)}</span>}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map(g => <Badge key={g.id} label={g.name} />)}
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">{movie.overview}</p>
            <div className="flex gap-3 mb-6 items-center">
              <Link
                href={`/watch/movie/${movie.id}`}
                className="px-6 py-2 bg-[#e50914] text-white font-semibold rounded hover:bg-[#b20710] transition-colors"
              >
                ▶ Watch Now
              </Link>
              
              <button 
                onClick={() => dispatch(setProvider(selectedProvider === 'videoeasy' ? 'vidsrc' : 'videoeasy'))}
                className="p-2 border-2 border-gray-400 bg-gray-800 hover:border-white rounded text-white transition-colors group relative"
                title={`Switch Source (Current: ${selectedProvider === 'videoeasy' ? 'VideoEasy' : 'VidSrc'})`}
              >
                <Server className={`w-5 h-5 transition-transform ${selectedProvider === 'videoeasy' ? 'text-green-400' : 'text-blue-400'}`} />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black px-2 py-1 rounded">
                  {selectedProvider === 'videoeasy' ? 'VideoEasy' : 'VidSrc'}
                </span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => inList
                    ? removeMutation.mutate(String(movie.id))
                    : addMutation.mutate({ contentId: String(movie.id), contentType: 'movie' })
                  }
                  className="px-6 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition-colors"
                >
                  {inList ? '✓ In My List' : '+ My List'}
                </button>
              )}
            </div>
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.slice(0, 8).map(c => (
                    <span key={c.id} className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
