/**
 * Color and status calculation utilities for Birdle
 * Pure functions for determining letter and key statuses based on guesses and answers
 */

import type { BoxStatus, KeyStatus, LetterStatus } from '@/types';

/**
 * Calculate the status for each letter in a guess compared to the answer
 * This implements Wordle-style logic:
 * - Correct position letters are marked first
 * - Remaining letters are checked for presence in remaining answer letters
 * - Each letter in the answer can only be "used" once
 *
 * @param guess - The guessed word (5 letters)
 * @param answer - The correct answer (5 letters)
 * @returns Array of BoxStatus for each letter
 *
 * @example
 * calculateLetterStatuses('TRASH', 'SHIRT')
 * // Returns: ['absent', 'correct', 'present', 'absent', 'present']
 * // T=absent, R=correct(pos1), A=present, S=absent, H=present
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

  // First pass: Mark all correct (exact position) letters
  for (let i = 0; i < 5; i++) {
    if (guessLower[i] === answerLower[i]) {
      statuses[i] = 'correct';
      // Remove this letter from remaining answer letters
      remainingAnswer = remainingAnswer.replace(guessLower[i], '');
    }
  }

  // Second pass: Mark present letters (wrong position but in word)
  for (let i = 0; i < 5; i++) {
    // Skip if already marked as correct
    if (statuses[i] === 'correct') {
      continue;
    }

    // Check if letter exists in remaining answer letters
    if (remainingAnswer.includes(guessLower[i])) {
      statuses[i] = 'present';
      // Remove this letter from remaining answer letters
      remainingAnswer = remainingAnswer.replace(guessLower[i], '');
    }
  }

  return statuses;
}

/**
 * Calculate the status for each letter in a guess and return as LetterStatus array
 *
 * @param guess - The guessed word (5 letters)
 * @param answer - The correct answer (5 letters)
 * @returns Array of LetterStatus objects
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
 * Calculate keyboard key statuses based on all guesses made so far
 * Priority order: correct > present > absent > unused
 *
 * @param guesses - Array of guessed words
 * @param answer - The correct answer
 * @returns Map of letter to KeyStatus
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
      const newStatus = letterStatuses[i];
      const currentStatus = keyStatuses.get(letter);

      // Update key status based on priority: correct > present > absent
      if (
        !currentStatus ||
        getStatusPriority(newStatus) > getStatusPriority(currentStatus)
      ) {
        keyStatuses.set(letter, newStatus as KeyStatus);
      }
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
