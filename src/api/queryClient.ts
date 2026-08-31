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
 *
 * `persistQueryClient` returns `[unsubscribe, restorePromise]`. We deliberately
 * never call `unsubscribe` — this app persists for its entire lifetime, there's
 * no scenario where we'd want to stop. `restorePromise` resolves once the
 * on-disk cache has actually finished loading into the QueryClient; the caller
 * awaits it so the app doesn't render its first frame before that cache is
 * live (see App.tsx) — the previous version returned void and fired this off
 * without waiting, so that guarantee was only accidental (worked because MMKV
 * happens to be fast, not because anything actually waited for it).
 */
export function setupOfflinePersistence(): Promise<void> {
  const [, restorePromise] = persistQueryClient({
    queryClient,
    persister: asyncStoragePersister,
    maxAge: 1000 * 60 * 60 * 24,
    // Never persist an error response — a stale rate-limit error should not
    // resurrect itself on the next cold start.
    dehydrateOptions: {
      shouldDehydrateQuery: query => query.state.status === 'success',
    },
  });
  return restorePromise;
}
