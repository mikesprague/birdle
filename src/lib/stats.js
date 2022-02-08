import ClipboardJS from 'clipboard';
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
  stats.winPercentage = Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
  setData('stats', stats);
};

module.exports.createShareText = () => {
  const absentEmoji = '🥚'; // '⚫';
  const presentEmoji = '🐣'; // '🟡';
  const correctEmoji = '🐥'; // '🟢';
  const gameState = getData('gameState');
  const gameId = gameState.gameId;
  const finalRow = gameState.currentRow >= 5 ? 6 : gameState.currentRow + 1;
  const shareTextLabel =
    gameState.wonGame || (gameState.isGameOver && gameState.currentRow < 5)
      ? `Birdle ${gameId} ${finalRow}/6\n\n`
      : `Birdle ${gameId} X/6\n\n`;
  let shareText = '';
  for (let i = 0; i < finalRow; i += 1) {
    const guesses = Array.from(
      document.getElementById(`guessRow-${i}`).childNodes,
    );
    const rowEmoji = guesses.map((guess) => {
      if (guess.classList.contains('correct-overlay')) {
        return correctEmoji;
      }
      if (guess.classList.contains('present-overlay')) {
        return presentEmoji;
      }
      if (guess.classList.contains('absent-overlay')) {
        return absentEmoji;
      }
    });
    shareText += `${rowEmoji.join('')}`;
    if (i < finalRow - 1) {
      shareText += '\n';
    }
  }
  shareText = shareTextLabel + shareText;
  // console.log(shareText);
  return shareText;
};

module.exports.handleShareClick = (e) => {
  e.preventDefault();
  const gameResuls = module.exports.createShareText();
  e.target.setAttribute('data-clipboard-text', gameResuls);
  const clipboard = new ClipboardJS('.btn-share');
  clipboard.on('success', function () {
    Swal.fire({
      html: 'Copied results to clipboard',
      showConfirmButton: false,
      toast: true,
      timer: 2500,
      position: 'top',
      allowEscapeKey: false,
      background: isSystemDarkTheme ? '#181818' : '#dedede',
      color: isSystemDarkTheme ? '#dedede' : '#181818',
    });
  });
};

module.exports.showStats = () => {
  const stats = getData('stats');
  Swal.fire({
    background: isSystemDarkTheme ? '#181818' : '#dedede',
    color: isSystemDarkTheme ? '#dedede' : '#181818',
    showCloseButton: true,
    position: 'center',
    backdrop: true,
    showConfirmButton: false,
    allowOutsideClick: true,
    didRender: () => {
      if (stats.gamesPlayed) {
        document
          .querySelector('.btn-share')
          .addEventListener('click', module.exports.handleShareClick);
      } else {
        document.querySelector('.btn-share').classList.add('invisible');
      }
    },
    html: html`
      <div class="stats">
        <h1>Statistics</h1>
        <div
          class="statsTable flex w-full mb-4"
          onClick="document.querySelector('.swal2-close').click()"
        >
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
              <span class="text-3xl">${stats.maxStreak}</span>
              <br />
              <span class="text-xs">Max Streak</span>
            </div>
          </div>
        </div>
        <!-- <h2>Guess Distribution</h2>
        <div></div> -->
        <div class="w-full flex">
          <!-- <div class="w-1/2">
            <strong class="text-sm uppercase font-bold">Next Birdle</strong>
            <br />
            <span class="text-4xl">00:00:00</span>
          </div> -->
          <div class="w-full">
            <button type="button" class="btn-share">Share</button>
          </div>
        </div>
      </div>
    `,
  });
};
