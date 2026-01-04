/**
 * StatsModal Component
 *
 * Displays player statistics including games played, win percentage,
 * streaks, and guess distribution. Uses shadcn Dialog (replaces sweetalert2).
 */

import { memo, useEffect, useState } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import type { Store } from 'tinybase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useStats } from '@/hooks';
import { showCopiedToast, showCopyFailedToast } from '@/hooks/useToast';
import type { GameState } from '@/types';
import { createShareText, shareResults } from '@/utils';
import { trackEvent } from '@/utils/analytics';

const NextBirdleCountdown = memo(function NextBirdleCountdown({
  open,
  isGameOver,
}: {
  open: boolean;
  isGameOver: boolean;
}) {
  const [timeUntilNext, setTimeUntilNext] = useState('00:00:00');

  useEffect(() => {
    if (!open || !isGameOver) {
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilNext(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [open, isGameOver]);

  return (
    <div className="text-center">
      <h3 className="text-sm font-semibold mb-2">Next Birdle</h3>
      <div className="text-3xl font-mono font-bold tabular-nums">
        {timeUntilNext}
      </div>
    </div>
  );
});

export interface StatsModalProps {
  /** Whether the modal is open */
  open: boolean;

  /** Callback to close the modal */
  onClose: () => void;

  /** TinyBase store instance */
  store: Store;

  /** Current game state (for share functionality) */
  gameState?: GameState | null;

  /** Answer word (for share functionality) */
  answer?: string;
}

/**
 * StatsModal component
 *
 * @example
 * <StatsModal
 *   open={statsOpen}
 *   onClose={() => setStatsOpen(false)}
 *   store={store}
 *   gameState={gameState}
 *   answer={birdle.word}
 * />
 */
export function StatsModal({
  open,
  onClose,
  store,
  gameState,
  answer,
}: StatsModalProps) {
  const { stats } = useStats(store);
  const chartConfig = {
    guesses: {
      label: 'Guesses',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  // Handle share button click
  const handleShare = async () => {
    if (!gameState || !answer) {
      return;
    }

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

  if (!stats) {
    return null;
  }

  // Find max guess count for chart scaling
  // @ts-expect-error -- ignore --
  const _maxGuessCount = Math.max(
    stats.guesses[1],
    stats.guesses[2],
    stats.guesses[3],
    stats.guesses[4],
    stats.guesses[5],
    stats.guesses[6],
    stats.guesses.fail
  );

  const chartData = [];
  for (const key in stats.guesses) {
    chartData.push({
      guesses: key,
      count: stats.guesses[key as keyof typeof stats.guesses],
      isCurrentGuess:
        gameState?.wonGame && gameState.currentRow + 1 === Number(key),
    });
  }

  // const chartData = [1, 2, 3, 4, 5, 6].map((guessNum) => {
  //   const count = stats.guesses[guessNum as 1 | 2 | 3 | 4 | 5 | 6];
  //   const percentage = maxGuessCount > 0 ? (count / maxGuessCount) * 100 : 0;
  //   const isCurrentGuess =
  //     gameState?.wonGame && gameState.currentRow + 1 === guessNum;
  //   return {
  //     guesses: guessNum,
  //     percentage,
  //     isCurrentGuess: isCurrentGuess,
  //   };
  // });
  console.log('chartData', chartData);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Statistics
          </DialogTitle>
          <DialogDescription className="sr-only">
            Your game statistics and guess distribution
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-2">
            <Card className="text-center p-3">
              <CardContent className="p-0">
                <div className="text-3xl font-bold">{stats.gamesPlayed}</div>
                <div className="text-xs text-muted-foreground">Played</div>
              </CardContent>
            </Card>

            <Card className="text-center p-3">
              <CardContent className="p-0">
                <div className="text-3xl font-bold">{stats.winPercentage}</div>
                <div className="text-xs text-muted-foreground">Win %</div>
              </CardContent>
            </Card>

            <Card className="text-center p-3">
              <CardContent className="p-0">
                <div className="text-3xl font-bold">{stats.currentStreak}</div>
                <div className="text-xs text-muted-foreground">
                  Current Streak
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-3">
              <CardContent className="p-0">
                <div className="text-3xl font-bold">{stats.maxStreak}</div>
                <div className="text-xs text-muted-foreground">Max Streak</div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Guess Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Guess Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  layout="vertical"
                  margin={{
                    left: -20,
                  }}
                >
                  <XAxis type="number" dataKey="guesses" hide />
                  <YAxis
                    dataKey="guesses"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="count"
                    fill="{isCurrentGuess ? 'var(--chart-2))' : 'var(--chart-1)'}"
                    radius={5}
                    label={{
                      position: 'right',
                      formatter: (value: number) => `${Number(value)}%`,
                    }}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          {/* <div>
            <h3 className="text-lg font-semibold mb-3">Guess Distribution</h3>
            <div className="space-y-1">
              {[1, 2, 3, 4, 5, 6].map((guessNum) => {
                const count = stats.guesses[guessNum as 1 | 2 | 3 | 4 | 5 | 6];
                const percentage =
                  maxGuessCount > 0 ? (count / maxGuessCount) * 100 : 0;
                const isCurrentGuess =
                  gameState?.wonGame && gameState.currentRow + 1 === guessNum;

                return (
                  <div key={guessNum} className="flex items-center gap-2">
                    <div className="w-4 text-sm font-medium">{guessNum}</div>
                    <div className="flex-1 relative h-7">
                      <div
                        className={`h-full rounded flex items-center justify-end px-2 text-sm font-bold text-white transition-all ${
                          isCurrentGuess
                            ? 'bg-green-600'
                            : 'bg-gray-600 dark:bg-gray-700'
                        }`}
                        style={{
                          width: `${Math.max(percentage, count > 0 ? 8 : 0)}%`,
                        }}
                      >
                        {count > 0 && count}
                      </div>
                    </div>
                  </div>
                );
              })} */}
          {/* Fail row */}
          {/* <div className="flex items-center gap-2">
                <div className="w-4 text-sm font-medium">X</div>
                <div className="flex-1 relative h-7">
                  <div
                    className="h-full rounded flex items-center justify-end px-2 text-sm font-bold text-white bg-gray-600 dark:bg-gray-700 transition-all"
                    style={{
                      width: `${Math.max(
                        maxGuessCount > 0
                          ? (stats.guesses.fail / maxGuessCount) * 100
                          : 0,
                        stats.guesses.fail > 0 ? 8 : 0
                      )}%`,
                    }}
                  >
                    {stats.guesses.fail > 0 && stats.guesses.fail}
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Next Birdle Countdown */}
          {gameState?.isGameOver && (
            <>
              <Separator />
              <NextBirdleCountdown open={open} isGameOver />
            </>
          )}

          {/* Share Button */}
          {gameState?.isGameOver && (
            <>
              <Separator />
              <Button
                onClick={handleShare}
                className="w-full"
                size="lg"
                variant="default"
              >
                Share Results
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
