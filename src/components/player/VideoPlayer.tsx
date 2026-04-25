'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  generateVidSrcMovieUrl, generateVidSrcTVUrl, generateVidSrcAnimeUrl,
  generateVideoEasyMovieUrl, generateVideoEasyTVUrl, generateVideoEasyAnimeUrl,
} from '@/utils/urlGenerators';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { useAuth } from '@/hooks/useAuth';
import type { ContentType } from '@/types/media';

interface VideoPlayerProps {
  contentId: string;
  contentType: ContentType;
  season?: number;
  episode?: number;
  dub?: boolean;
}

function buildUrl(
  provider: 'vidsrc' | 'videoeasy',
  contentType: ContentType,
  contentId: string,
  season?: number,
  episode?: number,
  dub?: boolean
): string {
  if (provider === 'vidsrc') {
    if (contentType === 'movie') return generateVidSrcMovieUrl(contentId);
    if (contentType === 'tv') return generateVidSrcTVUrl(contentId, season ?? 1, episode ?? 1);
    return generateVidSrcAnimeUrl(contentId, episode ?? 1, dub ?? false);
  }
  if (contentType === 'movie') return generateVideoEasyMovieUrl(contentId);
  if (contentType === 'tv') return generateVideoEasyTVUrl(contentId, season ?? 1, episode ?? 1);
  return generateVideoEasyAnimeUrl(contentId, episode ?? 1, dub ?? false);
}

export function VideoPlayer({ contentId, contentType, season, episode, dub }: VideoPlayerProps) {
  const selectedProvider = useSelector((state: RootState) => state.media.selectedProvider);
  const { isAuthenticated } = useAuth();
  const { upsertMutation } = useWatchHistory();

  const url = buildUrl(selectedProvider, contentType, contentId, season, episode, dub);

  useEffect(() => {
    if (isAuthenticated) {
      upsertMutation.mutate({ contentId, contentType });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, contentType]);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      <iframe
        src={url}
        allowFullScreen
        className="w-full h-full border-none"
        allow="autoplay; fullscreen; picture-in-picture"
        title={`${contentType} player`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
