/**
 * Hooks Module
 *
 * Central export file for all custom React hooks.
 * Import from '@/hooks' to access game hooks.
 *
 * @example
 * import { useGameState, useStats, useKeyboard, useTheme } from '@/hooks';
 */

// Game state management hook
export type { UseGameStateReturn } from './useGameState';
export { useGameState } from './useGameState';
// Keyboard input handling hook
export type { UseKeyboardReturn } from './useKeyboard';
export { KEYBOARD_ROWS, useKeyboard } from './useKeyboard';
// Statistics management hook
export type { UseStatsReturn } from './useStats';
export { useStats } from './useStats';

// Theme management hook
export type { UseThemeReturn } from './useTheme';
export { useTheme } from './useTheme';

// Toast notification utilities
export {
  showCopiedToast,
  showCopyFailedToast,
  showErrorToast,
  showInfoToast,
  showInvalidWordToast,
  showShareCancelledToast,
  showSharedToast,
  showSuccessToast,
  showToastPromise,
  useToast,
} from './useToast';
