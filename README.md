# BIRDLE :hatched_chick:

Yet another Wordle clone

## Features

- :capital_abcd: Same rules and word lists as original (pre NYT) Wordle
- :file_cabinet: Remembers current game status and previous results (stateful via localstorage)
- :art: Dark/light theme based on system setting
- :keyboard: Supports keyboard bindings if using device with physical KB (laptop/PC/etc)
- :iphone: Progressive Web App (PWA)
  - available offline
  - installable
  - responsive (mobile friendly)
- :clipboard: Results sharing
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

## Requirements

- Node.js >= 16.x
- npm >= 7.x
- Yarn >= 1.22.x

## Getting Started

1. Clone repo `git clone https://github.com/mikesprague/birdle.git`
1. Enter directory `cd birdle`
1. Install dependencies `yarn`
1. Run project locally `yarn dev`
1. Visit http://localhost:1234 in browser
