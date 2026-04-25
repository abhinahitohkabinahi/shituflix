'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { Server } from 'lucide-react';
import { fetchTVShowById, fetchSeasonDetails } from '@/services/tmdb';
import { Badge } from '@/components/ui/Badge';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Spinner } from '@/components/ui/Spinner';
import { SeasonSelector } from '@/components/media/SeasonSelector';
import { EpisodeList } from '@/components/media/EpisodeList';
import { useMyList } from '@/hooks/useMyList';
import { useAuth } from '@/hooks/useAuth';
import { formatRating } from '@/utils/formatters';
import { TMDB_BACKDROP_BASE_URL, TMDB_IMAGE_BASE_URL } from '@/utils/constants';
import { RootState } from '@/store/store';
import { setProvider } from '@/store/mediaSlice';
import type { TmdbEpisode } from '@/types/tmdb';

export default function TVDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedProvider = useSelector((state: RootState) => state.media.selectedProvider);
  const { isAuthenticated } = useAuth();
  const { isInList, addMutation, removeMutation } = useMyList();
  const [selectedSeason, setSelectedSeason] = useState(1);

  const { data: show, isLoading, isError, refetch } = useQuery({
    queryKey: ['tv', id],
    queryFn: () => fetchTVShowById(id),
    enabled: !!id,
  });

  const { data: season, isError: seasonError, refetch: refetchSeason } = useQuery({
    queryKey: ['season', id, selectedSeason],
    queryFn: () => fetchSeasonDetails(id, selectedSeason),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (isError || !show) return <ErrorMessage message="Failed to load TV show details." onRetry={() => refetch()} />;

  const inList = isAuthenticated ? isInList(String(show.id)) : false;
  const backdropSrc = show.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${show.backdrop_path}` : null;
  const posterSrc = show.poster_path ? `${TMDB_IMAGE_BASE_URL}${show.poster_path}` : null;
  const seasons = show.seasons?.filter(s => s.season_number > 0) ?? [];

  function handleEpisodeSelect(ep: TmdbEpisode) {
    if (show) {
      router.push(`/watch/tv/${show.id}?season=${selectedSeason}&episode=${ep.episode_number}`);
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#141414]">
        {backdropSrc && (
          <div className="relative w-full h-64 md:h-96">
            <Image src={backdropSrc} alt={show.name} fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
          </div>
        )}
        <div className="max-w-5xl mx-auto px-4 py-8 flex gap-8">
          {posterSrc && (
            <div className="hidden md:block flex-shrink-0">
              <Image src={posterSrc} alt={show.name} width={200} height={300} className="rounded-lg object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{show.name}</h1>
            <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-400">
              {show.first_air_date && <span>{show.first_air_date.slice(0, 4)}</span>}
              {show.vote_average > 0 && <span>· ★ {formatRating(show.vote_average)}</span>}
              <span>· {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {show.genres?.map(g => <Badge key={g.id} label={g.name} />)}
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">{show.overview}</p>
            <div className="flex gap-3 mb-6 items-center">
              {isAuthenticated && (
                <button
                  onClick={() => inList
                    ? removeMutation.mutate(String(show.id))
                    : addMutation.mutate({ contentId: String(show.id), contentType: 'tv' })
                  }
                  className="px-6 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition-colors"
                >
                  {inList ? '✓ In My List' : '+ My List'}
                </button>
              )}

              <button 
                onClick={() => dispatch(setProvider(selectedProvider === 'videoeasy' ? 'vidsrc' : 'videoeasy'))}
                className="p-2 border-2 border-gray-400 bg-gray-800 hover:border-white rounded text-white transition-colors group relative"
                title={`Switch Source (Current: ${selectedProvider === 'videoeasy' ? 'VideoEasy' : 'VidSrc'})`}
              >
                <Server className={`w-5 h-5 transition-transform ${selectedProvider === 'videoeasy' ? 'text-green-400' : 'text-blue-400'}`} />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black px-2 py-1 rounded z-10">
                  {selectedProvider === 'videoeasy' ? 'VideoEasy' : 'VidSrc'}
                </span>
              </button>
            </div>
            {seasons.length > 0 && (
              <div className="mb-4">
                <SeasonSelector seasons={seasons} selectedSeason={selectedSeason} onChange={setSelectedSeason} />
              </div>
            )}
            {seasonError ? (
              <ErrorMessage message="Failed to load season details." onRetry={() => refetchSeason()} />
            ) : season?.episodes ? (
              <EpisodeList episodes={season.episodes} onSelect={handleEpisodeSelect} />
            ) : null}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
