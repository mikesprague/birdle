import {
  getBirdleOfDay,
  initAnalytics,
  initGame,
  initServiceWorker,
} from './lib/helpers';
import { getData } from './lib/local-storage';

import './styles.scss';

(async () => {
  const birdle = getBirdleOfDay();
  const firstVisit =
    (getData('gameState') === null || getData('gameState') === undefined) &&
    (getData('stats') === null || getData('stats') === undefined);

  initServiceWorker(firstVisit);
  await initGame(birdle.day, firstVisit);
  initAnalytics();
})();