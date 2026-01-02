/**
 * Central export file for all utility functions
 * Import from '@/utils' to access game utilities
 */

// Color and status calculation utilities
export {
  calculateGuessWithStatuses,
  calculateKeyboardStatuses,
  calculateLetterStatuses,
  getBoxStatusClasses,
  getKeyStatusClasses,
  getRowStatus,
  getStatusClassName,
  isGuessCorrect,
} from './colors';
// Game logic utilities
export {
  createInitialGameState,
  createInitialStats,
  defaultBirds,
  getBirdleOfDay,
  getCelebrationEmojis,
  getSuccessMessage,
  halloweenEmojis,
  isDev,
  isGameFromToday,
  isGuessValid,
  isHalloweenSeason,
  isLocal,
  isSameDay,
  successStrings,
} from './game-logic';

// Share functionality utilities
export {
  copyToClipboard,
  createShareText,
  formatShareTextForDisplay,
  getFacebookShareUrl,
  getTwitterShareUrl,
  isMobileShareSupported,
  isShareApiSupported,
  shareResults,
} from './share';

// Theme management utilities
export {
  applyTheme,
  getEffectiveTheme,
  getSystemTheme,
  getThemeColor,
  initializeTheme,
  isSystemDarkTheme,
  listenToSystemThemeChanges,
  toggleTheme,
  updateThemeColorMeta,
} from './theme';

// Wake lock utilities
export {
  isWakeLockActive,
  isWakeLockSupported,
  releaseWakeLock,
  requestWakeLock,
  setupAutoWakeLock,
} from './wake-lock';
