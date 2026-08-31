import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/storage/mmkvStorage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

/**
 * Deliberately not TanStack Query: this is small, local UI preference state
 * with no server counterpart, so a lightweight persisted store is a better
 * fit than routing it through the query cache. On a larger app with many
 * such client-state slices this is exactly where I'd reach for Redux
 * Toolkit instead, for the shared DevTools and stricter action conventions.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'theme-preference',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
