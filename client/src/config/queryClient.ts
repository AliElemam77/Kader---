import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient instance with high-performance caching:
 * - staleTime (5 mins): Navigating between tabs renders data instantly from cache in 0ms!
 * - gcTime (30 mins): Keeps data in memory so returning users experience no loading flashes.
 * - refetchOnWindowFocus: false: Prevents intrusive re-renders when toggling window focus.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh window
      gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
