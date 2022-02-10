import Swal from 'sweetalert2/dist/sweetalert2.js';
import {
  isGuessValid,
  getBirdleOfDay,
  successStrings,
  buildGuessesRows,
  isSystemDarkTheme,
  initServiceWorker,
} from './lib/helpers';
import { showInstructions } from './lib/instructions';
import { initKeys, keys } from './lib/keys';
import { getData, setData } from './lib/local-storage';
import { initStats, showStats, updateStats } from './lib/stats';

initServiceWorker();

(async () => {
  const initGame = async (day = null) => {
    const initialGameState = {
      currentRow: 0,
      currentGuess: 0,
      isGameOver: false,
      wonGame: false,
      guessesRows: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
      gameId: day,
    };
    let gameState = getData('gameState');
    initStats();
    const gameStats = getData('stats');
    if (
      gameState === null ||
      gameState === undefined ||
      day === null ||
      day === undefined ||
      gameStats === null ||
      gameStats === undefined ||
      (gameState && day > gameState.gameId)
    ) {
      setData('gameState', initialGameState);
      gameState = initialGameState;
      showInstructions();
    }
    buildGuessesRows(gameState.guessesRows);
    initKeys(keys, handleKey);
    document.getElementById('help').addEventListener('click', () => {
      showInstructions();
    });
    document.getElementById('stats').addEventListener('click', () => {
      showStats();
    });
    if (gameState.isGameOver && gameStats.gamesPlayed && day === gameState.gameId) {
      showStats();
    }

    for (let i = 0; i < gameState.guessesRows.length; i += 1) {
      // console.log(i, gameState.guessesRows[i]);
      if (
        gameState.guessesRows[i].join('').length &&
        gameState.guessesRows[i].join('').length === 5 &&
        isGuessValid(gameState.guessesRows[i].join(''))
      ) {
        colorGuess(i);
      }
    }
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
      setData('gameState', gameState);
      // guessesRows[currentRow][currentGuess] = letter;
      // currentGuess += 1;
    }
  };

  const deleteLetter = () => {
    let gameState = getData('gameState');
    let { currentRow, currentGuess } = gameState;
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
    if (!key) {
      return;
    }
    if (className === 'correct-overlay') {
      key.classList.remove('present-overlay');
      key.classList.remove('absent-overlay');
      key.classList.add('correct-overlay');
      return;
    }
    if (
      className === 'present-overlay' &&
      !key.classList.contains('correct-overlay')
    ) {
      key.classList.remove('correct-overlay');
      key.classList.remove('absent-overlay');
      key.classList.add('present-overlay');
      return;
    }
    if (className === 'absent-overlay') {
      key.classList.remove('correct-overlay');
      key.classList.remove('present-overlay');
      key.classList.add('absent-overlay');
    }
    // if (className === 'absent-overlay') {
    //   key.setAttribute('disabled', 'disabled');
    // }
  };

  const colorGuess = (currentRow) => {
    const row = document.getElementById(`guessRow-${currentRow}`);
    const guesses = row.childNodes;
    const gameState = getData('gameState');
    let checkBirdle = birdle.word;
    let guessArray = Array.from(guesses).map((guess) => {
      return {
        letter: guess.textContent.toLowerCase(),
        color: 'absent-overlay',
      };
    });

    guessArray.forEach((guess, guessIndex) => {
      // console.log(guess, birdle[guessIndex]);
      if (guess.letter === birdle.word[guessIndex]) {
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
      const dataLetter = guess.textContent.toLowerCase();
      setTimeout(
        () => {
          guess.classList.add(guessArray[guessIndex].color);
          if (!gameState.isGameOver) {
            guess.classList.add('flip-vertical-right');
          }
          colorKeyboardLetter(dataLetter, guessArray[guessIndex].color);
        },
        !gameState.isGameOver ? 300 * guessIndex : 0,
      );
    });
  };

  const checkWord = () => {
    let gameState = getData('gameState');
    let { currentRow, currentGuess, guessesRows } = gameState;
    if (currentGuess === guessesRows[currentRow].length) {
      const guess = guessesRows[currentRow].join('');
      if (!isGuessValid(guess)) {
        Swal.fire({
          html: 'Not in word list',
          showConfirmButton: false,
          toast: true,
          timer: 2500,
          position: 'top',
          allowEscapeKey: false,
          background: isSystemDarkTheme ? '#181818' : '#dedede',
          color: isSystemDarkTheme ? '#dedede' : '#181818',
        });
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
      if (guess.toLowerCase() === birdle.word) {
        Swal.fire({
          text: successStrings[currentRow],
          showConfirmButton: false,
          toast: true,
          position: 'top',
          allowEscapeKey: false,
          background: isSystemDarkTheme ? '#181818' : '#dedede',
          color: isSystemDarkTheme ? '#dedede' : '#181818',
          timer: 2500,
          didDestroy: () => {
            showStats();
          },
        });
        document
          .getElementById('enter')
          .removeEventListener('click', handleKey, true);
        gameState.isGameOver = true;
        gameState.wonGame = true;
        setData('gameState', gameState);
        updateStats(true);
        return;
      } else {
        if (currentRow < guessesRows.length - 1) {
          gameState.currentRow += 1;
          gameState.currentGuess = 0;
          setData('gameState', gameState);
          return;
        } else {
          document
            .getElementById('enter')
            .removeEventListener('click', handleKey, true);
          Swal.fire({
            html: `Womp womp!<br>Today's Birdle was: <em class="uppercase">${birdle.word}</em>`,
            showConfirmButton: false,
            toast: true,
            position: 'top',
            allowEscapeKey: true,
            background: isSystemDarkTheme ? '#181818' : '#dedede',
            color: isSystemDarkTheme ? '#dedede' : '#181818',
            allowOutsideClick: true,
            timer: 2500,
            didDestroy: () => {
              showStats();
            },
          });
          gameState.isGameOver = true;
          setData('gameState', gameState);
          updateStats(false);
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

      if (key === 'ctrl' || key === 'shift' || key === 'alt') {
        return;
      }

      if (key === 'back' || key === 'backspace') {
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

  initGame(birdle.day);
})();
