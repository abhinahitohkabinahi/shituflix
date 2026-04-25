'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { SignUpForm } from '@/components/auth/SignUpForm';
import type { RootState } from '@/store/store';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col gap-4">
      <SignUpForm />
      <p className="text-center text-gray-400 text-sm mt-2">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-[#e50914] hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
