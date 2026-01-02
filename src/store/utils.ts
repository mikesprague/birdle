/**
 * TinyBase Store Utility Functions
 *
 * Common operations for reading and writing game data to the TinyBase store.
 * These utilities abstract away the schema details and provide a clean API
 * for game state management.
 */

import type { Store } from 'tinybase';
import type { GameState, Stats, Theme } from '@/types';
import {
  gameStateToRow,
  ROW_IDS,
  rowToGameState,
  rowToStats,
  statsToRow,
  TABLES,
} from './schema';

/**
 * Game State Operations
 */

/**
 * Get the current game state from the store
 *
 * @param store - TinyBase store instance
 * @param gameId - Game ID (day number)
 * @returns GameState or null if not found
 */
export function getGameState(store: Store, gameId: number): GameState | null {
  const row = store.getRow(TABLES.GAMES, gameId.toString());
  if (!row) return null;

  try {
    return rowToGameState(row as any);
  } catch (error) {
    console.error('Failed to parse game state:', error);
    return null;
  }
}

/**
 * Save game state to the store
 *
 * @param store - TinyBase store instance
 * @param gameState - Game state to save
 */
export function saveGameState(store: Store, gameState: GameState): void {
  const row = gameStateToRow(gameState);
  store.setRow(TABLES.GAMES, gameState.gameId.toString(), row);
}

/**
 * Delete a game state from the store
 *
 * @param store - TinyBase store instance
 * @param gameId - Game ID to delete
 */
export function deleteGameState(store: Store, gameId: number): void {
  store.delRow(TABLES.GAMES, gameId.toString());
}

/**
 * Get all game states from the store
 *
 * @param store - TinyBase store instance
 * @returns Array of GameState objects
 */
export function getAllGameStates(store: Store): GameState[] {
  const gamesTable = store.getTable(TABLES.GAMES);
  const gameStates: GameState[] = [];

  for (const [_, row] of Object.entries(gamesTable)) {
    try {
      const gameState = rowToGameState(row as any);
      gameStates.push(gameState);
    } catch (error) {
      console.error('Failed to parse game state:', error);
    }
  }

  return gameStates.sort((a, b) => b.gameId - a.gameId); // Most recent first
}

/**
 * Update a specific field in the current game state
 *
 * @param store - TinyBase store instance
 * @param gameId - Game ID
 * @param updates - Partial game state updates
 */
export function updateGameState(
  store: Store,
  gameId: number,
  updates: Partial<GameState>
): void {
  const currentState = getGameState(store, gameId);
  if (!currentState) {
    console.warn(`Game state not found for game ${gameId}`);
    return;
  }

  const updatedState = { ...currentState, ...updates };
  saveGameState(store, updatedState);
}

/**
 * Statistics Operations
 */

/**
 * Get current statistics from the store
 *
 * @param store - TinyBase store instance
 * @returns Stats object
 */
export function getStats(store: Store): Stats | null {
  const row = store.getRow(TABLES.STATS, ROW_IDS.STATS_CURRENT);
  if (!row) return null;

  try {
    return rowToStats(row as any);
  } catch (error) {
    console.error('Failed to parse stats:', error);
    return null;
  }
}

/**
 * Save statistics to the store
 *
 * @param store - TinyBase store instance
 * @param stats - Stats object to save
 */
export function saveStats(store: Store, stats: Stats): void {
  const row = statsToRow(stats);
  store.setRow(TABLES.STATS, ROW_IDS.STATS_CURRENT, row);
}

/**
 * Update statistics after a game
 *
 * @param store - TinyBase store instance
 * @param won - Whether the game was won
 * @param guessCount - Number of guesses used (1-6, or 7 for fail)
 */
export function updateStatsAfterGame(
  store: Store,
  won: boolean,
  guessCount: number
): void {
  const stats = getStats(store);
  if (!stats) {
    console.error('Stats not found in store');
    return;
  }

  // Increment games played
  stats.gamesPlayed += 1;

  if (won) {
    // Update win statistics
    stats.gamesWon += 1;
    stats.currentStreak += 1;

    // Update max streak if current is higher
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }

    // Update guess distribution (1-6)
    if (guessCount >= 1 && guessCount <= 6) {
      stats.guesses[guessCount as 1 | 2 | 3 | 4 | 5 | 6] += 1;
    }

    // Calculate average guesses
    let totalGuesses = 0;
    for (const key of [1, 2, 3, 4, 5, 6] as const) {
      totalGuesses += stats.guesses[key] * key;
    }
    stats.averageGuesses = Math.round(totalGuesses / stats.gamesWon);
  } else {
    // Loss: reset streak and increment fail count
    stats.currentStreak = 0;
    stats.guesses.fail += 1;
  }

  // Calculate win percentage
  stats.winPercentage = Math.round((stats.gamesWon / stats.gamesPlayed) * 100);

  // Save updated stats
  saveStats(store, stats);
}

/**
 * Reset statistics to default values
 *
 * @param store - TinyBase store instance
 */
export function resetStats(store: Store): void {
  const defaultStats: Stats = {
    currentStreak: 0,
    maxStreak: 0,
    guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
    winPercentage: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    averageGuesses: 0,
  };

  saveStats(store, defaultStats);
}

/**
 * Settings Operations
 */

/**
 * Get current theme from settings
 *
 * @param store - TinyBase store instance
 * @returns Theme value
 */
export function getTheme(store: Store): Theme {
  const settings = store.getRow(TABLES.SETTINGS, ROW_IDS.SETTINGS_CURRENT);
  const theme = settings?.theme as Theme | undefined;
  return theme || 'dark';
}

/**
 * Save theme to settings
 *
 * @param store - TinyBase store instance
 * @param theme - Theme to save
 */
export function saveTheme(store: Store, theme: Theme): void {
  store.setCell(TABLES.SETTINGS, ROW_IDS.SETTINGS_CURRENT, 'theme', theme);
}

/**
 * Get show instructions flag
 *
 * @param store - TinyBase store instance
 * @returns boolean
 */
export function getShowInstructions(store: Store): boolean {
  const settings = store.getRow(TABLES.SETTINGS, ROW_IDS.SETTINGS_CURRENT);
  return settings?.showInstructions !== false; // Default to true
}

/**
 * Save show instructions flag
 *
 * @param store - TinyBase store instance
 * @param show - Whether to show instructions
 */
export function saveShowInstructions(store: Store, show: boolean): void {
  store.setCell(
    TABLES.SETTINGS,
    ROW_IDS.SETTINGS_CURRENT,
    'showInstructions',
    show
  );
}

/**
 * Get all settings
 *
 * @param store - TinyBase store instance
 * @returns Settings object
 */
export function getSettings(store: Store): {
  theme: Theme;
  showInstructions: boolean;
} {
  const settings = store.getRow(TABLES.SETTINGS, ROW_IDS.SETTINGS_CURRENT);

  return {
    theme: (settings?.theme as Theme) || 'dark',
    showInstructions: settings?.showInstructions !== false,
  };
}

/**
 * Utility Functions
 */

/**
 * Check if a game exists in the store
 *
 * @param store - TinyBase store instance
 * @param gameId - Game ID to check
 * @returns true if game exists
 */
export function hasGame(store: Store, gameId: number): boolean {
  return store.hasRow(TABLES.GAMES, gameId.toString());
}

/**
 * Get the most recent game state
 *
 * @param store - TinyBase store instance
 * @returns Most recent GameState or null
 */
export function getMostRecentGame(store: Store): GameState | null {
  const games = getAllGameStates(store);
  return games.length > 0 ? games[0] : null;
}

/**
 * Delete old games (keep only last N games)
 *
 * @param store - TinyBase store instance
 * @param keepCount - Number of games to keep (default: 30)
 */
export function pruneOldGames(store: Store, keepCount = 30): void {
  const games = getAllGameStates(store);

  if (games.length <= keepCount) {
    return; // Nothing to prune
  }

  // Sort by gameId descending (most recent first)
  games.sort((a, b) => b.gameId - a.gameId);

  // Delete games beyond keepCount
  for (let i = keepCount; i < games.length; i++) {
    deleteGameState(store, games[i].gameId);
  }

  console.log(
    `🗑️  Pruned ${games.length - keepCount} old games (kept ${keepCount})`
  );
}

/**
 * Export store data as JSON (for backup)
 *
 * @param store - TinyBase store instance
 * @returns JSON string of store data
 */
export function exportStoreData(store: Store): string {
  const tables = store.getTables();
  const values = store.getValues();
  return JSON.stringify({ tables, values }, null, 2);
}

/**
 * Import store data from JSON (for restore)
 *
 * @param store - TinyBase store instance
 * @param jsonData - JSON string of store data
 */
export function importStoreData(store: Store, jsonData: string): void {
  try {
    const data = JSON.parse(jsonData);
    if (data.tables) {
      store.setTables(data.tables);
    }
    if (data.values) {
      store.setValues(data.values);
    }
    console.log('✅ Store data imported successfully');
  } catch (error) {
    console.error('Failed to import store data:', error);
    throw error;
  }
}
