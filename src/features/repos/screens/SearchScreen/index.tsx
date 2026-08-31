import { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import type { GithubRepo } from '@/api/types';
import type { SearchScreenProps } from '@/navigation/types';
import { RepoSearchBar } from '@components/RepoSearchBar';
import { RepoListItem } from '@components/RepoListItem';
import { EmptyQueryState } from '@components/RepoListStates/EmptyQueryState';
import { ErrorState } from '@components/RepoListStates/ErrorState';
import { NoResultsState } from '@components/RepoListStates/NoResultsState';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { useRepoSearch } from '@hooks/useRepoSearch';
import { useResolvedTheme } from '@theme/colors';
import { styles } from './styles';

export function SearchScreen({ navigation }: SearchScreenProps) {
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
      <RepoSearchBar value={queryInput} onChangeText={setQueryInput} />
      {trimmedQuery.length > 0 && totalCount > 0 ? (
        <Text style={[styles.resultCount, { color: colors.textMuted }]}>
          {totalCount.toLocaleString()} repositories
        </Text>
      ) : null}

      {trimmedQuery.length === 0 ? (
        <EmptyQueryState />
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : 'Please try again.'}
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
