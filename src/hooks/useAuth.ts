import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

export function useAuth() {
  const { user, session, profile, isAuthenticated, loading, isKidsMode } = useSelector(
    (state: RootState) => state.auth
  );
  return { user, session, profile, isAuthenticated, loading, isKidsMode };
}
