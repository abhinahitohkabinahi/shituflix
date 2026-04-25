'use client';

import { Button } from '@/components/ui/Button';
import { signInWithGoogle } from '@/services/supabase/auth';

export function GoogleOAuthButton() {
  async function handleClick() {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google OAuth error:', err);
    }
  }

  return (
    <Button variant="secondary" onClick={handleClick} className="w-full flex items-center justify-center gap-2">
      <span>Continue with Google</span>
    </Button>
  );
}
