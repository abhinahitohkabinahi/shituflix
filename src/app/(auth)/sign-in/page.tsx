'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { SignInForm } from '@/components/auth/SignInForm';
import type { RootState } from '@/store/store';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col gap-4">
      <SignInForm />
      <p className="text-center text-gray-400 text-sm mt-2">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-[#e50914] hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
