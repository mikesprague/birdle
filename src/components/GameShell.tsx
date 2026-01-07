/**
 * GameShell Component
 *
 * Main game container that orchestrates all game components and manages
 * game flow, modal states, and win/loss effects.
 */

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react';
import type { Store } from 'tinybase';
import { useCell } from 'tinybase/ui-react';

import { Board } from '@/components/Board/Board';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { Keyboard } from '@/components/Keyboard/Keyboard';
import { InstructionsModal } from '@/components/Modals/InstructionsModal';
import { SettingsModal } from '@/components/Modals/SettingsModal';
import { StatsModal } from '@/components/Modals/StatsModal';

import { useGameState, useStats } from '@/hooks';
import { showWinToast, TOAST_CONFIG } from '@/hooks/useToast';
import { ROW_IDS, TABLES } from '@/store/schema';
import { getSuccessMessage } from '@/utils';
import { trackEvent } from '@/utils/analytics';
import {
  christmasEmojis,
  defaultBirds,
  halloweenEmojis,
  thanksGivingEmojis,
} from '@/utils/emoji';
import { setupAutoWakeLock } from '@/utils/wake-lock';

const DEBUG_WIN_SEQUENCE = false;

function debugWinSequence(message: string, data?: Record<string, unknown>) {
  if (!DEBUG_WIN_SEQUENCE) {
    return;
  }
  // Keep logs easy to filter in the console.
  console.log(`[win-sequence] ${message}`, data ?? {});
}

export interface GameShellProps {
  /** TinyBase store instance */
  store: Store;
}

/**
 * GameShell component
 *
 * Orchestrates the complete game experience including:
 * - Game board and keyboard
 * - Header with navigation
 * - Modal management (stats, instructions, settings, game end)
 * - Win/loss effects (emoji blast, balloons)
 * - Wake lock management
 *
 * @example
 * <GameShell store={store} />
 */
export function GameShell({ store }: GameShellProps) {
  // Game state and actions
  const { gameState, birdle } = useGameState(store);
  const { stats, countGameIfNeeded } = useStats(store);

  // Get celebration settings from store
  const emojiBlasts =
    (useCell(
      TABLES.SETTINGS,
      ROW_IDS.SETTINGS_CURRENT,
      'emojiBlasts',
      store
    ) as boolean) ?? true;

  const balloons =
    (useCell(
      TABLES.SETTINGS,
      ROW_IDS.SETTINGS_CURRENT,
      'balloons',
      store
    ) as boolean) ?? true;

  // Modal states
  const [statsOpen, setStatsOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  /**
   * Flip reveal timing:
   * - Each tile flip is 0.5s and we stagger by 0.5s per position (see Box.tsx).
   * - Total reveal time for 5 tiles = 0.5s (duration) + 0.5s * (4 delays) = 2.5s.
   *
   * This constant defines when we should run "post-reveal" UX (toast/celebrations).
   */
  const REVEAL_TOTAL_MS = 1250;

  /**
   * Track whether the game was already over when this component mounted.
   * If it was, we treat it as a reload and should not run win celebrations/toast.
   *
   * We set this once, on the first render, based on the initial gameState snapshot.
   * This avoids violating hook dependency lint rules.
   */
  const mountedWithGameOverRef = useRef<boolean>(
    Boolean(gameState?.isGameOver)
  );

  /**
   * Ensure the win post-reveal UX (toast + celebrations + delayed stats) runs only once
   * per gameId per session, even if effects re-run (e.g. due to state changes).
   */
  const winUxStateRef = useRef<{
    gameId: number | null;
    revealTimeoutId: number | null;
    statsTimeoutId: number | null;
  }>({ gameId: null, revealTimeoutId: null, statsTimeoutId: null });

  /**
   * Effect Events used by win/loss sequencing timers.
   *
   * These avoid stale closures inside setTimeout callbacks and allow the scheduling
   * effect to depend only on the actual scheduling signal (gameId/isGameOver/wonGame).
   */
  const showWinToastEvent = useEffectEvent((attemptRow: number) => {
    showWinToast(getSuccessMessage(attemptRow));
  });

  const triggerWinEffectsEvent = useEffectEvent(() => {
    void triggerWinEffects();
  });

  const openStatsEvent = useEffectEvent(() => {
    setStatsOpen(true);
  });

  /**
   * Trigger win celebration effects
   * Lazy loads emoji-blast and balloons-js libraries based on settings
   */
  const triggerWinEffects = useCallback(async () => {
    try {
      if (emojiBlasts) {
        // Lazy load and trigger emoji-blast if enabled
        const { emojiBlasts: emojiBlastsFn } = await import('emoji-blast');

        // var with current date
        const today = new Date();
        // var that returns true if today is in October
        const isHalloween =
          today.getMonth() === 9 &&
          today.getDate() > 21 &&
          today.getDate() <= 31;
        // var that returns true if today is in November
        const isThanksgiving =
          today.getMonth() === 10 &&
          today.getDate() > 20 &&
          today.getDate() <= 28;

        const isChristmas =
          today.getMonth() === 11 &&
          today.getDate() > 10 &&
          today.getDate() <= 25;

        const { cancel } = emojiBlastsFn({
          position: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 4,
          },
          emojiCount:
            ((gameState?.guessesRows.length || 0) * 10) /
            ((gameState?.currentRow || 0) + 1),
          emojis: isHalloween
            ? halloweenEmojis
            : isThanksgiving
              ? thanksGivingEmojis
              : isChristmas
                ? christmasEmojis
                : defaultBirds || defaultBirds,
        });

        // stop/clean up after 5 seconds
        setTimeout(() => {
          cancel();
        }, 3500);
      }

      if (balloons) {
        // Lazy load and trigger balloons if enabled
        try {
          const balloonsModule = await import('balloons-js');
          if (typeof balloonsModule.balloons === 'function') {
            await balloonsModule.textBalloons([
              {
                text: defaultBirds.slice(0, 4).join(''),
                fontSize: Math.min(window.innerWidth / 5, 160),
                color: '#000000',
              },
              {
                text: defaultBirds.slice(4, 8).join(''),
                fontSize: Math.min(window.innerWidth / 5, 160),
                color: '#000000',
              },
              {
                text: defaultBirds.slice(8, 12).join(''),
                fontSize: Math.min(window.innerWidth / 5, 160),
                color: '#000000',
              },
              {
                text: defaultBirds.slice(12, 16).join(''),
                fontSize: Math.min(window.innerWidth / 5, 160),
                color: '#000000',
              },
            ]);
          }
        } catch (error) {
          // Balloons library not available or failed to load, skip it
          console.log('Balloons effect not available', error);
        }
      }
    } catch (error) {
      // Effects failed to load, that's okay
      console.log('Win effects not available:', error);
    }
  }, [
    balloons,
    emojiBlasts,
    gameState?.currentRow,
    gameState?.guessesRows.length,
  ]);

  /**
   * Update stats and analytics once per completed game (idempotent across reloads).
   * This stays immediate on completion so persistence is correct even if the user
   * closes the tab during the reveal animation.
   *
   * IMPORTANT:
   * - `countGameIfNeeded` returns false both on reloads *and* if this session
   *   reaches game-over for a game that was already counted earlier (e.g. due to
   *   previous bugs that double-counted or partial state).
   * - For UX sequencing (flip -> toast+celebrate -> stats), we instead treat a
   *   transition into game-over as the signal for a "new completion in this session".
   *   Reloads are distinguished by the fact that the component mounts already in game-over
   *   (no transition).
   */
  useEffect(() => {
    if (!gameState?.isGameOver) {
      return;
    }

    if (!stats) {
      debugWinSequence('stats effect: stats not available yet; waiting', {
        gameId: gameState.gameId,
        isGameOver: gameState.isGameOver,
        wonGame: gameState.wonGame,
      });
      return;
    }

    const attempts = gameState.currentRow + 1;

    debugWinSequence('stats effect: game over detected; counting if needed', {
      gameId: gameState.gameId,
      attempts,
      wonGame: gameState.wonGame,
      lastCountedGameId: stats.lastCountedGameId,
    });

    const didUpdateStats = countGameIfNeeded(
      gameState.gameId,
      gameState.wonGame,
      attempts
    );

    debugWinSequence('stats effect: countGameIfNeeded result', {
      gameId: gameState.gameId,
      didUpdateStats,
    });

    // Track analytics only when we actually counted the game.
    if (didUpdateStats) {
      trackEvent('game_completed', {
        won: gameState.wonGame,
        attempts,
        gameId: gameState.gameId,
      });
    }
  }, [countGameIfNeeded, gameState, stats]);

  /**
   * Post-reveal UX orchestration:
   * - After a win, wait for the 5-tile flip reveal to finish.
   * - Then show the toast + start celebrations.
   * - When the toast auto-closes (2.5s), open the stats modal.
   *
   * On reloads (mounting already in game-over), we open stats immediately with no delay.
   */
  useEffect(() => {
    if (!gameState) {
      return;
    }

    const gameId = gameState.gameId;
    const isGameOver = gameState.isGameOver;
    const wonGame = gameState.wonGame;
    const currentRow = gameState.currentRow;
    const guessesSubmittedLen = gameState.guessesSubmitted.length;
    const lastCountedGameId = stats?.lastCountedGameId;

    debugWinSequence('ux effect: evaluate', {
      gameId,
      isGameOver,
      wonGame,
      currentRow,
      guessesSubmittedLen,
      lastCountedGameId,
      mountedWithGameOver: mountedWithGameOverRef.current,
    });

    // Loss behavior is unchanged: show stats immediately when game ends.
    // However, only auto-open once per gameId so the user can dismiss the modal.
    if (isGameOver && !wonGame) {
      debugWinSequence('ux effect: loss -> open stats immediately', {
        gameId,
      });

      if (winUxStateRef.current.gameId !== gameId) {
        winUxStateRef.current.gameId = gameId;
        openStatsEvent();
      }

      return;
    }

    if (!isGameOver || !wonGame) {
      return;
    }

    // Reload behavior: if we mounted already-over, open stats immediately; no toast/celebrations.
    // Only auto-open once per gameId so the user can dismiss the modal.
    if (mountedWithGameOverRef.current) {
      debugWinSequence(
        'ux effect: mounted with game over -> open stats immediately',
        {
          gameId,
        }
      );

      if (winUxStateRef.current.gameId !== gameId) {
        winUxStateRef.current.gameId = gameId;
        openStatsEvent();
      }

      return;
    }

    // If we've already scheduled win UX for this gameId, do nothing.
    // Importantly, do NOT return a cleanup function that cancels already-scheduled timeouts
    // on subsequent effect re-runs.
    if (winUxStateRef.current.gameId === gameId) {
      debugWinSequence(
        'ux effect: win UX already scheduled for game; skipping',
        {
          gameId,
        }
      );
      return;
    }

    // Schedule once for this gameId.
    winUxStateRef.current.gameId = gameId;

    debugWinSequence('ux effect: scheduling post-reveal win sequence', {
      gameId,
      revealMs: REVEAL_TOTAL_MS,
      toastMs: TOAST_CONFIG.duration,
    });

    // Capture only the reactive scalar we need for the toast message at schedule-time.
    // Everything else runs through Effect Events to avoid stale closures.
    const attemptRow = currentRow;

    const revealTimeoutId = window.setTimeout(() => {
      debugWinSequence(
        'ux effect: reveal finished -> show toast + start celebrations',
        {
          gameId,
        }
      );

      showWinToastEvent(attemptRow);
      triggerWinEffectsEvent();

      const statsTimeoutId = window.setTimeout(() => {
        debugWinSequence('ux effect: toast duration elapsed -> open stats', {
          gameId,
        });
        openStatsEvent();
      }, TOAST_CONFIG.duration);

      winUxStateRef.current.statsTimeoutId = statsTimeoutId;
    }, REVEAL_TOTAL_MS);

    winUxStateRef.current.revealTimeoutId = revealTimeoutId;
  }, [gameState, stats?.lastCountedGameId]);

  // Cleanup any scheduled win UX timers on unmount.
  useEffect(() => {
    return () => {
      const { revealTimeoutId, statsTimeoutId } = winUxStateRef.current;
      if (revealTimeoutId !== null) {
        window.clearTimeout(revealTimeoutId);
      }
      if (statsTimeoutId !== null) {
        window.clearTimeout(statsTimeoutId);
      }
    };
  }, []);

  // Wake lock management with auto visibility handling
  useEffect(() => {
    // Setup automatic wake lock that handles visibility changes
    const cleanup = setupAutoWakeLock();

    // Return cleanup function to release wake lock on unmount
    return cleanup;
  }, []);

  /**
   * Handle header button clicks
   */
  const handleStatsClick = () => {
    setStatsOpen(true);
  };

  const handleInstructionsClick = () => {
    setInstructionsOpen(true);
  };

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header with navigation */}
      <Header
        store={store}
        onStatsClick={handleStatsClick}
        onInstructionsClick={handleInstructionsClick}
        onSettingsClick={handleSettingsClick}
      />

      {/* Main game area with board */}
      <main className="flex-1 flex items-center justify-center px-2 py-2 overflow-y-auto min-h-0">
        <div className="w-full max-w-lg">
          <ErrorBoundary
            fallback={(_error, reset) => (
              <div className="text-center p-8 space-y-4">
                <p className="text-destructive font-semibold">
                  Game board error
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            )}
          >
            <Board store={store} />
          </ErrorBoundary>
        </div>
      </main>

      {/* Keyboard */}
      <footer className="shrink-0 pb-2 px-2">
        <div className="w-full max-w-2xl mx-auto">
          <Keyboard store={store} />
        </div>
      </footer>

      {/* Modals */}
      <StatsModal
        store={store}
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        gameState={gameState}
        answer={birdle?.word}
      />

      <InstructionsModal
        open={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
      />

      <SettingsModal
        store={store}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
