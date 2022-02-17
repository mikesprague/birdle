import { words } from './words';
import { allowed } from './allowed';
import { register } from 'register-service-worker';

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

export const isSystemDarkTheme = window.matchMedia(
  '(prefers-color-scheme: dark)',
).matches
  ? true
  : false;

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

export const initServiceWorker = (firstVisit = false) => {
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
      if (!firstVisit) {
        location.reload(true);
      }
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

export const initAnalytics = () => {
  setTimeout(() => {
    // cloudflare analytics
    const cloudFlareScript = document.createElement('script');
    cloudFlareScript.setAttribute('src', 'https://static.cloudflareinsights.com/beacon.min.js');
    cloudFlareScript.setAttribute('defer', '');
    cloudFlareScript.setAttribute('data-cf-beacon', '{"token": "29d2c844068c46f2889b0399d73c78c6"}');
    document.querySelector('body').appendChild(cloudFlareScript);
    // google analytics
    const googleAnalyticsScript = document.createElement('script');
    googleAnalyticsScript.setAttribute(
      'src',
      'https://www.googletagmanager.com/gtag/js?id=G-KDCMVB11KQ',
    );
    googleAnalyticsScript.setAttribute('async', '');
    document.querySelector('body').appendChild(googleAnalyticsScript);
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-KDCMVB11KQ');
  }, 1000);
};
