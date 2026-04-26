import { MediaCard } from './MediaCard';
import { Button } from '@/components/ui/Button';
import type { MediaItem, ContentType } from '@/types/media';

interface MediaGridProps {
  items: MediaItem[];
  contentType: ContentType;
  onLoadMore?: () => void;
}

export function MediaGrid({ items, contentType, onLoadMore }: MediaGridProps) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 p-4">
        {items.map(item => (
          <MediaCard key={item.id} item={item} contentType={contentType} />
        ))}
      </div>
      {onLoadMore && (
        <div className="flex justify-center py-6">
          <Button variant="secondary" onClick={onLoadMore}>Load More</Button>
        </div>
      )}
    </div>
  );
}
