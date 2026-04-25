'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import type { ContentType } from '@/types/media';

export default function WatchPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const searchParams = useSearchParams();

  const season = searchParams.get('season') ? Number(searchParams.get('season')) : undefined;
  const episode = searchParams.get('episode') ? Number(searchParams.get('episode')) : undefined;
  const dub = searchParams.get('dub') === 'true';

  const contentType = (type === 'movie' || type === 'tv' || type === 'anime') ? type as ContentType : 'movie';

  return (
    <div className="w-screen h-screen bg-black overflow-hidden m-0 p-0">
      <VideoPlayer
        contentId={id}
        contentType={contentType}
        season={season}
        episode={episode}
        dub={dub}
      />
    </div>
  );
}
