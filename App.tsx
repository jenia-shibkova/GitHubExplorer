import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { queryClient, setupOfflinePersistence } from '@/api/queryClient';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  const [isPersistenceReady, setIsPersistenceReady] = useState(false);
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    setupOfflinePersistence();
    setIsPersistenceReady(true);
  }, []);

  // Brief, one-time gate so the very first frame doesn't render before the
  // persisted cache has a chance to attach — avoids a flash of empty state
  // on cold start when the device is offline.
  if (!isPersistenceReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </QueryClientProvider>
  );
}
