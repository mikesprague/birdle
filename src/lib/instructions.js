import { html } from 'common-tags';
import Swal from 'sweetalert2';
import { isSystemDarkTheme } from './helpers.js';

export const showInstructions = () => {
  Swal.fire({
    background: isSystemDarkTheme ? '#181818' : '#dedede',
    color: isSystemDarkTheme ? '#dedede' : '#181818',
    showCloseButton: true,
    showConfirmButton: false,
    allowOutsideClick: true,
    backdrop: true,
    heightAuto: false,
    position: 'center',
    html: html`
      <div class="instructions font-sans" onClick="document.querySelector('.swal2-close').click()">
        <h1 class="text-lg font-bold mb-2">How to Play</h1>
        <p class="text-base mb-4">Guess the BIRDLE in 6 tries.</p>
        <p class="text-base mb-4">
          Each guess must be a valid 5 letter word. Hit the enter button to
          submit.
        </p>
        <p class="text-base mb-4">
          After each guess, the color of the tiles will change to show how close
          your guess was to the word.
        </p>
        <hr class="my-2" />
        <div>
          <h2 class="text-lg font-bold mb-2">Examples</h2>
          <div>
            <div class="guess-row flex manipulation justify-center">
              <div class="guess correct-overlay md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">s</div>
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">t</div>
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">o</div>
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">r</div>
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">m</div>
            </div>
            <p class="examples-text text-sm mb-4">The letter S is in the word and in the correct spot.</p>
          </div>
          <div>
            <div class="guess-row flex manipulation justify-center">
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">w</div>
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">o</div>
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">r</div>
              <div class="guess present-overlay md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">l</div>
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">d</div>
            </div>
            <p class="examples-text text-sm mb-4">The letter L is in the word but in the wrong spot.</p>
          </div>
          <div>
            <div class="guess-row flex manipulation justify-center">
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">q</div>
              <div class="guess absent-overlay md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">u</div>
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">a</div>
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">i</div>
              <div class="guess md:h-10 w-10 h-10 border-2 border-gray-600 box-border flex justify-center items-center text-gray-900 dark:text-gray-50 m-1 text-2xl font-black uppercase">l</div>
            </div>
            <p class="examples-text text-sm mb-4">The letter U is not in the word.</p>
          </div>
        </div>
        <hr class="my-2" />
        <p class="text-base mb-4">A new BIRDLE will be available each day!</p>
      </div>
    `,
  });
};
