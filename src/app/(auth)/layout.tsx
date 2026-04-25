import { Suspense } from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <Suspense>{children}</Suspense>
    </AuthLayout>
  );
}
