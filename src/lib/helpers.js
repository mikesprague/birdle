import { words } from './words';
import { allowed } from './allowed';

module.exports.getBirdleOfDay = () => {
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

module.exports.isSystemDarkTheme = window.matchMedia(
  '(prefers-color-scheme: dark)',
).matches
  ? true
  : false;

module.exports.isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

module.exports.isGuessValid = (word) =>
  words.includes(word.toLowerCase()) ||
  allowed.includes(word.toLowerCase()) ||
  words.includes(word.toUpperCase()) ||
  allowed.includes(word.toUpperCase());

module.exports.successStrings = [
  'Genius',
  'Magnificent',
  'Impressive',
  'Splendid',
  'Great',
  'Phew',
];

module.exports.buildGuessesRows = (guessesRows) => {
  const guessesContainer = document.querySelector('.guesses-container');
  guessesRows.forEach((guessRow, guessRowIndex) => {
    const rowEl = document.createElement('div');
    rowEl.setAttribute('id', `guessRow-${guessRowIndex}`);
    rowEl.classList.add('guess-row');
    guessRow.forEach((guess, guessIndex) => {
      const guessEl = document.createElement('div');
      guessEl.setAttribute(
        'id',
        `guessRow-${guessRowIndex}-guess-${guessIndex}`,
      );
      guessEl.textContent = guess.length ? guess.toUpperCase() : '';
      guessEl.classList.add('guess');
      rowEl.append(guessEl);
    });
    guessesContainer.append(rowEl);
  });
};

module.exports.initServiceWorker = () => {
  const sw = './service-worker.js'; // it is needed because parcel will not recognize this as a file and not precess in its manner
  navigator.serviceWorker
    .register(sw)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // console.log('New content is available and will be used after page reload ');
            } else {
              // console.log('Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
};
