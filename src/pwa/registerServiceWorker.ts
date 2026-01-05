import { registerSW } from 'virtual:pwa-register';
import { showUpdateAvailableToast } from '@/hooks/useToast';
import { pwLogger } from '@/utils/logger';

/**
 * Register service worker for PWA capabilities
 * - Offline support
 * - Update notifications
 * - Asset caching
 */
export function registerServiceWorker() {
  try {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        pwLogger.info('New version available');
        // Show toast notification with option to reload
        showUpdateAvailableToast(() => {
          pwLogger.info('User initiated app reload for update');
          void updateSW(true);
        });
      },
      onOfflineReady() {
        pwLogger.info('App ready to work offline');
        // Could show a toast notification here if desired
      },
      onRegistered(registration) {
        pwLogger.info('Service worker registered', {
          scope: registration?.scope,
        });

        // Check for updates every hour
        if (registration) {
          setInterval(
            () => {
              pwLogger.debug('Checking for service worker updates...');
              void registration.update();
            },
            60 * 60 * 1000
          ); // 1 hour
        }
      },
      onRegisterError(error) {
        pwLogger.error('Service worker registration failed', { error });
      },
    });
  } catch (error) {
    // PWA disabled (e.g. dev mode)
    pwLogger.debug('Service worker not available', { error });
  }
}
