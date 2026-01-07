/**
 * Key Component
 *
 * Renders a single key on the virtual keyboard.
 * Displays appropriate colors based on letter status and handles click events.
 */

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { KeyStatus } from '@/types';

export interface KeyProps {
  /** The key value (letter, 'enter', or 'backspace') */
  letter: string;

  /** Status of the key based on guesses */
  status: KeyStatus;

  /** Click handler */
  onClick: () => void;

  /** Size variant */
  size?: 'normal' | 'large';

  /** Whether the key is disabled */
  disabled?: boolean;
}

/**
 * Key component (memoized to prevent unnecessary re-renders)
 *
 * @example
 * <Key letter="a" status="correct" onClick={() => handleLetter('a')} />
 */
export const Key = memo(function Key({
  letter,
  status,
  onClick,
  size = 'normal',
  disabled = false,
}: KeyProps) {
  // Get display label for special keys
  const label = getKeyLabel(letter);

  // Get status-specific styles
  const statusClasses = getStatusClasses(status);

  // Size classes
  const sizeClasses =
    size === 'large'
      ? 'w-15 sm:w-17 md:w-19 px-1 sm:px-2 font-bold'
      : 'w-9 sm:w-11 md:w-13 px-1 sm:px-2 font-bold';

  const interactionClasses =
    status === 'unused'
      ? 'hover:scale-105 hover:brightness-75 dark:hover:brightness-200 active:scale-95'
      : '';

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={'default'}
      className={cn(
        // Base styles
        'keyboard-key flex rounded uppercase transition-all duration-200',
        // Hover/active interactions (only for unused keys)
        interactionClasses,
        // Text size
        'md:text-lg sm:text-base text-sm leading-8 font-normal',
        // Height
        'md:h-17 sm:h-15 h-13',
        // Focus styles
        'focus-visible:ring-2 focus-visible:ring-offset-2',
        // Size classes
        sizeClasses,
        statusClasses
      )}
      data-key={letter}
      data-status={status}
      aria-label={`Key ${label}`}
    >
      {label}
    </Button>
  );
});

/**
 * Get display label for key
 */
function getKeyLabel(letter: string): string {
  switch (letter) {
    case 'enter':
      return '⏎';
    case 'backspace':
      return '⌫';
    default:
      return letter.toUpperCase();
  }
}

/**
 * Get Tailwind classes for key status
 * Uses CSS custom properties for consistent theming
 */
function getStatusClasses(status: KeyStatus): string {
  switch (status) {
    case 'correct':
      return 'bg-[var(--color-correct)] hover:opacity-90 text-[var(--color-correct-foreground)] border-[var(--color-correct)]';
    case 'present':
      return 'bg-[var(--color-present)] hover:opacity-90 text-[var(--color-present-foreground)] border-[var(--color-present)]';
    case 'absent':
      return 'bg-[var(--color-absent)] hover:opacity-90 text-[var(--color-absent-foreground)] border-[var(--color-absent)]';
    case 'unused':
      return 'bg-[var(--color-empty)] hover:bg-[var(--color-empty)]/80 text-[var(--color-absent-foreground)] border-[var(--color-empty)]';
    default:
      return 'bg-[var(--color-empty)] hover:bg-[var(--color-empty)]/80 text-[var(--color-absent-foreground)] border-[var(--color-empty)]';
  }
}

Key.displayName = 'Key';
