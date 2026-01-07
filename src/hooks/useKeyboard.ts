/**
 * useKeyboard Hook
 *
 * Handles keyboard input for the game, including both physical keyboard
 * and on-screen keyboard. Calculates key statuses based on submitted guesses.
 *
 * UX: incremental keyboard reveal
 * - When a guess is submitted, tiles flip one-by-one revealing statuses.
 * - The keyboard should update in the same cadence to avoid "spoiling" results early.
 */

import { bindKey, unbindKey } from '@rwh/keystrokes';
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { KEYBOARD_REVEAL_STEP_MS } from '@/constants/revealTiming';
import type { KeyStatus } from '@/types';
import { calculateKeyboardStatuses } from '@/utils';
import { calculateLetterStatuses, mergeKeyStatus } from '@/utils/colors';

/**
 * Return whether a KeyboardEvent should be ignored for game input.
 *
 * We ignore common browser/system shortcuts (Cmd/Ctrl combos) so they don't
 * accidentally type into the game (e.g. Cmd+R / Ctrl+R for reload).
 *
 * Exception:
 * - Cmd/Ctrl+Backspace is treated as an in-game "clear row" command.
 */
function shouldIgnoreKeyEvent(event: KeyboardEvent): boolean {
  // Ignore IME composition keystrokes.
  if (event.isComposing) {
    return true;
  }

  // Allow Cmd/Ctrl+Backspace through so we can implement "clear row".
  if (
    (event.metaKey || event.ctrlKey) &&
    event.key.toLowerCase() === 'backspace'
  ) {
    return false;
  }

  // If any modifier is held, treat it as a shortcut chord and ignore.
  // This prevents Cmd/Ctrl+<letter> from typing letters into the grid.
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return true;
  }

  // Shift is special: it is required to type many characters and should not
  // globally disable input. We do not ignore shift-only combos.
  return false;
}

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
  // Flip reveal timing: centralized so keyboard stays in sync with tile flips + post-reveal UX.
  const REVEAL_STEP_MS = KEYBOARD_REVEAL_STEP_MS;

  /**
   * Reveal state:
   * - revealedGuessCount: number of whole guesses fully revealed on the keyboard.
   * - revealedTilesInCurrentGuess: number of tiles (0-5) revealed for the next guess (if any).
   */
  const [revealedGuessCount, setRevealedGuessCount] = useState<number>(0);
  const [revealedTilesInCurrentGuess, setRevealedTilesInCurrentGuess] =
    useState<number>(0);

  // Track scheduled timers so we can cancel on changes/unmount.
  const revealTimersRef = useRef<number[]>([]);

  // Ensure we don't re-run the initial mount snap more than once.
  const hasInitializedRevealRef = useRef<boolean>(false);

  /**
   * Stable key-press handler that always reads the latest `onKeyPress`.
   *
   * This is the React 19+ replacement for the old "ref + effect" pattern used to
   * avoid stale closures in effects and avoid rebinding listeners.
   *
   * NOTE: Effect Events must only be *invoked* from inside Effects.
   */
  const handleKeyPress = useEffectEvent((key: string) => {
    onKeyPress(key);
  });

  // Global capture listener to ignore modifier shortcuts before keystrokes processes them.
  // We use capture so we can stop propagation early for Cmd/Ctrl combos (e.g. Cmd+R).
  useEffect(() => {
    if (isGameOver) {
      return;
    }

    const onKeyDownCapture = (event: KeyboardEvent) => {
      const isClearRowCombo =
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'backspace';

      if (isClearRowCombo) {
        // Treat Cmd/Ctrl+Backspace as an explicit in-game command.
        // We *do* preventDefault here to avoid browser/system "delete line" behaviors
        // and to keep the UX consistent across platforms.
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        handleKeyPress('clear-row');
        return;
      }

      if (!shouldIgnoreKeyEvent(event)) {
        return;
      }

      // Prevent the keystrokes library listener (and our bindKey handlers) from seeing this.
      // We intentionally do NOT call preventDefault so browser shortcuts (reload, etc.) still work.
      event.stopImmediatePropagation();
      event.stopPropagation();
    };

    window.addEventListener('keydown', onKeyDownCapture, { capture: true });

    return () => {
      window.removeEventListener('keydown', onKeyDownCapture, {
        capture: true,
      });
    };
  }, [isGameOver]);

  // Incremental keyboard reveal: reveal one tile per 0.5s for a newly submitted guess.
  useEffect(() => {
    // Clear any pending timeouts
    for (const id of revealTimersRef.current) {
      window.clearTimeout(id);
    }
    revealTimersRef.current = [];

    // On mount (or reload with existing guesses), don't animate: show everything immediately.
    if (!hasInitializedRevealRef.current) {
      hasInitializedRevealRef.current = true;
      setRevealedGuessCount(guesses.length);
      setRevealedTilesInCurrentGuess(0);
      return;
    }

    // If guesses were reset or reduced, snap back.
    if (guesses.length < revealedGuessCount) {
      setRevealedGuessCount(guesses.length);
      setRevealedTilesInCurrentGuess(0);
      return;
    }

    // If no new guess was added, nothing to do.
    if (guesses.length <= revealedGuessCount) {
      return;
    }

    // New guess submitted: schedule 5 steps, one per tile flip.
    setRevealedTilesInCurrentGuess(0);

    for (let step = 1; step <= 5; step++) {
      const id = window.setTimeout(() => {
        setRevealedTilesInCurrentGuess(step);

        if (step === 5) {
          setRevealedGuessCount((prev) => Math.min(prev + 1, guesses.length));
          setRevealedTilesInCurrentGuess(0);
        }
      }, REVEAL_STEP_MS * step);
      revealTimersRef.current.push(id);
    }

    return () => {
      for (const id of revealTimersRef.current) {
        window.clearTimeout(id);
      }
      revealTimersRef.current = [];
    };
  }, [guesses, revealedGuessCount, REVEAL_STEP_MS]);

  // Calculate keyboard key statuses based on progressively revealed guesses.
  const keyStatuses = useMemo(() => {
    const fullyRevealedGuesses = guesses.slice(0, revealedGuessCount);

    // Start from the fully revealed state (existing behavior)
    const baseMap = calculateKeyboardStatuses(fullyRevealedGuesses, answer);

    // If we're in the middle of revealing the next guess, apply letter-by-letter updates.
    if (revealedTilesInCurrentGuess <= 0) {
      return baseMap;
    }

    const inProgressIndex = revealedGuessCount;
    if (inProgressIndex >= guesses.length) {
      return baseMap;
    }

    const guess = guesses[inProgressIndex];
    const statuses = calculateLetterStatuses(guess, answer);
    const lettersToReveal = Math.min(
      5,
      Math.max(0, revealedTilesInCurrentGuess)
    );

    for (let i = 0; i < lettersToReveal; i++) {
      const letter = guess[i]?.toLowerCase();
      if (!letter) {
        continue;
      }

      const incoming = statuses[i] as KeyStatus;
      const current = baseMap.get(letter);
      baseMap.set(letter, mergeKeyStatus(current, incoming));
    }

    return baseMap;
  }, [answer, guesses, revealedGuessCount, revealedTilesInCurrentGuess]);

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
  }, [isGameOver]);

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
