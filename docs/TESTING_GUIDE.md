# Birdle Testing Guide

**Version:** 1.0  
**Last Updated:** January 2, 2026  
**Status:** Phase 8 - Testing & Optimization

---

## Overview

This guide provides comprehensive testing procedures for the Birdle TypeScript React migration. Use this document to verify all features work correctly before deployment.

---

## Table of Contents

1. [Manual Testing Checklist](#manual-testing-checklist)
2. [Migration Testing](#migration-testing)
3. [Performance Testing](#performance-testing)
4. [Browser Compatibility](#browser-compatibility)
5. [Accessibility Testing](#accessibility-testing)
6. [Issue Tracking](#issue-tracking)

---

## Manual Testing Checklist

### 🎮 Game Functionality

#### Win Scenario (1-6 Guesses)

**Test Steps:**
1. Start a new game
2. Play and win in 1-6 guesses
3. Verify the following:

**Expected Results:**
- [ ] Emoji blast triggers (if enabled in settings)
- [ ] Balloons trigger (if enabled in settings)
- [ ] GameEndDialog auto-opens with success message:
  - 1 guess: "Genius"
  - 2 guesses: "Magnificent"
  - 3 guesses: "Impressive"
  - 4 guesses: "Splendid"
  - 5 guesses: "Great"
  - 6 guesses: "Phew"
- [ ] Stats update correctly:
  - Games Played +1
  - Games Won +1
  - Current Streak +1
  - Win % recalculated
  - Guess distribution updated
- [ ] Share button is present and functional
- [ ] View Stats button opens StatsModal

#### Lose Scenario (6 Failed Guesses)

**Test Steps:**
1. Start a new game
2. Use all 6 guesses without guessing correctly
3. Verify the following:

**Expected Results:**
- [ ] No celebrations trigger
- [ ] GameEndDialog auto-opens with correct word revealed
- [ ] Message: "Today's Birdle was: [WORD]"
- [ ] Stats update correctly:
  - Games Played +1
  - Fail count +1
  - Current Streak reset to 0
  - Win % recalculated
- [ ] Share button is present and functional

---

### ⌨️ Keyboard Testing

#### Physical Keyboard

**Test Steps:**
1. Click in game area (if needed for focus)
2. Test each key type:

**Expected Results:**
- [ ] **A-Z keys:** Add letter to current box
- [ ] **Enter key:** Submit guess (if 5 letters entered)
- [ ] **Backspace key:** Delete last letter
- [ ] Letters appear in boxes immediately
- [ ] Invalid keys (numbers, symbols) are ignored
- [ ] Keyboard is disabled after game ends

#### On-Screen Keyboard

**Test Steps:**
1. Click each on-screen key
2. Test special keys

**Expected Results:**
- [ ] All letter keys (Q-P, A-L, Z-M) work
- [ ] ENTER button submits guess
- [ ] ⌫ (Backspace) button deletes letter
- [ ] Keys have visual feedback (scale on press)
- [ ] Keys show correct status colors:
  - Green: correct letter in correct position
  - Yellow: correct letter, wrong position
  - Gray: letter not in word
  - Light gray: unused letter
- [ ] Keys are disabled after game ends

---

### ✅ Validation Testing

#### Invalid Word

**Test Steps:**
1. Enter a 5-letter combination not in word list (e.g., "ZZZZZ")
2. Press Enter

**Expected Results:**
- [ ] Toast appears: "Not in word list"
- [ ] Toast auto-dismisses after 2.5 seconds
- [ ] Guess is NOT submitted
- [ ] Letters remain in current row
- [ ] Can delete letters and try again
- [ ] Row shakes (visual feedback)

#### Incomplete Word

**Test Steps:**
1. Enter fewer than 5 letters (e.g., "CAT")
2. Press Enter

**Expected Results:**
- [ ] Nothing happens (Enter is disabled)
- [ ] No toast appears
- [ ] Can continue adding letters

#### Empty Row Submit

**Test Steps:**
1. With no letters entered, press Enter

**Expected Results:**
- [ ] Nothing happens
- [ ] No error message

---

### 💾 Persistence Testing

#### Stats Persistence

**Test Steps:**
1. Complete a game (win or lose)
2. Note your stats (games played, win %, streak)
3. Refresh the page (F5)
4. Open Stats modal

**Expected Results:**
- [ ] Stats match before refresh
- [ ] Guess distribution persists
- [ ] Current streak persists
- [ ] Max streak persists

#### Game State Persistence

**Test Steps:**
1. Start a game
2. Enter 2-3 guesses
3. Refresh page mid-game
4. Check game state

**Expected Results:**
- [ ] Game continues from where you left off
- [ ] Previous guesses are visible with correct colors
- [ ] Current row is correct
- [ ] Can continue playing

#### Theme Persistence

**Test Steps:**
1. Change theme in Settings (Light/Dark/System)
2. Refresh page

**Expected Results:**
- [ ] Theme preference persists
- [ ] App opens with selected theme
- [ ] Theme setting shown correctly in Settings modal

#### Celebration Settings Persistence

**Test Steps:**
1. Toggle Emoji Blasts and/or Balloons in Settings
2. Refresh page
3. Win a game

**Expected Results:**
- [ ] Settings persist across refresh
- [ ] Celebrations respect settings (only show if enabled)

---

### 🎨 Theme Testing

#### Theme Switching

**Test Steps:**
1. Open Settings modal
2. Select each theme option:

**Light Theme:**
- [ ] Background is white/light
- [ ] Text is dark/readable
- [ ] Header buttons visible
- [ ] Game boxes have proper contrast
- [ ] Keyboard keys visible
- [ ] Modals are light themed

**Dark Theme:**
- [ ] Background is dark
- [ ] Text is light/readable
- [ ] Header buttons visible
- [ ] Game boxes have proper contrast
- [ ] Keyboard keys visible
- [ ] Modals are dark themed

**System Theme:**
- [ ] Matches OS theme preference
- [ ] Updates when OS theme changes
- [ ] Shows correct description in Settings

#### Component Theme Consistency

**Test Steps:**
1. Switch between themes
2. Check all components:

**Expected Results:**
- [ ] Header respects theme
- [ ] Board and boxes respect theme
- [ ] Keyboard respects theme
- [ ] All modals respect theme
- [ ] Toast notifications respect theme
- [ ] No "flash" of wrong theme on load

---

### 🔔 Modal Testing

#### Instructions Modal

**Test Steps:**
1. Click Help button (?) in header
2. Review modal content
3. Close modal (X or outside click)

**Expected Results:**
- [ ] Modal opens smoothly
- [ ] Content is readable
- [ ] Example boxes display correctly
- [ ] Close button works
- [ ] Clicking outside closes modal
- [ ] ESC key closes modal

#### Stats Modal

**Test Steps:**
1. Click Stats button (📊) in header
2. Review stats
3. Test interactions

**Expected Results:**
- [ ] Modal opens smoothly
- [ ] All stats display correctly
- [ ] Guess distribution chart shows bars
- [ ] Countdown timer shows time until next Birdle
- [ ] Share button is visible (if game complete)
- [ ] Bars highlight current game (if won today)

#### Settings Modal

**Test Steps:**
1. Click Settings button (⚙️) in header
2. Test all settings

**Expected Results:**
- [ ] Modal opens smoothly
- [ ] Theme buttons work (Light/Dark/System)
- [ ] Active theme is highlighted
- [ ] Emoji Blasts toggle works
- [ ] Balloons toggle works
- [ ] Settings save immediately

#### GameEnd Dialog

**Test Steps:**
1. Complete a game (win or lose)
2. Verify auto-open behavior

**Expected Results:**
- [ ] Dialog auto-opens on game completion
- [ ] Shows correct message (win/loss)
- [ ] Shows mini stats summary
- [ ] Share button works
- [ ] Close button works
- [ ] Can reopen from Stats modal if dismissed

---

### 📤 Share Functionality

#### Native Share (Mobile)

**Test Steps:**
1. Complete a game
2. Click Share button
3. Test on mobile device with share API

**Expected Results:**
- [ ] Native share sheet opens
- [ ] Share text includes:
  - Game number (e.g., "Birdle 123")
  - Score (e.g., "3/6" or "X/6")
  - Emoji grid (🥚🐣🐥)
- [ ] Can share to various apps
- [ ] Toast shows on successful share

#### Clipboard Fallback (Desktop)

**Test Steps:**
1. Complete a game
2. Click Share button
3. Test on desktop

**Expected Results:**
- [ ] Results copied to clipboard
- [ ] Toast appears: "Copied results to clipboard"
- [ ] Can paste result (Ctrl+V / Cmd+V)
- [ ] Pasted text format is correct:
```
Birdle 123 3/6

🥚🐣🥚🥚🐥
🐥🐥🥚🐣🐥
🐥🐥🐥🐥🐥

https://birdle.app
```

#### Share Text Validation

**Verify Format:**
- [ ] Header line: "Birdle [gameId] [score]/6"
- [ ] Empty line after header
- [ ] One row per guess
- [ ] 5 emojis per row
- [ ] 🥚 for absent letters
- [ ] 🐣 for present letters (wrong position)
- [ ] 🐥 for correct letters (right position)
- [ ] No extra spaces or characters

---

### 📱 PWA Testing

#### Offline Functionality

**Test Steps:**
1. Build and serve production build
2. Open app in browser
3. Wait for service worker to register
4. Disconnect from network (airplane mode or dev tools)
5. Refresh page

**Expected Results:**
- [ ] App loads from cache
- [ ] Can play game offline
- [ ] Game state persists
- [ ] Stats persist
- [ ] Only online features fail gracefully (share to web)

#### Install Prompt

**Test Steps:**
1. Open app in supported browser
2. Look for install prompt/button

**Expected Results:**
- [ ] Install prompt appears (Chrome/Edge)
- [ ] Can add to home screen (mobile)
- [ ] Installed app has correct icon
- [ ] Installed app has correct name ("BIRDLE")
- [ ] Opens in standalone mode (no browser UI)

#### Service Worker Updates

**Test Steps:**
1. Deploy new version
2. Open app with old version cached
3. Refresh page

**Expected Results:**
- [ ] New version downloads in background
- [ ] Page auto-reloads with new version
- [ ] No errors during update
- [ ] User data persists through update

---

### 📐 Responsive Design Testing

#### Mobile (< 640px)

**Test Devices:**
- iPhone (various models)
- Android phones
- Small tablets

**Expected Results:**
- [ ] Layout is single column
- [ ] Header fits within screen width
- [ ] Game board is centered and appropriately sized
- [ ] Boxes are readable (not too small)
- [ ] Keyboard keys are large enough to tap (44x44px min)
- [ ] Modals are full-width with padding
- [ ] Text is readable without zooming
- [ ] No horizontal scrolling

#### Tablet (640px - 1024px)

**Test Devices:**
- iPad (various models)
- Android tablets

**Expected Results:**
- [ ] Layout scales appropriately
- [ ] Game board is centered
- [ ] Keyboard is proportional
- [ ] Modals are centered with max-width
- [ ] Text scales well
- [ ] Touch targets are adequate

#### Desktop (> 1024px)

**Test Devices:**
- Laptop screens
- Desktop monitors
- Large displays

**Expected Results:**
- [ ] Layout is centered
- [ ] Max-width constraints applied
- [ ] Game doesn't stretch too wide
- [ ] Modals are centered with reasonable width
- [ ] Hover states work on keyboard keys
- [ ] Mouse interactions are smooth

---

## Migration Testing

### Fresh Install (No Previous Data)

**Test Steps:**
1. Open app in incognito/private window
2. Check localStorage and IndexedDB (dev tools)
3. Play first game

**Expected Results:**
- [ ] No localStorage data
- [ ] No IndexedDB data initially
- [ ] App initializes with empty stats
- [ ] Can play first game without errors
- [ ] Stats save correctly after first game
- [ ] Data appears in IndexedDB

### Legacy Migration (localStorage → TinyBase)

**Setup:**
1. Clear all storage (localStorage + IndexedDB)
2. Manually add old localStorage keys:

```javascript
// In browser console:
localStorage.setItem('gameState', JSON.stringify({
  gameId: 100,
  guessesRows: [['T', 'E', 'S', 'T', 'S'], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']],
  guessesSubmitted: ['TESTS'],
  currentRow: 1,
  currentGuess: 0,
  wonGame: false,
  isGameOver: false,
  lastPlayedDate: new Date().toISOString()
}));

localStorage.setItem('stats', JSON.stringify({
  currentStreak: 5,
  maxStreak: 10,
  guesses: { 1: 2, 2: 5, 3: 8, 4: 6, 5: 3, 6: 1, fail: 2 },
  winPercentage: 93,
  gamesPlayed: 27,
  gamesWon: 25,
  averageGuesses: 3.2
}));
```

**Test Steps:**
1. Refresh page
2. Check for migration

**Expected Results:**
- [ ] Migration runs automatically
- [ ] Console shows: "Successfully migrated legacy data to TinyBase"
- [ ] `birdle-migrated-to-tinybase` flag set in localStorage
- [ ] Game state transferred to TinyBase
- [ ] Stats transferred to TinyBase
- [ ] Can view stats in Stats modal
- [ ] Can continue playing

**Second Refresh:**
- [ ] Migration does NOT run again
- [ ] No console message about migration
- [ ] Data remains intact

### Mid-Game Migration

**Setup:**
1. Add in-progress game to localStorage (see above with currentRow: 3)
2. Refresh page

**Expected Results:**
- [ ] Game continues from row 3
- [ ] Previous guesses visible with correct colors
- [ ] Can continue playing
- [ ] Can complete game

---

## Performance Testing

### Bundle Size Analysis

**Check Build Output:**
```bash
npm run build
```

**Expected Results:**
- [ ] Main bundle (gzipped) < 200 KB ✅ (Currently: 154.78 KB)
- [ ] CSS bundle (gzipped) < 15 KB ✅ (Currently: 8.67 KB)
- [ ] Total bundle < 500 KB (gzipped)
- [ ] No warnings about large chunks

### Load Time Testing

**Test Steps:**
1. Clear cache
2. Open app in dev tools with network throttling
3. Measure load time

**Expected Results:**
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No render-blocking resources
- [ ] Service worker caches resources

### Runtime Performance

**Test Steps:**
1. Play a complete game
2. Monitor performance in dev tools

**Expected Results:**
- [ ] Smooth animations (60fps)
- [ ] No janky scrolling
- [ ] No memory leaks
- [ ] React DevTools shows minimal re-renders
- [ ] Key presses respond instantly (<100ms)

### Lighthouse Audit

**Test Steps:**
1. Build production: `npm run build`
2. Serve production: `npm run preview`
3. Open Chrome DevTools
4. Run Lighthouse audit (Mobile + Desktop)

**Target Scores:**
- [ ] Performance: > 90 (aim for 95+)
- [ ] Accessibility: > 95 (aim for 100)
- [ ] Best Practices: > 90 (aim for 95+)
- [ ] SEO: > 90 (aim for 95+)

**Common Issues to Check:**
- [ ] No console errors
- [ ] No console warnings
- [ ] Proper meta tags
- [ ] Touch targets sized appropriately
- [ ] Color contrast meets WCAG AA
- [ ] ARIA labels present
- [ ] Images have alt text (if any)

---

## Browser Compatibility

### Desktop Browsers

#### Chrome / Edge (Chromium)

**Test Version:** Latest stable

**Expected Results:**
- [ ] All features work
- [ ] PWA install prompt appears
- [ ] Service worker registers
- [ ] IndexedDB works
- [ ] Animations smooth
- [ ] Theme switching works

#### Firefox

**Test Version:** Latest stable

**Expected Results:**
- [ ] All features work
- [ ] PWA install works (limited support)
- [ ] Service worker registers
- [ ] IndexedDB works
- [ ] Animations smooth
- [ ] Theme switching works

#### Safari (macOS)

**Test Version:** Latest stable

**Expected Results:**
- [ ] All features work
- [ ] PWA install works (Add to Dock)
- [ ] Service worker registers
- [ ] IndexedDB works
- [ ] Animations smooth
- [ ] Theme switching works

### Mobile Browsers

#### Safari (iOS)

**Test Version:** iOS 15+

**Expected Results:**
- [ ] All features work
- [ ] Add to Home Screen works
- [ ] Standalone mode works
- [ ] Touch interactions smooth
- [ ] No viewport issues
- [ ] No safe area issues

#### Chrome (Android)

**Test Version:** Latest stable

**Expected Results:**
- [ ] All features work
- [ ] Install prompt appears
- [ ] Standalone mode works
- [ ] Touch interactions smooth
- [ ] No viewport issues

---

## Accessibility Testing

### Keyboard Navigation

**Test Steps:**
1. Tab through all interactive elements
2. Use keyboard only to play game

**Expected Results:**
- [ ] Can tab to all buttons
- [ ] Focus indicators visible
- [ ] Logical tab order
- [ ] Can open/close modals with keyboard
- [ ] ESC closes modals
- [ ] Can play complete game with keyboard only

### Screen Reader Testing

**Test Tools:**
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)

**Test Steps:**
1. Enable screen reader
2. Navigate through app

**Expected Results:**
- [ ] All buttons have descriptive labels
- [ ] Game state announced (win/loss)
- [ ] Current guess row announced
- [ ] Modal content is read correctly
- [ ] Live regions announce updates
- [ ] No confusing or missing labels

### Color Contrast

**Test Tool:** Chrome DevTools Accessibility Panel

**Test Steps:**
1. Check all text against backgrounds
2. Verify WCAG AA compliance (4.5:1 ratio)

**Expected Results:**
- [ ] Header text readable
- [ ] Body text readable
- [ ] Button text readable
- [ ] Box letters readable (all states)
- [ ] Key labels readable (all states)
- [ ] Modal text readable
- [ ] Both themes meet contrast requirements

### Reduced Motion

**Test Steps:**
1. Enable "Reduce Motion" in OS settings
2. Play game

**Expected Results:**
- [ ] Animations are minimal or removed
- [ ] App still functional
- [ ] No jarring transitions
- [ ] Flip animation reduced
- [ ] Pop animation reduced

---

## Issue Tracking

### Issue Template

When you find an issue, document it using this template:

```markdown
### Issue #[number]

**Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Type:** Bug / Performance / Accessibility / UI/UX

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Device: [e.g., MacBook Pro / iPhone 15]
- Screen Size: [e.g., 1920x1080]

**Screenshots/Videos:**
[If applicable]

**Console Errors:**
[If applicable]
```

### Severity Definitions

- **Critical:** App is unusable, data loss, security issue
- **High:** Major feature broken, significant UX issue
- **Medium:** Minor feature broken, cosmetic issue affecting UX
- **Low:** Minor cosmetic issue, edge case

---

## Test Completion Checklist

### Before Marking Phase 8 Complete:

- [ ] All manual tests passed
- [ ] Migration tests passed
- [ ] Performance tests passed
- [ ] Browser compatibility verified
- [ ] Accessibility tests passed
- [ ] Lighthouse scores meet targets
- [ ] No critical or high severity issues
- [ ] Production build tested
- [ ] PWA functionality verified

### Sign-off:

**Tested By:** _________________  
**Date:** _________________  
**Build Version:** _________________  
**Notes:**

---

## Additional Resources

### Testing Tools

- **Chrome DevTools:** Performance, Lighthouse, Accessibility
- **React DevTools:** Component inspection, profiler
- **Firefox DevTools:** Accessibility inspector
- **Safari DevTools:** iOS debugging
- **Lighthouse CI:** Automated performance testing
- **axe DevTools:** Accessibility testing

### Documentation

- [Lighthouse Scoring Guide](https://web.dev/performance-scoring/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PWA Testing](https://web.dev/pwa-checklist/)
- [React Performance](https://react.dev/learn/render-and-commit)

---

**Last Updated:** January 2, 2026  
**Next Review:** Before production deployment
