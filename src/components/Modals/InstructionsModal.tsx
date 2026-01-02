/**
 * InstructionsModal Component
 *
 * Displays game instructions and examples showing how to play Birdle.
 * Uses shadcn Dialog (replaces sweetalert2).
 */

import { Box } from '@/components/Board/Box';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export interface InstructionsModalProps {
  /** Whether the modal is open */
  open: boolean;

  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * InstructionsModal component
 *
 * @example
 * <InstructionsModal
 *   open={instructionsOpen}
 *   onClose={() => setInstructionsOpen(false)}
 * />
 */
export function InstructionsModal({ open, onClose }: InstructionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            How to Play
          </DialogTitle>
          <DialogDescription className="sr-only">
            Instructions for playing Birdle
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm">
              Guess the <strong>BIRDLE</strong> in 6 tries.
            </p>
            <p className="text-sm">
              Each guess must be a valid 5-letter word. Hit the enter button to
              submit.
            </p>
            <p className="text-sm">
              After each guess, the color of the tiles will change to show how
              close your guess was to the word.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="font-semibold text-sm">Examples</p>

            {/* Example 1: Correct letter */}
            <div className="space-y-2">
              <div className="flex gap-1">
                <Box letter="w" status="correct" position={0} rowIndex={0} />
                <Box letter="e" status="empty" position={1} rowIndex={0} />
                <Box letter="a" status="empty" position={2} rowIndex={0} />
                <Box letter="r" status="empty" position={3} rowIndex={0} />
                <Box letter="y" status="empty" position={4} rowIndex={0} />
              </div>
              <p className="text-sm">
                The letter <strong>W</strong> is in the word and in the correct
                spot.
              </p>
            </div>

            {/* Example 2: Present letter */}
            <div className="space-y-2">
              <div className="flex gap-1">
                <Box letter="p" status="empty" position={0} rowIndex={1} />
                <Box letter="i" status="present" position={1} rowIndex={1} />
                <Box letter="l" status="empty" position={2} rowIndex={1} />
                <Box letter="l" status="empty" position={3} rowIndex={1} />
                <Box letter="s" status="empty" position={4} rowIndex={1} />
              </div>
              <p className="text-sm">
                The letter <strong>I</strong> is in the word but in the wrong
                spot.
              </p>
            </div>

            {/* Example 3: Absent letter */}
            <div className="space-y-2">
              <div className="flex gap-1">
                <Box letter="v" status="empty" position={0} rowIndex={2} />
                <Box letter="a" status="empty" position={1} rowIndex={2} />
                <Box letter="g" status="empty" position={2} rowIndex={2} />
                <Box letter="u" status="absent" position={3} rowIndex={2} />
                <Box letter="e" status="empty" position={4} rowIndex={2} />
              </div>
              <p className="text-sm">
                The letter <strong>U</strong> is not in the word in any spot.
              </p>
            </div>
          </div>

          <Separator />

          <div className="text-center">
            <p className="text-sm font-semibold">
              A new BIRDLE will be available each day!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
