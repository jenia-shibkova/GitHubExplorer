import { Text, View } from 'react-native';
import { useResolvedTheme } from '@/theme/colors';
import { styles } from './styles';

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { colors } = useResolvedTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.danger }]}>
        Something went wrong
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {message}
      </Text>
      <Text style={[styles.retry, { color: colors.accent }]} onPress={onRetry}>
        Tap to retry
      </Text>
    </View>
  );
}
