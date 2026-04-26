import type { TmdbMovie, TmdbTVShow } from '@/types/tmdb';
import type { MediaItem } from '@/types/media';

export function tmdbMovieToMediaItem(m: TmdbMovie): MediaItem {
  return {
    id: String(m.id),
    title: m.title,
    posterPath: m.poster_path,
    backdropPath: m.backdrop_path,
    contentType: 'movie',
    year: m.release_date?.slice(0, 4),
    rating: m.vote_average,
    overview: m.overview ?? undefined,
  };
}

export function tmdbTVToMediaItem(s: TmdbTVShow): MediaItem {
  return {
    id: String(s.id),
    title: s.name,
    posterPath: s.poster_path,
    backdropPath: s.backdrop_path,
    contentType: 'tv',
    year: s.first_air_date?.slice(0, 4),
    rating: s.vote_average,
    overview: s.overview ?? undefined,
  };
}

export function anilistToMediaItem(a: any): MediaItem {
  return {
    id: String(a.id),
    title: a.title?.english ?? a.title?.romaji ?? a.title?.native,
    posterPath: null,
    backdropPath: a.bannerImage ?? null,
    contentType: 'anime',
    rating: a.averageScore ? a.averageScore / 10 : undefined,
  };
}

export function tmdbToMediaItem(item: TmdbMovie | TmdbTVShow): MediaItem {
  if ('title' in item) return tmdbMovieToMediaItem(item as TmdbMovie);
  return tmdbTVToMediaItem(item as TmdbTVShow);
}

