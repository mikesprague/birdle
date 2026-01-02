/**
 * Share functionality utilities for Birdle
 * Handles creating shareable text and using native share API or clipboard fallback
 */

import type { GameState } from '@/types';
import { calculateLetterStatuses } from './colors';

/**
 * Emojis for share text
 */
const SHARE_EMOJIS = {
  absent: '🥚',
  present: '🐣',
  correct: '🐥',
} as const;

/**
 * Create shareable text representation of game results
 * Generates emoji grid showing guess patterns
 *
 * @param gameState - Current game state
 * @param answer - The correct answer word
 * @returns Formatted share text with emoji grid
 *
 * @example
 * // Returns something like:
 * // Birdle 123 3/6
 * //
 * // 🥚🐣🥚🥚🐥
 * // 🐥🐥🥚🐣🐥
 * // 🐥🐥🐥🐥🐥
 */
export function createShareText(gameState: GameState, answer: string): string {
  const { gameId, currentRow, wonGame, isGameOver, guessesSubmitted } =
    gameState;

  // Determine final row (0-indexed to 1-indexed for display)
  const finalRow = currentRow >= 5 ? 6 : currentRow + 1;

  // Create header: "Birdle 123 3/6" or "Birdle 123 X/6" (for loss)
  const scoreText =
    wonGame || (isGameOver && currentRow < 5) ? `${finalRow}/6` : 'X/6';
  const header = `Birdle ${gameId} ${scoreText}\n\n`;

  // Generate emoji grid for each completed guess
  const emojiGrid = guessesSubmitted
    .map((guess) => {
      const statuses = calculateLetterStatuses(guess, answer);
      return statuses
        .map((status) => {
          // Only include non-empty statuses in share text
          if (status === 'empty') return '';
          return SHARE_EMOJIS[status as keyof typeof SHARE_EMOJIS];
        })
        .join('');
    })
    .join('\n');

  return header + emojiGrid;
}

/**
 * Check if the Web Share API is supported and available
 * Typically available on mobile browsers
 *
 * @returns true if navigator.share is available
 */
export function isShareApiSupported(): boolean {
  if (typeof navigator === 'undefined') return false;
  return typeof navigator.share === 'function';
}

/**
 * Check if running on a mobile device that supports sharing
 *
 * @returns true if mobile with Chrome or Safari
 */
export function isMobileShareSupported(): boolean {
  if (typeof navigator === 'undefined') return false;

  const userAgent = navigator.userAgent;
  const isMobile = /Mobi/i.test(userAgent);
  const isSupportedBrowser = /Chrome|Safari/i.test(userAgent);

  return isMobile && isSupportedBrowser && isShareApiSupported();
}

/**
 * Share results using native share API if available, otherwise copy to clipboard
 *
 * @param text - The text to share
 * @returns Promise<boolean> - true if successful, false if failed
 *
 * @example
 * const shareText = createShareText(gameState, answer);
 * const success = await shareResults(shareText);
 * if (success) {
 *   toast.success('Shared successfully!');
 * }
 */
export async function shareResults(text: string): Promise<boolean> {
  // Try native share API first (mobile)
  if (isMobileShareSupported()) {
    try {
      await navigator.share({ text });
      return true;
    } catch (error) {
      // User cancelled or share failed, fall through to clipboard
      console.log('Share cancelled or failed:', error);
    }
  }

  // Fallback to clipboard
  return copyToClipboard(text);
}

/**
 * Copy text to clipboard using modern Clipboard API
 *
 * @param text - Text to copy
 * @returns Promise<boolean> - true if successful
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    // Fallback for older browsers
    return copyToClipboardLegacy(text);
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // Try legacy fallback
    return copyToClipboardLegacy(text);
  }
}

/**
 * Legacy clipboard copy method using execCommand (fallback)
 *
 * @param text - Text to copy
 * @returns boolean - true if successful
 */
function copyToClipboardLegacy(text: string): boolean {
  if (typeof document === 'undefined') return false;

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.setAttribute('readonly', '');
  document.body.appendChild(textArea);

  try {
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error('Legacy clipboard copy failed:', error);
    document.body.removeChild(textArea);
    return false;
  }
}

/**
 * Format share text for display (preview)
 * Replaces emojis with colored squares for UI display
 *
 * @param text - Share text with emojis
 * @returns HTML string with styled squares
 */
export function formatShareTextForDisplay(text: string): string {
  return text.replace(/🐥/g, '🟩').replace(/🐣/g, '🟨').replace(/🥚/g, '⬜');
}

/**
 * Share to Twitter/X with pre-filled text
 *
 * @param text - Share text
 * @returns Twitter share URL
 */
export function getTwitterShareUrl(text: string): string {
  const encodedText = encodeURIComponent(text);
  const url = encodeURIComponent('https://birdle.app');
  return `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`;
}

/**
 * Share to Facebook
 *
 * @returns Facebook share URL
 */
export function getFacebookShareUrl(): string {
  const url = encodeURIComponent('https://birdle.app');
  return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
}
