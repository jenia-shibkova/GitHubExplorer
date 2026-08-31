import { useState } from 'react';
import { View } from 'react-native';
import { RepoSearchBar } from '@components/RepoSearchBar';
import { useResolvedTheme } from '@/theme/colors';
import { styles } from './styles';

export function SearchScreen() {
  const { colors } = useResolvedTheme();
  const [queryInput, setQueryInput] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <RepoSearchBar value={queryInput} onChangeText={setQueryInput} />
    </View>
  );
}
