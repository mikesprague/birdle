module.exports.initKeys = (keys, keyHandler) => {
  const keyboardContainer = document.querySelector('.keyboard-container');
  keys.forEach((keyVal) => {
    if (keyVal === '--') {
      const breakEl = document.createElement('div');
      breakEl.classList.add('break-flex');
      keyboardContainer.append(breakEl);
    } else {
      const buttonEl = document.createElement('button');
      buttonEl.textContent = keyVal;
      buttonEl.classList.add('key');
      buttonEl.setAttribute('id', keyVal);
      buttonEl.addEventListener('click', keyHandler, true);
      keyboardContainer.append(buttonEl);
    }
  });
};

module.exports.keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  '--',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  '--',
  'ENTER',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  '<<',
];
