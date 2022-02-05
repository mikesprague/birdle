# birdle :bird:

Yet annother Wordle clone - WIP :construction:

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

### Issues

- [ ] game over: need to unbind events (keyboard and clicks)
- [ ] flash message: styling needs improvement
- [ ] light theme: guesses display is white text on white bg
- [ ] light theme: message styling needs improvement
- [ ] on-screen kb: fix/remove color change on tap
- [ ] on-screen kb: improve (more consistent) key sizing
- [ ] mobile/responsive: general improvements

### Missing Features (planning to add)

- [ ] statefulness: will use localstorage
- [ ] game over: show info from current game
- [ ] sharing: develop sharing with emoji blocks
- [ ] game over: add sharing to game over info
- [ ] general: add stats and game number
- [ ] instructions: add popup with instructions (should launch on first load and from a `?` icon)

### Possible future enhancements

- [ ] different word size
- [ ] multiple words per day
