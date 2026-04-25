'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '@/lib/supabaseClient';
import { setUser, setSession, setProfile, clearAuth } from '@/store/authSlice';
import { setProvider } from '@/store/mediaSlice';
import { getProfile } from '@/services/supabase/profile';
import { getProviderPreference } from '@/utils/urlGenerators';
import type { AppDispatch } from '@/store/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Restore provider preference from localStorage
    const savedProvider = getProviderPreference();
    if (savedProvider) dispatch(setProvider(savedProvider));

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthChange('INITIAL_SESSION', session);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      handleAuthChange(event, session);
    });

    async function handleAuthChange(event: string, session: any) {
      if (event === 'SIGNED_OUT') {
        dispatch(clearAuth());
        return;
      }

      if (session?.user) {
        dispatch(setUser(session.user));
        dispatch(setSession(session));
        try {
          const profile = await getProfile(session.user.id);
          dispatch(setProfile(profile));
        } catch {
          dispatch(setProfile(null));
        }
      }
    }

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}
