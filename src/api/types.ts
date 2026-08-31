export interface GithubOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GithubLicense {
  key: string;
  name: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  owner: GithubOwner;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  license: GithubLicense | null;
  created_at: string;
  updated_at: string;
}

export interface GithubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubRepo[];
}
