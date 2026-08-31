import { Text, View } from 'react-native';
import { useResolvedTheme } from '@/theme/colors';
import { styles } from './styles';

export function NoResultsState({ query }: { query: string }) {
  const { colors } = useResolvedTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        No repositories found
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Nothing matched "{query}" — try a different keyword.
      </Text>
    </View>
  );
}
