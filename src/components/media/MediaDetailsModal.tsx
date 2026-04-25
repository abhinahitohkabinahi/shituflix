'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { X, Play, Plus, Check, ThumbsUp, VolumeX, Server } from 'lucide-react';

import { RootState } from '@/store/store';
import { closeModal, setProvider } from '@/store/mediaSlice';
import { TMDB_BACKDROP_BASE_URL, TMDB_IMAGE_BASE_URL } from '@/utils/constants';
import { useMyList } from '@/hooks/useMyList';
import { useAuth } from '@/hooks/useAuth';
import { fetchTVShowById, fetchMovieById, fetchSeasonDetails } from '@/services/tmdb';
import { SeasonSelector } from '@/components/media/SeasonSelector';
import { EpisodeList } from '@/components/media/EpisodeList';
import { Spinner } from '@/components/ui/Spinner';
import type { TmdbEpisode, TmdbMovie, TmdbTVShow, TmdbGenre, TmdbCastMember } from '@/types/tmdb';

export function MediaDetailsModal() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { modalItem, isModalOpen, selectedProvider } = useSelector((state: RootState) => state.media);
  const { isAuthenticated } = useAuth();
  const { isInList, addMutation, removeMutation } = useMyList();
  
  const [renderModal, setRenderModal] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  useEffect(() => {
    if (isModalOpen) {
      setRenderModal(true);
      document.body.style.overflow = 'hidden';
      setSelectedSeason(1);
      setSelectedEpisode(1);
    } else {
      setTimeout(() => {
        setRenderModal(false);
      }, 300);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const { data: details, isLoading: isDetailsLoading } = useQuery<TmdbTVShow | TmdbMovie>({
    queryKey: [modalItem?.contentType, modalItem?.id],
    queryFn: () => modalItem?.contentType === 'tv' 
      ? fetchTVShowById(modalItem.id) 
      : fetchMovieById(modalItem!.id),
    enabled: !!isModalOpen && !!modalItem,
  });

  const show = modalItem?.contentType === 'tv' ? (details as TmdbTVShow) : null;
  const movie = modalItem?.contentType === 'movie' ? (details as TmdbMovie) : null;

  const { data: season, isLoading: isSeasonLoading } = useQuery({
    queryKey: ['season', modalItem?.id, selectedSeason],
    queryFn: () => fetchSeasonDetails(modalItem!.id, selectedSeason),
    enabled: isModalOpen && modalItem?.contentType === 'tv',
  });

  if (!renderModal || !modalItem) return null;

  const inList = isAuthenticated ? isInList(modalItem.id) : false;
  const src = modalItem.backdropPath 
    ? `${TMDB_BACKDROP_BASE_URL}${modalItem.backdropPath}` 
    : modalItem.posterPath 
      ? `${TMDB_IMAGE_BASE_URL}${modalItem.posterPath}` 
      : null;

  function handleListToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeMutation.mutate(modalItem!.id);
    } else {
      addMutation.mutate({ contentId: modalItem!.id, contentType: modalItem!.contentType });
    }
  }

  function handleClose() {
    dispatch(closeModal());
  }

  function toggleProvider() {
    dispatch(setProvider(selectedProvider === 'videoeasy' ? 'vidsrc' : 'videoeasy'));
  }

  function handleEpisodeSelect(ep: TmdbEpisode) {
    setSelectedEpisode(ep.episode_number);
    dispatch(closeModal());
    router.push(`/watch/tv/${modalItem!.id}?season=${selectedSeason}&episode=${ep.episode_number}`);
  }

  const seasonsList = show?.seasons?.filter((s: any) => s.season_number > 0) ?? [];
  const isTV = modalItem.contentType === 'tv';

  return (
    <div 
      className={`fixed inset-0 z-50 flex justify-center pt-8 pb-8 px-4 md:px-0 transition-all duration-300 overflow-y-auto ${
        isModalOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-5xl bg-[#181818] rounded-xl shadow-2xl transition-all duration-300 transform my-auto h-fit mb-auto overflow-hidden ${
          isModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#181818]/70 hover:bg-[#181818] rounded-full text-white transition-colors border border-gray-600 hover:border-white"
        >
          <X size={24} />
        </button>

        {/* Hero Banner Section */}
        <div className="relative w-full aspect-video sm:aspect-[21/9] max-h-[60vh]">
          {src ? (
            <>
              <Image
                src={src}
                alt={modalItem.title}
                fill
                className="object-cover"
                priority
              />
              {/* Fade to background color at the bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]" />
            </>
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <span className="text-gray-500 text-2xl">{modalItem.title}</span>
            </div>
          )}

          {/* Title and Buttons Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col justify-end pointer-events-none">
            {/* Netflix Series Logo style */}
            {isTV && (
              <div className="flex items-center gap-1.5 mb-1 opacity-90 drop-shadow-md">
                <span className="text-[#e50914] font-black tracking-tighter text-xl">N</span>
                <span className="text-gray-200 text-[10px] tracking-[0.3em] font-bold mt-1">S E R I E S</span>
              </div>
            )}
            
            <h1 className="font-display text-white mb-6 drop-shadow-xl uppercase tracking-wider w-3/4" style={{ fontSize: 'var(--text-title-1)', fontWeight: 'var(--weight-bold)' }}>
              {modalItem.title}
            </h1>
            
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3">
                <Link 
                  href={`/watch/${modalItem.contentType}/${modalItem.id}`}
                  onClick={handleClose}
                  className="flex items-center justify-center gap-2 px-8 py-2 bg-white hover:bg-white/80 text-black rounded font-bold transition-colors"
                >
                  <Play size={24} className="fill-black" />
                  <span className="text-lg">Play</span>
                </Link>

                <button 
                  onClick={handleListToggle}
                  className="w-10 h-10 border border-gray-400 bg-black/40 hover:border-white rounded-full flex items-center justify-center transition-colors group"
                  title={inList ? "Remove from My List" : "Add to My List"}
                >
                  {inList ? <Check className="text-white w-5 h-5" /> : <Plus className="text-white w-5 h-5" />}
                </button>

                <button 
                  className="w-10 h-10 border border-gray-400 bg-black/40 hover:border-white rounded-full flex items-center justify-center transition-colors"
                  title="Rate"
                >
                  <ThumbsUp className="text-white w-5 h-5" />
                </button>

                {/* Provider Toggle */}
                <button 
                  onClick={toggleProvider}
                  className="ml-2 w-10 h-10 border border-gray-400 bg-black/40 hover:border-white rounded-full flex items-center justify-center transition-colors relative group"
                  title={`Source: ${selectedProvider === 'videoeasy' ? 'VideoEasy' : 'VidSrc'}`}
                >
                  <Server className={`w-5 h-5 transition-transform ${selectedProvider === 'videoeasy' ? 'text-green-400' : 'text-blue-400'}`} />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black px-2 py-1 rounded">
                    {selectedProvider === 'videoeasy' ? 'VideoEasy' : 'VidSrc'}
                  </span>
                </button>
              </div>

              {/* Mute Button (Visual mock) */}
              <button className="hidden md:flex w-10 h-10 border border-gray-400 bg-black/40 hover:border-white rounded-full items-center justify-center transition-colors">
                <VolumeX className="text-white w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="px-8 md:px-12 pt-4 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column (2/3) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-base font-semibold">
              <span className="text-[#46d369]">{Math.round(((details as any)?.vote_average || 8.5) * 10)}% Match</span>
              {isTV && <span className="text-gray-300">{(show as any)?.number_of_seasons || seasonsList.length || 1} Seasons</span>}
              {modalItem.year && <span className="text-gray-300">{modalItem.year}</span>}
              <div className="flex items-center gap-1.5">
                {/* Audio Description Mock */}
                <span className="border border-gray-400 text-gray-300 px-1 py-0.5 rounded-[2px] text-[10px] font-bold flex items-center gap-0.5 bg-transparent">
                  AD<span className="text-[8px]">)))</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Content Rating Icon */}
              {(() => {
                let rating = '';
                if (modalItem.contentType === 'tv' && show?.content_ratings) {
                  rating = show.content_ratings.results.find((r: any) => r.iso_3166_1 === 'US')?.rating || show.content_ratings.results[0]?.rating;
                } else if (modalItem.contentType === 'movie' && movie?.release_dates) {
                  const release = movie.release_dates.results.find((r: any) => r.iso_3166_1 === 'US') || movie.release_dates.results[0];
                  rating = release?.release_dates[0]?.certification;
                }
                
                if (!rating) return <span className="border border-gray-400 text-gray-300 px-1.5 py-0.5 rounded text-xs font-bold bg-[#181818]">TV-MA</span>;
                
                return (
                  <Image 
                    src={`/assets/Rating/${rating}.svg`} 
                    alt={rating} 
                    width={40} 
                    height={24} 
                    className="h-5 w-auto object-contain"
                    onError={(e) => {
                      // Fallback if icon doesn't exist
                      (e.target as any).style.display = 'none';
                    }}
                  />
                );
              })()}

              {/* Video Quality Icon - Default to HD for now */}
              <Image 
                src="/assets/videoQuality/HD.svg" 
                alt="HD" 
                width={30} 
                height={20} 
                className="h-4 w-auto object-contain opacity-80"
              />

              <span className="text-sm text-gray-300">smoking, violence</span>
            </div>

            {/* Top 10 Mock */}
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-[#e50914] text-white text-[10px] font-black leading-tight px-1 py-0.5 flex flex-col items-center justify-center rounded-sm">
                <span>TOP</span>
                <span className="text-sm -mt-1">10</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                #2 in {isTV ? 'TV Shows' : 'Movies'} Today
              </span>
            </div>
            
            <p className="text-gray-200 leading-relaxed mt-4" style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-regular)' }}>
              {modalItem.overview || 'No description available for this title.'}
            </p>
          </div>
          
          {/* Right Column (1/3) */}
          <div className="text-sm text-gray-400 space-y-3 pt-1">
            <p>
              <span className="text-gray-500">Cast: </span>
              {(show?.cast || movie?.cast)?.slice(0, 3).map((c: any) => c.name).join(', ') || 'Kento Kaku, Yosuke Eguchi, Tae Kimura'}, more
            </p>
            <p>
              <span className="text-gray-500">Genres: </span> 
              {(show?.genres || movie?.genres)?.map((g: any) => g.name).join(', ') || 'TV Dramas, Japanese, TV Thrillers'}
            </p>
            <p>
              <span className="text-gray-500">This show is: </span> 
              Dark, Suspenseful, Exciting
            </p>
          </div>
        </div>

        {/* TV Show Episodes Section */}
        {isTV && (
          <div className="px-8 md:px-12 pb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white" style={{ fontSize: 'var(--text-title-4)', fontWeight: 'var(--weight-bold)' }}>Episodes</h3>
              
              <div className="flex items-center gap-4">
                <span className="text-lg text-gray-300">{modalItem.title}</span>
              </div>
            </div>

            {seasonsList.length > 1 && (
              <div className="mb-6 w-48">
                <SeasonSelector 
                  seasons={seasonsList} 
                  selectedSeason={selectedSeason} 
                  onChange={setSelectedSeason} 
                />
              </div>
            )}

            {isDetailsLoading || isSeasonLoading ? (
              <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : season?.episodes ? (
              <div className="custom-scrollbar">
                <EpisodeList 
                  episodes={season.episodes} 
                  onSelect={handleEpisodeSelect} 
                  selectedEpisodeNumber={selectedEpisode}
                />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Episodes not available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
