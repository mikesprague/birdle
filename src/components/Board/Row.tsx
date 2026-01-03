/**
 * Row Component
 *
 * Renders a row of 5 letter boxes in the Birdle game grid.
 * Handles status calculation and animations for the entire row.
 */

import { memo, useMemo } from 'react';
import type { BoxStatus } from '@/types';
import { calculateLetterStatuses } from '@/utils';
import { Box } from './Box';

export interface RowProps {
  /** Array of 5 letters */
  letters: string[];

  /** The correct answer word (for status calculation) */
  answer?: string;

  /** Row index (0-5) */
  rowIndex: number;

  /** Whether this is the current active row */
  isCurrentRow?: boolean;

  /** Whether this row has been submitted */
  isSubmitted?: boolean;

  /** Whether to animate the reveal */
  animated?: boolean;
}

/**
 * Row component (memoized to prevent unnecessary re-renders)
 *
 * @example
 * <Row
 *   letters={['h', 'e', 'l', 'l', 'o']}
 *   answer="hello"
 *   rowIndex={0}
 *   isSubmitted={true}
 *   animated={true}
 * />
 */
export const Row = memo(function Row({
  letters,
  answer,
  rowIndex,
  isCurrentRow = false,
  isSubmitted = false,
  animated = false,
}: RowProps) {
  // Calculate statuses for submitted rows (memoized)
  const statuses: BoxStatus[] = useMemo(() => {
    if (isSubmitted && answer) {
      return calculateLetterStatuses(letters.join(''), answer);
    }
    return letters.map((letter) => (letter ? 'empty' : 'empty'));
  }, [isSubmitted, answer, letters]);

  return (
    <div
      className="flex gap-1 md:gap-1.5 justify-center"
      data-row-index={rowIndex}
      data-is-current={isCurrentRow}
      data-is-submitted={isSubmitted}
    >
      {letters.map((letter, position) => (
        <Box
          // biome-ignore lint/suspicious/noArrayIndexKey: Position is stable within row (boxes don't reorder)
          key={position}
          letter={letter}
          status={statuses[position]}
          position={position}
          rowIndex={rowIndex}
          animated={animated && isSubmitted}
        />
      ))}
    </div>
  );
});

Row.displayName = 'Row';
