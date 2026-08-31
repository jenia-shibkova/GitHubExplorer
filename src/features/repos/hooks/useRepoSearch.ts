import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { GITHUB_SEARCH_RESULT_CAP, searchRepositories } from '@/api/github';
import type { GithubRepo } from '@/api/types';

const PER_PAGE = 30;

export function useRepoSearch(query: string) {
  const trimmedQuery = query.trim();

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['repos', 'search', trimmedQuery] as const,
    queryFn: ({ pageParam }) =>
      searchRepositories({ query: trimmedQuery, page: pageParam, perPage: PER_PAGE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const fetchedSoFar = allPages.length * PER_PAGE;
      const availableTotal = Math.min(lastPage.total_count, GITHUB_SEARCH_RESULT_CAP);
      if (fetchedSoFar >= availableTotal) return undefined;
      return allPages.length + 1;
    },
    enabled: trimmedQuery.length > 0,
  });

  // Flatten pages once per data change, not on every render of the list.
  const repos: GithubRepo[] = useMemo(
    () => infiniteQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [infiniteQuery.data]
  );

  const totalCount = infiniteQuery.data?.pages[0]?.total_count ?? 0;

  return { ...infiniteQuery, repos, totalCount };
}
