/**
 * Box Component
 *
 * Renders a single letter box in the Birdle game grid.
 * Displays a letter with appropriate status coloring and animations.
 *
 * UX note:
 * - For the reveal flip animation, we render two faces:
 *   - Front face: neutral tile styling (no status color)
 *   - Back face: status styling (correct/present/absent)
 *   This ensures the status color is only revealed during the flip (mid-animation),
 *   instead of appearing before the flip starts.
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
  const isRevealing = animated && status !== 'empty';

  // Front face is always neutral (no status color)
  const frontFaceClasses = getFrontFaceClasses();

  // Back face uses the status color
  const backFaceClasses = getBackFaceClasses(status);

  // During reveal animation, we keep the outer container neutral and do the 3D flip.
  // When not revealing, we render a single-face tile (back face) so it looks normal.
  const outerStatusClasses = isRevealing ? frontFaceClasses : backFaceClasses;

  // Animation classes
  const animationClasses = isRevealing
    ? 'box-flip'
    : letter && status === 'empty'
      ? 'box-pop'
      : '';

  // Animation delay for cascade effect:
  // Flip animation is 0.5s in CSS, so stagger by 500ms to ensure one box finishes
  // before the next begins (sequential reveal).
  const animationDelay = isRevealing ? `${position * 500}ms` : '0ms';

  return (
    <div
      className={cn(
        // Base styles
        'relative uppercase',
        // Size + typography
        'h-15 w-15 text-4xl font-semibold',
        'sm:h-17 sm:w-17 sm:text-4xl font-bold',
        'md:h-18 md:w-18 md:text-4xl font-bold',
        // 3D flip container
        'box-3d',
        // Status styles (neutral during reveal)
        outerStatusClasses,
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
      {isRevealing ? (
        <>
          <div className={cn('box-face box-face-front', frontFaceClasses)}>
            {letter}
          </div>
          <div className={cn('box-face box-face-back', backFaceClasses)}>
            {letter}
          </div>
        </>
      ) : (
        <div className={cn('box-face box-face-front', backFaceClasses)}>
          {letter}
        </div>
      )}
    </div>
  );
});

/**
 * Neutral (pre-reveal) tile face styling.
 * This matches the "unrevealed but filled" look (Option A).
 */
function getFrontFaceClasses(): string {
  return 'flex items-center justify-center border-2 border-[rgb(var(--color-empty))] bg-transparent text-foreground';
}

/**
 * Revealed (status) tile face styling.
 */
function getBackFaceClasses(status: BoxStatus): string {
  switch (status) {
    case 'correct':
      return 'flex items-center justify-center border-2 border-[rgb(var(--color-correct))] bg-[rgb(var(--color-correct))] text-[rgb(var(--color-correct-foreground))]';
    case 'present':
      return 'flex items-center justify-center border-2 border-[rgb(var(--color-present))] bg-[rgb(var(--color-present))] text-[rgb(var(--color-present-foreground))]';
    case 'absent':
      return 'flex items-center justify-center border-2 border-[rgb(var(--color-absent))] bg-[rgb(var(--color-absent))] text-[rgb(var(--color-absent-foreground))]';
    case 'empty':
    default:
      return 'flex items-center justify-center border-2 border-[rgb(var(--color-empty))] bg-transparent text-foreground';
  }
}

Box.displayName = 'Box';
