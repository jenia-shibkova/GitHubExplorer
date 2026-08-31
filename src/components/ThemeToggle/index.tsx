import { Switch } from 'react-native';
import { useResolvedTheme } from '@/theme/colors';
import { useThemeStore } from '@/theme/themeStore';

export function ThemeToggle() {
  const { isDark, colors } = useResolvedTheme();
  const setMode = useThemeStore(state => state.setMode);

  return (
    <Switch
      value={isDark}
      onValueChange={next => setMode(next ? 'dark' : 'light')}
      trackColor={{ false: colors.border, true: colors.accent }}
      thumbColor={colors.surface}
      ios_backgroundColor={colors.fieldBackground}
      accessibilityLabel="Toggle dark mode"
      accessibilityRole="switch"
    />
  );
}
