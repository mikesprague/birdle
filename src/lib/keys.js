import keyboardJs from 'keyboardjs';

export const initKeyboardBindings = (keys, keyHandler) => {
  keys.forEach((keyVal) => {
    let letter = keyVal === 'back' ? 'backspace' : keyVal;
    keyboardJs.bind(letter, (e) => {
      e.preventRepeat();
      keyHandler(letter);
    });
  });
};

export const initKeys = (keys, keyHandler) => {
  const keyboardContainer = document.querySelector('.keyboard-container');
  keys.forEach((keyVal) => {
    if (keyVal === '--') {
      const breakEl = document.createElement('div');
      breakEl.classList.add('break-flex');
      keyboardContainer.append(breakEl);
    } else {
      const buttonEl = document.createElement('button');
      buttonEl.textContent = keyVal.toUpperCase();
      buttonEl.classList.add('key');
      buttonEl.setAttribute('id', keyVal);
      buttonEl.addEventListener('click', keyHandler, true);
      keyboardContainer.append(buttonEl);
    }
  });
  initKeyboardBindings(keys, keyHandler);
};

export const gameOver = (keys, keyHandler) => {
  keys.forEach((keyVal) => {
    let letter = keyVal === 'back' ? 'backspace' : keyVal;
    keyboardJs.unbind(letter, () => keyHandler(letter));
  });
};

export const keys = [
  'q',
  'w',
  'e',
  'r',
  't',
  'y',
  'u',
  'i',
  'o',
  'p',
  '--',
  'a',
  's',
  'd',
  'f',
  'g',
  'h',
  'j',
  'k',
  'l',
  '--',
  'enter',
  'z',
  'x',
  'c',
  'v',
  'b',
  'n',
  'm',
  'back',
];
