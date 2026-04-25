'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { Play, Info, Plus, Check } from 'lucide-react';
import { TMDB_BACKDROP_BASE_URL } from '@/utils/constants';
import { useMyList } from '@/hooks/useMyList';
import { useAuth } from '@/hooks/useAuth';
import { openModal } from '@/store/mediaSlice';
import type { MediaItem, ContentType } from '@/types/media';

interface HeroBannerProps {
  items: MediaItem[];
}

const watchPath: Record<ContentType, string> = {
  movie: '/watch/movie',
  tv: '/watch/tv',
  anime: '/watch/anime',
};

export function HeroBanner({ items }: HeroBannerProps) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { isInList, addMutation, removeMutation } = useMyList();
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const inList = isAuthenticated ? isInList(currentItem.id) : false;

  function handleListToggle() {
    if (inList) {
      removeMutation.mutate(currentItem.id);
    } else {
      addMutation.mutate({ contentId: currentItem.id, contentType: currentItem.contentType });
    }
  }

  return (
    <header className="relative w-full h-[85vh] lg:h-[95vh] text-white overflow-hidden bg-[#141414]">
      {/* Background Images - Render all and crossfade using opacity */}
      {items.map((item, index) => {
        const backdropSrc = item.backdropPath ? `${TMDB_BACKDROP_BASE_URL}${item.backdropPath}` : null;
        if (!backdropSrc) return null;
        const isActive = index === currentIndex;

        return (
          <div 
            key={item.id} 
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="relative w-full h-full">
              <Image
                src={backdropSrc}
                alt={item.title}
                fill
                className="object-cover object-center"
                priority={index === 0} // Only prioritize the first image
                sizes="100vw"
                unoptimized
              />
              {/* Gradients */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_100%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#141414] to-transparent" />
            </div>
          </div>
        );
      })}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-12 lg:px-16 pt-20 max-w-3xl pointer-events-none">
        <div className="pointer-events-auto">
          {/* Key forces re-animation of text on change */}
          <div key={currentItem.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="font-display mb-4 drop-shadow-lg tracking-wider" style={{ fontSize: 'clamp(2rem, 8vw, var(--text-large-title))', lineHeight: '1.1' }}>
              {currentItem.title}
            </h1>
            
            <p className="mb-8 line-clamp-3 drop-shadow-md text-gray-200 font-medium" style={{ fontSize: 'var(--text-headline-2)', maxWidth: '600px' }}>
              {currentItem.overview}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={`${watchPath[currentItem.contentType]}/${currentItem.id}`}
              className="flex items-center gap-3 px-6 md:px-8 py-2 md:py-3 bg-white text-black font-bold rounded hover:bg-white/90 transition-all transform hover:scale-105 active:scale-95 text-lg"
            >
              <Play className="fill-black h-6 w-6" />
              Play
            </Link>

            <button
               onClick={handleListToggle}
               className="flex items-center gap-3 px-6 md:px-8 py-2 md:py-3 bg-gray-500/50 text-white font-bold rounded hover:bg-gray-500/40 transition-all transform hover:scale-105 active:scale-95 text-lg backdrop-blur-sm"
            >
              {inList ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
              {inList ? 'In List' : 'My List'}
            </button>

            <button
               onClick={() => dispatch(openModal(currentItem))}
               className="hidden md:flex items-center gap-3 px-6 md:px-8 py-2 md:py-3 bg-gray-500/50 text-white font-bold rounded hover:bg-gray-500/40 transition-all transform hover:scale-105 active:scale-95 text-lg backdrop-blur-sm"
            >
              <Info className="h-6 w-6" />
              More Info
            </button>
          </div>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-12 left-4 md:left-12 lg:left-16 flex gap-2 pointer-events-auto">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-white' : 'w-4 bg-gray-500/50 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
