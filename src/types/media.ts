export type ContentType = 'movie' | 'tv' | 'anime';
export type VideoProvider = 'vidsrc' | 'videoeasy';

export interface MediaItem {
  id: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  contentType: ContentType;
  year?: string;
  rating?: number;
  overview?: string;
}
