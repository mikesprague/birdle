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
import { ROW_IDS, rowToStats, statsToRow, TABLES } from '@/store/schema';
import type { Stats } from '@/types';

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
      return rowToStats(statsRow as any);
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

      // Create a copy to modify
      const updatedStats: Stats = { ...stats };

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

        // Calculate average guesses
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
    };

    const row = statsToRow(defaultStats);
    store.setRow(TABLES.STATS, ROW_IDS.STATS_CURRENT, row);

    console.log('📊 Stats reset to defaults');
  }, [store]);

  return {
    stats,
    isLoading: !stats,
    updateStats,
    resetStats,
  };
}
