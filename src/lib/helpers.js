import { words } from './words';
import { allowed } from './allowed';
import { register } from 'register-service-worker';

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

module.exports.supportsShareApi = () =>
  /Mobi/i.test(navigator.userAgent) &&
  /Chrome|Safari/i.test(navigator.userAgent);

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
  register('./service-worker.js', {
    // ready() {
    //   console.log('Service worker is active.');
    // },
    // registered(registration) {
    //   console.log('Service worker has been registered.', registration);
    // },
    // cached(registration) {
    //   console.log('Content has been cached for offline use.', registration);
    // },
    // updatefound(registration) {
    //   console.log('New content is downloading.', registration);
    // },
    updated() {
      // updated(registration)
      window.location.reload();
    },
    offline() {
      console.info(
        'No internet connection found. BIRDLE is running in offline mode.',
      );
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
};
