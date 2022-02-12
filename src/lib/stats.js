import ClipboardJS from 'clipboard';
import Swal from 'sweetalert2';
import { html } from 'common-tags';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { isSystemDarkTheme, supportsShareApi } from './helpers';
import { getData, setData } from './local-storage';

dayjs.extend(utc);
dayjs.extend(timezone);

import 'charts.css';

export const initStats = () => {
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

export const updateStats = (won = true) => {
  const lastGameData = getData('gameState');
  const { currentRow } = lastGameData;
  let stats = getData('stats');
  // increment every game
  stats.gamesPlayed += 1;
  if (won) {
    // calculate on win
    stats.guesses[currentRow + 1] += 1;
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

export const createShareText = () => {
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

export const handleShareClick = (e) => {
  e.preventDefault();
  const gameResuls = createShareText();
  let useWebSharingApi = supportsShareApi() && navigator.share;
  console.log('useWebSharingApi: ', useWebSharingApi);
  // attempt to use web sharing api on mobile
  if (useWebSharingApi) {
    navigator
      .share({
        text: gameResuls,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => {
        console.log('Error sharing', error);
        // use clipboard
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
      });
    return;
  }
  // use clipboard
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

export const initCountdown = () => {
  const timerEnd = dayjs()
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .add(1, 'day')
    .local()
    .valueOf();
  const handle = setInterval(() => {
    const timeNow = dayjs().local().valueOf();
    const diff = timerEnd - timeNow;
    if (diff <= 0) {
      window.location.reload();
    }
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    // prettier-ignore
    const timeString = `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
    document.querySelector('.timer').innerHTML = timeString;
  }, 1000);
  return handle;
};

export const showStats = () => {
  const stats = getData('stats');
  const gameState = getData('gameState');
  // let totalGuesses = 0;
  const guessCountArray = [];
  for (const guess in stats.guesses) {
    // console.log(stats.guesses[guess], guess);
    if (guess !== 'fail') {
      // totalGuesses += stats.guesses[guess] * Number(guess);
      guessCountArray.push(stats.guesses[guess]);
    }
  }
  let scale = 100 / Math.max(...guessCountArray);
  scale = scale === Infinity ? 0 : scale;
  const currentGuessCount =
    gameState.isGameOver && gameState.wonGame ? gameState.currentRow + 1 : null;
  let timerHandle;
  Swal.fire({
    background: isSystemDarkTheme ? '#181818' : '#dedede',
    color: isSystemDarkTheme ? '#dedede' : '#181818',
    showCloseButton: true,
    position: 'center',
    backdrop: true,
    showConfirmButton: false,
    allowOutsideClick: true,
    didOpen: () => {
      timerHandle = initCountdown();
    },
    didDestroy: () => {
      clearInterval(timerHandle);
    },
    didClose: () => {
      clearInterval(timerHandle);
    },
    didRender: () => {
      if (stats.gamesPlayed && gameState.isGameOver) {
        document
          .querySelector('.btn-share')
          .addEventListener('click', handleShareClick);
      } else {
        document.querySelector('.btn-share').classList.add('invisible');
      }
    },
    html: html`
      <div class="stats">
        <h1>Statistics</h1>
        <div
          class="flex w-full mb-4"
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
        <div class="mb-4 mr-4">
          <strong class="text-sm uppercase font-bold">
            Guess Distribution
          </strong>
          <table
            id="guess-distribution"
            class="charts-css bar show-labels data-spacing-2"
          >
            <caption>
              Guess Distribution
            </caption>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td
                  class="text-gray-50"
                  style="--color: ${currentGuessCount && currentGuessCount === 1
                    ? '#581c87;'
                    : '#333;'} --size:calc((${stats
                    .guesses[1]} * ${scale}) / 100)"
                >
                  <span class="data"
                    >${stats.guesses[1] ? stats.guesses[1] : '&nbsp;'}</span
                  >
                </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td
                  class="text-gray-50"
                  style="--color: ${currentGuessCount && currentGuessCount === 2
                    ? '#581c87;'
                    : '#333;'} --size:calc((${stats
                    .guesses[2]} * ${scale}) / 100)"
                >
                  <span class="data"
                    >${stats.guesses[2] ? stats.guesses[2] : '&nbsp;'}</span
                  >
                </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td
                  class="text-gray-50"
                  style="--color: ${currentGuessCount && currentGuessCount === 3
                    ? '#581c87;'
                    : '#333;'}; --size:calc((${stats
                    .guesses[3]} * ${scale}) / 100)"
                >
                  <span class="data"
                    >${stats.guesses[3] ? stats.guesses[3] : '&nbsp;'}</span
                  >
                </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td
                  class="text-gray-50"
                  style="--color: ${currentGuessCount && currentGuessCount === 4
                    ? '#581c87;'
                    : '#333;'}; --size:calc((${stats
                    .guesses[4]} * ${scale}) / 100)"
                >
                  <span class="data"
                    >${stats.guesses[4] ? stats.guesses[4] : '&nbsp;'}</span
                  >
                </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td
                  class="text-gray-50"
                  style="--color: ${currentGuessCount && currentGuessCount === 5
                    ? '#581c87;'
                    : '#333;'}; --size:calc((${stats
                    .guesses[5]} * ${scale}) / 100)"
                >
                  <span class="data"
                    >${stats.guesses[5] ? stats.guesses[5] : '&nbsp;'}</span
                  >
                </td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td
                  class="text-gray-50"
                  style="--color: ${currentGuessCount && currentGuessCount === 6
                    ? '#581c87;'
                    : '#333;'} --size:calc((${stats
                    .guesses[6]} * ${scale}) / 100)"
                >
                  <span class="data"
                    >${stats.guesses[6] ? stats.guesses[6] : '&nbsp;'}</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="w-full flex">
          <div class="w-1/2">
            <strong class="text-sm uppercase font-bold">Next Birdle</strong>
            <br />
            <div class="timer-container text-3xl">
              <span class="timer mr-2"
                ><em class="text-gray-500">--:--:--</em></span
              >
            </div>
          </div>
          <div class="w-1/2">
            <button type="button" class="btn-share">Share</button>
          </div>
        </div>
      </div>
    `,
  });
};
