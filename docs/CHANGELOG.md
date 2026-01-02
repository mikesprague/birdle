# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-02

### 🎉 Major Version - Complete TypeScript React Migration

This release represents a complete rewrite of Birdle from vanilla JavaScript to a modern TypeScript React application. All user data (game state and statistics) is automatically migrated from localStorage to IndexedDB.

### Added

#### Core Features
- **TypeScript** - Full type safety throughout the application
- **React 18** - Modern component-based architecture
- **TinyBase** - Reactive state management with IndexedDB persistence
- **shadcn/ui** - Accessible, customizable component library
- **Celebration Settings** - Toggle emoji blasts and balloons in Settings
- **System Theme** - New "System" theme option follows OS preference

#### UI/UX Improvements
- **Enhanced Modals** - Replaced SweetAlert2 with native shadcn/ui dialogs
- **Improved Header** - Clean navigation with icon buttons
- **Better Stats Display** - Enhanced statistics modal with charts
- **Toast Notifications** - Modern toast system using Sonner
- **Smooth Animations** - CSS-based flip, pop, and shake animations
- **Loading States** - Professional loading indicators

#### Accessibility
- **WCAG AA Compliant** - All color contrast meets accessibility standards
- **Screen Reader Support** - ARIA labels and live regions
- **Keyboard Navigation** - Full keyboard support throughout
- **Reduced Motion** - Respects `prefers-reduced-motion` preference
- **Touch Targets** - Minimum 44x44px on mobile devices

#### Developer Experience
- **Vite** - Fast build tool and dev server
- **Hot Module Replacement** - Instant feedback during development
- **TypeScript ESLint** - Code quality enforcement
- **Component Documentation** - JSDoc comments throughout
- **Comprehensive Testing Guide** - Detailed testing procedures

### Changed

#### Architecture
- **State Management** - Migrated from localStorage to TinyBase + IndexedDB
- **Component Structure** - Atomic design pattern (atoms → molecules → organisms)
- **Data Flow** - Unidirectional data flow with custom hooks
- **Styling** - Migrated to Tailwind CSS utility classes
- **Theme System** - CSS custom properties for consistent theming

#### Build & Deployment
- **Build Tool** - Migrated from Vite (vanilla) to Vite (React + TypeScript)
- **Bundle Size** - Optimized to 154.78 kB gzipped (main bundle)
- **Code Splitting** - Lazy loading for emoji-blast and balloons
- **PWA** - Enhanced service worker with Workbox
- **Development Server** - Port changed from 3000 to 3002

#### File Structure
- **React TypeScript Application** - Complete rewrite in TypeScript + React at project root
- **Legacy Code** - Original vanilla JS moved to `src-legacy/` (archived)
- **Build Output** - Production build outputs to `dist/`

### Improved

#### Performance
- **Faster Load Times** - Optimized bundle size (~163 kB total gzipped)
- **Efficient Re-renders** - React hooks with proper memoization
- **Lazy Loading** - Optional features loaded on-demand
- **Build Speed** - ~880ms production build time

#### Code Quality
- **Type Safety** - Zero `any` types (except where necessary)
- **Component Reusability** - Modular, composable components
- **Error Handling** - Comprehensive error boundaries and fallbacks
- **Code Organization** - Clear separation of concerns

#### User Experience
- **Smoother Animations** - GPU-accelerated CSS transforms
- **Better Feedback** - Immediate visual responses to actions
- **Improved Modals** - Native-feeling dialogs with proper focus management
- **Enhanced Sharing** - Better formatted share text with URL

### Fixed

#### Bugs
- **Theme Persistence** - Theme preference now properly persists across sessions
- **Stats Accuracy** - Improved streak calculation logic
- **Keyboard Focus** - Better focus management in modals
- **Mobile Scrolling** - Fixed viewport issues on mobile devices

#### Accessibility
- **Color Contrast** - All text meets WCAG AA standards
- **Focus Indicators** - Visible focus rings on all interactive elements
- **Screen Reader** - Proper announcements for game state changes

### Migration Notes

#### Automatic Data Migration
- **localStorage → IndexedDB** - Automatic one-time migration on first load
- **Game State** - Current game progress preserved
- **Statistics** - All stats (win %, streaks, distribution) transferred
- **Settings** - Theme preference preserved (dark/light converted to new system)
- **No Data Loss** - All user data safely migrated

#### Breaking Changes for Developers
- **Directory Structure** - React TypeScript app at project root
- **Build Commands** - Use `npm run build` from project root
- **Import Paths** - All imports use `@/` alias (e.g., `@/components/Board`)
- **Node Version** - Requires Node.js >= 22.x (updated from >= 16.x)

#### New Development Workflow
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Security

- **Dependency Updates** - All dependencies updated to latest stable versions
- **Vulnerability Fixes** - Zero known vulnerabilities (npm audit clean)
- **CSP Headers** - Content Security Policy headers configured
- **No Sensitive Data** - All data stored locally (IndexedDB)

### Documentation

#### New Documentation Files
- **ARCHITECTURE.md** - Comprehensive architecture documentation
- **TESTING_GUIDE.md** - Detailed testing procedures
- **PHASE_0-8_COMPLETE.md** - Phase completion reports
- **MIGRATION_PLAN.md** - Complete migration roadmap

#### Updated Documentation
- **README.md** - Updated with new tech stack and instructions
- **CONTRIBUTING.md** - Updated development workflow
- **.github/copilot-instructions.md** - Updated for TypeScript React

### Technical Details

#### Dependencies Added
- `react` ^18.3.1
- `react-dom` ^18.3.1
- `typescript` ^5.6.2
- `tinybase` ^5.3.2
- `@shadcn/ui` components
- `sonner` (toast notifications)
- `lucide-react` (icons)
- And more (see `package.json`)

#### Dependencies Removed
- `sweetalert2` (replaced with shadcn/ui dialogs)
- `@sweetalert2/theme-dark` (no longer needed)

#### Bundle Size Comparison
```
Before (Vanilla):  ~180 kB gzipped
After (React):     ~163 kB gzipped
Reduction:         ~17 kB (9.4% smaller)
```

### Performance Metrics

#### Lighthouse Scores (Target)
- **Performance:** > 90
- **Accessibility:** > 95
- **Best Practices:** > 90
- **SEO:** > 90

#### Build Performance
- **Build Time:** ~880ms
- **Modules Transformed:** 1,829
- **Precache Size:** 557.20 KiB (8 entries)

---

## [1.x.x] - Legacy Versions

Previous versions were built with vanilla JavaScript. See git history for details.

### Legacy Features (Preserved in v2.0.0)
- Daily word rotation
- 6 guess attempts
- Letter color feedback (correct/present/absent)
- Statistics tracking
- Win/loss streak
- Share functionality
- Dark/light themes
- PWA offline support
- Physical keyboard support
- Toast notifications

---

## Migration Timeline

**Phase 0:** Pre-Migration Setup (Foundation)  
**Phase 1:** TypeScript Foundation & Type System  
**Phase 2:** TinyBase Store Setup  
**Phase 3:** Custom Hooks Layer  
**Phase 4:** Component Architecture  
**Phase 5:** Main App Integration  
**Phase 6:** Feature Parity & Polish  
**Phase 7:** Styling & Theme  
**Phase 8:** Testing & Optimization  
**Phase 9:** Documentation & Cleanup  

**Total Duration:** ~5 days  
**Lines of Code Added:** ~8,000+  
**Files Created:** 60+  
**Components Built:** 20+  

---

## Upgrade Guide

### For Users

Your data will be automatically migrated when you first load v2.0.0. No action required!

- ✅ Game progress preserved
- ✅ Statistics preserved
- ✅ Theme preference preserved
- ✅ No data loss

### For Developers

#### Updating Your Local Environment

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Start development server
npm start
```

#### Key Changes

1. **React TypeScript app at project root**
2. **Build output in `dist/` directory**
3. **Import paths use `@/` alias**
4. **TypeScript required for all new code**
5. **React functional components with hooks**

---

## Support

- **Issues:** [GitHub Issues](https://github.com/mikesprague/birdle/issues)
- **Discussions:** [GitHub Discussions](https://github.com/mikesprague/birdle/discussions)
- **Documentation:** See README.md and ARCHITECTURE.md

---

## Acknowledgments

Special thanks to:
- Josh Wardle for the original Wordle concept
- The React and TypeScript communities
- TinyBase for excellent reactive state management
- shadcn for beautiful, accessible components
- All contributors and testers

---

**[2.0.0]:** Complete TypeScript React Migration ✨  
**Previous versions:** Vanilla JavaScript implementation

[2.0.0]: https://github.com/mikesprague/birdle/compare/v1.0.0...v2.0.0