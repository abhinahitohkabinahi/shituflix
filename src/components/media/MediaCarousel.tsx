'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Spinner } from '@/components/ui/Spinner';
import { MediaCard } from './MediaCard';
import type { MediaItem, ContentType } from '@/types/media';

interface MediaCarouselProps {
  title: string;
  items: MediaItem[];
  contentType: ContentType;
  isLoading?: boolean;
}

export function MediaCarousel({ title, items, contentType, isLoading }: MediaCarouselProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-6 netflix-row-container relative group/row overflow-visible">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-12 lg:px-16 transition-colors group-hover/row:text-white/80">
        {title}
      </h2>
      
      <div className="netflix-row-wrapper overflow-visible">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={10}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 10 },
            768: { slidesPerView: 4, spaceBetween: 10 },
            1024: { slidesPerView: 5, spaceBetween: 10 },
            1280: { slidesPerView: 6, spaceBetween: 10 },
          }}
          className="px-4 md:px-12 lg:px-16 !overflow-visible"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id} className="!overflow-visible py-8">
              <MediaCard item={item} contentType={contentType} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

