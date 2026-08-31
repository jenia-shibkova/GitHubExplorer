import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchScreen } from '@/features/repos/screens/SearchScreen';
import { RepoDetailScreen } from '@/features/repos/screens/RepoDetailScreen';
import { useResolvedTheme } from '@/theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function renderThemeToggle() {
  return <ThemeToggle />;
}

export function RootNavigator() {
  const { t } = useTranslation();
  const { colors, isDark } = useResolvedTheme();

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: t('search.screenTitle'), headerRight: renderThemeToggle }}
        />
        <Stack.Screen
          name="RepoDetail"
          component={RepoDetailScreen}
          options={({ route }) => ({ title: route.params.fullName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
