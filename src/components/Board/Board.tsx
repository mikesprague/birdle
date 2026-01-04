/**
 * Board Component
 *
 * Renders the complete 6x5 Birdle game grid.
 * Displays all 6 rows with appropriate status coloring for submitted guesses.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
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

  // Track the last submitted-guess count we animated in this session to avoid
  // replaying the flip animation after a page reload or re-mount.
  const lastAnimatedSubmittedCountRef = useRef<number>(-1);

  // Memoize row props to prevent recalculation on every render
  const rowsData = useMemo(() => {
    const submittedCount = gameState?.guessesSubmitted.length ?? 0;

    // Only animate when we observe a brand-new submission in this session.
    // If the board mounts with existing submissions (e.g., after reload),
    // we "prime" the ref so no historical rows animate.
    const hasSeenAnySubmission = lastAnimatedSubmittedCountRef.current !== -1;
    if (!hasSeenAnySubmission) {
      lastAnimatedSubmittedCountRef.current = submittedCount;
    }

    const shouldAnimateLatestSubmission =
      submittedCount > 0 &&
      lastAnimatedSubmittedCountRef.current === submittedCount - 1;

    return (
      gameState?.guessesRows.map((letters, rowIndex) => ({
        letters,
        rowIndex,
        isSubmitted: rowIndex < submittedCount,
        isCurrentRow: rowIndex === (gameState?.currentRow ?? 0),
        shouldAnimate:
          shouldAnimateLatestSubmission && rowIndex === submittedCount - 1,
        answer: rowIndex < submittedCount ? birdle.word : undefined,
      })) ?? []
    );
  }, [
    gameState?.guessesRows,
    gameState?.guessesSubmitted.length,
    gameState?.currentRow,
    birdle.word,
  ]);

  // Announce game state changes for screen readers
  useEffect(() => {
    if (!gameState) {
      return;
    }

    // When a new guess is submitted in this session, allow the latest row to animate exactly once.
    // This avoids re-animating historical rows on reload/re-mount while still animating new submissions.
    const submittedCount = gameState.guessesSubmitted.length;
    if (
      submittedCount > 0 &&
      lastAnimatedSubmittedCountRef.current === submittedCount - 1
    ) {
      lastAnimatedSubmittedCountRef.current = submittedCount;
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
    gameState?.guessesSubmitted.length,
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
      <output aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </output>

      <div className="flex flex-col gap-1 md:gap-1.5 py-2">
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
