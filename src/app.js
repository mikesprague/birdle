import keyboardJs from 'keyboardjs';
import { initKeys, keys } from './lib/keys';
import {
  isGuessValid,
  getBirdleOfDay,
  successStrings,
  buildGuessesRows,
  showMessage,
} from './lib/helpers';

(async () => {
  let currentRow = 0;
  let currentGuess = 0;
  // let isGameOver = false;

  const guessesRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ];

  const birdle = getBirdleOfDay().toUpperCase();

  const addLetter = (letter) => {
    if (
      currentGuess < guessesRows[currentRow].length &&
      currentRow < guessesRows.length
    ) {
      const el = document.getElementById(
        `guessRow-${currentRow}-guess-${currentGuess}`,
      );
      el.textContent = letter;
      el.setAttribute('data', letter);
      guessesRows[currentRow][currentGuess] = letter;
      currentGuess += 1;
    }
  };

  const deleteLetter = () => {
    if (currentGuess > 0) {
      currentGuess -= 1;
      const el = document.getElementById(
        `guessRow-${currentRow}-guess-${currentGuess}`,
      );
      el.textContent = '';
      el.setAttribute('data', '');
      guessesRows[currentRow][currentGuess] = '';
    }
  };

  const colorKeyboardLetter = (letter, className) => {
    const key = document.getElementById(letter);
    key.classList.add(className);
    // if (className === 'grey-overlay') {
    //   key.setAttribute('disabled', 'disabled');
    // }
  };

  const colorGuess = () => {
    const row = document.getElementById(`guessRow-${currentRow}`);
    const guesses = row.childNodes;
    let checkBirdle = birdle;
    let guessArray = Array.from(guesses).map((guess) => {
      return {
        letter: guess.getAttribute('data'),
        color: 'grey-overlay',
      };
    });

    guessArray.forEach((guess, guessIndex) => {
      if (guess.letter === birdle[guessIndex]) {
        guess.color = 'green-overlay';
        checkBirdle = checkBirdle.replace(guess.letter, '');
      }
    });

    guessArray.forEach((guess) => {
      if (
        checkBirdle.includes(guess.letter) &&
        guess.color !== 'green-overlay'
      ) {
        guess.color = 'yellow-overlay';
        checkBirdle = checkBirdle.replace(guess.letter, '');
      }
    });

    guesses.forEach((guess, guessIndex) => {
      const dataLetter = guess.getAttribute('data');

      setTimeout(() => {
        guess.classList.add(
          guessArray[guessIndex].color,
          'flip-vertical-right',
        );
        colorKeyboardLetter(dataLetter, guessArray[guessIndex].color);
      }, 300 * guessIndex);
    });
  };

  const checkWord = () => {
    if (currentGuess === guessesRows[currentRow].length) {
      const guess = guessesRows[currentRow].join('');
      if (!isGuessValid(guess)) {
        showMessage('Not in word list');
        const row = document.getElementById(`guessRow-${currentRow}`);
        row.classList.add('shake-horizontal');
        setTimeout(() => row.classList.remove('shake-horizontal'), 250);
        // row.childNodes.forEach((item) => {
        //   item.classList.add('shake-horizontal');
        //   setTimeout(() => item.classList.remove('shake-horizontal'), 250);
        // });
        return;
      }
      colorGuess();
      if (guess.toLowerCase() === birdle.toLowerCase()) {
        showMessage(successStrings[currentRow], true);
        document
          .getElementById('ENTER')
          .removeEventListener('click', handleKey, true);
        // isGameOver = true;
        return;
      } else {
        if (currentRow < guessesRows.length - 1) {
          currentRow += 1;
          currentGuess = 0;
          return;
        } else {
          showMessage('Womp womp', true);
          document
            .getElementById('ENTER')
            .removeEventListener('click', handleKey, true);
          // isGameOver = true;
          return;
        }
      }
    } else {
      // console.log('not enough letters');
    }
  };

  const handleKey = (letter) => {
    const key = typeof letter === 'object' ? letter.target.id : letter;

    if (key.toLowerCase() === '<<' || key.toLowerCase() === 'backspace') {
      deleteLetter();
    }
    if (key.toLowerCase() === 'enter') {
      checkWord();
    }
    if (key.length === 1) {
      addLetter(key);
    }
  };

  keys.forEach((keyVal) => {
    let letter = keyVal === '<<' ? 'backspace' : keyVal;
    keyboardJs.bind(letter.toLowerCase(), (e) => handleKey(letter));
  });

  buildGuessesRows(guessesRows);
  initKeys(keys, handleKey);
  console.log('🙈 nothing to see here, move along now');
})();
