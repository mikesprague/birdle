/**
 * Shared timing constants for the "reveal" sequence:
 * - Board tile flip animation duration & stagger
 * - Incremental keyboard key reveal cadence
 * - Post-reveal UX sequencing (toast/celebrations, stats modal)
 *
 * Keep these values in sync with CSS keyframes/animations and any JS timers that
 * orchestrate the reveal. Centralizing them avoids drift and regressions.
 */

/**
 * Duration (ms) of a single tile flip animation.
 *
 * NOTE: Must match the `.box-flip` animation duration in `src/index.css`.
 */
export const TILE_FLIP_DURATION_MS = 300;

/**
 * Stagger (ms) between each tile's flip start within a row.
 *
 * NOTE: Must match the per-tile `animationDelay` in `src/components/Board/Box.tsx`.
 * Setting this equal to `TILE_FLIP_DURATION_MS` yields a strict "one finishes, next starts"
 * sequential reveal.
 */
export const TILE_FLIP_STAGGER_MS = 300;

/**
 * Number of tiles in a row (Birdle is 5 letters).
 * Used to compute derived totals for reveal orchestration.
 */
export const TILES_PER_ROW = 5;

/**
 * Total time (ms) from the start of the first tile flip until the last tile finishes.
 *
 * For N tiles, last tile starts at (N-1) * stagger and then runs for duration.
 */
export const REVEAL_TOTAL_MS =
  TILE_FLIP_DURATION_MS + (TILES_PER_ROW - 1) * TILE_FLIP_STAGGER_MS;

/**
 * Keyboard reveal cadence (ms) per letter.
 *
 * In the current UX, each keyboard update should align with each tile’s flip.
 * This is typically equal to `TILE_FLIP_STAGGER_MS`.
 */
export const KEYBOARD_REVEAL_STEP_MS = TILE_FLIP_STAGGER_MS;

/**
 * Return the delay (ms) for a given tile position (0-based) within a row.
 */
export function getTileFlipDelayMs(position: number): number {
  return Math.max(0, position) * TILE_FLIP_STAGGER_MS;
}
