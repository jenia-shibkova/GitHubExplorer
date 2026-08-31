import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { queryClient, setupOfflinePersistence } from '@/api/queryClient';
import '@/services/i18n'; // side-effect: initializes i18next before anything renders
import { RootNavigator } from '@/navigation/RootNavigator';
import { useResolvedTheme } from '@/theme/colors';

export default function App() {
  const [isPersistenceReady, setIsPersistenceReady] = useState(false);
  const { isDark } = useResolvedTheme();

  useEffect(() => {
    let cancelled = false;
    setupOfflinePersistence()
      .catch(error => {
        // A restore failure (corrupt cache, etc.) shouldn't leave the app
        // stuck on a blank screen forever — fall through to an unpersisted
        // cold start instead.
        console.warn('Offline cache restore failed:', error);
      })
      .finally(() => {
        if (!cancelled) setIsPersistenceReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // One-time gate so the very first frame doesn't render before the
  // persisted cache has actually finished restoring — avoids a flash of
  // empty state on cold start when the device is offline. This actually
  // waits on `setupOfflinePersistence`'s restore promise now; it used to
  // flip on the next tick regardless, which only ever avoided a real flash
  // by accident of how fast MMKV happens to be.
  if (!isPersistenceReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </QueryClientProvider>
  );
}
