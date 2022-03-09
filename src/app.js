import {
  getBirdleOfDay,
  initAnalytics,
  initGame,
  initServiceWorker,
} from './lib/helpers';
import { getData, setData } from './lib/local-storage';

import './styles.scss';

const birdle = getBirdleOfDay();
const firstVisit =
  (getData('gameState') === null || getData('gameState') === undefined) &&
  (getData('stats') === null || getData('stats') === undefined);

if (getData('gameMode') === null || getData('gameMode') === undefined) {
  setData('gameMode', 'default');
}

const toggleMode = (mode = 'default') => {
  const mainHeading = document.querySelector('.title-container h1');
  const gameToggle = document.getElementById('game-toggle');

  if (mode === 'free') {
    document.title = 'FREE BIRDLE';
    mainHeading.innerHTML = mainHeading.innerHTML.replace(
      /Birdle/,
      'Free Birdle',
    );
    setData('gameMode', 'free');
    gameToggle.checked = true;
  } else {
    document.title = 'BIRDLE';
    mainHeading.innerHTML = mainHeading.innerHTML.replace(
      /Free Birdle/,
      'Birdle',
    );
    setData('gameMode', 'default');
    gameToggle.checked = false;
  }
};

toggleMode(getData('gameMode'));

initServiceWorker(firstVisit);
initGame(birdle.day, firstVisit);
initAnalytics();

const gameToggle = document.getElementById('game-toggle');

gameToggle.addEventListener('change', (e) => {
  if (e.target.checked) {
    toggleMode('free');
  } else {
    toggleMode();
  }
});
