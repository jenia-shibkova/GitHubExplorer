import { createMMKV } from 'react-native-mmkv';

export const mmkv = createMMKV({ id: 'app-storage' });

/**
 * Shared adapter exposing MMKV through the `getItem`/`setItem`/`removeItem`
 * shape both consumers expect — zustand's `persist` middleware (via
 * `createJSONStorage`) and TanStack Query's `createAsyncStoragePersister`.
 * Both accept sync or async implementations, so MMKV's synchronous API
 * (much faster than AsyncStorage, no bridge round-trip) drops in directly
 * without wrapping calls in Promises.
 */
export const mmkvStorage = {
  getItem: (key: string): string | null => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string): void => {
    mmkv.set(key, value);
  },
  removeItem: (key: string): void => {
    mmkv.remove(key);
  },
};
