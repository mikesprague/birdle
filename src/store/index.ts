/**
 * TinyBase Store Module
 *
 * Central export file for all store-related functionality.
 * Import from '@/store' to access store creation, persistence, and utilities.
 *
 * @example
 * import { createGameStore, createGamePersister, migrateFromLocalStorage } from '@/store';
 *
 * const store = createGameStore();
 * await migrateFromLocalStorage(store);
 * const persister = await createGamePersister(store);
 */

// Migration utilities
export type { MigrationResult } from './migration';
export {
  getMigrationStatus,
  isMigrationComplete,
  markMigrationComplete,
  migrateFromLocalStorage,
  resetMigration,
} from './migration';
// Persister configuration
export {
  createGamePersister,
  createGamePersisterWithDefaults,
  DB_NAME,
  destroyPersister,
  getPersisterStatus,
  manualLoad,
  manualSave,
} from './persister';
// Schema definitions and helpers
export type {
  GamesTableRow,
  SettingsTableRow,
  StatsTableRow,
  StoreStructure,
} from './schema';
export {
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  gameStateToRow,
  ROW_IDS,
  rowToGameState,
  rowToStats,
  statsToRow,
  TABLES,
} from './schema';
// Store creation and initialization
export {
  clearStore,
  createGameStore,
  getGlobalStore,
  isStoreInitialized,
  resetGlobalStore,
} from './store';
// Store utilities
export {
  deleteGameState,
  exportStoreData,
  getAllGameStates,
  getGameState,
  getMostRecentGame,
  getSettings,
  getShowInstructions,
  getStats,
  getTheme,
  hasGame,
  importStoreData,
  pruneOldGames,
  resetStats,
  saveGameState,
  saveShowInstructions,
  saveStats,
  saveTheme,
  updateGameState,
  updateStatsAfterGame,
} from './utils';
