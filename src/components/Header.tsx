/**
 * Header Component
 *
 * App header with title, game number, and menu buttons for stats,
 * instructions, and settings.
 */

import { BarChart3, HelpCircle, Settings } from 'lucide-react';
import type { Store } from 'tinybase';

import { Button } from '@/components/ui/button';
import { useGameState } from '@/hooks';

import { version } from '../../package.json';

export interface HeaderProps {
  /** TinyBase store instance */
  store: Store;

  /** Open stats modal */
  onStatsClick: () => void;

  /** Open instructions modal */
  onInstructionsClick: () => void;

  /** Open settings modal */
  onSettingsClick: () => void;
}

/**
 * Header component
 *
 * @example
 * <Header
 *   store={store}
 *   onStatsClick={() => setStatsOpen(true)}
 *   onInstructionsClick={() => setInstructionsOpen(true)}
 *   onSettingsClick={() => setSettingsOpen(true)}
 * />
 */
export function Header({
  store,
  onStatsClick,
  onInstructionsClick,
  onSettingsClick,
}: HeaderProps) {
  // @ts-expect-error -- ignore --
  // biome-ignore lint/correctness/noUnusedVariables: ignore
  const { birdle } = useGameState(store);

  return (
    <header className="w-full shrink-0 border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
          {/* Left: Menu/Help button */}
          <div className="flex items-center gap-2 min-w-16">
            <Button
              variant="ghost"
              onClick={onInstructionsClick}
              aria-label="How to play"
              className="hover:bg-accent focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <HelpCircle className="h-16 w-16" />
            </Button>
          </div>

          {/* Center: Title and game number */}
          <div className="flex flex-col items-center">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
              aria-label="Birdle"
            >
              BIRDLE
              <small className="ml-1 text-xs sm:text-sm md:text-base font-normal tracking-tight lowercase">
                <a
                  href={`https://github.com/mikesprague/birdle/releases/tag/v${version}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  v{version}
                </a>
              </small>
            </h1>
            {/* <p className="text-xs text-muted-foreground">#{birdle.day}</p> */}
          </div>

          {/* Right: Stats and Settings buttons */}
          <div className="flex items-center gap-2 min-w-16 justify-end">
            <Button
              variant="ghost"
              onClick={onStatsClick}
              aria-label="View statistics"
              className="hover:bg-accent focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <BarChart3 className="h-16 w-16" />
            </Button>

            <Button
              variant="ghost"
              onClick={onSettingsClick}
              aria-label="Settings"
              className="hover:bg-accent focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Settings className="h-16 w-16" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
