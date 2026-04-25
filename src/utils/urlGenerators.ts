import { VideoProvider } from '@/types/media';

// VidSrc URL generators
export function generateVidSrcMovieUrl(tmdbId: string): string {
  return `https://vidsrc.icu/embed/movie/${tmdbId}`;
}

export function generateVidSrcTVUrl(tmdbId: string, season: number, episode: number): string {
  return `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${episode}`;
}

export function generateVidSrcAnimeUrl(anilistId: string, episode: number, dub: boolean): string {
  return `https://vidsrc.icu/embed/anime/${anilistId}/${episode}/${dub ? 1 : 0}`;
}

// VideoEasy URL generators
export function generateVideoEasyMovieUrl(tmdbId: string): string {
  return `https://player.videasy.net/movie/${tmdbId}`;
}

export function generateVideoEasyTVUrl(tmdbId: string, season: number, episode: number): string {
  return `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`;
}

export function generateVideoEasyAnimeUrl(anilistId: string, episode: number, dub: boolean): string {
  const base = `https://player.videasy.net/anime/${anilistId}/${episode}`;
  return dub ? `${base}?dub=true` : base;
}

// Provider preference persistence
const PROVIDER_KEY = 'dograflix_provider';

export function setProviderPreference(provider: VideoProvider): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROVIDER_KEY, provider);
  }
}

export function getProviderPreference(): VideoProvider | null {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(PROVIDER_KEY);
  if (val === 'vidsrc' || val === 'videoeasy') return val;
  return null;
}
