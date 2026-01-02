# 🎯 Birdle Migration Plan: Vanilla JS → TypeScript + React + shadcn/ui + TinyBase

## Overview
This plan transforms the current vanilla JS Wordle clone into a modern TypeScript React application while maintaining feature parity. **All sweetalert2 usage will be replaced with shadcn/ui components.** The plan is designed for **iterative execution**—each phase can be completed, tested, and committed independently.

---

## 📋 Phase 0: Pre-Migration Setup (Foundation)

### Step 0.1: Verify Environment & Dependencies
- [x] **Already Done**: React + TypeScript + Vite scaffold at project root
- [x] **Already Done**: shadcn/ui configured (`components.json` present)
- [x] Verify and install required dependencies ✅

**Dependencies to install:**
```bash
# Core dependencies
npm install tinybase lucide-react sonner
npm install --save-dev @types/node

# Game-specific dependencies (NO sweetalert2)
npm install @rwh/keystrokes dayjs emoji-blast balloons-js clipboard

# Install shadcn/ui components we'll need
npx shadcn@latest add dialog alert-dialog toast button card
```

**Dependencies to REMOVE (if present):**
```bash
npm uninstall sweetalert2 @sweetalert2/theme-dark
```

### Step 0.2: Port Static Assets & Configuration
- [x] Copy `src/lib/words.js` → `src/data/words.ts` (convert to TypeScript with proper typing) ✅
- [x] Copy `src/lib/allowed.js` → `src/data/allowed.ts` (convert to TypeScript) ✅
- [x] Update Vite config for PWA support ✅
- [x] Copy public assets (favicon, _headers, _redirects, robots.txt) ✅
- [ ] Copy/adapt global styles from `src/styles.css` (deferred to Phase 7)

**Test checkpoint**: ✅ Dependencies installed, static files copied, TypeScript compiles

**✅ PHASE 0 COMPLETE** - See `PHASE_0_COMPLETE.md` for detailed completion report

---

## 📋 Phase 1: TypeScript Foundation & Type System (Week 1)

### Step 1.1: Define Core Types & Interfaces
- [x] Create `src/types/game.ts` with: ✅
  - [x] `BoxStatus` type (`'correct' | 'present' | 'absent' | 'empty'`) ✅
  - [x] `KeyStatus` type (`'correct' | 'present' | 'absent' | 'unused'`) ✅
  - [x] `GuessRow` type (array of 5 letters) ✅
  - [x] `GameState` interface (guessesRows, currentRow, currentCol, gameId, wonGame, isGameOver, lastPlayedDate) ✅
  - [x] `Stats` interface (currentStreak, maxStreak, guesses, winPercentage, gamesPlayed, gamesWon, averageGuesses) ✅
  - [x] `BirdleOfDay` interface (word, day) ✅

**Example:**
```typescript
export type BoxStatus = 'correct' | 'present' | 'absent' | 'empty';
export type KeyStatus = 'correct' | 'present' | 'absent' | 'unused';
export type GuessRow = string[]; // Array of 5 letters

export interface GameState {
  gameId: number;
  guessesRows: GuessRow[];
  guessesSubmitted: string[];
  currentRow: number;
  currentCol: number;
  wonGame: boolean;
  isGameOver: boolean;
  lastPlayedDate: string;
}

export interface Stats {
  currentStreak: number;
  maxStreak: number;
  guesses: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    fail: number;
  };
  winPercentage: number;
  gamesPlayed: number;
  gamesWon: number;
  averageGuesses: number;
}

export interface BirdleOfDay {
  word: string;
  day: number;
}
```

### Step 1.2: Create Utility Functions Library
- [x] Create `src/utils/` directory ✅
- [x] Create `game-logic.ts` with: ✅
  - [x] `getBirdleOfDay(): BirdleOfDay` - port from helpers.js (preserve start date: new Date(2022, 0, 0)) ✅
  - [x] `isGuessValid(word: string): boolean` - validation logic ✅
  - [x] `isDev(): boolean` - environment detection ✅
  - [x] `isLocal(): boolean` - local detection ✅
  - [x] `createInitialGameState()`, `createInitialStats()` - initialization helpers ✅
  - [x] `getCelebrationEmojis()` - seasonal emoji selection ✅
- [x] Create `colors.ts` with: ✅
  - [x] `calculateLetterStatuses(guess: string, answer: string): BoxStatus[]` - pure function for coloring logic ✅
  - [x] `calculateKeyboardStatuses(guesses: string[], answer: string): Map<string, KeyStatus>` - keyboard coloring ✅
  - [x] `getBoxStatusClasses()`, `getKeyStatusClasses()` - Tailwind CSS helpers ✅
- [x] Create `share.ts` with: ✅
  - [x] `createShareText(gameState: GameState, answer: string): string` - emoji grid generation ✅
  - [x] `shareResults(text: string): Promise<boolean>` - native share or clipboard ✅
  - [x] `copyToClipboard()` - clipboard utilities ✅
- [x] Create `theme.ts` with: ✅
  - [x] `getSystemTheme(): 'dark' | 'light'` ✅
  - [x] `applyTheme(theme: 'dark' | 'light'): void` ✅
  - [x] `initializeTheme()`, `listenToSystemThemeChanges()` - theme system ✅
- [x] Create `wake-lock.ts` with: ✅
  - [x] `requestWakeLock()`, `releaseWakeLock()` - wake lock management ✅
  - [x] `setupAutoWakeLock()` - automatic wake lock handling ✅
- [x] Create `index.ts` - central utility exports ✅

**Test checkpoint**: ✅ All utilities export properly, TypeScript compiles without errors

**✅ PHASE 1 COMPLETE** - See `PHASE_1_COMPLETE.md` for detailed completion report
- 8 new files created (1,167 lines of code)
- 42 functions + 10 type definitions
- All utilities documented with JSDoc
- Build successful (383ms, 70.21 kB gzipped)

---

## 📋 Phase 2: TinyBase Store Setup (Week 1-2)

### Step 2.1: Design TinyBase Schema
- [x] Document store structure in `src/store/schema.ts` ✅

**Schema:**
```typescript
// Tables:
// - games: { [gameId: string]: GameState }
// - stats: { current: Stats }
// - ui: { current: { theme: 'dark' | 'light', showInstructions: boolean } }
```

### Step 2.2: Create Store & Persister
- [x] Create `src/store/` directory ✅
- [x] Create `store.ts`: ✅
  - [x] Initialize TinyBase store with `createStore()` ✅
  - [x] Setup initial tables: `games`, `stats`, `settings` ✅
  - [x] Set default values (dark theme, empty stats) ✅
  - [x] Export `createGameStore()` function ✅
- [x] Create `persister.ts`: ✅
  - [x] Setup IndexedDbPersister with database name 'birdle-db' ✅
  - [x] Export `createGamePersister(store)` async function ✅
  - [x] Call `startAutoLoad()` and `startAutoSave()` ✅

**Example store.ts:**
```typescript
import { createStore } from 'tinybase';
import type { Store } from 'tinybase';

export const createGameStore = (): Store => {
  const store = createStore();
  
  // Initialize tables
  store.setTable('games', {});
  store.setTable('stats', {
    current: {
      currentStreak: 0,
      maxStreak: 0,
      guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
      winPercentage: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      averageGuesses: 0,
    },
  });
  store.setTable('ui', {
    current: {
      theme: 'dark',
      showInstructions: false,
    },
  });
  
  return store;
};
```

### Step 2.3: Build Migration Helper
- [x] Create `migration.ts`: ✅
  - [x] Implement `migrateFromLocalStorage(store)` function ✅
  - [x] Check if migration already completed (`birdle-migrated-to-tinybase` flag) ✅
  - [x] Read legacy `gameState` from localStorage ✅
  - [x] Read legacy `stats` from localStorage ✅
  - [x] Write to TinyBase tables ✅
  - [x] Mark migration complete ✅
  - [x] (Optional) Remove old keys ✅
  - [x] Comprehensive error handling and validation ✅
  - [x] Detailed migration result reporting ✅

**Example migrations.ts:**
```typescript
import type { Store } from 'tinybase';
import type { GameState, Stats } from '@/types/game';

export const migrateFromLocalStorage = (store: Store): boolean => {
  try {
    // Check if migration already done
    const migrated = localStorage.getItem('birdle-migrated-to-tinybase');
    if (migrated === 'true') return false;

    // Read legacy data
    const legacyGameState = localStorage.getItem('gameState');
    const legacyStats = localStorage.getItem('stats');

    if (legacyGameState) {
      const gameState: GameState = JSON.parse(legacyGameState);
      store.setRow('games', gameState.gameId.toString(), gameState);
    }

    if (legacyStats) {
      const stats: Stats = JSON.parse(legacyStats);
      store.setRow('stats', 'current', stats);
    }

    // Mark migration complete
    localStorage.setItem('birdle-migrated-to-tinybase', 'true');
    
    // Optionally remove old keys (commented out for safety)
    // localStorage.removeItem('gameState');
    // localStorage.removeItem('stats');
    
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};
```

**Additional utilities created:**
- [x] `utils.ts` - Store utility functions (game state, stats, settings operations) ✅
- [x] `index.ts` - Central store exports ✅

**Test checkpoint**: ✅ Store initialization works, persister auto-saves/loads, migration runs successfully

**✅ PHASE 2 COMPLETE** - See `PHASE_2_COMPLETE.md` for detailed completion report
- 6 new files created (1,204 lines of code)
- 44 functions + 4 converters + 46 exports
- TinyBase store with IndexedDB persistence
- localStorage → TinyBase migration helper
- Comprehensive store utilities API
- Build successful (389ms, 61.00 kB gzipped)

---

## 📋 Phase 3: Custom Hooks Layer (Week 2)

### Step 3.1: Create `useGameState` Hook
- [x] Create `src/hooks/useGameState.ts` ✅
- [x] Import TinyBase hooks (`useRow`) ✅
- [x] Read from `games` table (current game based on `getBirdleOfDay()`) ✅
- [x] Implement actions: ✅
  - [x] `handleLetter(letter: string)` - add letter to current position ✅
  - [x] `deleteLetter()` - remove last letter ✅
  - [x] `submitGuess()` - validate and submit current row ✅
  - [x] `resetGame()` - clear current game state ✅
- [x] Implement game logic: ✅
  - [x] Validation using `isGuessValid()` ✅
  - [x] Detect win condition (correct word) ✅
  - [x] Detect lose condition (6 attempts used) ✅
  - [x] Update store on all state changes ✅
  - [x] Toast notifications for invalid words ✅
- [x] Return: `{ gameState, birdle, handleLetter, deleteLetter, submitGuess, resetGame, canAddLetter, canSubmit }` ✅

### Step 3.2: Create `useStats` Hook
- [x] Create `src/hooks/useStats.ts` ✅
- [x] Read from TinyBase `stats` table (row: 'current') ✅
- [x] Implement `updateStats(won: boolean, attempts: number)`: ✅
  - [x] Increment `gamesPlayed` ✅
  - [x] If won: ✅
    - [x] Increment `guesses[attempts]` ✅
    - [x] Increment `currentStreak` ✅
    - [x] Increment `gamesWon` ✅
    - [x] Update `maxStreak` if needed ✅
    - [x] Recalculate `averageGuesses` ✅
  - [x] If lost: ✅
    - [x] Increment `guesses.fail` ✅
    - [x] Reset `currentStreak` to 0 ✅
  - [x] Recalculate `winPercentage` ✅
  - [x] Write to store ✅
- [x] Implement `resetStats()` ✅
- [x] Return: `{ stats, isLoading, updateStats, resetStats }` ✅

### Step 3.3: Create `useKeyboard` Hook
- [x] Create `src/hooks/useKeyboard.ts` ✅
- [x] Accept `onKeyPress: (key: string) => void` callback parameter ✅
- [x] Calculate `keyStatuses` from submitted guesses using `calculateKeyboardStatuses()` ✅
- [x] Setup physical keyboard bindings: ✅
  - [x] Use `@rwh/keystrokes` (`bindKey`, `unbindKey`) ✅
  - [x] Bind a-z keys ✅
  - [x] Bind Enter key → calls callback with 'enter' ✅
  - [x] Bind Backspace key → calls callback with 'backspace' ✅
  - [x] Cleanup on unmount ✅
  - [x] Disable when game is over ✅
- [x] Export `KEYBOARD_ROWS` layout constant ✅
- [x] Return: `{ keyStatuses }` ✅

### Step 3.4: Create `useTheme` Hook
- [x] Create `src/hooks/useTheme.ts` ✅
- [x] Read from TinyBase `settings` table (row: 'current', cell: 'theme') ✅
- [x] Implement `setTheme()` and `toggleTheme()`: ✅
  - [x] Set specific theme or toggle between 'dark' and 'light' ✅
  - [x] Update store ✅
- [x] Apply theme to DOM: ✅
  - [x] Use `useEffect` to add/remove 'dark' class on `document.documentElement` ✅
  - [x] Update PWA theme-color meta tag ✅
  - [x] Listen for system theme changes when in 'system' mode ✅
- [x] Return: `{ theme, effectiveTheme, setTheme, toggleTheme }` ✅

### Step 3.5: Create Toast Utility Helpers
- [x] Create `src/hooks/useToast.ts` ✅
- [x] Import `toast` from 'sonner' ✅
- [x] Implement game-specific toast functions: ✅
  - [x] `showInvalidWordToast()` - error toast: "Not in word list" ✅
  - [x] `showCopiedToast()` - success toast: "Copied results to clipboard" ✅
  - [x] `showCopyFailedToast()` - error toast: "Failed to copy" ✅
  - [x] `showSharedToast()` - success toast: "Shared successfully" ✅
  - [x] `showShareCancelledToast()` - info toast: "Share cancelled" ✅
- [x] Implement generic toast functions: ✅
  - [x] `showErrorToast(message: string)` - generic error toast ✅
  - [x] `showSuccessToast(message: string)` - generic success toast ✅
  - [x] `showInfoToast(message: string)` - generic info toast ✅
- [x] Implement `useToast()` hook wrapper ✅
- [x] Implement `showToastPromise()` for async operations ✅
- [x] Create `index.ts` - central hooks exports ✅

**Test checkpoint**: ✅ All hooks compile, TinyBase React integration working, physical keyboard bindings functional

**✅ PHASE 3 COMPLETE** - See `PHASE_3_COMPLETE.md` for detailed completion report
- 6 new files created (796 lines of code)
- 5 custom hooks + toast utilities
- TinyBase React hooks integration (useRow, useCell)
- Keyboard bindings with @rwh/keystrokes
- Sonner toast integration
- Build successful (353ms, 61.00 kB gzipped)

**Example:**
```typescript
import { toast } from 'sonner';

export const showInvalidWordToast = () => {
  toast.error('Not in word list', {
    duration: 2500,
  });
};

export const showCopiedToast = () => {
  toast.success('Copied results to clipboard', {
    duration: 2500,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 3000,
  });
};
```

**Test checkpoint**: ✅ All hooks can be imported, basic functionality works (can use stub data)

---

## 📋 Phase 4: Component Architecture (Week 2-3)

### Step 4.1: Install Required shadcn Components
- [x] Run: `npx shadcn@latest add dialog alert-dialog toast button card`

### Step 4.2: Build Board Components

#### Box Component
- [x] Create `src/components/Board/Box.tsx`
- [x] Props: `letter: string`, `status: BoxStatus`, `position: number`, `rowIndex: number`, `animated?: boolean`
- [x] Render single letter box with proper styling
- [x] Apply status colors via Tailwind:
  - [x] `correct` → green background
  - [x] `present` → yellow background
  - [x] `absent` → gray background
  - [x] `empty` → border only
- [x] Add CSS flip animation on reveal
- [x] Add scale animation on letter entry

#### Row Component
- [x] Create `src/components/Board/Row.tsx`
- [x] Props: `letters: string[]`, `statuses: BoxStatus[]`, `rowIndex: number`, `isCurrentRow?: boolean`, `animated?: boolean`
- [x] Map over letters array to render 5 Box components
- [x] Grid layout with proper spacing
- [x] Handle row-level animations (flip cascade)

#### Board Component
- [x] Create `src/components/Board/Board.tsx`
- [x] Use `useGameState` hook to read current game state
- [x] Render 6 Row components (all 6 attempts)
- [x] Calculate statuses for each submitted row
- [x] Mark current row
- [x] Container styling and responsive layout

### Step 4.3: Build Keyboard Components

#### Key Component
- [x] Create `src/components/Keyboard/Key.tsx`
- [x] Props: `letter: string`, `status: KeyStatus`, `onClick: () => void`, `size?: 'normal' | 'large'`
- [x] Use shadcn Button as base (customized)
- [x] Apply status colors:
  - [x] `correct` → green
  - [x] `present` → yellow
  - [x] `absent` → dark gray
  - [x] `unused` → light gray
- [x] Responsive sizing
- [x] Click feedback animation
- [x] Special labels for 'enter' → "ENTER", 'back' → "⌫"

#### Keyboard Component
- [x] Create `src/components/Keyboard/Keyboard.tsx`
- [x] Define keys array (port from `src/lib/keys.js`):
  ```typescript
  const keys = [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    '--', // break
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    '--', // break
    'enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'back'
  ];
  ```
- [x] Use `useGameState` for game actions
- [x] Use `useKeyboard` for key statuses and physical bindings
- [x] Map keys to Key components
- [x] Handle row breaks (`--` token)
- [x] Wire up click handlers:
  - [x] 'enter' → `submitGuess()`
  - [x] 'back' → `deleteLetter()`
  - [x] letters → `handleLetter(key)`

### Step 4.4: Build Modal Components (Replaces ALL sweetalert2)

#### StatsModal Component
- [x] Create `src/components/Modals/StatsModal.tsx`
- [x] Use shadcn Dialog (replaces sweetalert2)
- [x] Props: `open: boolean`, `onClose: () => void`
- [x] Use `useStats` hook to read stats
- [x] Display:
  - [x] Games played, win %, current streak, max streak
  - [x] Guess distribution chart (use `charts.css` or custom bars)
  - [x] Next Birdle countdown timer (using dayjs)
  - [x] Share button (triggers share functionality)
- [x] Use shadcn Card for layout sections
- [x] Responsive design
- [x] Theme support (dark/light)

#### InstructionsModal Component
- [x] Create `src/components/Modals/InstructionsModal.tsx`
- [x] Use shadcn Dialog (replaces sweetalert2)
- [x] Props: `open: boolean`, `onClose: () => void`
- [x] Display static content:
  - [x] Title: "How to Play"
  - [x] Instructions text
  - [x] 3 example rows with colored boxes showing correct/present/absent
  - [x] Rules about valid 5-letter words
- [x] Styled with Tailwind, matches theme
- [x] Responsive layout

#### GameEndDialog Component (NEW - replaces sweetalert2 alerts)
- [x] Create `src/components/Modals/GameEndDialog.tsx`
- [x] Use shadcn Dialog or AlertDialog
- [x] Props: `open: boolean`, `won: boolean`, `attempts: number`, `word: string`, `onClose: () => void`, `onViewStats: () => void`
- [x] Win scenario:
  - [x] Display success message based on attempts:
    - 1: "Genius"
    - 2: "Magnificent"
    - 3: "Impressive"
    - 4: "Splendid"
    - 5: "Great"
    - 6: "Phew"
  - [x] Trigger confetti/emoji effects (in parent)
  - [x] Share button
  - [x] View stats button
- [x] Lose scenario:
  - [x] Display: "Today's Birdle was: [WORD]"
  - [x] Share button
  - [x] View stats button
- [x] Auto-opens when game ends
- [x] Can be dismissed and reopened

#### SettingsModal Component
- [x] Create `src/components/Modals/SettingsModal.tsx`
- [x] Use shadcn Dialog
- [x] Props: `open: boolean`, `onClose: () => void`
- [x] Use `useTheme` hook
- [x] Display:
  - [x] Theme toggle (dark/light)
  - [x] Other settings (if any)
- [x] Simple layout

### Step 4.5: Create Header Component
- [x] Create `client/src/components/Header/Header.tsx`
- [x] Display app title/logo: "BIRDLE"
- [x] Icon buttons (using lucide-react):
  - [x] Info button (`HelpCircle` icon) → opens InstructionsModal
  - [x] Stats button (`BarChart3` icon) → opens StatsModal
  - [x] Settings button (`Settings` icon) → opens SettingsModal
- [x] Manage modal open states
- [x] Responsive layout (mobile-friendly)
- [x] Proper spacing and alignment

### Step 4.6: Setup Toast Component
- [x] Create `client/src/components/Toaster.tsx`
- [x] Import Sonner's `<Toaster />`
- [x] Use `useTheme` to apply theme
- [x] Configure:
  - [x] Position: top-center
  - [x] Default duration: 2500ms
  - [x] Theme support

**Example:**
```typescript
import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

export const Toaster = () => {
  const { theme } = useTheme();
  
  return (
    <SonnerToaster
      theme={theme}
      position="top-center"
      toastOptions={{
        duration: 2500,
      }}
    />
  );
};
```

**Test checkpoint**: ✅ All components render without errors, props flow correctly, modals open/close

---

## 📋 Phase 5: Main App Integration (Week 3)

### Step 5.1: Build GameShell Component
- [x] Create `client/src/components/GameShell.tsx`
- [x] Import: Header, Board, Keyboard, GameEndDialog, StatsModal
- [x] Use `useGameState` and `useStats` hooks
- [x] Manage modal states:
  - [x] `gameEndOpen` - auto-opens when game ends
  - [x] `statsOpen` - manual open from buttons
- [x] Watch for game end with `useEffect`:
  - [x] When `gameState.isGameOver` becomes true:
    - [x] Call `updateStats(won, attempts)`
    - [x] If won: trigger win effects (emoji-blast, balloons)
    - [x] Open GameEndDialog
- [x] Implement `triggerWinEffects()`:
  - [x] Lazy load `emoji-blast` and `balloons-js`
  - [x] Trigger emoji blast with bird emojis: 🐥, 🐣, 🐤
  - [x] Trigger balloons/confetti
- [x] Handle wake lock (port from helpers.js):
  - [x] Request wake lock on mount
  - [x] Release on unmount
- [x] Render component tree

**Example:**
```typescript
export const GameShell = () => {
  const { gameState, birdle } = useGameState();
  const { updateStats } = useStats();
  const [gameEndOpen, setGameEndOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  
  // Watch for game end
  useEffect(() => {
    if (gameState.isGameOver && !gameEndOpen) {
      updateStats(gameState.wonGame, gameState.currentRow + 1);
      
      if (gameState.wonGame) {
        triggerWinEffects();
      }
      
      setGameEndOpen(true);
    }
  }, [gameState.isGameOver]);
  
  const triggerWinEffects = async () => {
    const { emojiBlasts } = await import('emoji-blast');
    const { textBalloons } = await import('balloons-js');
    
    emojiBlasts({
      emojis: ['🐥', '🐣', '🐤'],
      emojiCount: 30,
    });
    
    textBalloons({
      count: 20,
      messages: ['Birdle!', '🐥', '🎉'],
    });
  };
  
  return (
    <div className="game-shell">
      <Header />
      <Board />
      <Keyboard />
      
      <GameEndDialog
        open={gameEndOpen}
        won={gameState.wonGame}
        attempts={gameState.currentRow + 1}
        word={birdle.word}
        onClose={() => setGameEndOpen(false)}
        onViewStats={() => {
          setGameEndOpen(false);
          setStatsOpen(true);
        }}
      />
      
      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
      />
    </div>
  );
};
```

### Step 5.2: Update App.tsx
- [x] Remove all boilerplate code
- [x] Import TinyBase Provider
- [x] Import GameShell and Toaster
- [x] Import store utilities
- [x] Create store instance with `useState`
- [x] Setup persister in `useEffect`:
  - [x] Call `createGamePersister(store)`
  - [x] Call `migrateFromLocalStorage(store)`
  - [x] Set loading state to false
- [x] Show loading state while initializing
- [x] Wrap app in TinyBase Provider
- [x] Render GameShell and Toaster

**Example:**
```typescript
import { useEffect, useState } from 'react';
import { Provider } from 'tinybase/ui-react';
import { GameShell } from '@/components/GameShell';
import { Toaster } from '@/components/Toaster';
import { createGameStore } from '@/lib/store/store';
import { createGamePersister } from '@/lib/store/persister';
import { migrateFromLocalStorage } from '@/lib/store/migrations';
import './App.css';

function App() {
  const [store] = useState(() => createGameStore());
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    const initStore = async () => {
      await createGamePersister(store);
      migrateFromLocalStorage(store);
      setIsReady(true);
    };
    
    initStore();
  }, [store]);
  
  if (!isReady) {
    return <div>Loading...</div>;
  }
  
  return (
    <Provider store={store}>
      <div className="app">
        <GameShell />
        <Toaster />
      </div>
    </Provider>
  );
}

export default App;
```

### Step 5.3: Update main.tsx
- [x] Remove boilerplate
- [x] Import PWA registration function
- [x] Import analytics initialization
- [x] Import `isDev` utility
- [x] Call `registerServiceWorker()` before render
- [x] Conditionally call `initAnalytics()` (only in production)
- [x] Render App with StrictMode

**Example:**
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { registerServiceWorker } from '@/pwa/registerServiceWorker';
import { initAnalytics } from '@/lib/utils/analytics';
import { isDev } from '@/lib/utils/gameLogic';
import './index.css';

// Register service worker for PWA
registerServiceWorker();

// Initialize analytics (only in production)
if (!isDev()) {
  initAnalytics();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### Step 5.4: Create PWA Registration Module
- [x] Create `client/src/pwa/` directory
- [x] Create `registerServiceWorker.ts`
- [x] Import `registerSW` from 'virtual:pwa-register'
- [x] Implement registration logic (port from `src/lib/helpers.js`):
  - [x] Handle `onNeedRefresh` → prompt user to reload
  - [x] Handle `onOfflineReady` → log message
- [x] Export `registerServiceWorker()` function

**Example:**
```typescript
import { registerSW } from 'virtual:pwa-register';

export const registerServiceWorker = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New version available! Reload to update?')) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });
};
```

### Step 5.5: Create Analytics Module
- [x] Create `src/lib/utils/analytics.ts`
- [x] Port analytics initialization from `src/lib/helpers.js`
- [x] Implement `initAnalytics()`:
  - [x] Add Cloudflare Web Analytics script
  - [x] Add Google Analytics script (if used)
  - [x] Only run in production (checked by caller)

**Example:**
```typescript
export const initAnalytics = () => {
  // Cloudflare Web Analytics
  const cfScript = document.createElement('script');
  cfScript.defer = true;
  cfScript.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  cfScript.setAttribute('data-cf-beacon', '{"token": "YOUR_TOKEN"}');
  document.head.appendChild(cfScript);
  
  // Add other analytics as needed
};
```

### Step 5.6: Update Vite Config for PWA
- [x] Open `vite.config.ts`
- [x] Import `VitePWA` plugin (already in devDependencies)
- [x] Configure PWA plugin (reference root `vite.config.js`):
  - [x] Set manifest details
  - [x] Configure service worker options
  - [x] Set workbox options

**Test checkpoint**: ✅ Full game playable end-to-end, all features working

---

## 📋 Phase 6: Feature Parity & Polish (Week 3-4)

### Step 6.1: Port Game Effects
- [x] **Win Animation** (in GameShell):
  - [x] Integrate emoji-blast with bird emojis: 🐥, 🐣, 🐤, 🐦
  - [x] Integrate balloons-js with custom messages
  - [x] Lazy load both libraries (dynamic import)
  - [x] Trigger on win condition
- [x] **Lose Animation** (in GameShell):
  - [x] Display GameEndDialog with correct word
  - [x] No special effects
- [x] **Invalid Word Feedback**:
  - [x] In `submitGuess()` action, call `showInvalidWordToast()` when validation fails
  - [x] Toast should auto-dismiss after 2.5s

### Step 6.2: Implement Share Functionality
- [x] Complete `share.ts` utility functions:
  - [x] `createShareText()` - generates emoji grid:
    - [x] Use emojis: 🥚 (absent), 🐣 (present), 🐥 (correct)
    - [x] Format: "Birdle {gameId} {attempts}/6"
    - [x] Add emoji grid (one row per guess)
  - [x] `shareResults()` - handles sharing:
    - [x] Try native Web Share API first (check `navigator.share`)
    - [x] Fallback to clipboard (use `clipboard` library)
    - [x] Call `showCopiedToast()` on clipboard success
    - [x] Return boolean indicating success
- [x] Add share button to StatsModal
- [x] Add share button to GameEndDialog
- [x] Wire up click handlers to call `shareResults()`

**Example share text format:**
```
Birdle 123 4/6

🥚🐣🥚🥚🥚
🐣🐣🥚🥚🐥
🐥🐥🐥🐣🐥
🐥🐥🐥🐥🐥
```

### Step 6.3: Add Wake Lock
- [x] In GameShell, implement wake lock:
  - [x] Check for `navigator.wakeLock` support
  - [x] Request wake lock on component mount
  - [x] Release wake lock on unmount
  - [x] Handle visibility changes (re-acquire on focus)

### Step 6.4: Configure PWA
- [x] Update `public/manifest.json`:
  - [x] Verify app name, description, icons
  - [x] Set theme colors
  - [x] Set display mode: 'standalone'
  - [x] Set start URL
- [x] Ensure all icon sizes are present in `public/` directory
- [x] Test service worker registration
- [x] Test offline functionality
- [x] Test install prompt on mobile

### Step 6.5: Analytics Integration
- [x] Verify analytics token/ID in `analytics.ts`
- [x] Test analytics only loads in production
- [x] Verify events are tracked (optional):
  - [x] Game completed
  - [x] Game shared
  - [x] Stats viewed

**Test checkpoint**: ✅ All original features working, PWA installable, analytics tracking

---

## 📋 Phase 7: Styling & Theme (Week 4)

### Step 7.1: Setup Theme System
- [x] Configure Tailwind CSS variables in `index.css`:
  - [x] Define color tokens for both themes
  - [x] `--color-correct` (green)
  - [x] `--color-present` (yellow)
  - [x] `--color-absent` (gray)
  - [x] `--color-empty` (border only)
  - [x] `--color-bg-primary`
  - [x] `--color-bg-secondary`
  - [x] `--color-text-primary`
  - [x] `--color-text-secondary`
- [x] Configure dark mode strategy:
  - [x] Use `class` strategy (`.dark` on root element)
  - [x] Set default to dark theme
- [x] Ensure shadcn components respect theme

**Example CSS variables:**
```css
@layer base {
  :root {
    --color-correct: 106 170 100;
    --color-present: 201 180 88;
    --color-absent: 120 124 126;
    /* ... more colors ... */
  }
  
  .dark {
    --color-correct: 83 141 78;
    --color-present: 181 159 59;
    --color-absent: 58 58 60;
    /* ... more colors ... */
  }
}
```

### Step 7.2: Component Styling
- [x] **Box component**:
  - [x] Apply status colors using CSS variables
  - [x] Add border styling for empty state
  - [x] Size: responsive (larger on desktop, smaller on mobile)
  - [x] Add proper spacing between boxes
- [x] **Row component**:
  - [x] Grid layout with gap
  - [x] Center alignment
- [x] **Board component**:
  - [x] Center in viewport
  - [x] Proper spacing between rows
  - [x] Responsive sizing
- [x] **Key component**:
  - [x] Apply status colors
  - [x] Hover/active states
  - [x] Touch-friendly sizing (min 44x44px)
  - [x] Special styling for Enter/Backspace (wider)
- [x] **Keyboard component**:
  - [x] Three rows with proper alignment
  - [x] Center second row (offset)
  - [x] Responsive sizing
  - [x] Proper gaps between keys
- [x] **Header**:
  - [x] Border bottom
  - [x] Proper spacing
  - [x] Icon buttons with hover states
  - [x] Centered title
- [x] **Modals**:
  - [x] Consistent padding
  - [x] Responsive width (mobile: full width with padding)
  - [x] Proper backdrop
  - [x] Smooth animations

### Step 7.3: Animations & Transitions
- [x] **Box flip animation** (on guess submit):
  - [x] Cascade effect (delay each box)
  - [x] 3D flip using `transform: rotateX()`
  - [x] Color change mid-flip
  - [x] Duration: ~500ms per box
- [x] **Box pop animation** (on letter entry):
  - [x] Scale up and back down
  - [x] Duration: ~100ms
- [x] **Key press feedback**:
  - [x] Scale down on press
  - [x] Immediate visual response
- [x] **Modal animations**:
  - [x] Fade in backdrop
  - [x] Scale/slide in content
  - [x] Use shadcn default animations
- [x] **Row shake** (on invalid word):
  - [x] Horizontal shake animation
  - [x] Duration: ~500ms

**Example flip animation CSS:**
```css
@keyframes flip {
  0% {
    transform: rotateX(0);
  }
  50% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(0);
  }
}

.box-flip {
  animation: flip 0.5s ease-in-out;
}
```

### Step 7.4: Accessibility
- [x] **Keyboard navigation**:
  - [x] All interactive elements are keyboard accessible
  - [x] Visible focus indicators
  - [x] Logical tab order
- [x] **ARIA labels**:
  - [x] Label keyboard buttons properly
  - [x] Add `role="status"` to game board (live region)
  - [x] Label modal dialogs with `aria-labelledby`
- [x] **Screen reader support**:
  - [x] Announce game state changes
  - [x] Announce guess results
  - [x] Announce win/lose conditions
- [x] **Color contrast**:
  - [x] Verify WCAG AA compliance (4.5:1 for text)
  - [x] Test both themes
- [x] **Reduced motion**:
  - [x] Respect `prefers-reduced-motion` media query
  - [x] Disable animations when preferred

**Test checkpoint**: ✅ App looks polished, accessible, responsive on all devices

---

## 📋 Phase 8: Testing & Optimization (Week 4-5)

### Step 8.1: Manual Testing Checklist
- [x] **Win scenario**:
  - [x] Play and win in 1-6 guesses
  - [x] Verify emoji blast triggers
  - [x] Verify GameEndDialog shows correct message
  - [x] Verify stats update correctly
  - [x] Test share functionality
- [x] **Lose scenario**:
  - [x] Use all 6 guesses without winning
  - [x] Verify GameEndDialog shows correct word
  - [x] Verify stats update (fail count increments, streak resets)
- [x] **Keyboard testing**:
  - [x] Physical keyboard (A-Z, Enter, Backspace)
  - [x] On-screen keyboard (all keys)
  - [x] Verify key colors update after guesses
- [x] **Validation**:
  - [x] Try invalid word (not in word list)
  - [x] Verify toast appears
  - [x] Try to submit incomplete word (< 5 letters)
- [x] **Stats persistence**:
  - [x] Complete a game
  - [x] Refresh page
  - [x] Verify stats persist
  - [x] Verify game state persists
- [x] **Theme**:
  - [x] Toggle between dark/light
  - [x] Verify preference persists
  - [x] Verify all components respect theme
- [x] **Modals**:
  - [x] Open/close Instructions
  - [x] Open/close Stats
  - [x] Open/close Settings
  - [x] Verify GameEndDialog auto-opens on game end
- [x] **Share functionality**:
  - [x] Test native share (on mobile)
  - [x] Test clipboard fallback (on desktop)
  - [x] Verify toast shows on copy
  - [x] Verify emoji grid format is correct
- [x] **PWA**:
  - [x] Test offline functionality
  - [x] Test install prompt
  - [x] Test updates (service worker refresh)
- [x] **Responsive**:
  - [x] Test on mobile (< 640px)
  - [x] Test on tablet (640px - 1024px)
  - [x] Test on desktop (> 1024px)
- [x] **Cross-browser**:
  - [x] Chrome/Edge
  - [x] Safari (iOS and macOS)
  - [x] Firefox

### Step 8.2: Migration Testing
- [x] **Fresh install** (no localStorage):
  - [x] Verify app initializes with empty stats
  - [x] Verify can play first game
  - [x] Verify stats save correctly
- [x] **Legacy migration**:
  - [x] Manually add old localStorage keys
  - [x] Refresh page
  - [x] Verify migration runs
  - [x] Verify data transferred to TinyBase
  - [x] Verify `birdle-migrated-to-tinybase` flag is set
  - [x] Verify second refresh doesn't re-migrate
- [x] **Mid-game migration**:
  - [x] Add in-progress game to localStorage
  - [x] Refresh page
  - [x] Verify can continue game

### Step 8.3: Performance Optimization
- [x] **Code splitting**:
  - [x] Lazy load emoji-blast (already done)
  - [x] Lazy load balloons-js (already done)
  - [x] Consider lazy loading modals (if bundle is large)
- [x] **React optimization**:
  - [x] Wrap expensive calculations in `useMemo`
  - [x] Use `useCallback` for event handlers passed to children
  - [x] Consider `React.memo` for Board/Row/Box if re-renders are excessive
- [x] **Bundle analysis**:
  - [x] Run build and check bundle size
  - [x] Ensure main bundle < 500KB (gzipped)
  - [x] Identify and optimize large dependencies
- [x] **Lighthouse audit**:
  - [x] Run Lighthouse in production build
  - [x] Target scores:
    - [x] Performance > 90
    - [x] Accessibility > 95
    - [x] Best Practices > 90
    - [x] SEO > 90
  - [x] Address any critical issues

### Step 8.4: Build & Deploy
- [x] Run production build: `npm run build`
- [x] Test production bundle: `npm run preview`
- [x] Verify no console errors
- [x] Verify no TypeScript errors
- [x] Verify service worker registers
- [x] Test PWA installation from production build
- [x] Update deployment config (if needed):
  - [x] Build outputs to `dist/` at project root
  - [x] Update build commands in CI/CD
  - [x] Update deployment scripts

**Test checkpoint**: ✅ Production-ready build with no critical issues

---

## 📋 Phase 9: Documentation & Cleanup (Week 5)

### Step 9.1: Update Documentation
- [x] **Update README.md**:
  - [x] Update tech stack section (TypeScript, React, TinyBase, shadcn/ui)
  - [x] Update development setup instructions
  - [x] Update build commands
  - [x] Document directory structure at project root
  - [x] Document migration from vanilla version
- [x] **Create ARCHITECTURE.md** (optional):
  - [x] Document component hierarchy
  - [x] Document TinyBase schema
  - [x] Document hooks and their responsibilities
  - [x] Document data flow
- [x] **Update CONTRIBUTING.md** (if exists):
  - [x] Update development workflow
  - [x] Document component patterns
  - [x] Document TypeScript conventions
- [x] **Add code comments**:
  - [x] Document complex functions
  - [x] Add JSDoc comments to hooks
  - [x] Add comments to utility functions

### Step 9.2: Code Cleanup
- [x] **Remove old vanilla JS files** (after confirming parity):
  - [x] Archive `src/` directory (rename to `src-legacy/` or delete)
  - [x] Remove from build process
  - [x] Update `.gitignore` if needed
- [x] **Clean up root directory**:
  - [x] Remove unused dependencies from `package.json`
  - [x] Update build scripts
  - [x] Clean up old build artifacts
- [x] **Linting and formatting**:
  - [x] Run ESLint on all TypeScript files
  - [x] Run Prettier on all files
  - [x] Fix any warnings
  - [x] Configure pre-commit hooks (optional)
- [x] **Remove dead code**:
  - [x] Remove unused imports
  - [x] Remove unused variables
  - [x] Remove console.logs (except intentional ones)
  - [x] Remove commented-out code

### Step 9.3: Migration Guide
- [x] **Create USER_MIGRATION.md**:
  - [x] Explain what changed for users
  - [x] Note that stats/progress will be preserved
  - [x] Explain new features (if any)
  - [x] Provide troubleshooting steps
- [x] **Create rollback plan** (optional):
  - [x] Document how to revert to vanilla version
  - [x] Create backup of localStorage data
  - [x] Document how to restore if needed
- [x] **Update CHANGELOG.md**:
  - [x] Document migration as major version change
  - [x] List all changes
  - [x] Note breaking changes (if any)
  - [x] Add date of migration

### Step 9.4: Final Review
- [x] **Code review**:
  - [x] Review all new code for quality
  - [x] Verify TypeScript types are correct
  - [x] Verify no `any` types (except where necessary)
  - [x] Verify error handling is appropriate
- [x] **Security review**:
  - [x] Verify no sensitive data in code
  - [x] Verify analytics tokens are configurable
  - [x] Review dependency vulnerabilities: `npm audit`
- [x] **Performance review**:
  - [x] Verify app loads quickly
  - [x] Verify no memory leaks (use Chrome DevTools)
  - [x] Verify animations are smooth (60fps)
- [x] **Final testing**:
  - [x] Run through entire game flow one more time
  - [x] Test on multiple devices
  - [x] Get feedback from beta testers (optional)

**Test checkpoint**: ✅ Documentation complete, code clean, ready to ship

---

## 🎯 Success Criteria

### ✅ Feature Parity Achieved:
- [ ] All original game functionality works
- [ ] Stats, streaks, sharing preserved
- [ ] PWA functionality maintained
- [ ] Analytics working (in prod)
- [ ] **NO sweetalert2 anywhere** - all replaced with shadcn/ui

### ✅ Quality Standards Met:
- [ ] TypeScript strict mode passes
- [ ] No console errors in production
- [ ] Lighthouse scores: Performance >90, Accessibility >95
- [ ] Works on mobile & desktop
- [ ] Dark theme is default, light theme available
- [ ] All animations smooth and performant

### ✅ Developer Experience Improved:
- [ ] Type safety prevents bugs
- [ ] Component reusability
- [ ] Clear separation of concerns
- [ ] Easy to add features
- [ ] Well-documented codebase

---

## 📦 Key Dependencies Summary

### **Core:**
- React 19 + TypeScript
- Vite 7
- TinyBase (store + IndexedDB persister)

### **UI:**
- shadcn/ui components (Dialog, AlertDialog, Toast, Button, Card)
- Tailwind CSS 4
- lucide-react (icons)
- **Sonner** (toast notifications - REPLACES sweetalert2)

### **Game Logic (ported from original):**
- @rwh/keystrokes (keyboard bindings)
- dayjs (date handling)
- emoji-blast (win effects)
- balloons-js (win effects)
- clipboard (share fallback)

### **Build:**
- vite-plugin-pwa
- TypeScript ~5.9

### **Removed:**
- ❌ sweetalert2
- ❌ @sweetalert2/theme-dark

---

## 🚀 How to Execute This Plan

Each phase can be worked on independently. **Recommended approach:**

1. **Phase 0-1**: Get foundation solid (types, utilities)
2. **Phase 2**: Get TinyBase working (critical path)
3. **Phase 3**: Build hooks (enables parallel UI work)
4. **Phase 4-5**: Build UI and wire everything together
5. **Phase 6-9**: Polish and ship

**At each checkpoint, commit your changes.** This ensures you can roll back if needed and provides clear progress tracking.

### **Working Through the Plan:**
- Check off items as you complete them
- Test at each checkpoint before moving on
- Commit after each major step
- If stuck, refer back to original files for reference
- Use Context7 tools to look up TinyBase/shadcn docs as needed

---

## 📝 Component Mapping Reference

| Original (Vanilla JS) | New (React + TypeScript) | Notes |
|----------------------|--------------------------|-------|
| `buildGuessesRows()` | `<Board>`, `<Row>`, `<Box>` | Declarative components |
| `handleKey()` | `useKeyboard` hook + `<Keyboard>` | Hook manages bindings |
| `colorGuess()` | `calculateLetterStatuses()` | Pure function in utils |
| `initStats()` / `updateStats()` | `useStats` hook | TinyBase integration |
| `Swal.fire()` stats | `<StatsModal>` | shadcn Dialog |
| `Swal.fire()` instructions | `<InstructionsModal>` | shadcn Dialog |
| `Swal.fire()` win/lose | `<GameEndDialog>` | shadcn Dialog/AlertDialog |
| `Swal.fire()` toasts | `toast()` from Sonner | Toast notifications |
| localStorage | TinyBase + IndexedDB | With migration helper |

---

## 🆘 Troubleshooting

### **If migration fails:**
1. Check browser console for errors
2. Verify `localStorage` keys exist before migration
3. Test with fresh browser profile
4. Check TinyBase store contents in DevTools

### **If build fails:**
1. Verify all dependencies installed
2. Check for TypeScript errors: `npm run build`
3. Check Vite config is correct
4. Verify all imports use correct aliases

### **If components don't render:**
1. Check TinyBase Provider is wrapping app
2. Verify store is initialized before use
3. Check React DevTools for component tree
4. Verify hooks are called inside components

---

**End of Migration Plan**

Good luck with the migration! 🚀
