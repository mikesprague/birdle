import {
  getBirdleOfDay,
  initAnalytics,
  initGame,
  initServiceWorker,
  isDev,
} from './lib/helpers';
import { getData } from './lib/local-storage';

import './styles.scss';

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
