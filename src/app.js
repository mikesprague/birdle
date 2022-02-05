import {
  isGuessValid,
  getBirdleOfDay,
  successStrings,
  buildGuessesRows,
  showMessage,
} from './lib/helpers';
import { initKeys, keys } from './lib/keys';
import { getData, setData } from './lib/local-storage';

// 🦤🐤🦤🦤🦤
// 🦜🦤🦤🦤🦜
// 🦜🦤🦜🦤🦜
// 🦜🦤🦜🦤🦜
// 🦜🦤🦜🦤🦜
// 🦜🦜🦜🦜🦜

(async () => {
  const initGame = async () => {
    const initialGameState = {
      currentRow: 0,
      currentGuess: 0,
      isGameOver: false,
      guessesRows: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
    };
    let gameState = getData('gameState');
    console.log('initial game state: ', gameState);
    if (null || gameState === undefined) {
      setData('gameState', initialGameState);
      gameState = initialGameState;
    }
    buildGuessesRows(gameState.guessesRows);
    initKeys(keys, handleKey);
    console.log('🙈 nothing to see here, move along now');
  };

  const birdle = getBirdleOfDay();

  const addLetter = (letter) => {
    let gameState = getData('gameState');
    let { currentRow, currentGuess, guessesRows } = gameState;
    if (
      currentGuess < guessesRows[currentRow].length &&
      currentRow < guessesRows.length
    ) {
      const el = document.getElementById(
        `guessRow-${currentRow}-guess-${currentGuess}`,
      );
      el.textContent = letter.toUpperCase();
      el.setAttribute('data', letter);

      gameState.guessesRows[currentRow][currentGuess] = letter;
      gameState.currentGuess += 1;
      console.log('gameState: ', gameState);
      setData('gameState', gameState);
      // guessesRows[currentRow][currentGuess] = letter;
      // currentGuess += 1;
    }
  };

  const deleteLetter = () => {
    let gameState = getData('gameState');
    let { currentRow, currentGuess, guessesRows } = gameState;
    if (currentGuess > 0) {
      currentGuess -= 1;
      const el = document.getElementById(
        `guessRow-${currentRow}-guess-${currentGuess}`,
      );
      el.textContent = '';
      el.setAttribute('data', '');
      gameState.guessesRows[currentRow][currentGuess] = '';
      gameState.currentGuess = currentGuess;
      setData('gameState', gameState);
    }
  };

  const colorKeyboardLetter = (letter, className) => {
    const key = document.getElementById(letter);
    if (
      key.classList.contains('correct-overlay') ||
      key.classList.contains('present-overlay')
    ) {
      return;
    }
    key.classList.add(className);
    // if (className === 'absent-overlay') {
    //   key.setAttribute('disabled', 'disabled');
    // }
  };

  const colorGuess = (currentRow) => {
    const row = document.getElementById(`guessRow-${currentRow}`);
    const guesses = row.childNodes;
    let checkBirdle = birdle;
    let guessArray = Array.from(guesses).map((guess) => {
      return {
        letter: guess.getAttribute('data'),
        color: 'absent-overlay',
      };
    });

    guessArray.forEach((guess, guessIndex) => {
      if (guess.letter === birdle[guessIndex]) {
        guess.color = 'correct-overlay';
        checkBirdle = checkBirdle.replace(guess.letter, '');
      }
    });

    guessArray.forEach((guess) => {
      if (
        checkBirdle.includes(guess.letter) &&
        guess.color !== 'correct-overlay'
      ) {
        guess.color = 'present-overlay';
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
    let gameState = getData('gameState');
    let { currentRow, currentGuess, guessesRows } = gameState;
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
      colorGuess(currentRow);
      if (guess.toLowerCase() === birdle) {
        showMessage(successStrings[currentRow], true);
        document
          .getElementById('ENTER')
          .removeEventListener('click', handleKey, true);
        gameState.isGameOver = true;
        setData('gameState', gameState);
        return;
      } else {
        if (currentRow < guessesRows.length - 1) {
          gameState.currentRow += 1;
          gameState.currentGuess = 0;
          setData('gameState', gameState);
          return;
        } else {
          showMessage('Womp womp', true);
          document
            .getElementById('ENTER')
            .removeEventListener('click', handleKey, true);
          gameState.isGameOver = true;
          setData('gameState', gameState);
          return;
        }
      }
    } else {
      // console.log('not enough letters');
    }
  };

  const handleKey = (letter) => {
    let gameState = getData('gameState');
    let { isGameOver } = gameState;
    if (!isGameOver) {
      const key = typeof letter === 'object' ? letter.target.id : letter;

      if (key === '<<' || key === 'backspace') {
        deleteLetter();
      }
      if (key === 'enter') {
        checkWord();
      }
      if (key.length === 1) {
        addLetter(key);
      }
    }
  };

  initGame();
})();
