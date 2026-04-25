'use client';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isProfileSelected } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isProfileSelected) {
      router.push('/profile-selection');
    }
  }, [isAuthenticated, isProfileSelected, router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#141414] text-white">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <BottomNav />
      <Footer />
    </div>
  );
}
