import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useResolvedTheme } from '@/theme/colors';
import { GithubRepoSvg } from '@/assets/github-repo';
import { styles } from './styles';

export function EmptyQueryState() {
  const { t } = useTranslation();
  const { colors } = useResolvedTheme();
  return (
    <View style={styles.container}>
      <GithubRepoSvg />
      <Text style={[styles.title, { color: colors.text }]}>
        {t('search.emptyQuery.title')}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {t('search.emptyQuery.subtitle')}
      </Text>
    </View>
  );
}
