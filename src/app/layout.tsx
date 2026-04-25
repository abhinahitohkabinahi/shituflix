import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { AppGateProvider } from '@/providers/AppGateProvider';

export const metadata: Metadata = {
  title: 'dograFlix',
  description: 'Stream movies, TV shows, and anime',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#141414] text-white min-h-screen">
        <ReduxProvider>
          <QueryProvider>
            <AuthProvider>
              <AppGateProvider>
                {children}
              </AppGateProvider>
            </AuthProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
