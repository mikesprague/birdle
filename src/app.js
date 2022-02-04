import { setData, getData, clearData } from './lib/local-storage';
import { keys } from './lib/keys';

const appContainer = document.querySelector('.app');
const titleContainer = document.querySelector('.title-container');
const guessesContainer = document.querySelector('.guesses-container');
const keyboardContainer = document.querySelector('.keyboard-container');

const guessesRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
];

guessesRows.forEach((guessRow, guessRowIndex) => {
  const rowEl = document.createElement('div');
  rowEl.setAttribute('id', `guessRow-${guessRowIndex}`);
  rowEl.classList.add('guess-row');
  guessRow.forEach((guess, guessIndex) => {
    const guessEl = document.createElement('div');
    guessEl.setAttribute('id', `guessRow-${guessRowIndex}-guess-${guessIndex}`);
    guessEl.classList.add('guess');
    rowEl.append(guessEl);
  });
  guessesContainer.append(rowEl);
  console.log(rowEl);
});

const handleKey = (event) => {
  console.log(event.target.id);
};

keys.forEach((keyVal, keyIndex) => {
  const buttonEl = document.createElement('button');
  buttonEl.textContent = keyVal;
  buttonEl.classList.add('key');
  buttonEl.setAttribute('id', keyVal);
  buttonEl.addEventListener('click', handleKey);
  keyboardContainer.append(buttonEl);
});
