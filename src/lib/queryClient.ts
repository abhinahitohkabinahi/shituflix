import { QueryClient } from '@tanstack/react-query';

const ONE_DAY = 1000 * 60 * 60 * 24;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_DAY,
      gcTime: ONE_DAY,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
