/**
 * useKeyboard Hook
 *
 * Handles keyboard input for the game, including both physical keyboard
 * and on-screen keyboard. Calculates key statuses based on submitted guesses.
 */

import { bindKey, unbindKey } from '@rwh/keystrokes';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { KeyStatus } from '@/types';
import { calculateKeyboardStatuses } from '@/utils';

/**
 * Hook return type
 */
export interface UseKeyboardReturn {
  /** Map of letter to key status */
  keyStatuses: Map<string, KeyStatus>;
}

/**
 * useKeyboard hook
 *
 * @param onKeyPress - Callback when a key is pressed
 * @param guesses - Array of submitted guesses
 * @param answer - The correct answer word
 * @param isGameOver - Whether the game is over (disable input)
 * @returns Key statuses for keyboard rendering
 *
 * @example
 * const { keyStatuses } = useKeyboard(
 *   handleKeyPress,
 *   gameState.guessesSubmitted,
 *   birdle.word,
 *   gameState.isGameOver
 * );
 */
export function useKeyboard(
  onKeyPress: (key: string) => void,
  guesses: string[],
  answer: string,
  isGameOver = false
): UseKeyboardReturn {
  // Calculate keyboard key statuses based on submitted guesses
  const keyStatuses = useMemo(() => {
    return calculateKeyboardStatuses(guesses, answer);
  }, [guesses, answer]);

  // Use ref to store the callback to avoid rebinding keys
  const onKeyPressRef = useRef(onKeyPress);

  // Update ref when callback changes
  useEffect(() => {
    onKeyPressRef.current = onKeyPress;
  }, [onKeyPress]);

  // Stable handler that uses the ref
  const handleKeyPress = useCallback((key: string) => {
    onKeyPressRef.current(key);
  }, []);

  // Setup physical keyboard bindings (only once)
  useEffect(() => {
    // Don't bind keys if game is over
    if (isGameOver) {
      return;
    }

    // Bind letter keys (a-z)
    const letterKeys: string[] = [];
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i).toLowerCase();
      letterKeys.push(letter);

      bindKey(letter, () => {
        handleKeyPress(letter);
      });
    }

    // Bind Enter key
    bindKey('Enter', () => {
      handleKeyPress('enter');
    });

    // Bind Backspace key
    bindKey('Backspace', () => {
      handleKeyPress('backspace');
    });

    // Cleanup: unbind all keys on unmount or when game ends
    return () => {
      for (const key of letterKeys) {
        unbindKey(key);
      }
      unbindKey('Enter');
      unbindKey('Backspace');
    };
  }, [isGameOver, handleKeyPress]);

  return {
    keyStatuses,
  };
}

/**
 * Default keyboard layout
 * Used by Keyboard component for rendering
 */
export const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
] as const;
