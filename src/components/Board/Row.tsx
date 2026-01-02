/**
 * Row Component
 *
 * Renders a row of 5 letter boxes in the Birdle game grid.
 * Handles status calculation and animations for the entire row.
 */

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
 * Row component
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
export function Row({
  letters,
  answer,
  rowIndex,
  isCurrentRow = false,
  isSubmitted = false,
  animated = false,
}: RowProps) {
  // Calculate statuses for submitted rows
  const statuses: BoxStatus[] =
    isSubmitted && answer
      ? calculateLetterStatuses(letters.join(''), answer)
      : letters.map((letter) => (letter ? 'empty' : 'empty'));

  return (
    <div
      className="flex gap-1 justify-center"
      data-row-index={rowIndex}
      data-is-current={isCurrentRow}
      data-is-submitted={isSubmitted}
    >
      {letters.map((letter, position) => (
        <Box
          key={`${rowIndex}-${position}`}
          letter={letter}
          status={statuses[position]}
          position={position}
          rowIndex={rowIndex}
          animated={animated && isSubmitted}
        />
      ))}
    </div>
  );
}
