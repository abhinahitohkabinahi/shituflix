'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { TmdbSeason } from '@/types/tmdb';

interface SeasonSelectorProps {
  seasons: TmdbSeason[];
  selectedSeason: number;
  onChange: (season: number) => void;
}

export function SeasonSelector({ seasons, selectedSeason, onChange }: SeasonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSeason = seasons.find(s => s.season_number === selectedSeason) || seasons[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-[#242424] text-white border border-gray-600 rounded-sm hover:bg-[#333333] transition-colors shadow-lg"
        style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-bold)' }}
      >
        <span>{currentSeason?.name || `Season ${selectedSeason}`}</span>
        <ChevronDown className={`ml-2 h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-full bg-[#242424] border border-gray-600 rounded-sm shadow-2xl z-[100] max-h-64 overflow-y-auto custom-scrollbar">
          <div className="py-1">
            {seasons.map((s) => (
              <button
                key={s.season_number}
                onClick={() => {
                  onChange(s.season_number);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-4 py-3 text-left text-sm md:text-base hover:bg-[#333333] transition-colors ${
                  s.season_number === selectedSeason ? 'bg-[#333333] text-white font-bold' : 'text-gray-300'
                }`}
              >
                <span>{s.name || `Season ${s.season_number}`}</span>
                <span className="text-gray-500 text-xs ml-4">({s.episode_count} Episodes)</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
