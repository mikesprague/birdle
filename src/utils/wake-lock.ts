/**
 * Wake Lock utilities for Birdle
 * Prevents screen from sleeping during active gameplay
 */

/**
 * Wake Lock instance
 */
let wakeLock: WakeLockSentinel | null = null;

/**
 * Check if Wake Lock API is supported
 *
 * @returns true if supported
 */
export function isWakeLockSupported(): boolean {
  if (typeof navigator === 'undefined') return false;
  return 'wakeLock' in navigator;
}

/**
 * Request wake lock to prevent screen from sleeping
 * Automatically releases when tab becomes hidden
 *
 * @returns Promise<boolean> - true if successful
 */
export async function requestWakeLock(): Promise<boolean> {
  if (!isWakeLockSupported()) {
    console.log('Wake Lock API not supported');
    return false;
  }

  try {
    // Release existing lock if any
    if (wakeLock !== null) {
      await releaseWakeLock();
    }

    // Request new wake lock
    wakeLock = await navigator.wakeLock.request('screen');

    console.log('Wake Lock active');

    // Listen for wake lock release
    wakeLock.addEventListener('release', () => {
      console.log('Wake Lock released');
    });

    return true;
  } catch (error) {
    console.error('Failed to acquire wake lock:', error);
    wakeLock = null;
    return false;
  }
}

/**
 * Release the current wake lock
 *
 * @returns Promise<void>
 */
export async function releaseWakeLock(): Promise<void> {
  if (wakeLock === null) return;

  try {
    await wakeLock.release();
    wakeLock = null;
  } catch (error) {
    console.error('Failed to release wake lock:', error);
  }
}

/**
 * Setup automatic wake lock management
 * - Requests lock when page becomes visible
 * - Releases lock when page becomes hidden
 *
 * @returns Cleanup function to remove listeners
 */
export function setupAutoWakeLock(): () => void {
  if (!isWakeLockSupported()) {
    return () => {};
  }

  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible') {
      await requestWakeLock();
    }
  };

  // Request initial wake lock
  requestWakeLock();

  // Re-request wake lock when tab becomes visible
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    releaseWakeLock();
  };
}

/**
 * Get current wake lock state
 *
 * @returns true if wake lock is currently active
 */
export function isWakeLockActive(): boolean {
  return wakeLock !== null;
}
