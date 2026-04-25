'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { Play, Plus, ChevronDown, Check } from 'lucide-react';
import { TMDB_IMAGE_BASE_URL, TMDB_BACKDROP_BASE_URL } from '@/utils/constants';
import { useMyList } from '@/hooks/useMyList';
import { useAuth } from '@/hooks/useAuth';
import { RootState } from '@/store/store';
import { openModal } from '@/store/mediaSlice';
import type { MediaItem, ContentType } from '@/types/media';

interface MediaCardProps {
  item: MediaItem;
  contentType: ContentType;
}

const detailPath: Record<ContentType, string> = {
  movie: '/movie',
  tv: '/tv',
  anime: '/anime',
};

const watchPath: Record<ContentType, string> = {
  movie: '/watch/movie',
  tv: '/watch/tv',
  anime: '/watch/anime',
};

export function MediaCard({ item, contentType }: MediaCardProps) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { isInList, addMutation, removeMutation } = useMyList();
  const inList = isAuthenticated ? isInList(item.id) : false;
  const showTitles = useSelector((state: RootState) => state.media.showTitles);
  
  const href = `${detailPath[contentType]}/${item.id}`;
  const src = item.backdropPath 
    ? `${TMDB_BACKDROP_BASE_URL}${item.backdropPath}` 
    : item.posterPath 
      ? `${TMDB_IMAGE_BASE_URL}${item.posterPath}` 
      : null;

  function handleListToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeMutation.mutate(item.id);
    } else {
      addMutation.mutate({ contentId: item.id, contentType: item.contentType });
    }
  }

  function handleCardClick() {
    dispatch(openModal(item));
  }

  return (
    <div 
      className="netflix-card relative w-full aspect-video rounded-sm overflow-visible bg-gray-900 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="block w-full h-full">
        <div className="relative w-full h-full">
          {src ? (
            <Image
              src={src}
              alt={item.title}
              fill
              className="object-cover rounded-sm"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center px-2">
              {item.title}
            </div>
          )}
          
          {/* Global Title Toggle Overlay */}
          {showTitles && (
            <div className="absolute bottom-0 left-0 w-full p-2 bg-black/60 group-hover:opacity-0 transition-opacity">
              <p className="text-[10px] text-white font-bold line-clamp-1">{item.title}</p>
            </div>
          )}
        </div>
      </div>

      {/* Hover Information Overlay */}
      <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
        <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black via-black/80 to-transparent rounded-b-sm">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href={`${watchPath[contentType]}/${item.id}`}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 bg-white rounded-full hover:bg-gray-200 transition-colors"
            >
              <Play className="fill-black h-3 w-3 text-black" />
            </Link>
            <button 
              onClick={handleListToggle}
              className="p-1.5 border border-gray-400 rounded-full hover:border-white transition-colors"
            >
              {inList ? <Check className="h-3 w-3 text-white" /> : <Plus className="h-3 w-3 text-white" />}
            </button>
            <Link 
              href={href}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto p-1.5 border border-gray-400 rounded-full hover:border-white transition-colors"
              title="More Info"
            >
              <ChevronDown className="h-3 w-3 text-white" />
            </Link>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="text-green-500">98% Match</span>
            <span className="border border-gray-500 px-1 text-gray-300">13+</span>
            <span className="text-gray-300">{item.rating?.toFixed(1)} ★</span>
          </div>
          
          <p className="text-[10px] text-white font-bold mt-1 line-clamp-1">{item.title}</p>
        </div>
      </div>
    </div>
  );
}

