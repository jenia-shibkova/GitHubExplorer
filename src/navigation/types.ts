import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { GithubRepo } from '@/api/types';

export type RootStackParamList = {
  Search: undefined;
  RepoDetail: { fullName: string; seedRepo: GithubRepo };
};

export type SearchScreenProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
export type RepoDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'RepoDetail'>;
