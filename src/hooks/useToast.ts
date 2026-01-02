/**
 * useToast Hook and Toast Utilities
 *
 * Provides toast notification helpers using Sonner.
 * Pre-configured toast functions for common game notifications.
 */

import { toast } from 'sonner';

/**
 * Toast configuration constants
 */
const TOAST_CONFIG = {
  duration: 2500,
  position: 'top-center' as const,
};

/**
 * Show "Not in word list" error toast
 * Displayed when user submits an invalid word
 */
export function showInvalidWordToast(): void {
  toast.error('Not in word list', {
    duration: TOAST_CONFIG.duration,
    position: TOAST_CONFIG.position,
  });
}

/**
 * Show "Copied results to clipboard" success toast
 * Displayed after successfully copying share results
 */
export function showCopiedToast(): void {
  toast.success('Copied results to clipboard', {
    duration: TOAST_CONFIG.duration,
    position: TOAST_CONFIG.position,
  });
}

/**
 * Show "Failed to copy" error toast
 * Displayed when clipboard copy fails
 */
export function showCopyFailedToast(): void {
  toast.error('Failed to copy to clipboard', {
    duration: TOAST_CONFIG.duration,
    position: TOAST_CONFIG.position,
  });
}

/**
 * Show generic error toast with custom message
 *
 * @param message - Error message to display
 */
export function showErrorToast(message: string): void {
  toast.error(message, {
    duration: TOAST_CONFIG.duration,
    position: TOAST_CONFIG.position,
  });
}

/**
 * Show generic success toast with custom message
 *
 * @param message - Success message to display
 */
export function showSuccessToast(message: string): void {
  toast.success(message, {
    duration: TOAST_CONFIG.duration,
    position: TOAST_CONFIG.position,
  });
}

/**
 * Show generic info toast with custom message
 *
 * @param message - Info message to display
 */
export function showInfoToast(message: string): void {
  toast.info(message, {
    duration: TOAST_CONFIG.duration,
    position: TOAST_CONFIG.position,
  });
}

/**
 * Show "Shared successfully" success toast
 * Displayed after successfully using native share API
 */
export function showSharedToast(): void {
  toast.success('Shared successfully', {
    duration: TOAST_CONFIG.duration,
    position: TOAST_CONFIG.position,
  });
}

/**
 * Show "Share cancelled" info toast
 * Displayed when user cancels native share dialog
 */
export function showShareCancelledToast(): void {
  toast.info('Share cancelled', {
    duration: 1500,
    position: TOAST_CONFIG.position,
  });
}

/**
 * Custom hook for toast notifications (optional)
 * Provides access to all toast functions in a hook format
 *
 * @returns Object with toast notification functions
 *
 * @example
 * const toasts = useToast();
 * toasts.showInvalidWord();
 */
export function useToast() {
  return {
    showInvalidWord: showInvalidWordToast,
    showCopied: showCopiedToast,
    showCopyFailed: showCopyFailedToast,
    showError: showErrorToast,
    showSuccess: showSuccessToast,
    showInfo: showInfoToast,
    showShared: showSharedToast,
    showShareCancelled: showShareCancelledToast,
  };
}

/**
 * Toast promise helper for async operations
 *
 * @param promise - Promise to track
 * @param messages - Messages for loading, success, and error states
 *
 * @example
 * await showToastPromise(
 *   saveGameState(store, gameState),
 *   {
 *     loading: 'Saving game...',
 *     success: 'Game saved!',
 *     error: 'Failed to save game'
 *   }
 * );
 */
export function showToastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    duration: TOAST_CONFIG.duration,
    position: TOAST_CONFIG.position,
  });
}
