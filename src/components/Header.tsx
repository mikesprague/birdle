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
  const { birdle } = useGameState(store);

  return (
    <header className="w-full shrink-0 border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Menu/Help button */}
          <div className="flex items-center gap-2 min-w-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={onInstructionsClick}
              aria-label="How to play"
              className="hover:bg-accent focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-correct))] focus-visible:ring-offset-2"
            >
              <HelpCircle className="h-6 w-6" />
            </Button>
          </div>

          {/* Center: Title and game number */}
          <div className="flex flex-col items-center">
            <h1
              className="text-3xl font-bold tracking-tight"
              aria-label="Birdle"
            >
              BIRDLE
              <small className="ml-1 text-base font-normal tracking-tight lowercase">
                <a
                  href={`https://github.com/mikesprague/birdle/releases/tag/v${version}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  v{version}
                </a>
              </small>
            </h1>
            <p className="text-xs text-muted-foreground">#{birdle.day}</p>
          </div>

          {/* Right: Stats and Settings buttons */}
          <div className="flex items-center gap-2 min-w-16 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={onStatsClick}
              aria-label="View statistics"
              className="hover:bg-accent focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-correct))] focus-visible:ring-offset-2"
            >
              <BarChart3 className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              aria-label="Settings"
              className="hover:bg-accent focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-correct))] focus-visible:ring-offset-2"
            >
              <Settings className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
