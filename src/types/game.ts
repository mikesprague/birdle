/**
 * Core game types and interfaces for Birdle
 * These types define the shape of game state, statistics, and UI elements
 */

/**
 * Status of a letter box in the game grid
 */
export type BoxStatus = 'correct' | 'present' | 'absent' | 'empty';

/**
 * Status of a key on the keyboard
 */
export type KeyStatus = 'correct' | 'present' | 'absent' | 'unused';

/**
 * A single guess row - array of 5 letters
 */
export type GuessRow = string[];

/**
 * Complete game state
 */
export interface GameState {
  /** Unique game ID (day number) */
  gameId: number;

  /** All guess rows (6 rows of 5 letters each) */
  guessesRows: GuessRow[];

  /** Array of completed guess words */
  guessesSubmitted: string[];

  /** Current row being played (0-5) */
  currentRow: number;

  /** Current column/position in the row (0-4) */
  currentGuess: number;

  /** Whether the player won the game */
  wonGame: boolean;

  /** Whether the game is over (won or lost) */
  isGameOver: boolean;

  /** Last date the game was played (ISO string) */
  lastPlayedDate: string;
}

/**
 * Player statistics
 */
export interface Stats {
  /** Current win streak */
  currentStreak: number;

  /** Maximum win streak achieved */
  maxStreak: number;

  /** Distribution of guesses (how many games won in each number of guesses) */
  guesses: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    fail: number;
  };

  /** Win percentage (0-100) */
  winPercentage: number;

  /** Total games played */
  gamesPlayed: number;

  /** Total games won */
  gamesWon: number;

  /** Average number of guesses to win */
  averageGuesses: number;

  /**
   * Last gameId that was already counted into these aggregate stats.
   * Used to prevent incrementing stats multiple times across reloads.
   */
  lastCountedGameId?: number;
}

/**
 * The Birdle word of the day
 */
export interface BirdleOfDay {
  /** The answer word */
  word: string;

  /** Day number since epoch */
  day: number;
}

/**
 * Theme options
 */
export type Theme = 'dark' | 'light' | 'system';

/**
 * App settings/preferences
 */
export interface AppSettings {
  /** Theme preference */
  theme: Theme;

  /** Whether to show instructions on first load */
  showInstructions: boolean;
}

/**
 * Keyboard key definition
 */
export interface KeyDef {
  /** Key value/label */
  key: string;

  /** Current status of the key */
  status: KeyStatus;
}

/**
 * Letter with its calculated status
 */
export interface LetterStatus {
  /** The letter */
  letter: string;

  /** The status color */
  status: BoxStatus;
}
