import { html } from 'common-tags';
import Swal from 'sweetalert2';
import { isSystemDarkTheme } from './helpers';

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
      <div class="instructions" onClick="document.querySelector('.swal2-close').click()">
        <h1>How to Play</h1>
        <p>Guess the BIRDLE in 6 tries.</p>
        <p>
          Each guess must be a valid 5 letter word. Hit the enter button to
          submit.
        </p>
        <p>
          After each guess, the color of the tiles will change to show how close
          your guess was to the word.
        </p>
        <hr />
        <div>
          <h2>Examples</h2>
          <div>
            <div class="guess-row">
              <div class="guess correct-overlay">s</div>
              <div class="guess">t</div>
              <div class="guess">o</div>
              <div class="guess">r</div>
              <div class="guess">m</div>
            </div>
            <p class="examples-text">The letter S is in the word and in the correct spot.</p>
          </div>
          <div>
            <div class="guess-row">
              <div class="guess">w</div>
              <div class="guess">o</div>
              <div class="guess">r</div>
              <div class="guess present-overlay">l</div>
              <div class="guess">d</div>
            </div>
            <p class="examples-text">The letter L is in the word but in the wrong spot.</p>
            </p>
          </div>
          <div>
            <div class="guess-row">
              <div class="guess">q</div>
              <div class="guess absent-overlay">u</div>
              <div class="guess">a</div>
              <div class="guess">i</div>
              <div class="guess">l</div>
            </div>
            <p class="examples-text">The letter I is not in the word.</p>
          </div>
        </div>
        <hr />
        <p>A new BIRDLE will be available each day!</p>
      </div>
    `,
  });
};
