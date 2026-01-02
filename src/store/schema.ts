/**
 * TinyBase Store Schema Definition for Birdle
 *
 * This file documents the structure of the TinyBase store used for game state,
 * statistics, and UI preferences persistence.
 *
 * TinyBase uses a key-value store structure with tables, rows, and cells.
 * Each table contains rows (identified by rowId), and each row contains cells (key-value pairs).
 */

import type { GameState, Stats } from '@/types';

/**
 * Store Table Structure
 *
 * The store consists of three main tables:
 * 1. `games` - Stores game state for current and past games
 * 2. `stats` - Stores player statistics
 * 3. `settings` - Stores UI preferences and settings
 */

/**
 * Games Table Schema
 *
 * Table: 'games'
 * Purpose: Store game state data
 * RowId: gameId (string representation of day number)
 *
 * Structure:
 * {
 *   [gameId: string]: {
 *     gameId: number,
 *     guessesRows: string (JSON-encoded array of arrays),
 *     guessesSubmitted: string (JSON-encoded array),
 *     currentRow: number,
 *     currentGuess: number,
 *     wonGame: boolean,
 *     isGameOver: boolean,
 *     lastPlayedDate: string
 *   }
 * }
 *
 * Note: Complex types (arrays, objects) are stored as JSON strings
 * since TinyBase cells must be primitive values.
 */
export interface GamesTableRow {
  gameId: number;
  guessesRows: string; // JSON.stringify(string[][])
  guessesSubmitted: string; // JSON.stringify(string[])
  currentRow: number;
  currentGuess: number;
  wonGame: boolean;
  isGameOver: boolean;
  lastPlayedDate: string;
  [key: string]: string | number | boolean; // Index signature for TinyBase compatibility
}

/**
 * Stats Table Schema
 *
 * Table: 'stats'
 * Purpose: Store aggregate player statistics
 * RowId: 'current' (single row)
 *
 * Structure:
 * {
 *   current: {
 *     currentStreak: number,
 *     maxStreak: number,
 *     guesses: string (JSON-encoded object),
 *     winPercentage: number,
 *     gamesPlayed: number,
 *     gamesWon: number,
 *     averageGuesses: number
 *   }
 * }
 */
export interface StatsTableRow {
  currentStreak: number;
  maxStreak: number;
  guesses: string; // JSON.stringify({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 })
  winPercentage: number;
  gamesPlayed: number;
  gamesWon: number;
  averageGuesses: number;
  [key: string]: string | number | boolean; // Index signature for TinyBase compatibility
}

/**
 * Settings Table Schema
 *
 * Table: 'settings'
 * Purpose: Store UI preferences and app settings
 * RowId: 'current' (single row)
 *
 * Structure:
 * {
 *   current: {
 *     theme: string ('dark' | 'light' | 'system'),
 *     showInstructions: boolean,
 *     emojiBlasts: boolean,
 *     balloons: boolean
 *   }
 * }
 */
export interface SettingsTableRow {
  theme: string; // 'dark' | 'light' | 'system'
  showInstructions: boolean;
  emojiBlasts: boolean; // Show emoji blast celebrations on win
  balloons: boolean; // Show balloon celebrations on win
  [key: string]: string | number | boolean; // Index signature for TinyBase compatibility
}

/**
 * Complete Store Structure
 */
export interface StoreStructure {
  games: {
    [gameId: string]: GamesTableRow;
  };
  stats: {
    current: StatsTableRow;
  };
  settings: {
    current: SettingsTableRow;
  };
}

/**
 * Helper: Convert GameState to TinyBase row format
 */
export function gameStateToRow(gameState: GameState): GamesTableRow {
  return {
    gameId: gameState.gameId,
    guessesRows: JSON.stringify(gameState.guessesRows),
    guessesSubmitted: JSON.stringify(gameState.guessesSubmitted),
    currentRow: gameState.currentRow,
    currentGuess: gameState.currentGuess,
    wonGame: gameState.wonGame,
    isGameOver: gameState.isGameOver,
    lastPlayedDate: gameState.lastPlayedDate,
  };
}

/**
 * Helper: Convert TinyBase row to GameState format
 */
export function rowToGameState(row: GamesTableRow): GameState {
  return {
    gameId: row.gameId,
    guessesRows: JSON.parse(row.guessesRows),
    guessesSubmitted: JSON.parse(row.guessesSubmitted),
    currentRow: row.currentRow,
    currentGuess: row.currentGuess,
    wonGame: row.wonGame,
    isGameOver: row.isGameOver,
    lastPlayedDate: row.lastPlayedDate,
  };
}

/**
 * Helper: Convert Stats to TinyBase row format
 */
export function statsToRow(stats: Stats): StatsTableRow {
  return {
    currentStreak: stats.currentStreak,
    maxStreak: stats.maxStreak,
    guesses: JSON.stringify(stats.guesses),
    winPercentage: stats.winPercentage,
    gamesPlayed: stats.gamesPlayed,
    gamesWon: stats.gamesWon,
    averageGuesses: stats.averageGuesses,
  };
}

/**
 * Helper: Convert TinyBase row to Stats format
 */
export function rowToStats(row: StatsTableRow): Stats {
  return {
    currentStreak: row.currentStreak,
    maxStreak: row.maxStreak,
    guesses: JSON.parse(row.guesses),
    winPercentage: row.winPercentage,
    gamesPlayed: row.gamesPlayed,
    gamesWon: row.gamesWon,
    averageGuesses: row.averageGuesses,
  };
}

/**
 * Default initial values for store tables
 */
export const DEFAULT_STATS: StatsTableRow = {
  currentStreak: 0,
  maxStreak: 0,
  guesses: JSON.stringify({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 }),
  winPercentage: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  averageGuesses: 0,
};

export const DEFAULT_SETTINGS: SettingsTableRow = {
  theme: 'dark',
  showInstructions: true,
  emojiBlasts: true,
  balloons: true,
};

/**
 * Store table names (constants for type safety)
 */
export const TABLES = {
  GAMES: 'games',
  STATS: 'stats',
  SETTINGS: 'settings',
} as const satisfies Record<string, string>;

/**
 * Row IDs for singleton tables (constants for type safety)
 */
export const ROW_IDS = {
  STATS_CURRENT: 'current',
  SETTINGS_CURRENT: 'current',
} as const satisfies Record<string, string>;
