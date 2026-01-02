/**
 * GameShell Component
 *
 * Main game container that orchestrates all game components and manages
 * game flow, modal states, and win/loss effects.
 */

import { useEffect, useState } from 'react';
import type { Store } from 'tinybase';
import { useCell } from 'tinybase/ui-react';

import { Board } from '@/components/Board/Board';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { Keyboard } from '@/components/Keyboard/Keyboard';
import { GameEndDialog } from '@/components/Modals/GameEndDialog';
import { InstructionsModal } from '@/components/Modals/InstructionsModal';
import { SettingsModal } from '@/components/Modals/SettingsModal';
import { StatsModal } from '@/components/Modals/StatsModal';

import { useGameState, useStats } from '@/hooks';
import { ROW_IDS, TABLES } from '@/store/schema';
import { trackEvent } from '@/utils/analytics';
import {
  christmasEmojis,
  defaultBirds,
  halloweenEmojis,
  thanksGivingEmojis,
} from '@/utils/emoji';
import { setupAutoWakeLock } from '@/utils/wake-lock';

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
  const { updateStats } = useStats(store);

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
  const [gameEndOpen, setGameEndOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Track if we've already processed this game end
  const [processedGameId, setProcessedGameId] = useState<number | null>(null);

  /**
   * Trigger win celebration effects
   * Lazy loads emoji-blast and balloons-js libraries based on settings
   */
  const triggerWinEffects = async () => {
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
  };

  // Watch for game end
  useEffect(() => {
    if (
      gameState?.isGameOver &&
      !gameEndOpen &&
      processedGameId !== gameState.gameId
    ) {
      // Calculate attempts (currentRow is 0-indexed, so +1 for actual attempt count)
      const attempts = gameState.currentRow + 1;

      // Update stats
      updateStats(gameState.wonGame, attempts);

      // Track game completion event
      trackEvent('game_completed', {
        won: gameState.wonGame,
        attempts,
        gameId: gameState.gameId,
      });

      // Open game end dialog
      setGameEndOpen(true);

      // Mark this game as processed
      setProcessedGameId(gameState.gameId);
    }
  }, [gameState, gameEndOpen, processedGameId, updateStats]);

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
      {gameState && (
        <GameEndDialog
          store={store}
          open={gameEndOpen}
          onClose={() => setGameEndOpen(false)}
          gameState={gameState}
          answer={gameState.guessesSubmitted[gameState.currentRow] || ''}
          onCelebrate={triggerWinEffects}
        />
      )}

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
