/**
 * Board Component
 *
 * Renders the complete 6x5 Birdle game grid.
 * Displays all 6 rows with appropriate status coloring for submitted guesses.
 */

import { useEffect, useState } from 'react';
import type { Store } from 'tinybase';
import { useGameState } from '@/hooks';
import { Row } from './Row';

export interface BoardProps {
  /** TinyBase store instance */
  store: Store;
}

/**
 * Board component
 *
 * @example
 * <Board store={store} />
 */
export function Board({ store }: BoardProps) {
  const { gameState, birdle } = useGameState(store);
  const [announcement, setAnnouncement] = useState('');

  // Announce game state changes for screen readers
  useEffect(() => {
    if (!gameState) return;

    if (gameState.isGameOver) {
      if (gameState.wonGame) {
        setAnnouncement(
          `Congratulations! You won in ${gameState.currentRow + 1} guesses!`
        );
      } else {
        setAnnouncement(`Game over. The word was ${birdle.word}.`);
      }
    }
  }, [
    gameState?.isGameOver,
    gameState?.wonGame,
    gameState?.currentRow,
    birdle.word,
  ]);

  if (!gameState) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      <div
        className="flex flex-col gap-1 p-4"
        role="grid"
        aria-label="Birdle game board with 6 rows of 5 letter boxes"
      >
        {gameState.guessesRows.map((letters, rowIndex) => {
          const isSubmitted = rowIndex < gameState.guessesSubmitted.length;
          const isCurrentRow = rowIndex === gameState.currentRow;
          const shouldAnimate =
            isSubmitted && rowIndex === gameState.currentRow - 1;

          return (
            <Row
              key={rowIndex}
              letters={letters}
              answer={isSubmitted ? birdle.word : undefined}
              rowIndex={rowIndex}
              isCurrentRow={isCurrentRow}
              isSubmitted={isSubmitted}
              animated={shouldAnimate}
            />
          );
        })}
      </div>
    </>
  );
}
