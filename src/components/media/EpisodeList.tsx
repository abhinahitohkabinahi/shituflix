import Image from 'next/image';
import { Play } from 'lucide-react';
import { TMDB_IMAGE_BASE_URL } from '@/utils/constants';
import type { TmdbEpisode } from '@/types/tmdb';

interface EpisodeListProps {
  episodes: TmdbEpisode[];
  onSelect: (episode: TmdbEpisode) => void;
  selectedEpisodeNumber?: number;
}

export function EpisodeList({ episodes, onSelect, selectedEpisodeNumber = 1 }: EpisodeListProps) {
  return (
    <div className="flex flex-col border-b border-gray-800 pb-4">
      {episodes.map(ep => {
        const isSelected = ep.episode_number === selectedEpisodeNumber;
        const stillSrc = ep.still_path ? `${TMDB_IMAGE_BASE_URL}${ep.still_path}` : null;
        
        return (
          <button
            key={ep.episode_number}
            onClick={() => onSelect(ep)}
            className={`flex items-start gap-4 p-4 md:p-6 text-left transition-colors group border-b border-gray-800/50 last:border-0 ${
              isSelected ? 'bg-[#333333]' : 'hover:bg-[#222222]'
            }`}
          >
            {/* Episode Number */}
            <span className="text-gray-400 text-xl md:text-3xl font-light w-8 md:w-12 flex-shrink-0 flex justify-center mt-3">
              {ep.episode_number}
            </span>
            
            {/* Thumbnail */}
            <div className="relative w-32 md:w-40 aspect-video flex-shrink-0 rounded overflow-hidden mt-1">
              {stillSrc ? (
                <Image src={stillSrc} alt={ep.name} fill className="object-cover" sizes="160px" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">No Image</span>
                </div>
              )}
              {/* Play Button Overlay on Hover/Selected */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center bg-black/50">
                  <Play className="text-white w-5 h-5 ml-1 fill-white" />
                </div>
              </div>
              {/* Progress bar mock for selected episode */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600">
                  <div className="h-full bg-[#e50914] w-1/3" />
                </div>
              )}
            </div>
            
            {/* Details */}
            <div className="flex-1 min-w-0 pr-4 mt-1">
              <div className="flex justify-between items-start mb-2">
                <p 
                  className={`${isSelected ? 'text-white' : 'text-gray-200'}`}
                  style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-bold)' }}
                >
                  {ep.name}
                </p>
                <span className="text-gray-400 ml-4 flex-shrink-0 whitespace-nowrap" style={{ fontSize: 'var(--text-small-body)' }}>
                  {/* Mocking duration as TmdbEpisode doesn't provide runtime */}
                  {Math.floor(Math.random() * (60 - 40 + 1) + 40)}m
                </span>
              </div>
              <p className="text-gray-400 line-clamp-3 leading-relaxed" style={{ fontSize: 'var(--text-small-body)' }}>
                {ep.overview || "No description available for this episode."}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
