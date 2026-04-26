'use client';

import { useQuery } from '@tanstack/react-query';
import { getAppConfig } from '@/services/supabase/appConfig';
import { useState, useEffect } from 'react';
import { NetflixIntro } from '@/components/ui/NetflixIntro';

export function AppGateProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['appConfig'],
    queryFn: getAppConfig,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const [showIntro, setShowIntro] = useState(true);

  const renderContent = () => {
    if (isLoading) return null;

    if (data?.kill_switch_active) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white p-8">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-[#e50914]">Service Unavailable</h1>
            <p>{data.kill_switch_reason}</p>
          </div>
        </div>
      );
    }

    if (data?.maintenance_mode) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white p-8">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Under Maintenance</h1>
            <p>{data.maintenance_message}</p>
          </div>
        </div>
      );
    }

    return <>{children}</>;
  };

  return (
    <>
      {showIntro && <NetflixIntro onComplete={() => setShowIntro(false)} letter="S" />}
      {renderContent()}
    </>
  );
}
