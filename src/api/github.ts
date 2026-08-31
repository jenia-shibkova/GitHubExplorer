import i18n from '@/services/i18n';
import type { GithubRepo, GithubSearchResponse } from './types';

const GITHUB_API_BASE = 'https://api.github.com';

/** GitHub's Search API hard-caps results at 1000, regardless of total_count. */
export const GITHUB_SEARCH_RESULT_CAP = 1000;

export class GithubApiError extends Error {
  status: number;
  isRateLimit: boolean;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'GithubApiError';
    this.status = status;
    this.isRateLimit = status === 403 || status === 429;
  }
}

async function githubFetch<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
    signal,
  });

  if (!response.ok) {
    // Unauthenticated requests are capped at 10/min — this is the most likely
    // failure mode during review, so it gets a distinct, user-facing message
    // instead of a generic "something went wrong".
    if (response.status === 403 || response.status === 429) {
      throw new GithubApiError(
        i18n.t('api.rateLimitError'),
        response.status,
      );
    }
    throw new GithubApiError(
      i18n.t('api.genericError', { status: response.status }),
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

interface SearchRepositoriesParams {
  query: string;
  page: number;
  perPage?: number;
}

export function searchRepositories(
  { query, page, perPage = 30 }: SearchRepositoriesParams,
  signal?: AbortSignal,
): Promise<GithubSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    per_page: String(perPage),
    page: String(page),
  });
  return githubFetch<GithubSearchResponse>(
    `/search/repositories?${params.toString()}`,
    signal,
  );
}

export function fetchRepository(fullName: string, signal?: AbortSignal): Promise<GithubRepo> {
  // fullName is "owner/repo" — encode each segment separately so the slash
  // stays a path separator instead of becoming %2F.
  const path = fullName.split('/').map(encodeURIComponent).join('/');
  return githubFetch<GithubRepo>(`/repos/${path}`, signal);
}
