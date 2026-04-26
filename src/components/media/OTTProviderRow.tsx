import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

interface OTTProvider {
  id: string;
  name: string;
  logo: string;
  networkId: string;
}

interface OTTProviderRowProps {
  providers: OTTProvider[];
  onSelect: (providerId: string) => void;
}

export function OTTProviderRow({ providers, onSelect }: OTTProviderRowProps) {
  return (
    <section className="py-2 netflix-row-container relative group/row">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 px-4 transition-colors group-hover/row:text-white/80">
        Streaming Services
      </h2>

      <div className="netflix-row-wrapper">
        <Swiper
          spaceBetween={0}
          slidesPerView="auto"
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
          breakpoints={{
            480: { spaceBetween: 0, slidesOffsetBefore: 16, slidesOffsetAfter: 16 },
            768: { spaceBetween: 0, slidesOffsetBefore: 16, slidesOffsetAfter: 16 },
            1024: { spaceBetween: 0, slidesOffsetBefore: 16, slidesOffsetAfter: 16 },
            1280: { spaceBetween: 0, slidesOffsetBefore: 16, slidesOffsetAfter: 16 },
          }}
          className="!overflow-visible"
        >
          {providers.map((p) => (
            <SwiperSlide 
              key={p.id} 
              className="!w-auto px-2 md:px-4"
            >
              <button
                onClick={() => onSelect(p.id)}
                className="group flex flex-col items-center gap-2 w-full"
              >
                <div className="w-16 h-16 md:w-28 md:h-28 rounded-full overflow-hidden bg-white border-2 border-gray-800 group-hover:border-[#e50914] group-hover:scale-110 transition-all duration-300 shadow-lg relative">
                  <Image
                    src={p.logo}
                    alt={p.name}
                    fill
                    className="object-contain p-2 md:p-3"
                  />
                </div>
                <span className="text-[10px] md:text-xs text-gray-400 group-hover:text-white font-medium transition-colors text-center">
                  {p.name}
                </span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

