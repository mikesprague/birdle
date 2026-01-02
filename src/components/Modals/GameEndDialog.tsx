/**
 * GameEndDialog Component
 *
 * Displays win or loss message when game completes.
 * Shows statistics summary and share button.
 * Uses shadcn AlertDialog (replaces sweetalert2).
 */

import { useEffect } from 'react';
import type { Store } from 'tinybase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStats } from '@/hooks';
import { showCopiedToast, showCopyFailedToast } from '@/hooks/useToast';
import type { GameState } from '@/types';
import { createShareText, getSuccessMessage, shareResults } from '@/utils';
import { trackEvent } from '@/utils/analytics';

export interface GameEndDialogProps {
  /** Whether the dialog is open */
  open: boolean;

  /** Callback to close the dialog */
  onClose: () => void;

  /** TinyBase store instance */
  store: Store;

  /** Current game state */
  gameState: GameState;

  /** Answer word */
  answer: string;

  /** Callback to trigger celebration effects */
  onCelebrate?: () => void;
}

/**
 * GameEndDialog component
 *
 * @example
 * <GameEndDialog
 *   open={gameEndOpen}
 *   onClose={() => setGameEndOpen(false)}
 *   store={store}
 *   gameState={gameState}
 *   answer={birdle.word}
 *   onCelebrate={triggerWinEffects}
 * />
 */
export function GameEndDialog({
  open,
  onClose,
  store,
  gameState,
  answer,
  onCelebrate,
}: GameEndDialogProps) {
  const { stats } = useStats(store);
  const won = gameState.wonGame;
  const attempts = gameState.currentRow + 1;

  // Trigger celebration effects on win
  useEffect(() => {
    if (open && won && onCelebrate) {
      onCelebrate();
    }
  }, [open, won, onCelebrate]);

  // Handle share button click
  const handleShare = async () => {
    const shareText = createShareText(gameState, answer);
    const success = await shareResults(shareText);

    if (success) {
      showCopiedToast();
      // Track share event
      trackEvent('game_shared', {
        gameId: gameState.gameId,
        won: gameState.wonGame,
        attempts: gameState.currentRow + 1,
      });
    } else {
      showCopyFailedToast();
    }
  };

  // Get success message based on attempts
  const successMessage = won ? getSuccessMessage(gameState.currentRow) : '';

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            {won ? successMessage : 'Game Over'}
          </DialogTitle>
          <DialogDescription className="text-center text-lg pt-2">
            {won ? (
              <>
                You solved Birdle #{gameState.gameId} in {attempts}{' '}
                {attempts === 1 ? 'try' : 'tries'}!
              </>
            ) : (
              <>
                The word was{' '}
                <span className="font-bold uppercase">{answer}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {stats && (
          <div className="py-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
                <div className="text-xs text-muted-foreground">Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.winPercentage}</div>
                <div className="text-xs text-muted-foreground">Win %</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleShare} className="w-full" size="lg">
            Share Results
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
