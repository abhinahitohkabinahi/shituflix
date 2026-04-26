import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/types/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isProfileSelected: boolean;
  isKidsMode: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isProfileSelected: false,
  isKidsMode: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setSession(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
    },
    setProfile(state, action: PayloadAction<Profile | null>) {
      state.profile = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setProfileSelected(state, action: PayloadAction<boolean>) {
      state.isProfileSelected = action.payload;
    },
    setKidsMode(state, action: PayloadAction<boolean>) {
      state.isKidsMode = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.session = null;
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.isProfileSelected = false;
      state.isKidsMode = false;
    },
  },
});

export const { setUser, setSession, setProfile, setLoading, setError, setProfileSelected, setKidsMode, clearAuth } = authSlice.actions;
export default authSlice.reducer;
