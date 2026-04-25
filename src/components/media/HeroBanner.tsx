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
    <header className="relative w-full h-[70vh] md:h-[85vh] lg:h-[95vh] text-white overflow-hidden bg-[#141414]">
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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_100%)] md:bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_100%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30 md:via-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
            </div>
          </div>
        );
      })}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-12 lg:px-16 pt-20 max-w-3xl pointer-events-none">
        <div className="pointer-events-auto">
          {/* Key forces re-animation of text on change */}
          <div key={currentItem.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center md:items-start text-center md:text-left">
            {/* Top 10 Badge Mockup */}
            {currentIndex === 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#e50914] text-white text-[10px] font-black p-1 rounded-sm leading-none flex flex-col items-center">
                  <span>TOP</span>
                  <span className="text-sm">10</span>
                </div>
                <span className="text-white font-bold text-lg drop-shadow-md">#1 in India Today</span>
              </div>
            )}

            <h1 className="font-display mb-4 drop-shadow-lg tracking-wider" style={{ fontSize: 'clamp(3rem, 12vw, var(--text-large-title))', lineHeight: '1.1' }}>
              {currentItem.title}
            </h1>
            
            <p className="mb-8 line-clamp-2 md:line-clamp-3 drop-shadow-md text-gray-200 font-medium md:text-[var(--text-headline-2)] max-w-[320px] md:max-w-[600px] text-base md:text-base">
              {currentItem.overview}
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-10 md:gap-4 px-4 md:px-0">
            {/* My List */}
            <button
               onClick={handleListToggle}
               className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 md:px-8 md:py-3 md:bg-gray-500/50 text-white font-bold rounded hover:text-white/80 md:hover:bg-gray-500/40 transition-all transform hover:scale-105 active:scale-95 text-xs md:text-lg md:backdrop-blur-sm order-1 md:order-2"
            >
              {inList ? <Check className="h-7 w-7 md:h-6 md:w-6" /> : <Plus className="h-7 w-7 md:h-6 md:w-6" />}
              <span>{inList ? 'In List' : 'My List'}</span>
            </button>

            {/* Play Button */}
            <Link
              href={`${watchPath[currentItem.contentType]}/${currentItem.id}`}
              className="flex items-center gap-2 px-10 md:px-8 py-3 md:py-3 bg-white text-black font-bold rounded hover:bg-white/90 transition-all transform hover:scale-105 active:scale-95 text-lg md:text-lg order-2 md:order-1"
            >
              <Play className="fill-black h-6 w-6 md:h-6 md:w-6" />
              Play
            </Link>

            {/* More Info */}
            <button
               onClick={() => dispatch(openModal(currentItem))}
               className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 md:px-8 md:py-3 md:bg-gray-500/50 text-white font-bold rounded hover:text-white/80 md:hover:bg-gray-500/40 transition-all transform hover:scale-105 active:scale-95 text-xs md:text-lg md:backdrop-blur-sm order-3"
            >
              <Info className="h-7 w-7 md:h-6 md:w-6" />
              <span>{typeof window !== 'undefined' && window.innerWidth < 768 ? 'Info' : 'More Info'}</span>
            </button>
          </div>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 md:left-12 lg:left-16 md:translate-x-0 flex gap-2 pointer-events-auto">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-6 md:w-8 bg-white' : 'w-2 md:w-4 bg-gray-500/50 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
