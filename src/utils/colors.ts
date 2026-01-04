/**
 * Game colors and status calculation utilities
 *
 * Contains functions to calculate letter statuses for guesses,
 * keyboard key statuses, and status priority for comparisons.
 */

import type { BoxStatus, KeyStatus, LetterStatus } from '@/types';

/**
 * Calculate letter statuses for a guess compared to the answer
 *
 * @param guess - The guessed word
 * @param answer - The correct answer
 * @returns Array of statuses for each letter
 *
 * @example
 * calculateLetterStatuses('TRASH', 'SHIRT')
 * // Returns ['present', 'present', 'absent', 'absent', 'present']
 */
export function calculateLetterStatuses(
  guess: string,
  answer: string
): BoxStatus[] {
  const guessLower = guess.toLowerCase();
  const answerLower = answer.toLowerCase();
  const statuses: BoxStatus[] = Array(5).fill('absent');

  // Track which letters in the answer have been used
  let remainingAnswer = answerLower;

  // First pass: mark correct letters
  for (let i = 0; i < guessLower.length; i++) {
    if (guessLower[i] === answerLower[i]) {
      statuses[i] = 'correct';
      // Remove this letter from remaining answer
      remainingAnswer =
        remainingAnswer.slice(0, i) + '_' + remainingAnswer.slice(i + 1);
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < guessLower.length; i++) {
    if (statuses[i] === 'correct') {
      continue;
    }

    const letter = guessLower[i];
    const index = remainingAnswer.indexOf(letter);

    if (index !== -1) {
      statuses[i] = 'present';
      // Remove this letter from remaining answer
      remainingAnswer =
        remainingAnswer.slice(0, index) +
        '_' +
        remainingAnswer.slice(index + 1);
    }
  }

  return statuses;
}

/**
 * Calculate guess with individual letter statuses
 *
 * @param guess - The guessed word
 * @param answer - The correct answer
 * @returns Array of letter objects with status
 */
export function calculateGuessWithStatuses(
  guess: string,
  answer: string
): LetterStatus[] {
  const statuses = calculateLetterStatuses(guess, answer);
  const guessLower = guess.toLowerCase();

  return statuses.map((status, index) => ({
    letter: guessLower[index],
    status,
  }));
}

/**
 * Merge a key's current status with an incoming status using Wordle-style precedence:
 * correct > present > absent > unused.
 *
 * This is used to support incremental keyboard reveals without ever "downgrading"
 * a key that has already reached a higher confidence status.
 *
 * @param current - Existing status for the key (if any)
 * @param incoming - New status to merge in
 * @returns The merged status
 */
export function mergeKeyStatus(
  current: KeyStatus | undefined,
  incoming: KeyStatus
): KeyStatus {
  if (!current) {
    return incoming;
  }

  return getStatusPriority(incoming) > getStatusPriority(current)
    ? incoming
    : current;
}

/**
 * Calculate keyboard key statuses based on all guesses
 *
 * @param guesses - Array of guessed words
 * @param answer - The correct answer
 * @returns Map of letter to status
 *
 * @example
 * calculateKeyboardStatuses(['TRASH', 'SHIRT'], 'SHIRT')
 * // Returns Map with:
 * // 't' -> 'absent', 'r' -> 'correct', 'a' -> 'present', etc.
 */
export function calculateKeyboardStatuses(
  guesses: string[],
  answer: string
): Map<string, KeyStatus> {
  const keyStatuses = new Map<string, KeyStatus>();

  for (const guess of guesses) {
    const letterStatuses = calculateLetterStatuses(guess, answer);
    const guessLower = guess.toLowerCase();

    for (let i = 0; i < guessLower.length; i++) {
      const letter = guessLower[i];
      const newStatus = letterStatuses[i] as KeyStatus;
      const currentStatus = keyStatuses.get(letter);

      keyStatuses.set(letter, mergeKeyStatus(currentStatus, newStatus));
    }
  }

  return keyStatuses;
}

/**
 * Get numeric priority for status comparison
 * Higher number = higher priority
 *
 * @param status - The status to get priority for
 * @returns Priority number
 */
function getStatusPriority(status: BoxStatus | KeyStatus): number {
  switch (status) {
    case 'correct':
      return 3;
    case 'present':
      return 2;
    case 'absent':
      return 1;
    case 'empty':
    case 'unused':
      return 0;
    default:
      return 0;
  }
}

/**
 * Convert BoxStatus to CSS class name for styling
 *
 * @param status - The box status
 * @returns CSS class name
 */
export function getStatusClassName(status: BoxStatus | KeyStatus): string {
  switch (status) {
    case 'correct':
      return 'correct-overlay';
    case 'present':
      return 'present-overlay';
    case 'absent':
      return 'absent-overlay';
    case 'empty':
      return 'empty';
    case 'unused':
      return 'unused';
    default:
      return '';
  }
}

/**
 * Get Tailwind CSS classes for a box status
 *
 * @param status - The box status
 * @returns Tailwind CSS class string
 */
export function getBoxStatusClasses(status: BoxStatus): string {
  const baseClasses = 'transition-colors duration-300';

  switch (status) {
    case 'correct':
      return `${baseClasses} bg-green-600 border-green-600 text-white`;
    case 'present':
      return `${baseClasses} bg-yellow-600 border-yellow-600 text-white`;
    case 'absent':
      return `${baseClasses} bg-gray-600 border-gray-600 text-white`;
    case 'empty':
      return `${baseClasses} bg-transparent border-gray-400 dark:border-gray-600`;
    default:
      return baseClasses;
  }
}

/**
 * Get Tailwind CSS classes for a key status
 *
 * @param status - The key status
 * @returns Tailwind CSS class string
 */
export function getKeyStatusClasses(status: KeyStatus): string {
  const baseClasses = 'transition-colors duration-200';

  switch (status) {
    case 'correct':
      return `${baseClasses} bg-green-600 hover:bg-green-700 text-white`;
    case 'present':
      return `${baseClasses} bg-yellow-600 hover:bg-yellow-700 text-white`;
    case 'absent':
      return `${baseClasses} bg-gray-600 hover:bg-gray-700 text-white`;
    case 'unused':
      return `${baseClasses} bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white`;
    default:
      return baseClasses;
  }
}

/**
 * Check if a guess is completely correct
 *
 * @param guess - The guessed word
 * @param answer - The correct answer
 * @returns true if guess matches answer
 */
export function isGuessCorrect(guess: string, answer: string): boolean {
  return guess.toLowerCase() === answer.toLowerCase();
}

/**
 * Calculate row status for animations
 * Returns 'correct' if all letters are correct, 'partial' if some are correct/present, 'wrong' otherwise
 *
 * @param guess - The guessed word
 * @param answer - The correct answer
 * @returns Row status
 */
export function getRowStatus(
  guess: string,
  answer: string
): 'correct' | 'partial' | 'wrong' {
  if (isGuessCorrect(guess, answer)) {
    return 'correct';
  }

  const statuses = calculateLetterStatuses(guess, answer);
  const hasCorrectOrPresent = statuses.some(
    (s) => s === 'correct' || s === 'present'
  );

  return hasCorrectOrPresent ? 'partial' : 'wrong';
}
