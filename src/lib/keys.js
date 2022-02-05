import keyboardJs from 'keyboardjs';

module.exports.initKeyboardBindings = (keys, keyHandler) => {
  keys.forEach((keyVal) => {
    let letter = keyVal === '<<' ? 'backspace' : keyVal;
    keyboardJs.bind(letter, (e) => {
      e.preventRepeat();
      keyHandler(letter);
    });
  });
};

module.exports.initKeys = (keys, keyHandler) => {
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
  module.exports.initKeyboardBindings(keys, keyHandler);
};

module.exports.gameOver = (keys, keyHandler) => {
  keys.forEach((keyVal) => {
    let letter = keyVal === '<<' ? 'backspace' : keyVal;
    keyboardJs.unbind(letter, () => keyHandler(letter));
  });
};

module.exports.keys = [
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
  '<<',
];
