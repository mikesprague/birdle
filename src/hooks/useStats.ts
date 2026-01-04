/**
 * useStats Hook
 *
 * Manages player statistics including games played, win percentage,
 * streaks, and guess distribution. Integrates with TinyBase store
 * for automatic persistence.
 */

import { useCallback, useMemo } from 'react';
import type { Store } from 'tinybase';
import { useRow } from 'tinybase/ui-react';
import {
  ROW_IDS,
  rowToStats,
  type StatsTableRow,
  statsToRow,
  TABLES,
} from '@/store/schema';
import type { Stats } from '@/types';

type GameResult = {
  won: boolean;
  guessCount: number;
};

type ApplyGameResultOptions = {
  /**
   * When provided, stamps the aggregate with the gameId that was just counted.
   * This is used for idempotency across reloads (count at most once per day).
   */
  gameIdToMarkAsCounted?: number;
};

/**
 * Pure stat computation for applying a single completed game result.
 * This is shared by both `updateStats` and `countGameIfNeeded` to avoid drift.
 */
function applyGameResult(
  baseStats: Stats,
  { won, guessCount }: GameResult,
  options: ApplyGameResultOptions = {}
): Stats {
  const updatedStats: Stats = {
    ...baseStats,
    ...(typeof options.gameIdToMarkAsCounted === 'number'
      ? { lastCountedGameId: options.gameIdToMarkAsCounted }
      : {}),
  };

  // Increment games played
  updatedStats.gamesPlayed += 1;

  if (won) {
    // Update win statistics
    updatedStats.gamesWon += 1;
    updatedStats.currentStreak += 1;

    // Update max streak if current is higher
    if (updatedStats.currentStreak > updatedStats.maxStreak) {
      updatedStats.maxStreak = updatedStats.currentStreak;
    }

    // Update guess distribution (1-6)
    if (guessCount >= 1 && guessCount <= 6) {
      const key = guessCount as 1 | 2 | 3 | 4 | 5 | 6;
      updatedStats.guesses[key] += 1;
    }

    // Calculate average guesses (weighted avg over wins only)
    let totalGuesses = 0;
    for (const key of [1, 2, 3, 4, 5, 6] as const) {
      totalGuesses += updatedStats.guesses[key] * key;
    }
    updatedStats.averageGuesses = Math.round(
      totalGuesses / updatedStats.gamesWon
    );
  } else {
    // Loss: reset streak and increment fail count
    updatedStats.currentStreak = 0;
    updatedStats.guesses.fail += 1;
  }

  // Calculate win percentage
  updatedStats.winPercentage = Math.round(
    (updatedStats.gamesWon / updatedStats.gamesPlayed) * 100
  );

  return updatedStats;
}

/**
 * Hook return type
 */
export interface UseStatsReturn {
  /** Current statistics */
  stats: Stats | null;

  /** Whether stats are loading */
  isLoading: boolean;

  /** Update statistics after a game completes */
  updateStats: (won: boolean, guessCount: number) => void;

  /**
   * Count a completed game exactly once (idempotent per `gameId`).
   * Persists `stats.lastCountedGameId` so reloads won't double-count.
   *
   * @param gameId - Daily game id
   * @param won - Whether the player won
   * @param guessCount - Number of guesses used (1-6)
   * @returns true if stats were updated, false if this game was already counted or stats are unavailable
   */
  countGameIfNeeded: (
    gameId: number,
    won: boolean,
    guessCount: number
  ) => boolean;

  /** Reset all statistics to zero */
  resetStats: () => void;
}

/**
 * useStats hook
 *
 * @param store - TinyBase store instance
 * @returns Statistics and update functions
 *
 * @example
 * const { stats, updateStats } = useStats(store);
 *
 * // After game completes
 * updateStats(true, 4); // Won in 4 guesses
 */
export function useStats(store: Store): UseStatsReturn {
  // Subscribe to stats from TinyBase
  const statsRow = useRow(TABLES.STATS, ROW_IDS.STATS_CURRENT, store);

  // Convert row to Stats
  const stats = useMemo((): Stats | null => {
    if (!statsRow || Object.keys(statsRow).length === 0) {
      return null;
    }

    try {
      // TinyBase `useRow` returns a loosely-typed row. `rowToStats` performs
      // runtime parsing/validation (including JSON parsing for `guesses`).
      return rowToStats(statsRow as unknown as StatsTableRow);
    } catch (error) {
      console.error('Failed to parse stats:', error);
      return null;
    }
  }, [statsRow]);

  /**
   * Update statistics after a game completes
   */
  const updateStats = useCallback(
    (won: boolean, guessCount: number) => {
      if (!stats) {
        console.error('Stats not available');
        return;
      }

      const updatedStats = applyGameResult(stats, { won, guessCount });

      // Save to store
      const row = statsToRow(updatedStats);
      store.setRow(TABLES.STATS, ROW_IDS.STATS_CURRENT, row);

      console.log('📊 Stats updated:', {
        gamesPlayed: updatedStats.gamesPlayed,
        gamesWon: updatedStats.gamesWon,
        winPercentage: updatedStats.winPercentage,
        currentStreak: updatedStats.currentStreak,
      });
    },
    [stats, store]
  );

  /**
   * Count a completed daily game into aggregate stats at most once.
   * Uses `stats.lastCountedGameId` as a persisted idempotency marker.
   */
  const countGameIfNeeded = useCallback(
    (gameId: number, won: boolean, guessCount: number): boolean => {
      if (!stats) {
        console.error('Stats not available');
        return false;
      }

      if (stats.lastCountedGameId === gameId) {
        return false;
      }

      const updatedStats = applyGameResult(
        stats,
        { won, guessCount },
        { gameIdToMarkAsCounted: gameId }
      );

      const row = statsToRow(updatedStats);
      store.setRow(TABLES.STATS, ROW_IDS.STATS_CURRENT, row);

      return true;
    },
    [stats, store]
  );

  /**
   * Reset all statistics to zero
   */
  const resetStats = useCallback(() => {
    const defaultStats: Stats = {
      currentStreak: 0,
      maxStreak: 0,
      guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
      winPercentage: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      averageGuesses: 0,
      // Omit optional fields so we never write `undefined` into TinyBase cells.
    };

    const row = statsToRow(defaultStats);
    store.setRow(TABLES.STATS, ROW_IDS.STATS_CURRENT, row);

    console.log('📊 Stats reset to defaults');
  }, [store]);

  return {
    stats,
    isLoading: !stats,
    updateStats,
    countGameIfNeeded,
    resetStats,
  };
}
