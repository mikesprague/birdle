/**
 * Board Component
 *
 * Renders the complete 6x5 Birdle game grid.
 * Displays all 6 rows with appropriate status coloring for submitted guesses.
 */

import { useEffect, useMemo, useState } from 'react';
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

  // Memoize row props to prevent recalculation on every render
  const rowsData = useMemo(
    () =>
      gameState?.guessesRows.map((letters, rowIndex) => ({
        letters,
        rowIndex,
        isSubmitted: rowIndex < (gameState?.guessesSubmitted.length ?? 0),
        isCurrentRow: rowIndex === (gameState?.currentRow ?? 0),
        shouldAnimate:
          rowIndex < (gameState?.guessesSubmitted.length ?? 0) &&
          rowIndex === (gameState?.currentRow ?? 0) - 1,
        answer:
          rowIndex < (gameState?.guessesSubmitted.length ?? 0)
            ? birdle.word
            : undefined,
      })) ?? [],
    [
      gameState?.guessesRows,
      gameState?.guessesSubmitted.length,
      gameState?.currentRow,
      birdle.word,
    ]
  );

  // Announce game state changes for screen readers
  useEffect(() => {
    if (!gameState) {
      return;
    }

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
    gameState,
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
        className="flex flex-col gap-1 md:gap-1.5 py-2"
        role="grid"
        aria-label="Birdle game board with 6 rows of 5 letter boxes"
      >
        {rowsData.map((row) => (
          <Row
            key={`row-${row.rowIndex}`}
            letters={row.letters}
            answer={row.answer}
            rowIndex={row.rowIndex}
            isCurrentRow={row.isCurrentRow}
            isSubmitted={row.isSubmitted}
            animated={row.shouldAnimate}
          />
        ))}
      </div>
    </>
  );
}
