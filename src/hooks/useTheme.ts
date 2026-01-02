/**
 * useTheme Hook
 *
 * Manages theme preference (dark/light/system) with automatic
 * persistence to TinyBase store and DOM application.
 */

import { useCallback, useEffect, useMemo } from 'react';
import type { Store } from 'tinybase';
import { useCell } from 'tinybase/ui-react';
import { ROW_IDS, TABLES } from '@/store/schema';
import type { Theme } from '@/types';
import {
  applyTheme,
  getEffectiveTheme,
  listenToSystemThemeChanges,
  toggleTheme as toggleThemeUtil,
  updateThemeColorMeta,
} from '@/utils';

/**
 * Hook return type
 */
export interface UseThemeReturn {
  /** Current theme preference */
  theme: Theme;

  /** Effective theme (resolves 'system' to 'dark' or 'light') */
  effectiveTheme: 'dark' | 'light';

  /** Set theme */
  setTheme: (theme: Theme) => void;

  /** Toggle between dark and light */
  toggleTheme: () => void;
}

/**
 * useTheme hook
 *
 * @param store - TinyBase store instance
 * @returns Theme preference and control functions
 *
 * @example
 * const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme(store);
 *
 * // Toggle theme
 * <button onClick={toggleTheme}>Toggle theme</button>
 */
export function useTheme(store: Store): UseThemeReturn {
  // Subscribe to theme from TinyBase
  const theme = (useCell(
    TABLES.SETTINGS,
    ROW_IDS.SETTINGS_CURRENT,
    'theme',
    store
  ) || 'dark') as Theme;

  // Get effective theme (resolves 'system' to actual preference)
  const effectiveTheme = useMemo(() => {
    return getEffectiveTheme(theme);
  }, [theme]);

  /**
   * Apply theme to DOM whenever it changes
   */
  useEffect(() => {
    applyTheme(theme);
    updateThemeColorMeta(theme);
  }, [theme]);

  /**
   * Listen for system theme changes if using 'system' theme
   */
  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    // Setup listener for system theme changes
    const cleanup = listenToSystemThemeChanges(() => {
      // Re-apply theme when system preference changes
      applyTheme('system');
      updateThemeColorMeta('system');
    });

    return cleanup;
  }, [theme]);

  /**
   * Set theme preference
   */
  const setTheme = useCallback(
    (newTheme: Theme) => {
      store.setCell(
        TABLES.SETTINGS,
        ROW_IDS.SETTINGS_CURRENT,
        'theme',
        newTheme
      );
    },
    [store]
  );

  /**
   * Toggle between dark and light theme
   */
  const toggleTheme = useCallback(() => {
    const newTheme = toggleThemeUtil(theme);
    setTheme(newTheme);
  }, [theme, setTheme]);

  return {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
  };
}
