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

module.exports.showMessage = (message, persist = false) => {
  const messageContainer = document.querySelector('.message-container');
  const messageEl = document.createElement('p');
  messageEl.textContent = message;
  messageEl.classList.add('fade-in');
  messageContainer.append(messageEl);
  if (!persist) {
    setTimeout(() => {
      messageEl.classList.add('fade-out');
    }, 2000);
    setTimeout(() => messageContainer.removeChild(messageEl), 2500);
  }
};
