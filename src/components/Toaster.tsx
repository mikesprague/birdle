/**
 * Toaster Component
 *
 * Wrapper for Sonner Toaster component with app-specific configuration.
 * Provides toast notifications throughout the application.
 */

import { Toaster as SonnerToaster } from 'sonner';
import type { Store } from 'tinybase';
import { useTheme } from '@/hooks';

export interface ToasterProps {
  /** TinyBase store instance for theme detection */
  store: Store;
}

/**
 * Toaster component
 *
 * Should be placed at the root level of the app to provide
 * toast notifications globally.
 *
 * @example
 * <Toaster store={store} />
 */
export function Toaster({ store }: ToasterProps) {
  const { effectiveTheme } = useTheme(store);

  return (
    <SonnerToaster
      position="top-center"
      theme={effectiveTheme}
      richColors
      closeButton={false}
      duration={2500}
      toastOptions={{
        classNames: {
          toast:
            'rounded-lg border shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90',
          title: 'font-semibold text-sm',
          description: 'text-sm',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          closeButton:
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
          error:
            'border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
          success:
            'border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
          warning:
            'border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
          info: 'border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
        },
      }}
    />
  );
}
