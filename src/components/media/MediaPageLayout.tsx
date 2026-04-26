'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { HeroBanner } from './HeroBanner';
import { OTTProviderRow } from './OTTProviderRow';
import { OTT_PROVIDERS } from '@/utils/constants';
import type { MediaItem } from '@/types/media';

interface MediaPageLayoutProps {
  heroItems: MediaItem[];
  children: ReactNode;
  showOTT?: boolean;
  topContent?: ReactNode;
}

export function MediaPageLayout({
  heroItems,
  children,
  showOTT = false,
  topContent
}: MediaPageLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#141414] overflow-x-hidden pb-20">
      <div className="relative">
        {topContent && (
          <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
            <div className="pointer-events-auto">
              {topContent}
            </div>
          </div>
        )}
        {heroItems.length > 0 && <HeroBanner items={heroItems} />}
      </div>

      <div className="relative z-10 mt-4 md:mt-12 space-y-0">
        {showOTT && (
          <div className="mb-6">
            <OTTProviderRow 
              providers={OTT_PROVIDERS} 
              onSelect={(providerId) => {
                const provider = OTT_PROVIDERS.find(p => p.id === providerId);
                if (provider) {
                  router.push(`/service/${provider.id}`);
                }
              }} 
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
