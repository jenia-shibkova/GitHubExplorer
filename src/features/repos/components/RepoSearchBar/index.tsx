import { TextInput, View } from 'react-native';
import { useResolvedTheme } from '@/theme/colors';
import { styles } from './styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export function RepoSearchBar({ value, onChangeText }: Props) {
  const { colors } = useResolvedTheme();

  return (
    <View
      style={[
        styles.searchBar,
        { borderColor: colors.border, backgroundColor: colors.inputBackground },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search repositories (e.g. react-native)"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.text }]}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        accessibilityLabel="Search repositories"
      />
    </View>
  );
}
