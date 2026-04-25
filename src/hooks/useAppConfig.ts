import { useQuery } from '@tanstack/react-query';
import { getAppConfig } from '@/services/supabase/appConfig';

export function useAppConfig() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['appConfig'],
    queryFn: getAppConfig,
    staleTime: 300000,
  });
  return { data, isLoading, isError };
}
