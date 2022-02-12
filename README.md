# birdle :bird:

Yet another Wordle clone

## About

### Requirements

- Node.js >= 16.x
- npm >= 7.x
- Yarn >= 1.22.x

### Getting Started

1. Clone repo `git clone https://github.com/mikesprague/birdle.git`
1. Enter directory `cd birdle`
1. Install dependencies `yarn`
1. Run project locally `yarn dev`
1. Visit http://localhost:1234 in browser

## Features

- Same rules as Wordle
- Stateful via localstorage
- Light/dark theme based on system setting
- Supports keyboard bindings if using device with physical KB (laptop/PC/etc)
- Progressive Web App (PWA)
  - available offline
  - installable
  - responsive (mobile friendly)
- Results sharing
  - uses native sharing on mobile browsers that support it
  - default behavior is to copy results to clipboard
  - results key:
    - absent 🥚
    - present 🐣
    - correct 🐥
  - example results:
  
    ```text
      Birdle 12 4/6

      🥚🐣🥚🥚🐥
      🥚🥚🥚🐥🐥
      🥚🐣🥚🐥🐥
      🐥🐥🐥🐥🐥
    ```
