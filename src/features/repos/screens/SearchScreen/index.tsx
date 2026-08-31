import { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import type { GithubRepo } from '@/api/types';
import type { SearchScreenProps } from '@/navigation/types';
import { NetworkStatusBanner } from '@/components/NetworkStatusBanner';
import { RepoSearchBar } from '@/features/repos/components/RepoSearchBar';
import { RepoListItem } from '@/features/repos/components/RepoListItem';
import { EmptyQueryState } from '@/features/repos/components/RepoListStates/EmptyQueryState';
import { ErrorState } from '@/features/repos/components/RepoListStates/ErrorState';
import { NoResultsState } from '@/features/repos/components/RepoListStates/NoResultsState';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { useRepoSearch } from '@hooks/useRepoSearch';
import { useResolvedTheme } from '@theme/colors';
import { styles } from './styles';

export function SearchScreen({ navigation }: SearchScreenProps) {
  const { t } = useTranslation();
  const { colors } = useResolvedTheme();
  const [queryInput, setQueryInput] = useState('');
  const debouncedQuery = useDebouncedValue(queryInput, 400);

  const {
    repos,
    totalCount,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useRepoSearch(debouncedQuery);

  const handlePressRepo = useCallback(
    (repo: GithubRepo) => {
      navigation.navigate('RepoDetail', {
        fullName: repo.full_name,
        seedRepo: repo,
      });
    },
    [navigation],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback<ListRenderItem<GithubRepo>>(
    ({ item }) => <RepoListItem repo={item} onPress={handlePressRepo} />,
    [handlePressRepo],
  );

  const keyExtractor = useCallback((item: GithubRepo) => String(item.id), []);

  const trimmedQuery = debouncedQuery.trim();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NetworkStatusBanner />
      <RepoSearchBar value={queryInput} onChangeText={setQueryInput} />
      {trimmedQuery.length > 0 && totalCount > 0 ? (
        <Text style={[styles.resultCount, { color: colors.textMuted }]}>
          {t('search.resultCount', {
            count: totalCount,
            formattedCount: totalCount.toLocaleString(),
          })}
        </Text>
      ) : null}

      {trimmedQuery.length === 0 ? (
        <EmptyQueryState />
      ) : isError && repos.length === 0 ? (
        // Full-screen error only when we have nothing else to show. If a
        // background refetch (pagination, pull-to-refresh) fails while
        // repos from an earlier successful fetch are still around — most
        // commonly from going offline mid-session — keep showing that list
        // instead of yanking it away; NetworkStatusBanner already covers
        // telling the user they're offline.
        <ErrorState
          message={error instanceof Error ? error.message : t('search.genericErrorMessage')}
          onRetry={refetch}
        />
      ) : isLoading ? (
        <ActivityIndicator
          style={styles.loader}
          color={colors.accent}
          size="large"
        />
      ) : (
        <FlashList
          data={repos}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={<NoResultsState query={trimmedQuery} />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                style={styles.footerLoader}
                color={colors.accent}
                size="large"
              />
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}
