# birdle :bird:

Yet another Wordle clone - WIP :construction:

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

## Known issues/missing features

Work is in progress but it's an early version

### Known Issues

- [x] game over: need to unbind events (keyboard and clicks)
- [x] light theme: guesses display is white text on white bg
- [x] light theme: message styling needs improvement
- [x] bug fix: one of letter in birdle and two in guess changes kb key back to gray
- [x] statefullness: need to reset state if day has changed and word no longer valid
- [x] flash message: styling needs improvement
- [x] mobile/responsive: general improvements
- [ ] keyboard: should ignore kb bindings if used with `ctrl` or `command` (ex: `ctrl` + `r`)

### Missing Features (planning to add)

- [x] statefulness: will use localstorage
- [x] game over: show stats
- [x] sharing: develop sharing with emoji blocks
- [x] game over: add sharing to game over info
- [ ] stats: show guess distribution
- [x] general: add stats and game number
- [x] instructions: add popup with instructions
- [x] instructions: add examples

### Possible future enhancements

- [ ] different word size
- [ ] multiple words per day
