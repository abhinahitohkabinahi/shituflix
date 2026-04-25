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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        dispatch(clearAuth());
        return;
      }
      
      dispatch(setUser(session.user));
      dispatch(setSession(session));
      if (session?.user) {
        try {
          const profile = await getProfile(session.user.id);
          dispatch(setProfile(profile));
        } catch {
          dispatch(setProfile(null));
        }
      } else {
        dispatch(setProfile(null));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}
