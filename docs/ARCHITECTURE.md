# Birdle Architecture Documentation

**Version:** 2.0 (TypeScript React)  
**Last Updated:** January 2, 2026  
**Migration:** Vanilla JS → TypeScript + React + TinyBase

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Project Structure](#project-structure)
5. [Data Flow](#data-flow)
6. [Component Hierarchy](#component-hierarchy)
7. [State Management](#state-management)
8. [Data Schema](#data-schema)
9. [Hooks Architecture](#hooks-architecture)
10. [Persistence Strategy](#persistence-strategy)
11. [Type System](#type-system)
12. [Performance Optimizations](#performance-optimizations)
13. [Build & Deployment](#build--deployment)

---

## Overview

Birdle is a TypeScript React application that provides a Wordle-like game experience with modern web technologies. The architecture emphasizes:

- **Type Safety** - Full TypeScript coverage
- **Reactive State** - TinyBase for reactive data management
- **Component Composition** - Modular React components
- **Persistent Storage** - IndexedDB via TinyBase persister
- **Progressive Enhancement** - PWA with offline support

### Architecture Goals

1. **Maintainability** - Clean, modular code with clear separation of concerns
2. **Performance** - Fast load times, smooth animations, efficient re-renders
3. **Accessibility** - WCAG AA compliant, keyboard navigation, screen reader support
4. **Offline-First** - Full functionality without internet connection
5. **Type Safety** - Catch errors at compile time, not runtime

---

## Technology Stack

### Core Framework

```
React 18.3.1           # UI library with concurrent features
TypeScript 5.6.2       # Type-safe JavaScript
Vite 7.3.0             # Build tool and dev server
```

### UI Layer

```
Tailwind CSS 4.0       # Utility-first CSS framework
shadcn/ui              # Accessible component primitives
Sonner                 # Toast notifications
Lucide React           # Icon library
```

### State Management

```
TinyBase 5.3.2         # Reactive data store
- createStore          # Store creation
- IndexedDbPersister   # Persistence layer
- React hooks          # React integration (useRow, useCell)
```

### Additional Libraries

```
@rwh/keystrokes        # Keyboard event handling
emoji-blast            # Win celebration effects
balloons-js            # Additional celebration effects
dayjs                  # Date/time utilities
clipboard              # Clipboard API polyfill
```

### Development Tools

```
ESLint                 # Code linting
Prettier               # Code formatting
TypeScript ESLint      # TypeScript linting rules
Vite PWA Plugin        # PWA manifest and service worker generation
```

---

## Architecture Patterns

### 1. Component-Based Architecture

**Pattern:** Atomic Design (Atoms → Molecules → Organisms)

```
Atoms (Basic UI)       → Box, Key, Button, Toast
Molecules (Composed)   → Row, Keyboard Row
Organisms (Features)   → Board, Keyboard, Header, Modals
Templates (Layout)     → GameShell
Pages (App)            → App
```

### 2. Custom Hooks Pattern

**Pattern:** Hook-based business logic separation

```
useGameState    # Game logic and state
useStats        # Statistics tracking
useKeyboard     # Keyboard input handling
useTheme        # Theme management
useToast        # Toast notifications
```

### 3. Container/Presentational Pattern

**Container Components:**
- Manage state and business logic
- Connect to TinyBase store
- Handle side effects

**Presentational Components:**
- Pure, stateless components
- Receive props only
- Focus on UI rendering

### 4. Dependency Injection

**Pattern:** Store passed as prop

```typescript
// Store created at app root
const store = createGameStore();

// Passed down through components
<GameShell store={store} />
  <Board store={store} />
  <Keyboard store={store} />
```

### 5. Lazy Loading

**Pattern:** Dynamic imports for optional features

```typescript
// Load emoji-blast only when needed
const triggerWinEffects = async () => {
  const { emojiBlast } = await import('emoji-blast');
  // Use emoji-blast
};
```

---

## Project Structure

```
birdle/
├── public/                      # Static assets
│   ├── _headers                # Cloudflare headers config
│   ├── _redirects              # Redirect rules
│   ├── favicon.png             # App icon
│   └── robots.txt              # SEO crawl rules
│
├── src/
│   ├── components/             # React components
│   │   ├── Board/             # Game board
│   │   │   ├── Box.tsx        # Single letter box
│   │   │   ├── Row.tsx        # Row of 5 boxes
│   │   │   └── Board.tsx      # Complete 6x5 grid
│   │   │
│   │   ├── Keyboard/          # Virtual keyboard
│   │   │   ├── Key.tsx        # Individual key
│   │   │   └── Keyboard.tsx   # Complete keyboard
│   │   │
│   │   ├── Modals/            # Dialog modals
│   │   │   ├── GameEndDialog.tsx      # Win/loss dialog
│   │   │   ├── InstructionsModal.tsx  # How to play
│   │   │   ├── SettingsModal.tsx      # App settings
│   │   │   └── StatsModal.tsx         # Statistics
│   │   │
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (other shadcn components)
│   │   │
│   │   ├── GameShell.tsx      # Main game container
│   │   ├── Header.tsx         # App header
│   │   └── Toaster.tsx        # Toast container
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useGameState.ts   # Game state management
│   │   ├── useStats.ts       # Statistics tracking
│   │   ├── useKeyboard.ts    # Keyboard input
│   │   ├── useTheme.ts       # Theme management
│   │   ├── useToast.ts       # Toast notifications
│   │   └── index.ts          # Barrel export
│   │
│   ├── store/                 # TinyBase store
│   │   ├── schema.ts         # Store schema & types
│   │   ├── store.ts          # Store creation
│   │   ├── persister.ts      # IndexedDB persistence
│   │   ├── migration.ts      # localStorage migration
│   │   ├── utils.ts          # Store utilities
│   │   └── index.ts          # Barrel export
│   │
│   ├── utils/                 # Utility functions
│   │   ├── game-logic.ts     # Game rules & validation
│   │   ├── colors.ts         # Letter/key status calculation
│   │   ├── share.ts          # Share functionality
│   │   ├── theme.ts          # Theme utilities
│   │   ├── wake-lock.ts      # Wake lock API
│   │   ├── analytics.ts      # Analytics integration
│   │   └── index.ts          # Barrel export
│   │
│   ├── types/                 # TypeScript types
│   │   ├── game.ts           # Game state types
│   │   ├── stats.ts          # Statistics types
│   │   ├── settings.ts       # Settings types
│   │   └── index.ts          # Barrel export
│   │
│   ├── data/                  # Game data
│   │   ├── words.ts          # Answer word list
│   │   └── allowed.ts        # Allowed guess words
│   │
│   ├── pwa/                   # PWA configuration
│   │   └── registerServiceWorker.ts
│   │
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Application entry point
│   ├── index.css              # Global styles
│   └── vite-env.d.ts          # Vite type declarations
│
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies & scripts
```

---

## Data Flow

### Unidirectional Data Flow

```
User Action
    ↓
Event Handler (Component)
    ↓
Custom Hook (useGameState, etc.)
    ↓
TinyBase Store Update
    ↓
IndexedDB Persister (auto-save)
    ↓
TinyBase Subscription
    ↓
React Hook (useRow, useCell)
    ↓
Component Re-render
    ↓
UI Update
```

### Example: Letter Entry Flow

```typescript
// 1. User presses 'A' key
<Key letter="a" onClick={() => handleLetter('a')} />

// 2. Event handler calls hook
const { handleLetter } = useGameState(store);

// 3. Hook updates store
handleLetter('a') {
  const newGuessesRows = [...guessesRows];
  newGuessesRows[currentRow][currentGuess] = 'A';
  store.setRow(TABLES.GAMES, gameId, gameStateToRow(newState));
}

// 4. TinyBase notifies subscribers
store.setRow() → triggers subscriptions

// 5. Hook receives update
const gameState = useRow(TABLES.GAMES, gameId, store);

// 6. Component re-renders with new state
<Box letter="A" status="empty" />
```

---

## Component Hierarchy

### Full Component Tree

```
App
└── Provider (TinyBase)
    ├── GameShell
    │   ├── Header
    │   │   └── Buttons (Stats, Instructions, Settings)
    │   │
    │   ├── Board
    │   │   └── Row × 6
    │   │       └── Box × 5
    │   │
    │   ├── Keyboard
    │   │   └── Key × 30
    │   │
    │   ├── GameEndDialog
    │   │   ├── DialogContent
    │   │   ├── Stats Summary
    │   │   └── Action Buttons
    │   │
    │   ├── StatsModal
    │   │   ├── Stats Grid
    │   │   ├── Guess Distribution
    │   │   ├── Countdown Timer
    │   │   └── Share Button
    │   │
    │   ├── InstructionsModal
    │   │   ├── Game Rules
    │   │   └── Example Boxes
    │   │
    │   └── SettingsModal
    │       ├── Theme Selection
    │       └── Celebration Toggles
    │
    └── Toaster
        └── Toast (dynamic)
```

### Component Responsibilities

#### App
- Create TinyBase store
- Setup IndexedDB persistence
- Run localStorage migration
- Provide store to children

#### GameShell
- Orchestrate game flow
- Manage modal states
- Trigger win effects
- Handle wake lock

#### Board
- Render 6 rows
- Determine which rows are submitted
- Trigger animations
- ARIA live region

#### Row
- Render 5 boxes
- Calculate letter statuses
- Handle animation delays

#### Box
- Display single letter
- Show status color
- Animate on entry/reveal

#### Keyboard
- Render 30 keys
- Calculate key statuses
- Handle key presses
- Disable when game over

#### Modals
- Display information/settings
- Handle user interactions
- Manage open/close state
- Share functionality

---

## State Management

### TinyBase Store

**Architecture:** Single reactive store with three tables

```typescript
Store {
  games: {
    [gameId]: GameState
  },
  stats: {
    current: Stats
  },
  settings: {
    current: Settings
  }
}
```

### Store Operations

**Read Operations:**
```typescript
// Read entire row
const gameState = useRow(TABLES.GAMES, gameId, store);

// Read single cell
const theme = useCell(TABLES.SETTINGS, 'current', 'theme', store);
```

**Write Operations:**
```typescript
// Update entire row
store.setRow(TABLES.GAMES, gameId, gameStateRow);

// Update single cell
store.setCell(TABLES.SETTINGS, 'current', 'theme', 'dark');
```

### Subscription Model

TinyBase provides automatic subscriptions via React hooks:

```typescript
// Component subscribes to changes
const gameState = useRow(TABLES.GAMES, gameId, store);

// When store updates, component re-renders
// No manual subscription management needed
```

---

## Data Schema

### Games Table

**Purpose:** Store game state for current and past games

```typescript
interface GamesTableRow {
  gameId: number;                    // Game identifier (day number)
  guessesRows: string;               // JSON: string[][]
  guessesSubmitted: string;          // JSON: string[]
  currentRow: number;                // 0-5 (current guess row)
  currentGuess: number;              // 0-4 (current letter position)
  wonGame: boolean;                  // Game won?
  isGameOver: boolean;               // Game complete?
  lastPlayedDate: string;            // ISO date string
}
```

**Row ID:** Game day number (e.g., "123")

### Stats Table

**Purpose:** Store aggregate player statistics

```typescript
interface StatsTableRow {
  currentStreak: number;             // Consecutive wins
  maxStreak: number;                 // Longest win streak
  guesses: string;                   // JSON: { 1-6: count, fail: count }
  winPercentage: number;             // Win rate (0-100)
  gamesPlayed: number;               // Total games
  gamesWon: number;                  // Total wins
  averageGuesses: number;            // Average guesses per win
}
```

**Row ID:** 'current' (single row)

### Settings Table

**Purpose:** Store UI preferences

```typescript
interface SettingsTableRow {
  theme: string;                     // 'dark' | 'light' | 'system'
  showInstructions: boolean;         // Show instructions on first load
  emojiBlasts: boolean;              // Enable emoji blast celebrations
  balloons: boolean;                 // Enable balloon celebrations
}
```

**Row ID:** 'current' (single row)

---

## Hooks Architecture

### useGameState Hook

**Purpose:** Manage game state and game logic

```typescript
interface UseGameStateReturn {
  gameState: GameState | null;      // Current game state
  birdle: BirdleOfDay;               // Today's word and day
  isLoading: boolean;                // Loading state
  handleLetter: (letter: string) => void;
  deleteLetter: () => void;
  submitGuess: () => void;
  resetGame: () => void;
  canAddLetter: boolean;
  canSubmit: boolean;
}
```

**Responsibilities:**
- Read game state from store
- Handle letter input
- Validate guesses
- Submit guesses
- Update game state
- Detect win/loss conditions

### useStats Hook

**Purpose:** Track and update player statistics

```typescript
interface UseStatsReturn {
  stats: Stats | null;               // Current statistics
  isLoading: boolean;                // Loading state
  updateStats: (won: boolean, attempts: number) => void;
  resetStats: () => void;
}
```

**Responsibilities:**
- Read stats from store
- Update stats on game completion
- Calculate win percentage
- Track streaks
- Update guess distribution

### useKeyboard Hook

**Purpose:** Handle keyboard input

```typescript
interface UseKeyboardReturn {
  keyStatuses: Map<string, KeyStatus>;  // Status for each key
}
```

**Responsibilities:**
- Bind physical keyboard events
- Calculate key status colors
- Unbind on unmount
- Disable when game over

### useTheme Hook

**Purpose:** Manage theme preference

```typescript
interface UseThemeReturn {
  theme: Theme;                      // Current theme preference
  effectiveTheme: 'dark' | 'light';  // Resolved theme
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
```

**Responsibilities:**
- Read theme from store
- Apply theme to DOM
- Listen for system theme changes
- Update theme color meta tag

---

## Persistence Strategy

### IndexedDB via TinyBase

**Database:** `birdle-db`

**Strategy:** Auto-save on every store change

```typescript
// Create persister
const persister = createIndexedDbPersister(store, 'birdle-db');

// Start auto-save and auto-load
await persister.startAutoSave();
await persister.startAutoLoad();
```

### Migration from localStorage

**One-time migration on first load:**

```typescript
// Check if already migrated
if (!localStorage.getItem('birdle-migrated-to-tinybase')) {
  // Read legacy data
  const gameState = JSON.parse(localStorage.getItem('gameState'));
  const stats = JSON.parse(localStorage.getItem('stats'));
  
  // Write to TinyBase
  store.setRow(TABLES.GAMES, gameState.gameId, gameStateToRow(gameState));
  store.setRow(TABLES.STATS, 'current', statsToRow(stats));
  
  // Mark as migrated
  localStorage.setItem('birdle-migrated-to-tinybase', 'true');
}
```

### Data Flow

```
User Action
    ↓
Store Update
    ↓
TinyBase Persister (auto-save)
    ↓
IndexedDB Write
    ↓
[Data persisted]
```

---

## Type System

### Core Types

```typescript
// Box status (letter state)
type BoxStatus = 'correct' | 'present' | 'absent' | 'empty';

// Key status (keyboard key state)
type KeyStatus = 'correct' | 'present' | 'absent' | 'unused';

// Theme preference
type Theme = 'dark' | 'light' | 'system';

// Guess row (5 letters)
type GuessRow = string[];
```

### Interfaces

```typescript
// Complete game state
interface GameState {
  gameId: number;
  guessesRows: GuessRow[];
  guessesSubmitted: string[];
  currentRow: number;
  currentGuess: number;
  wonGame: boolean;
  isGameOver: boolean;
  lastPlayedDate: string;
}

// Player statistics
interface Stats {
  currentStreak: number;
  maxStreak: number;
  guesses: {
    1: number; 2: number; 3: number;
    4: number; 5: number; 6: number;
    fail: number;
  };
  winPercentage: number;
  gamesPlayed: number;
  gamesWon: number;
  averageGuesses: number;
}

// Today's Birdle
interface BirdleOfDay {
  word: string;
  day: number;
}
```

### Type Safety Benefits

1. **Compile-time checks** - Catch errors before runtime
2. **IntelliSense** - IDE autocomplete and hints
3. **Refactoring safety** - Rename/move with confidence
4. **Documentation** - Types serve as inline documentation
5. **Reduced bugs** - Eliminate entire classes of errors

---

## Performance Optimizations

### Bundle Optimization

**Current Bundle Sizes:**
- Main JS: 471.70 kB (154.78 kB gzipped) ✅
- CSS: 43.43 kB (8.67 kB gzipped) ✅
- Total: ~163 kB gzipped ✅

**Techniques Used:**
- Tree-shaking (Vite automatically removes unused code)
- Code splitting (dynamic imports for optional features)
- Minification (production build)
- Compression (gzip)

### Lazy Loading

**Lazy-loaded libraries:**

```typescript
// Emoji-blast (only on win, if enabled)
const { emojiBlast } = await import('emoji-blast');

// Balloons (only on win, if enabled)
const balloons = await import('balloons-js');
```

**Benefits:**
- Smaller initial bundle
- Faster first load
- Pay-for-what-you-use

### React Optimizations

**useCallback for event handlers:**
```typescript
const handleLetter = useCallback((letter: string) => {
  // Handler logic
}, [dependencies]);
```

**useMemo for computed values:**
```typescript
const effectiveTheme = useMemo(() => {
  return getEffectiveTheme(theme);
}, [theme]);
```

**Efficient subscriptions:**
- TinyBase subscriptions only trigger on actual changes
- No unnecessary re-renders
- Granular updates (useCell for single values)

### Animation Performance

**CSS-based animations:**
- GPU-accelerated transforms
- 60fps target
- Respects `prefers-reduced-motion`

```css
@keyframes flip {
  0% { transform: rotateX(0); }
  50% { transform: rotateX(-90deg); }
  100% { transform: rotateX(0); }
}
```

---

## Build & Deployment

### Build Process

```bash
# Development build
npm run dev              # Start Vite dev server

# Production build
npm run build            # TypeScript check + Vite build
```

**Build Output:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── ... (other chunks)
├── birdle.webmanifest
├── service-worker.js
└── workbox-[hash].js
```

### Build Steps

1. **TypeScript Compilation** (`tsc -b`)
   - Type checking
   - No emit (Vite handles compilation)

2. **Vite Build**
   - Module bundling
   - Tree-shaking
   - Minification
   - Asset optimization

3. **PWA Generation**
   - Service worker
   - Web manifest
   - Precache configuration

### Deployment Configuration

**Target:** Static hosting (Cloudflare Pages, Netlify, Vercel, etc.)

**Headers Configuration:** (`public/_headers`)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

**Redirects:** (`public/_redirects`)
```
/*  /index.html  200
```

### Environment Variables

**Required:** None (all features work without configuration)

**Optional:**
- `VITE_CLOUDFLARE_ANALYTICS_TOKEN` - Cloudflare Web Analytics
- `VITE_GA_MEASUREMENT_ID` - Google Analytics

---

## Security Considerations

### Data Security

1. **No Sensitive Data** - All data is local (IndexedDB)
2. **No Authentication** - Stateless application
3. **No Server Communication** - Except analytics (optional)
4. **Content Security Policy** - Via headers

### Dependencies

**Audit regularly:**
```bash
npm audit           # Check for vulnerabilities
npm audit fix       # Auto-fix if possible
```

**Keep Updated:**
- Regular dependency updates
- Security patches
- Breaking change reviews

---

## Testing Strategy

### Manual Testing

Comprehensive testing guide in `TESTING_GUIDE.md`:
- Game functionality
- Keyboard testing
- Validation
- Persistence
- Theme switching
- Modals
- Share functionality
- PWA features
- Responsive design
- Accessibility

### Performance Testing

**Lighthouse Targets:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

**Tools:**
- Chrome DevTools
- React DevTools
- Lighthouse

---

## Future Enhancements

### Potential Improvements

1. **Multiplayer Mode** - Share games with friends
2. **Custom Word Lists** - User-defined words
3. **Daily Challenges** - Special themed words
4. **Achievement System** - Unlock rewards
5. **Sound Effects** - Audio feedback
6. **Hard Mode** - Letters must be reused
7. **Colorblind Mode** - Alternative color schemes
8. **Stats Export** - Download statistics
9. **Social Features** - Leaderboards

### Architecture Considerations

- All features should maintain offline-first approach
- New features should be lazy-loaded where possible
- Maintain accessibility standards
- Keep bundle size under control
- Preserve backward compatibility with existing data

---

## Conclusion

Birdle's architecture emphasizes:

✅ **Type Safety** - TypeScript throughout  
✅ **Performance** - Optimized bundle, lazy loading  
✅ **Accessibility** - WCAG AA compliant  
✅ **Offline-First** - PWA with IndexedDB  
✅ **Maintainability** - Clean separation of concerns  
✅ **Modern Stack** - React, TinyBase, Vite  

The migration from vanilla JavaScript to this architecture provides a solid foundation for future enhancements while maintaining excellent user experience.

---

**Version:** 2.0  
**Last Updated:** January 2, 2026  
**Maintainers:** [@mikesprague](https://github.com/mikesprague)