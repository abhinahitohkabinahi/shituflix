import { Badge } from '@/components/ui/Badge';
import type { ContentType } from '@/types/media';

const variantMap: Record<ContentType, 'red' | 'blue' | 'purple'> = {
  movie: 'red',
  tv: 'blue',
  anime: 'purple',
};

const labelMap: Record<ContentType, string> = {
  movie: 'Movie',
  tv: 'TV',
  anime: 'Anime',
};

export function ContentTypeBadge({ type }: { type: ContentType }) {
  return <Badge label={labelMap[type]} variant={variantMap[type]} />;
}
