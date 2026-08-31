import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useResolvedTheme } from '@/theme/colors';
import { styles } from './styles';

export function NoResultsState({ query }: { query: string }) {
  const { t } = useTranslation();
  const { colors } = useResolvedTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('search.noResults.title')}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {t('search.noResults.subtitle', { query })}
      </Text>
    </View>
  );
}
