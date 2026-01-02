/**
 * TinyBase Store Creation and Initialization
 *
 * This module handles the creation and configuration of the TinyBase store
 * for game state, statistics, and settings persistence.
 */

import type { Store } from 'tinybase';
import { createStore } from 'tinybase';
import { DEFAULT_SETTINGS, DEFAULT_STATS, TABLES } from './schema';

/**
 * Create and initialize a new TinyBase store with default tables
 *
 * Sets up three tables:
 * - games: Stores game state for current and past games
 * - stats: Stores aggregate player statistics
 * - settings: Stores UI preferences and app settings
 *
 * @returns Initialized TinyBase Store instance
 *
 * @example
 * const store = createGameStore();
 * console.log(store.getTables());
 */
export function createGameStore(): Store {
  const store = createStore();

  // Initialize tables with empty/default data
  store.setTables({
    [TABLES.GAMES]: {},
    [TABLES.STATS]: {
      current: DEFAULT_STATS,
    },
    [TABLES.SETTINGS]: {
      current: DEFAULT_SETTINGS,
    },
  });

  return store;
}

/**
 * Get or create the global store instance (singleton pattern)
 * Useful for ensuring only one store exists across the app
 */
let globalStore: Store | null = null;

/**
 * Get the global store instance, creating it if it doesn't exist
 *
 * @returns Global Store instance
 */
export function getGlobalStore(): Store {
  if (!globalStore) {
    globalStore = createGameStore();
  }
  return globalStore;
}

/**
 * Reset the global store (useful for testing or starting fresh)
 */
export function resetGlobalStore(): void {
  globalStore = null;
}

/**
 * Check if the store has been initialized with data
 *
 * @param store - TinyBase store instance
 * @returns true if store has game or stats data
 */
export function isStoreInitialized(store: Store): boolean {
  const games = store.getTable(TABLES.GAMES);
  const stats = store.getRow(TABLES.STATS, 'current');

  // Check if there's any game data or non-default stats
  const gamesPlayed = stats?.gamesPlayed;
  return (
    Object.keys(games).length > 0 ||
    (typeof gamesPlayed === 'number' && gamesPlayed > 0)
  );
}

/**
 * Clear all store data (reset to defaults)
 *
 * @param store - TinyBase store instance
 */
export function clearStore(store: Store): void {
  store.setTables({
    [TABLES.GAMES]: {},
    [TABLES.STATS]: {
      current: DEFAULT_STATS,
    },
    [TABLES.SETTINGS]: {
      current: DEFAULT_SETTINGS,
    },
  });
}
