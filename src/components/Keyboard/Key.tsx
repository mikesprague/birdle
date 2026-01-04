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
    size === 'large' ? 'min-w-12 px-2' : 'w-8 md:w-12 sm:w-10 w-8 px-2';

  const interactionClasses =
    status === 'unused' ? 'hover:scale-105 active:scale-95' : '';

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={'ghost'}
      className={cn(
        // Base styles
        'keyboard-key flex rounded uppercase transition-all duration-200',
        // Hover/active interactions (only for unused keys)
        interactionClasses,
        // Text size
        'md:text-xl sm:text-lg text-base leading-6',
        // Height
        'md:h-15 sm:h-13 h-11',
        // Focus styles
        'focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-correct))] focus-visible:ring-offset-2',
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
      return 'ENTER';
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
      return 'bg-[rgb(var(--color-correct))] hover:opacity-90 text-[rgb(var(--color-correct-foreground))] border-[rgb(var(--color-correct))]';
    case 'present':
      return 'bg-[rgb(var(--color-present))] hover:opacity-90 text-[rgb(var(--color-present-foreground))] border-[rgb(var(--color-present))]';
    case 'absent':
      return 'bg-[rgb(var(--color-absent))] hover:opacity-90 text-[rgb(var(--color-absent-foreground))] border-[rgb(var(--color-absent))]';
    case 'unused':
      return 'bg-muted hover:bg-muted/80 text-muted-foreground border-muted';
    default:
      return 'bg-muted hover:bg-muted/80 text-muted-foreground border-muted';
  }
}

Key.displayName = 'Key';
