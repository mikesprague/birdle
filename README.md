# BIRDLE 🐥

A TypeScript React Wordle clone with modern architecture and offline support.

## ✨ Features

- 🎮 **Same Rules** - Uses original (pre-NYT) Wordle word lists and gameplay
- 💾 **Persistent State** - Game progress and statistics saved via IndexedDB
- 🎨 **Theme Support** - Light, dark, and system theme options
- ⌨️ **Keyboard Support** - Physical keyboard bindings for desktop users
- 📱 **Progressive Web App** - Offline-capable, installable, responsive
- 📤 **Native Sharing** - Share results with native share API or clipboard fallback
- 🎉 **Win Celebrations** - Optional emoji blasts and balloon effects
- ♿ **Accessible** - WCAG AA compliant with screen reader support

### Results Sharing

Share your game results with bird-themed emojis:
- 🥚 absent (letter not in word)
- 🐣 present (letter in word, wrong position)
- 🐥 correct (letter in correct position)

Example:
```text
Birdle 123 3/6

🥚🐣🥚🥚🐥
🐥🐥🥚🐣🐥
🐥🐥🐥🐥🐥
```

## 🛠️ Tech Stack

### Core Framework
- **React 19** - Modern UI library with concurrent features
- **TypeScript 5.9** - Full type safety and excellent IDE support
- **Vite 7** - Lightning-fast build tool and dev server

### UI & Styling
- **Tailwind CSS 4** - Utility-first styling with CSS variables
- **shadcn/ui** - Beautifully designed, accessible component library
- **Lucide React** - Consistent icon system

### State Management & Storage
- **TinyBase 7** - Reactive, tabular data store with powerful query capabilities
- **IndexedDB Persister** - Client-side persistent storage with automatic sync
- **Custom React Hooks** - Encapsulated game logic and state management

### Developer Experience
- **Biome** - Fast linter and formatter (replaces ESLint + Prettier)
- **TypeScript Strict Mode** - Maximum type safety
- **Vite PWA Plugin** - Automated service worker and manifest generation

### Additional Libraries
- **@rwh/keystrokes** - Physical keyboard bindings
- **emoji-blast** - Celebration effects
- **balloons-js** - Win animations
- **Sonner** - Toast notifications
- **dayjs** - Date manipulation

> See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed component and data flow diagrams.

## 📋 Requirements

- **Node.js** >= 22.x (pinned via Volta)
- **npm** >= 10.x (pinned via Volta)

> The project uses Volta for Node version management. Versions are automatically enforced if you have Volta installed.

## 🚀 Getting Started

### Development

```bash
# Clone the repository
git clone https://github.com/mikesprague/birdle.git

# Navigate to project directory
cd birdle

# Install dependencies
npm install

# Start development server
npm start
# or
npm run dev
```

Visit **http://localhost:3001** in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The production build outputs to `dist/`.

## 📁 Project Structure

```
birdle/
├── src/
│   ├── components/           # React components
│   │   ├── Board/           # Game board (Board, Row, Box)
│   │   ├── Keyboard/        # Virtual keyboard (Keyboard, Key)
│   │   ├── Modals/          # Dialogs (Stats, Settings, Instructions, GameEnd)
│   │   └── ui/              # shadcn/ui base components
│   ├── hooks/               # Custom React hooks
│   │   ├── useGameState.ts  # Core game logic
│   │   ├── useStats.ts      # Statistics management
│   │   ├── useKeyboard.ts   # Keyboard input handling
│   │   └── useTheme.ts      # Theme management
│   ├── store/               # TinyBase store architecture
│   │   ├── schema.ts        # Table definitions
│   │   ├── store.ts         # Store initialization
│   │   ├── persister.ts     # IndexedDB persistence
│   │   └── migration.ts     # localStorage → TinyBase migration
│   ├── utils/               # Utility functions
│   │   ├── game-logic.ts    # Game mechanics (word validation, etc.)
│   │   ├── colors.ts        # Box/key color calculations
│   │   ├── share.ts         # Result sharing
│   │   └── analytics.ts     # Analytics integration
│   ├── types/               # TypeScript type definitions
│   ├── data/                # Word lists (2,315 words + 10,657 allowed)
│   └── pwa/                 # PWA configuration
├── public/                  # Static assets (_headers, _redirects, robots.txt)
├── dist/                    # Production build output (gitignored)
└── src-legacy/              # Original vanilla JS (archived for reference)
```

> See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed component relationships and data flow.

## 🎮 How to Play

1. Guess the 5-letter bird-related word in 6 tries
2. After each guess, the color of the tiles changes:
   - 🐥 **Green** - Letter is correct and in the right position
   - 🐣 **Yellow** - Letter is in the word but wrong position
   - 🥚 **Gray** - Letter is not in the word
3. Use the on-screen keyboard or your physical keyboard
4. Share your results when you win!

## 🔄 Migration from Vanilla Version

This is a **complete rewrite** from vanilla JavaScript to TypeScript + React (Version 2.0).

### What's New
- ✅ **Full TypeScript** - Strict mode with comprehensive type coverage
- ✅ **React 19** - Modern component architecture with hooks
- ✅ **TinyBase Store** - Reactive data management with IndexedDB persistence
- ✅ **shadcn/ui** - Accessible, customizable component library (replaces sweetalert2)
- ✅ **Biome** - Fast, unified linting and formatting
- ✅ **Enhanced Animations** - Smooth transitions and win celebrations
- ✅ **Better Accessibility** - WCAG AA compliant with screen reader support

### User Data Migration
**The app automatically migrates your data on first load:**
- ✅ Game state (current guesses, progress) → TinyBase `games` table
- ✅ Statistics (streaks, win rate, etc.) → TinyBase `stats` table
- ✅ Theme preferences → TinyBase `settings` table
- ✅ **No data loss!** - Old localStorage is preserved as backup

### For Developers
The original vanilla JS code is archived in `src-legacy/` for reference. See [MIGRATION_PLAN.md](MIGRATION_PLAN.md) for the complete migration strategy and implementation phases.

**Breaking Changes:**
- Build output moved from `dist/` to root `dist/`
- Development server port changed from 3000 → 3001
- Node.js >= 22.x required
- All imports now use `@/` path alias

## 🛠️ Development

### Available Scripts

```bash
# Development
npm start              # Start dev server (port 3001)
npm run dev            # Start dev server (alias)

# Building
npm run build          # TypeScript compile + Vite build
npm run preview        # Preview production build locally

# Code Quality
npm run clean          # Remove dist/ directory
```

> **Note:** This project uses **Biome** for linting and formatting. Configure your editor to use Biome for the best experience.

### Environment Variables

Create a `.env` file in the project root:

```env
# Optional: Analytics
VITE_CLOUDFLARE_ANALYTICS_TOKEN=your_token_here
VITE_GA_MEASUREMENT_ID=your_ga_id_here
```

## 🎨 Customization

### Themes
Three theme options available in Settings:
- **Light** - Light color scheme
- **Dark** - Dark color scheme (default)
- **System** - Follows OS preference

### Celebrations
Toggle win celebration effects in Settings:
- **Emoji Blasts** - Bird emoji animations on win
- **Balloons** - Balloon celebration effects on win

## ♿ Accessibility

- **WCAG AA Compliant** - Color contrast meets accessibility standards
- **Keyboard Navigation** - Full keyboard support for navigation and gameplay
- **Screen Reader Support** - ARIA labels and live regions for game state
- **Reduced Motion** - Respects `prefers-reduced-motion` setting
- **Touch Targets** - Minimum 44x44px touch targets on mobile

## 📱 PWA Features

- **Offline Support** - Play without internet connection
- **Installable** - Add to home screen on mobile or desktop
- **Auto-updates** - Automatically updates when new version available
- **Responsive** - Optimized for mobile, tablet, and desktop

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code patterns
   - Add JSDoc comments for complex logic
   - Test manually (see [TESTING_GUIDE.md](TESTING_GUIDE.md))
4. **Verify code quality**
   ```bash
   npm run build          # Ensure TypeScript compiles
   ```
   - Biome will auto-format on save if configured
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### Code Standards

- ✅ **TypeScript Strict Mode** - No `any` without justification
- ✅ **Functional Components** - Use hooks, no class components
- ✅ **Tailwind CSS** - Utility-first styling, minimal custom CSS
- ✅ **TinyBase Patterns** - Use store utilities from `src/store/utils.ts`
- ✅ **Accessibility** - ARIA labels, keyboard navigation, color contrast
- ✅ **JSDoc Comments** - Document public APIs and complex logic

> See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing procedures.
