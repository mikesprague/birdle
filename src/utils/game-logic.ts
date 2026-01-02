/**
 * Core game logic utilities for Birdle
 * Contains pure functions for game mechanics, validation, and word-of-day calculation
 */

import { allowed } from '@/data/allowed';
import { words } from '@/data/words';
import type { BirdleOfDay } from '@/types';

/**
 * Calculate the Birdle word of the day
 * Uses a fixed epoch date (January 0, 2022) to ensure consistency
 *
 * IMPORTANT: This date is the source of truth for the game rotation.
 * Changing it will break game continuity for existing players.
 *
 * @returns BirdleOfDay object with the word and day number
 */
export function getBirdleOfDay(): BirdleOfDay {
  const now = new Date();
  const start = new Date(2022, 0, 0); // January 0, 2022 (Dec 31, 2021)
  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Wrap around if we exceed the word list length
  while (day > words.length) {
    day -= words.length;
  }

  return {
    word: words[day],
    day,
  };
}

/**
 * Check if a guess is valid (exists in words or allowed lists)
 * Case-insensitive comparison
 *
 * @param word - The word to validate
 * @returns true if the word is valid, false otherwise
 */
export function isGuessValid(word: string): boolean {
  const lowerWord = word.toLowerCase();
  return words.includes(lowerWord) || allowed.includes(lowerWord);
}

/**
 * Check if running in development environment
 * Returns true if on localhost or not on production domain
 *
 * @returns true if in development mode
 */
export function isDev(): boolean {
  if (typeof window === 'undefined') return false;

  return isLocal() || window.location.hostname !== 'birdle.app';
}

/**
 * Check if running on localhost
 *
 * @returns true if on localhost or 127.0.0.1
 */
export function isLocal(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
}

/**
 * Success messages based on number of guesses
 * Index corresponds to guess number (0 = 1 guess, 5 = 6 guesses)
 */
export const successStrings = [
  'Genius',
  'Magnificent',
  'Impressive',
  'Splendid',
  'Great',
  'Phew',
] as const;

/**
 * Get success message for a given row number
 *
 * @param row - The row number (0-5)
 * @returns Success message string
 */
export function getSuccessMessage(row: number): string {
  if (row < 0 || row >= successStrings.length) {
    return successStrings[successStrings.length - 1];
  }
  return successStrings[row];
}

/**
 * Bird emojis for celebrations
 */
export const defaultBirds = [
  '🦃',
  '🐔',
  '🐓',
  '🐦',
  '🐧',
  '🕊️',
  '🦅',
  '🦆',
  '🐥',
  '🐣',
  '🐤',
  '🦢',
  '🦉',
  '🦤',
  '🦩',
  '🦜',
] as const;

/**
 * Halloween-themed emojis for seasonal celebrations
 */
export const halloweenEmojis = [
  '👻',
  '🎃',
  '🦇',
  '🕷️',
  '🕸️',
  '🧙‍♀️',
  '🧛‍♂️',
  '🧟‍♀️',
  '🧟‍♂️',
  '👾',
  '👹',
  '💀',
  '☠️',
] as const;

/**
 * Check if current date is in October (Halloween season)
 *
 * @returns true if October
 */
export function isHalloweenSeason(): boolean {
  const now = new Date();
  return now.getMonth() === 9; // October is month 9 (0-indexed)
}

/**
 * Get celebration emojis based on current season
 *
 * @returns Array of emoji strings
 */
export function getCelebrationEmojis(): readonly string[] {
  return isHalloweenSeason() ? halloweenEmojis : defaultBirds;
}

/**
 * Create initial game state for a new game
 *
 * @param gameId - The game ID (day number)
 * @returns Initial GameState object
 */
export function createInitialGameState(gameId: number): {
  gameId: number;
  guessesRows: string[][];
  guessesSubmitted: string[];
  currentRow: number;
  currentGuess: number;
  wonGame: boolean;
  isGameOver: boolean;
  lastPlayedDate: string;
} {
  return {
    gameId,
    guessesRows: Array.from({ length: 6 }, () => Array(5).fill('')),
    guessesSubmitted: [],
    currentRow: 0,
    currentGuess: 0,
    wonGame: false,
    isGameOver: false,
    lastPlayedDate: new Date().toISOString(),
  };
}

/**
 * Create initial stats object
 *
 * @returns Initial Stats object
 */
export function createInitialStats(): {
  currentStreak: number;
  maxStreak: number;
  guesses: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    fail: number;
  };
  winPercentage: number;
  gamesPlayed: number;
  gamesWon: number;
  averageGuesses: number;
} {
  return {
    currentStreak: 0,
    maxStreak: 0,
    guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
    winPercentage: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    averageGuesses: 0,
  };
}

/**
 * Check if two dates are the same day
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if the game state is from today
 *
 * @param lastPlayedDate - ISO string of last played date
 * @param currentGameId - Current game ID
 * @returns true if game is from today
 */
export function isGameFromToday(
  lastPlayedDate: string,
  currentGameId: number
): boolean {
  const lastPlayed = new Date(lastPlayedDate);
  const today = new Date();
  const birdle = getBirdleOfDay();

  return isSameDay(lastPlayed, today) && currentGameId === birdle.day;
}
