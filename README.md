# BIRDLE :hatched_chick

Yet another Wordle clone

[![Vercel Deployment Status](https://img.shields.io/github/deployments/mikesprague/birdle/production?label=Deploy%20to%20Vercel&logo=Vercel&logoColor=white)](https://vercel.com/m5ls5e/birdle/deployments)

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
- npm >= 8.x

## Getting Started

1. Clone repo `git clone https://github.com/mikesprague/birdle.git`
1. Enter directory `cd birdle`
1. Install dependencies `npm install`
1. Run project locally `npm start`
1. Visit <http://localhost:3000> in browser
