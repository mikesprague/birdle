import {
  getBirdleOfDay,
  initAnalytics,
  initGame,
  initServiceWorker,
} from './lib/helpers';
import { getData } from './lib/local-storage';

import './styles.scss';

const birdle = getBirdleOfDay();
const firstVisit =
  (getData('gameState') === null || getData('gameState') === undefined) &&
  (getData('stats') === null || getData('stats') === undefined);

initServiceWorker(firstVisit);
initGame(birdle.day, firstVisit);
initAnalytics();
