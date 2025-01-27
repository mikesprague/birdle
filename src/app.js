import {
  getBirdleOfDay,
  initAnalytics,
  initGame,
  initServiceWorker,
  isDev,
} from './lib/helpers.js';
import { getData } from './lib/local-storage.js';

import './styles.css';

(async () => {
  if (isDev()) {
    const { title } = window.document;

    window.document.title = `DEV ${title}`;
  }

  const birdle = getBirdleOfDay();
  const firstVisit =
    (getData('gameState') === null || getData('gameState') === undefined) &&
    (getData('stats') === null || getData('stats') === undefined);

  initServiceWorker(firstVisit);
  await initGame(birdle.day, firstVisit);

  if (!isDev()) {
    initAnalytics();
  }
})();
