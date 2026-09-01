import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useResolvedTheme } from '@/theme/colors';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { styles } from './styles';

interface Props {
  onDebouncedChange: (query: string) => void;
  debounceMs?: number;
}

/**
 * Owns the raw, per-keystroke text itself — that state used to live in
 * SearchScreen, which meant every keystroke re-rendered the whole screen
 * (FlashList and all), just to bail out again a level down once memoized
 * children saw their props hadn't actually changed. Debouncing there only
 * throttled the *API call*, not that per-keystroke re-render of the parent.
 * Keeping the fast-changing state local and only reporting the settled,
 * debounced value upward means a keystroke now re-renders this component
 * alone.
 */
export function RepoSearchBar({ onDebouncedChange, debounceMs = 400 }: Props) {
  const { t } = useTranslation();
  const { colors } = useResolvedTheme();
  const [value, setValue] = useState('');
  const debouncedValue = useDebouncedValue(value, debounceMs);

  useEffect(() => {
    onDebouncedChange(debouncedValue);
  }, [debouncedValue, onDebouncedChange]);

  return (
    <View
      style={[
        styles.searchBar,
        { borderColor: colors.border, backgroundColor: colors.fieldBackground },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={setValue}
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
          onPress={() => setValue('')}
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
