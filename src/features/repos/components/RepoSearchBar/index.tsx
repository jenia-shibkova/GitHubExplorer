import { Platform, Pressable, Text, TextInput, View } from 'react-native';
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
        { borderColor: colors.border, backgroundColor: colors.fieldBackground },
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
        returnKeyType="search"
        clearButtonMode="while-editing"
        accessibilityLabel="Search repositories"
      />
      {/* clearButtonMode is iOS-only — Android gets no built-in way to clear the field. */}
      {Platform.OS === 'android' && value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Text style={[styles.clearButtonText, { color: colors.textMuted }]}>
            ✕
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
