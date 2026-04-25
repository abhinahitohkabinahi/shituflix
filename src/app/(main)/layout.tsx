import { Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MediaDetailsModal } from '@/components/media/MediaDetailsModal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <Suspense>{children}</Suspense>
      <MediaDetailsModal />
    </AppLayout>
  );
}
