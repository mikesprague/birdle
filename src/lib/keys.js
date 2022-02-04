import keyboardJs from 'keyboardjs';

module.exports.initKeys = (keys, keyHandler) => {
  const keyboardContainer = document.querySelector('.keyboard-container');
  keys.forEach((keyVal) => {
    const buttonEl = document.createElement('button');
    buttonEl.textContent = keyVal;
    buttonEl.classList.add('key');
    buttonEl.setAttribute('id', keyVal);
    buttonEl.addEventListener('click', keyHandler, true);
    keyboardContainer.append(buttonEl);
    keyboardJs.bind(keyVal.toLowerCase(), (e) => console.log(e.key));
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
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
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
