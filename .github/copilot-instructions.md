# Copilot / AI Agent Instructions for Birdle

**Version:** 2.0.0-beta.1 | **TypeScript React PWA** | **Status:** Complete

## Quick Overview

- **Stack:** React 19 + TypeScript 5.9 + Vite 7 + TinyBase 7 + shadcn/ui + Tailwind CSS 4
- **Entry:** `src/main.tsx` → `src/App.tsx` → `src/components/GameShell.tsx`
- **State:** TinyBase with IndexedDB persistence (3 tables: `games`, `stats`, `settings`)
- **Code Quality:** Biome (linter + formatter), TypeScript strict mode
- **Dev Server:** `npm start` on http://localhost:3001

## Project Structure

```
src/
├── components/
│   ├── Board/              # Board → Row → Box
│   ├── Keyboard/           # Keyboard → Key
│   ├── Modals/             # Stats, Settings, Instructions, GameEnd
│   ├── ui/                 # shadcn/ui components (don't modify directly)
│   ├── GameShell.tsx       # Main game orchestrator
│   ├── Header.tsx          # App header with modal triggers
│   └── Toaster.tsx         # Toast wrapper
├── hooks/
│   ├── useGameState.ts     # Core game logic + TinyBase
│   ├── useStats.ts         # Statistics management
│   ├── useKeyboard.ts      # Physical + virtual keyboard
│   ├── useTheme.ts         # Theme (dark/light/system)
│   └── useToast.ts         # Toast helpers
├── store/
│   ├── schema.ts           # TinyBase table definitions
│   ├── store.ts            # Store initialization
│   ├── persister.ts        # IndexedDB auto-sync
│   ├── migration.ts        # localStorage → TinyBase (one-time)
│   └── utils.ts            # Store helper functions
├── utils/
│   ├── game-logic.ts       # Word validation, getBirdleOfDay()
│   ├── colors.ts           # Box/key status calculations
│   ├── share.ts            # Result sharing
│   ├── analytics.ts        # Analytics integration
│   └── theme.ts, wake-lock.ts
├── types/game.ts           # All TypeScript types
├── data/
│   ├── words.ts            # 2,315 game words
│   └── allowed.ts          # 10,657 valid words
└── pwa/registerServiceWorker.ts
```

## Critical Information

### TinyBase Store Structure
```typescript
games: {
  [gameId: string]: {           // gameId format: "YYYY-MM-DD"
    guessesRows: string[][];    // 2D array of guesses
    guessesSubmitted: string[]; // Flattened submitted guesses
    currentRow: number;
    currentCol: number;
    wonGame: boolean;
    isGameOver: boolean;
  }
}

stats: {
  current: {
    currentStreak: number;
    maxStreak: number;
    guesses: { [key: string]: number };  // Distribution
    winPercentage: number;
    gamesPlayed: number;
    gamesWon: number;
    averageGuesses: number;
  }
}

settings: {
  current: {
    theme: 'light' | 'dark' | 'system';
    celebrations: boolean;
  }
}
```

### Word of the Day Calculation
- **Start date:** `new Date(2022, 0, 0)` — **DO NOT CHANGE** (breaks game IDs)
- **Formula:** Days since start % word list length
- **Location:** `getBirdleOfDay()` in `src/utils/game-logic.ts`

### Status System
- **Box:** `'correct' | 'present' | 'absent' | 'empty'`
- **Key:** `'correct' | 'present' | 'absent' | 'unused'`
- **Functions:** `calculateBoxStatuses()`, `calculateKeyboardStatuses()` in `src/utils/colors.ts`
- **CSS:** `bg-correct`, `bg-present`, `bg-absent` (Tailwind)

### Import Aliases
- `@/*` → `src/*` (use everywhere: `import { useGameState } from '@/hooks/useGameState'`)

## Key Patterns & Rules

### TypeScript
- Strict mode enabled — no `any` without justification
- Key types: `GameState`, `Stats`, `BirdleOfDay`, `BoxStatus`, `KeyStatus`
- Use `import type` for type-only imports
- All public APIs have JSDoc comments

### React Components
- Functional components only (no classes)
- Hooks for logic, keep components presentational
- Use TinyBase hooks (`useRow()`, `useCell()`) for reactivity

### shadcn/ui
- Base components in `src/components/ui/` — don't modify directly
- Customize via wrapper components or className overrides
- Install new components: `npx shadcn@latest add <component>`

### Styling
- Tailwind utility classes (primary method)
- CSS variables for theme colors (in `src/index.css`)
- Dark mode: `.dark` class strategy
- Animations: Tailwind + `tw-animate-css`

### State Management
- TinyBase is source of truth — don't duplicate in React state
- Use store utilities from `src/store/utils.ts`
- Prefer reactive hooks over direct store reads

## Development Commands

```bash
npm install          # Install dependencies
npm start            # Dev server (port 3001)
npm run build        # TypeScript compile + Vite build → dist/
npm run preview      # Preview production build
npm run clean        # Remove dist/
```

**Note:** Biome auto-formats on save (no separate lint command)

## Common Tasks

### Add/Remove Words
1. Edit `src/data/words.ts` (game words) or `src/data/allowed.ts` (valid words)
2. Words must be 5 letters, lowercase
3. Test `getBirdleOfDay()` wrapping

### Modify Game State
1. Update `GameState` type in `src/types/game.ts`
2. Update schema in `src/store/schema.ts`
3. Update migration in `src/store/migration.ts`
4. Update `useGameState` hook

### Add New Modal
1. Create in `src/components/Modals/`
2. Use shadcn Dialog: `npx shadcn@latest add dialog`
3. Wire up in `GameShell.tsx` or `Header.tsx`

### Update Theme
1. Edit CSS variables in `src/index.css`
2. Test both light and dark modes

## Gotchas & Important Notes

- **Port:** Dev server uses 3001 (not 3000)
- **TinyBase reactivity:** Always use `useRow()`/`useCell()` hooks, not direct reads
- **Migration:** Runs once on first load (localStorage → TinyBase)
- **Keyboard tokens:** `a-z`, `enter`, `back` (must match physical and virtual)
- **Word lists:** Immutable (`as const`, `readonly`)
- **Start date:** Sacred — changing breaks game ID consistency
- **No automated tests:** Manual testing only (see `TESTING_GUIDE.md`)
- **Analytics:** Only injected in production (via `isDev()` check)

## Accessibility Requirements

- WCAG AA color contrast
- Keyboard navigation for all interactive elements
- ARIA labels on game elements
- Screen reader live regions for state changes
- Respect `prefers-reduced-motion`

## Environment Variables (Optional)

```env
VITE_CLOUDFLARE_ANALYTICS_TOKEN=your_token
VITE_GA_MEASUREMENT_ID=your_ga_id
```

## Key Libraries

- **React 19** - https://react.dev/
- **TinyBase 7** - https://tinybase.org/
- **shadcn/ui** - https://ui.shadcn.com/
- **Tailwind CSS 4** - https://tailwindcss.com/
- **Vite 7** - https://vitejs.dev/
- **@rwh/keystrokes** - Physical keyboard bindings
- **Sonner** - Toast notifications
- **Lucide React** - Icons

## Documentation

- **`ARCHITECTURE.md`** - Detailed architecture, component hierarchy, data flow
- **`TESTING_GUIDE.md`** - Manual testing procedures
- **`CHANGELOG.md`** - Version history
- **`README.md`** - User-facing documentation

## Quick Reference: Common Imports

```typescript
// Hooks
import { useGameState } from '@/hooks/useGameState';
import { useStats } from '@/hooks/useStats';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useTheme } from '@/hooks/useTheme';

// Store
import { store } from '@/store';
import { getCurrentGame, updateGame } from '@/store/utils';

// Utils
import { getBirdleOfDay, isGuessValid } from '@/utils/game-logic';
import { calculateBoxStatuses } from '@/utils/colors';
import { createShareText } from '@/utils/share';

// Types
import type { GameState, Stats, BirdleOfDay } from '@/types/game';

// Data
import { WORDS } from '@/data/words';
import { ALLOWED } from '@/data/allowed';

// shadcn/ui
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
```

## Best Practices for Changes

1. **Read first** - Check existing patterns in similar components
2. **Type everything** - Leverage TypeScript strict mode
3. **Test manually** - Verify in browser (no automated tests)
4. **Preserve accessibility** - Maintain ARIA and keyboard nav
5. **Document logic** - JSDoc for complex code
6. **Follow patterns** - Component structure, hook usage, styling
7. **Use TinyBase correctly** - Prefer store utilities
8. **Never change start date** - Breaks game consistency

---

**Last Updated:** Migration complete, all features implemented  
**Status:** Production-ready