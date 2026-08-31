import { Text, View } from 'react-native';
import type { Palette } from '@theme/colors';
import { styles } from './styles';

export function MetaRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: Pick<Palette, 'text' | 'textMuted' | 'border'>;
}) {
  return (
    <View style={[styles.metaRow, { borderColor: colors.border }]}>
      <Text style={{ color: colors.textMuted }}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
    </View>
  );
}
