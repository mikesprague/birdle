import 'animate.css';
// import { setData, getData, clearData } from './lib/local-storage';
import { keys } from './lib/keys';
import { words } from './lib/words';
import { isGuessValid, getBirdleOfDay, successStrings } from './lib/helpers';

(async () => {
  // const appContainer = document.querySelector('.app');
  // const titleContainer = document.querySelector('.title-container');
  const messageContainer = document.querySelector('.message-container');
  const guessesContainer = document.querySelector('.guesses-container');
  const keyboardContainer = document.querySelector('.keyboard-container');

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

  const successStrings = [
    'Genius',
    'Magnificent',
    'Impressive',
    'Splendid',
    'Great',
    'Phew',
  ];

  const birdle = getBirdleOfDay().toUpperCase();
  // console.log(getBirdleOfDay());

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

  const showMessage = (message, persist = false) => {
    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.classList.add('animate__animated', 'animate__fadeIn');
    messageContainer.append(messageEl);
    if (!persist) {
      setTimeout(() => {
        messageEl.classList.add('animate__fadeOut');
      }, 2000);
      setTimeout(() => messageContainer.removeChild(messageEl), 2500);
    }
  };

  const colorKeyboardLetter = (letter, className) => {
    const key = document.getElementById(letter);
    // console.log(className);
    key.classList.add(className);
    // if (className === 'grey-overlay') {
    //   key.setAttribute('disabled', 'disabled');
    // }
  };

  const colorGuess = () => {
    const row = document.getElementById(`guessRow-${currentRow}`);
    const guesses = row.childNodes;
    let checkBirdle = birdle;

    const guessArray = Array.from(guesses).map((guess) => {
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
      if (checkBirdle.includes(guess.letter)) {
        guess.color = 'yellow-overlay';
        checkBirdle = checkBirdle.replace(guess.letter, '');
      }
    });

    guesses.forEach((guess, guessIndex) => {
      const dataLetter = guess.getAttribute('data');

      setTimeout(() => {
        guess.classList.add(
          guessArray[guessIndex].color,
          'animate__animated',
          'animate__flipInX',
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
        return;
      }
      colorGuess();
      if (guess.toLowerCase() === birdle.toLowerCase()) {
        console.log(successStrings[currentRow]);
        showMessage(successStrings[currentRow], true);
        document
          .getElementById('ENTER')
          .removeEventListener('click', handleKey, true);
        // isGameOver = true;
        return;
      } else {
        if (currentRow < guessesRows.length - 1) {
          console.log('no luck');
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
      console.log('not enough letters');
    }
  };

  const buildGuessRows = () => {
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
        guessEl.classList.add('guess');
        rowEl.append(guessEl);
      });
      guessesContainer.append(rowEl);
      // console.log(rowEl);
    });
  };

  const handleKey = (event) => {
    const letter = event.target.id;
    // console.log(letter);
    if (letter.toLowerCase() === '<<') {
      deleteLetter();
      return;
    }
    if (letter.toLowerCase() === 'enter') {
      checkWord();
      return;
    }
    if (letter.length === 1) {
      addLetter(letter);
      return;
    }
  };

  const initKeys = () => {
    keys.forEach((keyVal) => {
      const buttonEl = document.createElement('button');
      buttonEl.textContent = keyVal;
      buttonEl.classList.add('key');
      buttonEl.setAttribute('id', keyVal);
      buttonEl.addEventListener('click', handleKey, true);
      keyboardContainer.append(buttonEl);
    });
  };

  buildGuessRows();
  initKeys();
})();
