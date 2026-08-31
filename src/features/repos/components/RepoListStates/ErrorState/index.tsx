import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useResolvedTheme } from '@/theme/colors';
import { styles } from './styles';

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useResolvedTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.danger }]}>
        {t('search.error.title')}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {message}
      </Text>
      <Text style={[styles.retry, { color: colors.accent }]} onPress={onRetry}>
        {t('search.error.retry')}
      </Text>
    </View>
  );
}
