import { bindKey, unbindKey } from '@rwh/keystrokes';

export const initKeyboardBindings = (keys, keyHandler) => {
  for (const keyVal of keys) {
    const letter = keyVal === 'back' ? 'backspace' : keyVal;

    bindKey(letter, () => {
      keyHandler(letter);
    });
  }
};

export const initKeys = (keys, keyHandler) => {
  const keyboardContainer = document.querySelector('.keyboard-container');

  let index = 0;
  for (const keyVal of keys) {
    if (keyVal === '--') {
      const breakEl = document.createElement('div');
      breakEl.classList.add('break-flex');
      keyboardContainer.append(breakEl);
    } else {
      const buttonEl = document.createElement('button');

      buttonEl.textContent = keyVal.toUpperCase();
      buttonEl.classList.add(
        'key',
        'flex',
        'basis-auto',
        'flex-grow',
        'text-sm',
        'font-semibold',
        'bg-gray-400',
        'text-white',
        'items-center',
        'justify-center',
        'manipulation',
        'md:h-14',
        'h-12',
        'short:h-10',
        'md:w-9',
        'w-8',
        'short:w-7',
        'rounded-md',
        'border-0',
        'md:text-base'
      );
      if (index === 11) {
        buttonEl.classList.add('ml-2');
      }
      if (index === 19) {
        buttonEl.classList.add('mr-2');
      }
      if (index === 21 || index === 29) {
        buttonEl.classList.add('md:w-16', 'w-12', 'short:w-11');
      }
      buttonEl.setAttribute('id', keyVal);
      buttonEl.addEventListener('click', keyHandler, true);
      keyboardContainer.append(buttonEl);
    }
    index += 1;
  }

  initKeyboardBindings(keys, keyHandler);
};

export const gameOver = (keys, keyHandler) => {
  for (const keyVal of keys) {
    const letter = keyVal === 'back' ? 'backspace' : keyVal;

    unbindKey(letter, () => keyHandler(letter));
  }
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
