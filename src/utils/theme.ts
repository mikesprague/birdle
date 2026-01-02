/**
 * Theme management utilities for Birdle
 * Handles theme detection, application, and persistence
 */

import type { Theme } from '@/types';

/**
 * Detect the system's preferred color scheme
 *
 * @returns 'dark' or 'light' based on system preference
 */
export function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Check if system prefers dark theme
 *
 * @returns true if dark theme is preferred
 */
export function isSystemDarkTheme(): boolean {
  return getSystemTheme() === 'dark';
}

/**
 * Apply theme to document root element
 * Adds/removes 'dark' class on html element for Tailwind dark mode
 *
 * @param theme - Theme to apply ('dark', 'light', or 'system')
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;

  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * Get the current effective theme (resolving 'system' to actual theme)
 *
 * @param theme - Theme preference
 * @returns 'dark' or 'light'
 */
export function getEffectiveTheme(theme: Theme): 'dark' | 'light' {
  return theme === 'system' ? getSystemTheme() : theme;
}

/**
 * Setup system theme change listener
 * Calls callback when system theme changes
 *
 * @param callback - Function to call when theme changes
 * @returns Cleanup function to remove listener
 */
export function listenToSystemThemeChanges(
  callback: (theme: 'dark' | 'light') => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }

  // Fallback for older browsers (Safari < 14)
  if ('addListener' in mediaQuery) {
    (mediaQuery as any).addListener(handler);
    return () => (mediaQuery as any).removeListener(handler);
  }

  return () => {};
}

/**
 * Toggle between light and dark theme
 *
 * @param currentTheme - Current theme
 * @returns New theme
 */
export function toggleTheme(currentTheme: Theme): Theme {
  const effective = getEffectiveTheme(currentTheme);
  return effective === 'dark' ? 'light' : 'dark';
}

/**
 * Get theme meta tag color for PWA
 *
 * @param theme - Current theme
 * @returns Hex color for theme-color meta tag
 */
export function getThemeColor(theme: Theme): string {
  const effective = getEffectiveTheme(theme);
  return effective === 'dark' ? '#581c87' : '#581c87'; // Purple for both
}

/**
 * Update theme-color meta tag
 *
 * @param theme - Current theme
 */
export function updateThemeColorMeta(theme: Theme): void {
  if (typeof document === 'undefined') return;

  let metaTag = document.querySelector('meta[name="theme-color"]');

  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTag);
  }

  metaTag.setAttribute('content', getThemeColor(theme));
}

/**
 * Initialize theme system
 * Applies saved theme or system default and sets up listeners
 *
 * @param savedTheme - Theme from storage/preferences
 */
export function initializeTheme(savedTheme: Theme = 'system'): void {
  applyTheme(savedTheme);
  updateThemeColorMeta(savedTheme);

  // Listen for system theme changes if using system theme
  if (savedTheme === 'system') {
    listenToSystemThemeChanges(() => {
      applyTheme('system');
      updateThemeColorMeta('system');
    });
  }
}
