import { registerSW } from 'virtual:pwa-register';
import { balloons } from 'balloons-js';
import { emojiBlasts } from 'emoji-blast';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { allowed } from './allowed.js';
import { showInstructions } from './instructions.js';
import { initKeys, keys } from './keys.js';
import { getData, setData } from './local-storage.js';
import { initStats, showStats, updateStats } from './stats.js';
import { words } from './words.js';

export const isLocal = () => {
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return true;
  }

  return false;
};

export const isDev = () => {
  if (isLocal() || window.location.hostname !== 'birdle.app') {
    return true;
  }

  return false;
};

export const getBirdleOfDay = () => {
  const now = new Date();
  const start = new Date(2022, 0, 0);
  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));

  while (day > words.length) {
    day -= words.length;
  }

  return {
    word: words[day],
    day,
  };
};

const birdle = getBirdleOfDay();
let wakelock;

const lockWakeState = async () => {
  if (!('wakeLock' in navigator)) {
    return;
  }

  try {
    wakelock = await navigator.wakeLock.request();
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (e) {
    // console.error('failed to lock wake state:', e.message);
    wakelock = null;
  }
};

const releaseWakeState = () => {
  if (wakelock) {
    wakelock.release();
  }

  wakelock = null;
};

export const isSystemDarkTheme = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;

export const supportsShareApi = () =>
  /Mobi/i.test(navigator.userAgent) &&
  /Chrome|Safari/i.test(navigator.userAgent);

export const isGuessValid = (word) =>
  words.includes(word.toLowerCase()) ||
  allowed.includes(word.toLowerCase()) ||
  words.includes(word.toUpperCase()) ||
  allowed.includes(word.toUpperCase());

export const successStrings = [
  'Genius',
  'Magnificent',
  'Impressive',
  'Splendid',
  'Great',
  'Phew',
];

export const buildGuessesRows = (guessesRows) => {
  const guessesContainer = document.querySelector('.guesses-container');

  guessesRows.forEach((guessRow, guessRowIndex) => {
    const rowEl = document.createElement('div');

    rowEl.setAttribute('id', `guessRow-${guessRowIndex}`);
    rowEl.classList.add(
      'guess-row',
      'flex',
      'manipulation',
      'justify-center',
      'items-center',
      'flex-row'
    );
    guessRow.forEach((guess, guessIndex) => {
      const guessEl = document.createElement('div');

      guessEl.setAttribute(
        'id',
        `guessRow-${guessRowIndex}-guess-${guessIndex}`
      );
      guessEl.textContent = guess.length ? guess.toUpperCase() : '';
      guessEl.classList.add(
        'box-border',
        'flex',
        'items-center',
        'justify-center',
        'w-17',
        'h-17',
        'max-[480px]:w-16',
        'max-[680px]:h-16',
        'm-1.25',
        'text-3xl',
        'font-black',
        'text-gray-900',
        'border-2',
        'border-gray-600',
        'md:w-20',
        'md:h-20',
        'dark:text-gray-50',
        'md:text-4xl'
      );
      rowEl.append(guessEl);
    });
    console.log(rowEl);
    guessesContainer.append(rowEl);
  });
};

export const initServiceWorker = (firstVisit = false) => {
  registerSW({
    onNeedRefresh() {
      if (!firstVisit) {
        location.reload(true);
      }
    },
    onOfflineReady() {},
    immediate: true,
  });
};

export const initAnalytics = () => {
  setTimeout(() => {
    // cloudflare analytics
    const cloudFlareScript = document.createElement('script');

    cloudFlareScript.setAttribute(
      'src',
      'https://static.cloudflareinsights.com/beacon.min.js'
    );
    cloudFlareScript.setAttribute('defer', '');
    cloudFlareScript.setAttribute(
      'data-cf-beacon',
      '{"token": "29d2c844068c46f2889b0399d73c78c6"}'
    );
    document.querySelector('body').appendChild(cloudFlareScript);
    // google analytics
    const googleAnalyticsScript = document.createElement('script');

    googleAnalyticsScript.setAttribute(
      'src',
      'https://www.googletagmanager.com/gtag/js?id=G-KDCMVB11KQ'
    );
    googleAnalyticsScript.setAttribute('async', '');
    document.querySelector('body').appendChild(googleAnalyticsScript);
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      // biome-ignore lint/style/noArguments: <explanation>
      // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
      dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', 'G-KDCMVB11KQ');
  }, 1000);
};

export const deleteLetter = () => {
  const gameState = getData('gameState');
  let { currentRow, currentGuess } = gameState;

  if (currentGuess > 0) {
    currentGuess -= 1;
    const el = document.getElementById(
      `guessRow-${currentRow}-guess-${currentGuess}`
    );

    el.textContent = '';
    el.setAttribute('data', '');
    gameState.guessesRows[currentRow][currentGuess] = '';
    gameState.currentGuess = currentGuess;
    setData('gameState', gameState);
  }
};

export const addLetter = (letter) => {
  const gameState = getData('gameState');
  const { currentRow, currentGuess, guessesRows } = gameState;

  if (
    currentGuess < guessesRows[currentRow].length &&
    currentRow < guessesRows.length
  ) {
    const el = document.getElementById(
      `guessRow-${currentRow}-guess-${currentGuess}`
    );

    el.textContent = letter.toUpperCase();
    el.setAttribute('data', letter);

    gameState.guessesRows[currentRow][currentGuess] = letter;
    gameState.currentGuess += 1;
    setData('gameState', gameState);
    // guessesRows[currentRow][currentGuess] = letter;
    // currentGuess += 1;
  }
};

export const colorKeyboardLetter = (letter, className) => {
  const key = document.getElementById(letter);

  if (!key) {
    return;
  }

  if (className === 'correct-overlay') {
    key.classList.remove('present-overlay');
    key.classList.remove('absent-overlay');
    key.classList.add('correct-overlay');

    return;
  }

  if (
    className === 'present-overlay' &&
    !key.classList.contains('correct-overlay')
  ) {
    key.classList.remove('correct-overlay');
    key.classList.remove('absent-overlay');
    key.classList.add('present-overlay');

    return;
  }

  if (
    className === 'absent-overlay' &&
    !key.classList.contains('correct-overlay') &&
    !key.classList.contains('present-overlay')
  ) {
    key.classList.add('absent-overlay');
  }
  // if (className === 'absent-overlay') {
  //   key.setAttribute('disabled', 'disabled');
  // }
};

export const colorGuess = (currentRow) => {
  const row = document.getElementById(`guessRow-${currentRow}`);
  const guesses = row.childNodes;
  const gameState = getData('gameState');

  if (!gameState.guessesSubmitted) {
    gameState.guessesSubmitted = [];
    setData('gameState', gameState);
  }

  if (
    (gameState.guessesSubmitted.length &&
      currentRow + 1 <= gameState.guessesSubmitted.length) ||
    gameState.isGameOver
  ) {
    let checkBirdle = birdle.word;
    const guessArray = Array.from(guesses).map((guess) => {
      return {
        letter: guess.textContent.toLowerCase(),
        color: 'absent-overlay',
      };
    });

    guessArray.forEach((guess, guessIndex) => {
      // console.log(guess, birdle[guessIndex]);
      if (guess.letter === birdle.word[guessIndex]) {
        guess.color = 'correct-overlay';
        checkBirdle = checkBirdle.replace(guess.letter, '');
      }
    });

    for (const guess of guessArray) {
      if (
        checkBirdle.includes(guess.letter) &&
        guess.color !== 'correct-overlay'
      ) {
        guess.color = 'present-overlay';
        checkBirdle = checkBirdle.replace(guess.letter, '');
      }
    }

    guesses.forEach((guess, guessIndex) => {
      const dataLetter = guess.textContent.toLowerCase();

      setTimeout(
        () => {
          guess.classList.add(guessArray[guessIndex].color);

          if (!gameState.isGameOver) {
            guess.classList.add('flip-horizontal');
          }

          colorKeyboardLetter(dataLetter, guessArray[guessIndex].color);
        },
        !gameState.isGameOver ? 300 * guessIndex : 0
      );
    });
  }
};

export const checkWord = () => {
  const gameState = getData('gameState');
  const { currentRow, currentGuess, guessesRows, guessesSubmitted } = gameState;

  if (!guessesSubmitted) {
    gameState.guessesSubmitted = [];
    setData('gameState', gameState);
  }

  if (currentGuess === guessesRows[currentRow].length) {
    const guess = guessesRows[currentRow].join('');

    if (!isGuessValid(guess)) {
      Swal.fire({
        html: '<strong>Not in word list</strong>',
        showConfirmButton: false,
        toast: true,
        timer: 2500,
        timerProgressBar: true,
        position: 'top',
        allowEscapeKey: false,
        background: isSystemDarkTheme ? '#333' : '#dedede',
        color: isSystemDarkTheme ? '#dedede' : '#222',
      });
      const row = document.getElementById(`guessRow-${currentRow}`);

      row.classList.add('shake-horizontal');
      setTimeout(() => row.classList.remove('shake-horizontal'), 250);
      // row.childNodes.forEach((item) => {
      //   item.classList.add('shake-horizontal');
      //   setTimeout(() => item.classList.remove('shake-horizontal'), 250);
      // });

      return;
    }

    const defaultBirds = [
      '🦃',
      '🐔',
      '🐓',
      '🐦',
      '🐧',
      '🕊️',
      '🦅',
      '🦆',
      '🐥',
      '🐣',
      '🐤',
      '🦢',
      '🦉',
      '🦤',
      '🦩',
      '🦜',
    ];

    const halloweenEmojis = [
      '👻',
      '🎃',
      '🦇',
      '🕷️',
      '🕸️',
      '🧙‍♀️',
      '🧛‍♂️',
      '🧟‍♀️',
      '🧟‍♂️',
      '👾',
      '👹',
      '👽',
      '☠️',
      '💀',
      '🤡',
      '😱',
    ];

    const thanksGivingEmojis = [
      '🍽️',
      '🍴',
      '🦃',
      '👏',
      '🌽',
      '🌰',
      '🍗',
      '🏡',
      '💕',
      '🙌',
      '👪',
      '🔥',
      '☕',
      '🍾',
      '🍁',
      '🍂',
      '🥕',
      '🥞',
      '🙏',
      '🥃',
      '🤤',
      '🥂',
      '🥄',
      '🥓',
      '🥜',
      '🥧',
      '🧣',
      '🧤',
      '🏈',
      '🥔',
    ];

    const christmasEmojis = [
      '🔔',
      '🍴',
      '🎁',
      '👶',
      '🕯️',
      '🎅',
      '👼',
      '🎶',
      '🛐',
      '⛪',
      '🤶',
      '✝️',
      '❄️',
      '☃️',
      '👪',
      '⛄',
      '🌟',
      '🔥',
      '🎄',
      '🍷',
      '🦌',
      '🍪',
      '🥛',
      '🧝‍♀️',
      '🧦',
      '🧝‍♂️',
      '🧑‍🎄',
      '🧝',
      '🥕',
      '💝',
      '🌨️',
      '💟',
      '🛷',
      '📜',
      '⭐',
      '🍰',
      '🍫',
      '🍬',
      '🌠',
      '🌌',
      '🧩',
    ];

    gameState.guessesSubmitted.push(guess.toLowerCase());
    setData('gameState', gameState);
    colorGuess(currentRow);

    // var with current date
    const today = new Date();
    // var that returns true if today is in October
    const isHalloween =
      today.getMonth() === 9 && today.getDate() > 21 && today.getDate() <= 31;
    // var that returns true if today is in Novermber
    const isThanksgiving =
      today.getMonth() === 10 && today.getDate() > 20 && today.getDate() <= 28;

    const isChristmas =
      today.getMonth() === 11 && today.getDate() > 10 && today.getDate() <= 25;

    if (guess.toLowerCase() === birdle.word) {
      setTimeout(() => {
        const { cancel } = emojiBlasts({
          emojiCount: (guessesRows.length * 10) / (currentRow + 1),
          emojis: isHalloween
            ? halloweenEmojis
            : isThanksgiving
              ? thanksGivingEmojis
              : isChristmas
                ? christmasEmojis
                : defaultBirds,
        });
        Swal.fire({
          html: `<strong>${successStrings[currentRow]}</strong>`,
          showConfirmButton: false,
          toast: true,
          position: 'top',
          allowEscapeKey: false,
          background: isSystemDarkTheme ? '#333' : '#dedede',
          color: isSystemDarkTheme ? '#dedede' : '#222',
          timer: 2500,
          timerProgressBar: true,
          didDestroy: () => {
            balloons();
            showStats();
            releaseWakeState();
            cancel();
          },
        });
      }, 1500);
      document
        .getElementById('enter')
        .removeEventListener('click', handleKey, true);
      gameState.isGameOver = true;
      gameState.wonGame = true;
      setData('gameState', gameState);
      updateStats(true);

      return;
    }

    if (currentRow < guessesRows.length - 1) {
      gameState.currentRow += 1;
      gameState.currentGuess = 0;
      setData('gameState', gameState);
    } else {
      document
        .getElementById('enter')
        .removeEventListener('click', handleKey, true);
      setTimeout(() => {
        Swal.fire({
          html: `<strong>Womp womp!<br>Today's Birdle was: <em class="uppercase">${birdle.word}</em></strong>`,
          showConfirmButton: false,
          toast: true,
          position: 'top',
          allowEscapeKey: true,
          background: isSystemDarkTheme ? '#333' : '#dedede',
          color: isSystemDarkTheme ? '#dedede' : '#222',
          timer: 2500,
          timerProgressBar: true,
          didDestroy: () => {
            showStats();
            releaseWakeState();
          },
        });
      }, 1500);

      gameState.isGameOver = true;
      setData('gameState', gameState);
      updateStats(false);
    }
  } else {
    // not enough letters
  }
};

export const handleKey = (letter) => {
  const gameState = getData('gameState');
  const { isGameOver } = gameState;

  if (!isGameOver) {
    const key = typeof letter === 'object' ? letter.target.id : letter;

    if (key === 'ctrl' || key === 'shift' || key === 'alt') {
      return;
    }

    if (key === 'back' || key === 'backspace') {
      deleteLetter();
    }

    if (key === 'enter') {
      checkWord();
    }

    if (key.length === 1) {
      addLetter(key);
    }
  }
};

export const initGame = async (day = null, firstVisit = false) => {
  const initialGameState = {
    currentRow: 0,
    currentGuess: 0,
    isGameOver: false,
    wonGame: false,
    guessesRows: [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ],
    guessesSubmitted: [],
    gameId: day,
  };
  let gameState = getData('gameState');
  let gameStats = getData('stats');

  if (firstVisit) {
    initStats();
    showInstructions();
    gameStats = getData('stats');
  }

  if (
    gameState === null ||
    gameState === undefined ||
    day === null ||
    day === undefined ||
    (gameState && day > gameState.gameId)
  ) {
    setData('gameState', initialGameState);
    gameState = initialGameState;
  }

  buildGuessesRows(gameState.guessesRows);
  initKeys(keys, handleKey);
  await lockWakeState();

  document.getElementById('help').addEventListener('click', () => {
    showInstructions();
  });
  document.getElementById('stats').addEventListener('click', () => {
    showStats();
  });

  // show stats if game complete
  if (
    gameState.isGameOver &&
    gameStats.gamesPlayed &&
    day === gameState.gameId
  ) {
    showStats();
    releaseWakeState();
  }

  // color existing letters
  for (let i = 0; i < gameState.guessesRows.length; i += 1) {
    // console.log(i, gameState.guessesRows[i]);
    if (
      gameState.guessesRows[i].join('').length &&
      gameState.guessesRows[i].join('').length === 5 &&
      isGuessValid(gameState.guessesRows[i].join(''))
    ) {
      colorGuess(i);
    }
  }

  // watch for light/dark theme change
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      location.reload(true);
    });
  // watch for tab change and reload if taking focus
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      location.reload(true);
    }
  });
  // watch for orientation change and reload to "fix" resize issues
  window
    .matchMedia('(orientation: portrait)')
    .addEventListener('change', () => {
      location.reload(true);
    });

  console.log('🙈 nothing to see here, move along now');
};
