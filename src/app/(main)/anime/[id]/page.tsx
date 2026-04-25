'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { Server } from 'lucide-react';
import { fetchAnimeById } from '@/services/anilist';
import { Badge } from '@/components/ui/Badge';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Spinner } from '@/components/ui/Spinner';
import { useMyList } from '@/hooks/useMyList';
import { useAuth } from '@/hooks/useAuth';
import { RootState } from '@/store/store';
import { setProvider } from '@/store/mediaSlice';

export default function AnimeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedProvider = useSelector((state: RootState) => state.media.selectedProvider);
  const { isAuthenticated } = useAuth();
  const { isInList, addMutation, removeMutation } = useMyList();
  const [isDub, setIsDub] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  const { data: anime, isLoading, isError, refetch } = useQuery({
    queryKey: ['anime', id],
    queryFn: () => fetchAnimeById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (isError || !anime) return <ErrorMessage message="Failed to load anime details." onRetry={() => refetch()} />;

  const inList = isAuthenticated ? isInList(String(anime.id)) : false;
  const episodeCount = anime.episodes ?? 0;

  function handleEpisodeSelect(ep: number) {
    if (anime) {
      router.push(`/watch/anime/${anime.id}?episode=${ep}&dub=${isDub}`);
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#141414]">
        {anime.bannerImage && (
          <div className="relative w-full h-48 md:h-72">
            <Image src={anime.bannerImage} alt={anime.title.romaji} fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
          </div>
        )}
        <div className="max-w-5xl mx-auto px-4 py-8 flex gap-8">
          <div className="hidden md:block flex-shrink-0">
            <Image
              src={anime.coverImage.extraLarge}
              alt={anime.title.romaji}
              width={180}
              height={260}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-1">
              {anime.title.english ?? anime.title.romaji}
            </h1>
            {anime.title.english && (
              <p className="text-gray-400 text-sm mb-3">{anime.title.romaji}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-400">
              {anime.seasonYear && <span>{anime.seasonYear}</span>}
              {episodeCount > 0 && <span>· {episodeCount} episodes</span>}
              {anime.averageScore && <span>· ★ {(anime.averageScore / 10).toFixed(1)}</span>}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres?.map(g => <Badge key={g} label={g} variant="purple" />)}
            </div>
            {anime.studios?.nodes?.length > 0 && (
              <p className="text-gray-400 text-sm mb-4">
                Studio: {anime.studios.nodes.map(s => s.name).join(', ')}
              </p>
            )}
            {anime.description && (
              <p className="text-gray-300 leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: anime.description.replace(/<br>/gi, ' ') }}
              />
            )}

            {/* Sub/Dub toggle & Actions */}
            <div className="flex gap-2 mb-6 items-center flex-wrap">
              <button
                onClick={() => setIsDub(false)}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${!isDub ? 'bg-[#e50914] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Sub
              </button>
              <button
                onClick={() => setIsDub(true)}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${isDub ? 'bg-[#e50914] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Dub
              </button>

              <button 
                onClick={() => dispatch(setProvider(selectedProvider === 'videoeasy' ? 'vidsrc' : 'videoeasy'))}
                className="ml-2 p-1.5 border-2 border-gray-400 bg-gray-800 hover:border-white rounded text-white transition-colors group relative"
                title={`Switch Source (Current: ${selectedProvider === 'videoeasy' ? 'VideoEasy' : 'VidSrc'})`}
              >
                <Server className={`w-4 h-4 transition-transform ${selectedProvider === 'videoeasy' ? 'text-green-400' : 'text-blue-400'}`} />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black px-2 py-1 rounded z-10">
                  {selectedProvider === 'videoeasy' ? 'VideoEasy' : 'VidSrc'}
                </span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => inList
                    ? removeMutation.mutate(String(anime.id))
                    : addMutation.mutate({ contentId: String(anime.id), contentType: 'anime' })
                  }
                  className="ml-2 px-6 py-1.5 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition-colors text-sm"
                >
                  {inList ? '✓ In My List' : '+ My List'}
                </button>
              )}
            </div>

            {/* Episode selector */}
            {episodeCount > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Episodes</h2>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {Array.from({ length: episodeCount }, (_, i) => i + 1).map(ep => (
                    <button
                      key={ep}
                      onClick={() => handleEpisodeSelect(ep)}
                      className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                        selectedEpisode === ep
                          ? 'bg-[#e50914] text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {ep}
                    </button>
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
