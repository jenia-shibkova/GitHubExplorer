import { useQuery } from '@tanstack/react-query';
import { fetchRepository } from '@/api/github';
import type { GithubRepo } from '@/api/types';

/**
 * `seedData` is the repo object we already have from the search list.
 * We render it immediately via `initialData`, then this query silently
 * revalidates in the background so stats like star count stay fresh
 * without a blocking spinner on navigation.
 */
export function useRepoDetail(fullName: string, seedData?: GithubRepo) {
  return useQuery({
    queryKey: ['repos', 'detail', fullName] as const,
    queryFn: () => fetchRepository(fullName),
    initialData: seedData,
    // seedData came from a list fetched moments ago — treat it as fresh
    // for a few seconds so we don't immediately refetch on every navigation.
    initialDataUpdatedAt: seedData ? Date.now() : undefined,
    staleTime: 1000 * 10,
  });
}
