import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useResolvedTheme } from '@/theme/colors';
import { styles } from './styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export function RepoSearchBar({ value, onChangeText }: Props) {
  const { t } = useTranslation();
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
        placeholder={t('search.searchPlaceholder')}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.text }]}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        accessibilityLabel={t('search.searchAccessibilityLabel')}
      />
      {/* clearButtonMode is iOS-only — Android gets no built-in way to clear the field. */}
      {Platform.OS === 'android' && value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel={t('search.clearSearchAccessibilityLabel')}
        >
          <Text style={[styles.clearButtonText, { color: colors.textMuted }]}>
            ✕
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
