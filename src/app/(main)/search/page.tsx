'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Spinner } from '@/components/ui/Spinner';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '@/hooks/useAuth';
import { searchMedia } from '@/services/tmdb';
import { searchAnime } from '@/services/anilist';
import type { TmdbMovie, TmdbTVShow } from '@/types/tmdb';
import type { AniListMedia } from '@/types/anilist';
import type { MediaItem } from '@/types/media';

function isTVShow(item: TmdbMovie | TmdbTVShow): item is TmdbTVShow {
  return 'name' in item;
}

function tmdbToMediaItem(item: TmdbMovie | TmdbTVShow): MediaItem {
  if (isTVShow(item)) {
    return { id: String(item.id), title: item.name, posterPath: item.poster_path, backdropPath: item.backdrop_path, contentType: 'tv', rating: item.vote_average };
  }
  return { id: String(item.id), title: item.title, posterPath: item.poster_path, backdropPath: item.backdrop_path, contentType: 'movie', rating: item.vote_average };
}

function anilistToMediaItem(a: AniListMedia): MediaItem {
  return { id: String(a.id), title: a.title.english ?? a.title.romaji, posterPath: null, backdropPath: a.bannerImage ?? null, contentType: 'anime', rating: a.averageScore ? a.averageScore / 10 : undefined };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: history = [], insertMutation, clearMutation } = useSearchHistory();
  const [inputValue, setInputValue] = useState(searchParams.get('q') ?? '');
  const [showHistory, setShowHistory] = useState(false);
  const q = searchParams.get('q') ?? '';

  const { data: tmdbResults = [], isLoading: tmdbLoading, isError: tmdbError } = useQuery({
    queryKey: ['search', 'tmdb', q],
    queryFn: () => searchMedia(q),
    enabled: q.length > 0,
  });

  const { data: animeResults = [], isLoading: animeLoading } = useQuery({
    queryKey: ['search', 'anilist', q],
    queryFn: () => searchAnime(q),
    enabled: q.length > 0,
  });

  useEffect(() => {
    if (q && isAuthenticated) {
      insertMutation.mutate(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      setShowHistory(false);
    }
  }

  const movies = tmdbResults.filter(r => !isTVShow(r as TmdbMovie | TmdbTVShow)).map(r => tmdbToMediaItem(r as TmdbMovie | TmdbTVShow));
  const tvShows = tmdbResults.filter(r => isTVShow(r as TmdbMovie | TmdbTVShow)).map(r => tmdbToMediaItem(r as TmdbMovie | TmdbTVShow));
  const anime = animeResults.map(anilistToMediaItem);

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-6">
      <div className="max-w-5xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="relative mb-6">
          <input
            type="search"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 150)}
            placeholder="Search movies, TV shows, anime..."
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e50914] text-base"
          />
          {showHistory && isAuthenticated && history.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded-lg mt-1 z-10">
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">Recent searches</span>
                <button onClick={() => clearMutation.mutate()} className="text-gray-500 hover:text-white text-xs">Clear</button>
              </div>
              {history.map(h => (
                <button
                  key={h.id}
                  onMouseDown={() => {
                    setInputValue(h.search_query);
                    router.push(`/search?q=${encodeURIComponent(h.search_query)}`);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 text-sm"
                >
                  {h.search_query}
                </button>
              ))}
            </div>
          )}
        </form>

        {!q && <p className="text-gray-500 text-center py-12">Enter a search term to find content.</p>}

        {q && (tmdbLoading || animeLoading) && (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        )}

        {q && !tmdbLoading && !animeLoading && (
          <>
            {tmdbError && (
              <p className="text-red-400 text-sm mb-4 px-1">TMDB search unavailable — showing anime results only.</p>
            )}
            {movies.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Movies</h2>
                <MediaGrid items={movies} contentType="movie" />
              </section>
            )}
            {tvShows.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">TV Shows</h2>
                <MediaGrid items={tvShows} contentType="tv" />
              </section>
            )}
            {anime.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Anime</h2>
                <MediaGrid items={anime} contentType="anime" />
              </section>
            )}
            {movies.length === 0 && tvShows.length === 0 && anime.length === 0 && (
              <p className="text-gray-500 text-center py-12">No results found for &quot;{q}&quot;.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
