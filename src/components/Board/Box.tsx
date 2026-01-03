/**
 * Box Component
 *
 * Renders a single letter box in the Birdle game grid.
 * Displays a letter with appropriate status coloring and animations.
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { BoxStatus } from '@/types';

export interface BoxProps {
  /** Letter to display (empty string for empty box) */
  letter: string;

  /** Status of the box (correct/present/absent/empty) */
  status: BoxStatus;

  /** Position in the row (0-4) */
  position: number;

  /** Row index (0-5) */
  rowIndex: number;

  /** Whether to animate the reveal */
  animated?: boolean;
}

/**
 * Box component (memoized to prevent unnecessary re-renders)
 *
 * @example
 * <Box letter="a" status="correct" position={0} rowIndex={0} />
 */
export const Box = memo(function Box({
  letter,
  status,
  position,
  rowIndex,
  animated = false,
}: BoxProps) {
  // Get status-specific styles
  const statusClasses = getStatusClasses(status);

  // Animation classes
  const animationClasses = animated
    ? 'animate-flip-in'
    : letter && status === 'empty'
      ? 'animate-pop'
      : '';

  // Animation delay for cascade effect
  const animationDelay = animated ? `${position * 100}ms` : '0ms';

  return (
    <div
      className={cn(
        // Base styles
        'relative flex items-center justify-center',
        'border-2 uppercase transition-all duration-300',
        'h-15 w-15 text-4xl font-semibold',
        'sm:h-17 sm:w-17 sm:text-4xl font-bold',
        'md:h-18 md:w-18 md:text-4xl font-bold',
        // Status-specific styles
        statusClasses,
        // Animation classes
        animationClasses
      )}
      style={{
        animationDelay,
      }}
      data-letter={letter}
      data-status={status}
      data-position={position}
      data-row={rowIndex}
    >
      {letter}
    </div>
  );
});

/**
 * Get Tailwind classes for box status
 * Uses CSS custom properties for consistent theming
 */
function getStatusClasses(status: BoxStatus): string {
  switch (status) {
    case 'correct':
      return 'border-[rgb(var(--color-correct))] bg-[rgb(var(--color-correct))] text-[rgb(var(--color-correct-foreground))]';
    case 'present':
      return 'border-[rgb(var(--color-present))] bg-[rgb(var(--color-present))] text-[rgb(var(--color-present-foreground))]';
    case 'absent':
      return 'border-[rgb(var(--color-absent))] bg-[rgb(var(--color-absent))] text-[rgb(var(--color-absent-foreground))]';
    case 'empty':
      return 'border-[rgb(var(--color-empty))] bg-transparent text-foreground';
    default:
      return 'border-[rgb(var(--color-empty))] bg-transparent text-foreground';
  }
}

Box.displayName = 'Box';
