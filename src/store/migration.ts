/**
 * Migration Helper: localStorage → TinyBase
 *
 * This module handles the one-time migration of legacy game data from
 * localStorage to the TinyBase store with IndexedDB persistence.
 *
 * Migration Strategy:
 * 1. Check if migration has already been completed
 * 2. Read legacy data from localStorage (gameState, stats)
 * 3. Transform and write to TinyBase tables
 * 4. Mark migration as complete
 * 5. Optionally preserve or remove legacy data
 */

import type { Store } from 'tinybase';
import type { GameState, Stats } from '@/types';
import { gameStateToRow, statsToRow, TABLES } from './schema';

/**
 * Migration flag key in localStorage
 */
const MIGRATION_FLAG_KEY = 'birdle-migrated-to-tinybase';

/**
 * Legacy localStorage keys
 */
const LEGACY_KEYS = {
  GAME_STATE: 'gameState',
  STATS: 'stats',
} as const satisfies Record<string, string>;

/**
 * Migration result information
 */
export interface MigrationResult {
  /** Whether migration was performed (false if already migrated) */
  migrated: boolean;

  /** Whether legacy game state was found and migrated */
  hadGameState: boolean;

  /** Whether legacy stats were found and migrated */
  hadStats: boolean;

  /** Game ID that was migrated (if any) */
  gameId?: number;

  /** Any errors encountered during migration */
  errors: string[];
}

/**
 * Check if migration has already been completed
 *
 * @returns true if migration flag is set
 */
export function isMigrationComplete(): boolean {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  const flag = localStorage.getItem(MIGRATION_FLAG_KEY);
  return flag === 'true';
}

/**
 * Mark migration as complete
 */
export function markMigrationComplete(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
  console.log('✅ Migration marked as complete');
}

/**
 * Read legacy game state from localStorage
 *
 * @returns GameState object or null if not found/invalid
 */
function readLegacyGameState(): GameState | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const data = localStorage.getItem(LEGACY_KEYS.GAME_STATE);
    if (!data) {
      return null;
    }

    const gameState: GameState = JSON.parse(data);

    // Validate required fields
    if (
      typeof gameState.gameId !== 'number' ||
      !Array.isArray(gameState.guessesRows) ||
      !Array.isArray(gameState.guessesSubmitted)
    ) {
      console.warn('Invalid legacy game state structure');
      return null;
    }

    return gameState;
  } catch (error) {
    console.error('Failed to read legacy game state:', error);
    return null;
  }
}

/**
 * Read legacy stats from localStorage
 *
 * @returns Stats object or null if not found/invalid
 */
function readLegacyStats(): Stats | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const data = localStorage.getItem(LEGACY_KEYS.STATS);
    if (!data) {
      return null;
    }
    const stats: Stats = JSON.parse(data);

    // Validate required fields
    if (
      typeof stats.gamesPlayed !== 'number' ||
      typeof stats.gamesWon !== 'number' ||
      typeof stats.guesses !== 'object'
    ) {
      console.warn('Invalid legacy stats structure');
      return null;
    }

    return stats;
  } catch (error) {
    console.error('Failed to read legacy stats:', error);
    return null;
  }
}

/**
 * Migrate game state to TinyBase store
 *
 * @param store - TinyBase store instance
 * @param gameState - Game state to migrate
 */
function migrateGameState(store: Store, gameState: GameState): void {
  const row = gameStateToRow(gameState);
  const gameId = gameState.gameId.toString();

  store.setRow(TABLES.GAMES, gameId, row);
  console.log(`✅ Migrated game state for game #${gameId}`);
}

/**
 * Migrate stats to TinyBase store
 *
 * @param store - TinyBase store instance
 * @param stats - Stats to migrate
 */
function migrateStats(store: Store, stats: Stats): void {
  const row = statsToRow(stats);

  store.setRow(TABLES.STATS, 'current', row);
  console.log('✅ Migrated stats:', {
    gamesPlayed: stats.gamesPlayed,
    gamesWon: stats.gamesWon,
    winPercentage: stats.winPercentage,
  });
}

/**
 * Remove legacy data from localStorage
 * Only call this after successful migration
 */
function removeLegacyData(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const keysToRemove = [LEGACY_KEYS.GAME_STATE, LEGACY_KEYS.STATS];

  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }

  console.log('🗑️  Removed legacy localStorage data');
}

/**
 * Perform migration from localStorage to TinyBase
 *
 * This is the main migration function that should be called once
 * during app initialization.
 *
 * @param store - TinyBase store instance
 * @param options - Migration options
 * @param options.removeLegacyData - Whether to remove legacy data after migration (default: false)
 * @returns MigrationResult with details about what was migrated
 *
 * @example
 * const store = createGameStore();
 * const result = await migrateFromLocalStorage(store, { removeLegacyData: true });
 * if (result.migrated) {
 *   console.log('Migration completed successfully');
 * }
 */
export async function migrateFromLocalStorage(
  store: Store,
  options: { removeLegacyData?: boolean } = {}
): Promise<MigrationResult> {
  const result: MigrationResult = {
    migrated: false,
    hadGameState: false,
    hadStats: false,
    errors: [],
  };

  // Check if migration already completed
  if (isMigrationComplete()) {
    console.log('ℹ️  Migration already completed, skipping');
    return result;
  }

  console.log('🔄 Starting migration from localStorage to TinyBase...');

  try {
    // Read legacy data
    const legacyGameState = readLegacyGameState();
    const legacyStats = readLegacyStats();

    // Check if there's any data to migrate
    if (!legacyGameState && !legacyStats) {
      console.log('ℹ️  No legacy data found, marking migration as complete');
      markMigrationComplete();
      return result;
    }

    // Migrate game state
    if (legacyGameState) {
      try {
        migrateGameState(store, legacyGameState);
        result.hadGameState = true;
        result.gameId = legacyGameState.gameId;
      } catch (error) {
        const errorMsg = `Failed to migrate game state: ${error}`;
        console.error(errorMsg);
        result.errors.push(errorMsg);
      }
    }

    // Migrate stats
    if (legacyStats) {
      try {
        migrateStats(store, legacyStats);
        result.hadStats = true;
      } catch (error) {
        const errorMsg = `Failed to migrate stats: ${error}`;
        console.error(errorMsg);
        result.errors.push(errorMsg);
      }
    }

    // Mark migration as complete
    markMigrationComplete();
    result.migrated = true;

    // Optionally remove legacy data
    if (options.removeLegacyData && result.errors.length === 0) {
      removeLegacyData();
    }

    console.log('✅ Migration completed successfully');

    return result;
  } catch (error) {
    const errorMsg = `Migration failed: ${error}`;
    console.error(errorMsg);
    result.errors.push(errorMsg);
    return result;
  }
}

/**
 * Reset migration state (for testing or manual re-migration)
 *
 * WARNING: This will allow migration to run again, which could
 * overwrite existing TinyBase data. Use with caution!
 */
export function resetMigration(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem(MIGRATION_FLAG_KEY);
  console.log('⚠️  Migration state reset');
}

/**
 * Get migration status information
 *
 * @returns Object with migration status details
 */
export function getMigrationStatus(): {
  isComplete: boolean;
  hasLegacyGameState: boolean;
  hasLegacyStats: boolean;
} {
  return {
    isComplete: isMigrationComplete(),
    hasLegacyGameState: readLegacyGameState() !== null,
    hasLegacyStats: readLegacyStats() !== null,
  };
}
