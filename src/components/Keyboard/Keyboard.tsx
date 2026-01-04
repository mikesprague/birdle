/**
 * Keyboard Component
 *
 * Renders the complete virtual keyboard with three rows of keys.
 * Integrates with game state and provides visual feedback based on letter usage.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Store } from 'tinybase';
import { REVEAL_TOTAL_MS } from '@/constants/revealTiming';
import { KEYBOARD_ROWS, useGameState, useKeyboard } from '@/hooks';
import { Key } from './Key';

export interface KeyboardProps {
  /** TinyBase store instance */
  store: Store;
}

/**
 * Keyboard component
 *
 * @example
 * <Keyboard store={store} />
 */
export function Keyboard({ store }: KeyboardProps) {
  const {
    gameState,
    birdle,
    handleLetter,
    deleteLetter,
    clearCurrentRow,
    submitGuess,
  } = useGameState(store);

  // Handle key press from virtual or physical keyboard
  const handleKeyPress = useCallback(
    (key: string) => {
      // Virtual keyboard is disabled when game over (see `isInputDisabled` below),
      // but keep this guard as a last line of defense.
      if (!gameState || gameState.isGameOver) {
        return;
      }

      if (key === 'enter') {
        submitGuess();
      } else if (key === 'backspace') {
        deleteLetter();
      } else if (key === 'clear-row') {
        clearCurrentRow();
      } else {
        handleLetter(key);
      }
    },
    [gameState, handleLetter, deleteLetter, clearCurrentRow, submitGuess]
  );

  // Get key statuses based on submitted guesses
  const { keyStatuses } = useKeyboard(
    handleKeyPress,
    gameState?.guessesSubmitted || [],
    birdle.word,
    gameState?.isGameOver || false
  );

  // Get status for a specific key
  const getKeyStatus = (letter: string) => {
    return keyStatuses.get(letter.toLowerCase()) || 'unused';
  };

  /**
   * Defer disabling the keyboard until after the final tile flip completes.
   *
   * Problem:
   * - `gameState.isGameOver` flips to true immediately on a win, which disables
   *   the keyboard instantly, even though the last row is still animating.
   *
   * Goal:
   * - Keep the keyboard visually/interaction-enabled until the reveal finishes,
   *   then disable it.
   *
   * Notes:
   * - This only affects the on-screen keyboard `Button` disabled state.
   * - Physical keyboard bindings are still controlled inside `useKeyboard` via
   *   its `isGameOver` parameter (left as-is for now).
   */
  const isGameOver = gameState?.isGameOver || false;
  const wonGame = Boolean(gameState?.wonGame);

  // Defer until the final tile flip finishes (kept in sync with Box.tsx via constants).
  const DEFER_DISABLE_MS = REVEAL_TOTAL_MS;

  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(isGameOver);

  // Schedule once per win-completion moment (not on every re-render).
  // `gameState.gameId` is a number (day number), so keep this ref numeric.
  const didScheduleDisableForGameIdRef = useRef<number | null>(null);
  const disableTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any pending timer whenever the gameId changes or we reset.
    if (disableTimerRef.current != null) {
      window.clearTimeout(disableTimerRef.current);
      disableTimerRef.current = null;
    }

    // If the game isn't over, always enable input and reset scheduling guard.
    if (!isGameOver) {
      setIsInputDisabled(false);
      didScheduleDisableForGameIdRef.current = null;
      return;
    }

    // Loss: disable immediately.
    if (!wonGame) {
      setIsInputDisabled(true);
      return;
    }

    // Win: keep enabled through the reveal window, then disable.
    // We only schedule this once per gameId so it doesn't jitter if state updates during reveal.
    const gameId = gameState?.gameId ?? null;
    if (gameId == null) {
      setIsInputDisabled(true);
      return;
    }

    if (didScheduleDisableForGameIdRef.current !== gameId) {
      didScheduleDisableForGameIdRef.current = gameId;
      setIsInputDisabled(false);

      disableTimerRef.current = window.setTimeout(() => {
        setIsInputDisabled(true);
        disableTimerRef.current = null;
      }, DEFER_DISABLE_MS);
      return;
    }

    // While waiting for the scheduled disable, keep enabled.
    setIsInputDisabled(false);
  }, [DEFER_DISABLE_MS, isGameOver, wonGame, gameState?.gameId]);

  // Create stable onClick handlers for each key (prevents inline arrow functions)
  const keyHandlers = useMemo(() => {
    const handlers = new Map<string, () => void>();
    const allKeys = [
      ...KEYBOARD_ROWS[0],
      ...KEYBOARD_ROWS[1],
      ...KEYBOARD_ROWS[2],
    ];
    for (const letter of allKeys) {
      handlers.set(letter, () => handleKeyPress(letter));
    }
    return handlers;
  }, [handleKeyPress]);

  return (
    // biome-ignore lint/a11y/useSemanticElements: intentional, not part of a form
    <div
      className="w-full max-w-xl mx-auto px-2 pb-4"
      role="group"
      aria-label="Virtual keyboard"
    >
      <div className="flex flex-col gap-1">
        {/* Row 1: Q W E R T Y U I O P */}
        <div className="flex justify-center gap-1 flex-row">
          {KEYBOARD_ROWS[0].map((letter) => {
            const handler = keyHandlers.get(letter);
            if (!handler) {
              return null;
            }
            return (
              <Key
                key={letter}
                letter={letter}
                status={getKeyStatus(letter)}
                onClick={handler}
                disabled={isInputDisabled}
              />
            );
          })}
        </div>

        {/* Row 2: A S D F G H J K L */}
        <div className="flex justify-center gap-1 flex-row">
          {KEYBOARD_ROWS[1].map((letter) => {
            const handler = keyHandlers.get(letter);
            if (!handler) {
              return null;
            }
            return (
              <Key
                key={letter}
                letter={letter}
                status={getKeyStatus(letter)}
                onClick={handler}
                disabled={isInputDisabled}
              />
            );
          })}
        </div>

        {/* Row 3: ENTER Z X C V B N M BACKSPACE */}
        <div className="flex justify-center gap-1 flex-row">
          {KEYBOARD_ROWS[2].map((letter) => {
            const handler = keyHandlers.get(letter);
            if (!handler) {
              return null;
            }
            return (
              <Key
                key={letter}
                letter={letter}
                status={
                  letter === 'enter' || letter === 'backspace'
                    ? 'unused'
                    : getKeyStatus(letter)
                }
                onClick={handler}
                size={
                  letter === 'enter' || letter === 'backspace'
                    ? 'large'
                    : 'normal'
                }
                disabled={isInputDisabled}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
