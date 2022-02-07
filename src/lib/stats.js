import Swal from 'sweetalert2';
import { html } from 'common-tags';
import { isSystemDarkTheme } from './helpers';
import { getData, setData } from './local-storage';

module.exports.initStats = () => {
  const initialStatsObject = {
    currentStreak: 0,
    maxStreak: 0,
    guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
    winPercentage: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    averageGuesses: 0,
  };
  let stats = getData('stats');
  if (stats === null || stats === undefined) {
    stats = initialStatsObject;
    setData('stats', stats);
  }
  return stats;
};

module.exports.updateStats = (won = true) => {
  const lastGameData = getData('gameState');
  const { currentRow } = lastGameData;
  let stats = getData('stats');
  // increment every game
  stats.gamesPlayed += 1;
  stats.guesses[currentRow + 1] += 1;
  if (won) {
    // calculate on win
    stats.currentStreak += 1;
    stats.gamesWon += 1;
    if (stats.currentStreak >= stats.maxStreak) {
      stats.maxStreak += 1;
    }
    stats.winPercentage = Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
    let totalGuesses = 0;
    for (const guess in stats.guesses) {
      // console.log(stats.guesses[guess], guess);
      if (guess !== 'fail') {
        totalGuesses += stats.guesses[guess] * Number(guess);
      }
    }
    stats.averageGuesses = Math.round(totalGuesses / stats.gamesPlayed);
  } else {
    stats.guesses.fail += 1;
    stats.currentStreak = 0;
  }
  setData('stats', stats);
};

module.exports.showStats = () => {
  const stats = getData('stats');
  Swal.fire({
    background: isSystemDarkTheme ? '#181818' : '#dedede',
    color: isSystemDarkTheme ? '#dedede' : '#181818',
    showCloseButton: true,
    showConfirmButton: false,
    allowOutsideClick: true,
    backdrop: true,
    html: html`
      <div
        class="stats"
        onClick="document.querySelector('.swal2-close').click()"
      >
        <h1>Statistics</h1>
        <div class="statsTable flex w-full mb-4">
          <div class="flex-row flex justify-evenly w-full">
            <div class="w-1/4 leading-4">
              <span class="text-3xl">${stats.gamesPlayed}</span>
              <br />
              <span class="text-xs">Played</span>
            </div>
            <div class="w-1/4 leading-4">
              <span class="text-3xl break">${stats.winPercentage}</span>
              <br />
              <span class="text-xs">Win %</span>
            </div>
            <div class="w-1/4 leading-4">
              <span class="text-3xl">${stats.currentStreak}</span>
              <br />
              <span class="text-xs">Current Streak</span>
            </div>
            <div class="w-1/4 leading-4">
              <span class="text-3xl">${stats.currentStreak}</span>
              <br />
              <span class="text-xs">Max Streak</span>
            </div>
          </div>
        </div>
        <!-- <h2>Guess Distribution</p>
        <p></p> -->
      </div>
    `,
  });
};
