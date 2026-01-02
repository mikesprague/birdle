/**
 * SettingsModal Component
 *
 * Displays app settings including theme toggle and future preferences.
 * Uses shadcn Dialog (replaces sweetalert2).
 */

import type { Store } from 'tinybase';
import { useCell } from 'tinybase/ui-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks';
import { ROW_IDS, TABLES } from '@/store/schema';
import type { Theme } from '@/types';

export interface SettingsModalProps {
  /** Whether the modal is open */
  open: boolean;

  /** Callback to close the modal */
  onClose: () => void;

  /** TinyBase store instance */
  store: Store;
}

/**
 * SettingsModal component
 *
 * @example
 * <SettingsModal
 *   open={settingsOpen}
 *   onClose={() => setSettingsOpen(false)}
 *   store={store}
 * />
 */
export function SettingsModal({ open, onClose, store }: SettingsModalProps) {
  const { theme, setTheme } = useTheme(store);

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

  // Handle celebration setting toggles
  const handleEmojiBlastsToggle = (checked: boolean) => {
    store.setCell(
      TABLES.SETTINGS,
      ROW_IDS.SETTINGS_CURRENT,
      'emojiBlasts',
      checked
    );
  };

  const handleBalloonsToggle = (checked: boolean) => {
    store.setCell(
      TABLES.SETTINGS,
      ROW_IDS.SETTINGS_CURRENT,
      'balloons',
      checked
    );
  };

  // Theme options
  const themeOptions: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription className="sr-only">
            Customize your Birdle experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Theme</Label>
            <div className="flex gap-2">
              {themeOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  variant={theme === option.value ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {theme === 'system'
                ? 'Following your system preferences'
                : `Using ${theme} theme`}
            </p>
          </div>

          <Separator />

          {/* Celebration Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emoji-blasts" className="text-base font-medium">
                  Emoji Blasts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Show emoji celebrations on win
                </p>
              </div>
              <Switch
                id="emoji-blasts"
                checked={emojiBlasts}
                onCheckedChange={handleEmojiBlastsToggle}
                aria-label="Toggle emoji blasts"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="balloons" className="text-base font-medium">
                  Balloons
                </Label>
                <p className="text-sm text-muted-foreground">
                  Show balloon celebrations on win
                </p>
              </div>
              <Switch
                id="balloons"
                checked={balloons}
                onCheckedChange={handleBalloonsToggle}
                aria-label="Toggle balloons"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
