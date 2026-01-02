/**
 * Keyboard Component
 *
 * Renders the complete virtual keyboard with three rows of keys.
 * Integrates with game state and provides visual feedback based on letter usage.
 */

import { useCallback } from 'react';
import type { Store } from 'tinybase';
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
  const { gameState, birdle, handleLetter, deleteLetter, submitGuess } =
    useGameState(store);

  // Handle key press from virtual or physical keyboard
  const handleKeyPress = useCallback(
    (key: string) => {
      if (!gameState || gameState.isGameOver) {
        return;
      }

      if (key === 'enter') {
        submitGuess();
      } else if (key === 'backspace') {
        deleteLetter();
      } else {
        handleLetter(key);
      }
    },
    [gameState, handleLetter, deleteLetter, submitGuess]
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

  const isGameOver = gameState?.isGameOver || false;

  return (
    <div
      className="w-full max-w-xl mx-auto px-2 pb-4"
      role="group"
      aria-label="Virtual keyboard"
    >
      <div className="flex flex-col gap-1">
        {/* Row 1: Q W E R T Y U I O P */}
        <div className="flex justify-center gap-1">
          {KEYBOARD_ROWS[0].map((letter) => (
            <Key
              key={letter}
              letter={letter}
              status={getKeyStatus(letter)}
              onClick={() => handleKeyPress(letter)}
              disabled={isGameOver}
            />
          ))}
        </div>

        {/* Row 2: A S D F G H J K L */}
        <div className="flex justify-center gap-1">
          {KEYBOARD_ROWS[1].map((letter) => (
            <Key
              key={letter}
              letter={letter}
              status={getKeyStatus(letter)}
              onClick={() => handleKeyPress(letter)}
              disabled={isGameOver}
            />
          ))}
        </div>

        {/* Row 3: ENTER Z X C V B N M BACKSPACE */}
        <div className="flex justify-center gap-1">
          {KEYBOARD_ROWS[2].map((letter) => (
            <Key
              key={letter}
              letter={letter}
              status={
                letter === 'enter' || letter === 'backspace'
                  ? 'unused'
                  : getKeyStatus(letter)
              }
              onClick={() => handleKeyPress(letter)}
              size={
                letter === 'enter' || letter === 'backspace'
                  ? 'large'
                  : 'normal'
              }
              disabled={isGameOver}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
