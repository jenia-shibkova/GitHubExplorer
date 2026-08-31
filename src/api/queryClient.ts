import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { mmkvStorage } from '@/storage/mmkvStorage';
import { GithubApiError } from './github';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min — GitHub search results don't need to be second-fresh
      gcTime: 1000 * 60 * 60 * 24, // keep cached data a day so it survives app restarts offline
      retry: (failureCount, error) => {
        // Retrying a rate-limited request just makes the rate limit worse.
        if (error instanceof GithubApiError && error.isRateLimit) return false;
        return failureCount < 2;
      },
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: mmkvStorage,
  key: 'GITHUB_REPOS_EXPLORER_CACHE',
});

/**
 * Persists the query cache to disk so the last search results and repo
 * details a user viewed are available with no network at all — this is
 * what powers the "offline support" bonus requirement. Call once at app
 * startup, before rendering.
 */
export function setupOfflinePersistence(): void {
  persistQueryClient({
    queryClient,
    persister: asyncStoragePersister,
    maxAge: 1000 * 60 * 60 * 24,
    // Never persist an error response — a stale rate-limit error should not
    // resurrect itself on the next cold start.
    dehydrateOptions: {
      shouldDehydrateQuery: query => query.state.status === 'success',
    },
  });
}
