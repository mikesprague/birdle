/**
 * useGameState Hook
 *
 * Manages game state and logic for the current Birdle game.
 * Integrates with TinyBase store for persistence and provides
 * actions for playing the game (adding letters, submitting guesses, etc.)
 */

import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import type { Store } from 'tinybase';
import { useRow } from 'tinybase/ui-react';
import { gameStateToRow, rowToGameState, TABLES } from '@/store/schema';
import type { BirdleOfDay, GameState } from '@/types';
import {
  createInitialGameState,
  getBirdleOfDay,
  isGuessCorrect,
  isGuessValid,
} from '@/utils';

/**
 * Hook return type
 */
export interface UseGameStateReturn {
  /** Current game state */
  gameState: GameState | null;

  /** Today's Birdle word and day */
  birdle: BirdleOfDay;

  /** Whether game is loading */
  isLoading: boolean;

  /** Add a letter to the current position */
  handleLetter: (letter: string) => void;

  /** Delete the last letter */
  deleteLetter: () => void;

  /** Submit the current guess */
  submitGuess: () => void;

  /** Reset the current game */
  resetGame: () => void;

  /** Check if a letter can be added */
  canAddLetter: boolean;

  /** Check if current row can be submitted */
  canSubmit: boolean;
}

/**
 * useGameState hook
 *
 * @param store - TinyBase store instance
 * @returns Game state and actions
 *
 * @example
 * const { gameState, handleLetter, submitGuess } = useGameState(store);
 */
export function useGameState(store: Store): UseGameStateReturn {
  // Get today's Birdle word
  const birdle = useMemo(() => getBirdleOfDay(), []);

  // Subscribe to current game state from TinyBase
  const gameRow = useRow(TABLES.GAMES, birdle.day.toString(), store);

  // Convert row to GameState or create initial state
  const gameState = useMemo((): GameState | null => {
    if (!gameRow || Object.keys(gameRow).length === 0) {
      return null;
    }

    try {
      return rowToGameState(gameRow as any);
    } catch (error) {
      console.error('Failed to parse game state:', error);
      return null;
    }
  }, [gameRow]);

  // Initialize game if it doesn't exist or is from a previous day
  useEffect(() => {
    if (!gameState || gameState.gameId !== birdle.day) {
      const initialState = createInitialGameState(birdle.day);
      const row = gameStateToRow(initialState);
      store.setRow(TABLES.GAMES, birdle.day.toString(), row);
    }
  }, [store, birdle.day, gameState]);

  // Computed properties
  const canAddLetter = useMemo(() => {
    if (!gameState || gameState.isGameOver) return false;
    return gameState.currentGuess < 5;
  }, [gameState]);

  const canSubmit = useMemo(() => {
    if (!gameState || gameState.isGameOver) return false;
    return gameState.currentGuess === 5;
  }, [gameState]);

  /**
   * Add a letter to the current position
   */
  const handleLetter = useCallback(
    (letter: string) => {
      if (!gameState || !canAddLetter) return;

      const { currentRow, currentGuess, guessesRows } = gameState;

      // Update the current position
      const newGuessesRows = guessesRows.map((row, idx) =>
        idx === currentRow
          ? row.map((cell, cellIdx) =>
              cellIdx === currentGuess ? letter.toLowerCase() : cell
            )
          : row
      );

      // Create updated state
      const updatedState: GameState = {
        ...gameState,
        guessesRows: newGuessesRows,
        currentGuess: currentGuess + 1,
      };

      // Save to store
      const row = gameStateToRow(updatedState);
      store.setRow(TABLES.GAMES, birdle.day.toString(), row);
    },
    [gameState, canAddLetter, store, birdle.day]
  );

  /**
   * Delete the last letter
   */
  const deleteLetter = useCallback(() => {
    if (!gameState || gameState.currentGuess === 0 || gameState.isGameOver) {
      return;
    }

    const { currentRow, currentGuess, guessesRows } = gameState;
    const newGuess = currentGuess - 1;

    // Clear the previous position
    const newGuessesRows = guessesRows.map((row, idx) =>
      idx === currentRow
        ? row.map((cell, cellIdx) => (cellIdx === newGuess ? '' : cell))
        : row
    );

    // Create updated state
    const updatedState: GameState = {
      ...gameState,
      guessesRows: newGuessesRows,
      currentGuess: newGuess,
    };

    // Save to store
    const row = gameStateToRow(updatedState);
    store.setRow(TABLES.GAMES, birdle.day.toString(), row);
  }, [gameState, store, birdle.day]);

  /**
   * Submit the current guess
   */
  const submitGuess = useCallback(() => {
    if (!gameState || !canSubmit) return;

    const { currentRow, guessesRows, guessesSubmitted } = gameState;
    const guess = guessesRows[currentRow].join('');

    // Validate guess
    if (!isGuessValid(guess)) {
      toast.error('Not in word list', {
        duration: 2500,
        position: 'top-center',
      });
      return;
    }

    // Check if correct
    const isCorrect = isGuessCorrect(guess, birdle.word);
    const isLastRow = currentRow === 5;
    const gameOver = isCorrect || isLastRow;

    // Create updated state
    const updatedState: GameState = {
      ...gameState,
      guessesSubmitted: [...guessesSubmitted, guess],
      currentRow: gameOver ? currentRow : currentRow + 1,
      currentGuess: 0, // Reset column for next row
      wonGame: isCorrect,
      isGameOver: gameOver,
      lastPlayedDate: new Date().toISOString(),
    };

    // Save to store
    const row = gameStateToRow(updatedState);
    store.setRow(TABLES.GAMES, birdle.day.toString(), row);
  }, [gameState, canSubmit, store, birdle.day, birdle.word]);

  /**
   * Reset the current game
   */
  const resetGame = useCallback(() => {
    const initialState = createInitialGameState(birdle.day);
    const row = gameStateToRow(initialState);
    store.setRow(TABLES.GAMES, birdle.day.toString(), row);
  }, [store, birdle.day]);

  return {
    gameState,
    birdle,
    isLoading: !gameState,
    handleLetter,
    deleteLetter,
    submitGuess,
    resetGame,
    canAddLetter,
    canSubmit,
  };
}
