import { useColorScheme } from 'react-native';
import { useThemeStore } from './themeStore';

export interface Palette {
  background: string;
  inputBackground: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  star: string;
  danger: string;
}

export const palette: { light: Palette; dark: Palette } = {
  light: {
    background: '#F4F5EE',
    inputBackground: '#E5E5D6',
    text: '#111827',
    textMuted: '#6B7280',
    border: '#E4E5DE',
    accent: '#C6F277',
    star: '#D97706',
    danger: '#DC2626',
  },
  dark: {
    background: '#0B0F17',
    inputBackground: '#1C1C1D',
    text: '#F3F4F6',
    textMuted: '#9CA3AF',
    border: '#242B38',
    accent: '#C6F277',
    star: '#FBBF24',
    danger: '#F87171',
  },
};

/** Resolves the user's stored preference against the OS setting. */
export function useResolvedTheme(): { colors: Palette; isDark: boolean } {
  const mode = useThemeStore(state => state.mode);
  const systemScheme = useColorScheme();
  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  return { colors: isDark ? palette.dark : palette.light, isDark };
}
