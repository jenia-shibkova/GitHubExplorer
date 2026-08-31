import { Text, View } from 'react-native';
import { useResolvedTheme } from '@/theme/colors';
import { GithubRepoSvg } from '@/assets/github-repo';
import { styles } from './styles';

export function EmptyQueryState() {
  const { colors } = useResolvedTheme();
  return (
    <View style={styles.container}>
      <GithubRepoSvg />
      <Text style={[styles.title, { color: colors.text }]}>
        Search GitHub repositories
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Try a keyword like "react-native" or "design-system"
      </Text>
    </View>
  );
}
