'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TMDB_BACKDROP_BASE_URL } from '@/utils/constants';
import type { MediaItem, ContentType } from '@/types/media';

interface BannerTemplateProps {
  item: MediaItem;
  inList: boolean;
  onListToggle: () => void;
  onInfoClick: () => void;
  currentIndex: number;
  totalItems: number;
  onIndexChange: (index: number) => void;
}

const watchPath: Record<ContentType, string> = {
  movie: '/watch/movie',
  tv: '/watch/tv',
  anime: '/watch/anime',
};

/**
 * CENTRAL BANNER UI DESIGN
 * This file carries the major UI logic for all banners in the app.
 */
export function BannerTemplate({ 
  item, 
  inList, 
  onListToggle, 
  onInfoClick,
  currentIndex,
  totalItems,
  onIndexChange
}: BannerTemplateProps) {
  const backdropSrc = item.backdropPath ? `${TMDB_BACKDROP_BASE_URL}${item.backdropPath}` : null;
  const posterSrc = item.posterPath ? `https://image.tmdb.org/t/p/original${item.posterPath}` : backdropSrc;

  return (
    <header className="relative w-full h-[70vh] md:h-[85vh] lg:h-[95vh] text-white overflow-hidden bg-[#141414]">
      {/* 1. BACKGROUND LAYER (Mobile Poster / PC Backdrop) */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* PC Version */}
          <div className="hidden md:block absolute inset-0">
            <Image
              src={backdropSrc || posterSrc || ''}
              alt={item.title}
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
              unoptimized
            />
          </div>

          {/* Mobile Version */}
          <div className="block md:hidden absolute inset-0">
            <Image
              src={posterSrc || backdropSrc || ''}
              alt={item.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
              unoptimized
            />
          </div>

          {/* DESIGN TOKENS: GRADIENTS */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/40" />
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 md:px-12 lg:px-16 pb-10 md:pb-24 max-w-3xl pointer-events-none">
        <div className="pointer-events-auto">
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            {/* Top 10 Badge */}
            {currentIndex === 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#e50914] text-white text-[10px] font-black p-1 rounded-sm leading-none flex flex-col items-center">
                  <span>TOP</span>
                  <span className="text-sm">10</span>
                </div>
                <span className="text-white font-bold text-lg drop-shadow-md">#1 in India Today</span>
              </div>
            )}

            <h1 className="font-display mb-4 drop-shadow-2xl tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', lineHeight: '0.9' }}>
              {item.title}
            </h1>
            
            <p className="mb-8 line-clamp-2 md:line-clamp-3 drop-shadow-lg text-gray-100 font-medium max-w-[320px] md:max-w-[600px] text-sm md:text-lg opacity-90">
              {item.overview}
            </p>
          </motion.div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-center md:justify-start gap-10 md:gap-4 px-4 md:px-0">
            {/* My List */}
            <button
               onClick={onListToggle}
               className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 md:px-8 md:py-3 md:bg-gray-500/50 text-white font-bold rounded hover:text-white/80 md:hover:bg-gray-500/40 transition-all transform hover:scale-105 active:scale-95 text-xs md:text-lg md:backdrop-blur-sm order-1 md:order-2"
            >
              {inList ? <Check className="h-7 w-7 md:h-6 md:w-6" /> : <Plus className="h-7 w-7 md:h-6 md:w-6" />}
              <span>{inList ? 'In List' : 'My List'}</span>
            </button>

            {/* Play Button */}
            <Link
              href={`${watchPath[item.contentType]}/${item.id}`}
              className="flex items-center gap-2 px-10 md:px-8 py-3 md:py-3 bg-white text-black font-bold rounded hover:bg-white/90 transition-all transform hover:scale-105 active:scale-95 text-lg md:text-lg order-2 md:order-1"
            >
              <Play className="fill-black h-6 w-6 md:h-6 md:w-6" />
              Play
            </Link>

            {/* More Info */}
            <button
               onClick={onInfoClick}
               className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 md:px-8 md:py-3 md:bg-gray-500/50 text-white font-bold rounded hover:text-white/80 md:hover:bg-gray-500/40 transition-all transform hover:scale-105 active:scale-95 text-xs md:text-lg md:backdrop-blur-sm order-3"
            >
              <Info className="h-7 w-7 md:h-6 md:w-6" />
              <span>More Info</span>
            </button>
          </div>
        </div>
        
        {/* 3. INDICATORS LAYER */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 md:left-12 lg:left-16 md:translate-x-0 hidden md:flex gap-2 pointer-events-auto">
          {Array.from({ length: totalItems }).map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-[#e50914]' : 'w-2 bg-gray-500/50 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
