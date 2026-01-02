import { registerSW } from 'virtual:pwa-register';

export function registerServiceWorker() {
  try {
    const updateSW = registerSW({
      onNeedRefresh() {
        // Mirror current behavior (reload on update) for now.
        void updateSW(true);
      },
      onOfflineReady() {
        // no-op
      },
    });
  } catch {
    // PWA disabled (e.g. dev)
  }
}
