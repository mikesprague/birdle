import Swal from 'sweetalert2';
import { html } from 'common-tags';

module.exports.showInstructions = () => {
  Swal.fire({
    background: '#181818',
    color: '#dedede',
    showCloseButton: true,
    showConfirmButton: false,
    allowOutsideClick: true,
    backdrop: true,
    html: html`
      <div class="instructions" onClick="document.querySelector('.swal2-close').click()">
        <h1>How to Play</strong></h1>
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
              <div class="guess">b</div>
              <div class="guess">i</div>
              <div class="guess absent-overlay">r</div>
              <div class="guess">d</div>
              <div class="guess">s</div>
            </div>
            <p class="examples-text">The letter R is not in the word.</p>
          </div>
        </div>
        <hr />
        <p>A new BIRDLE will be available each day!</p>
      </div>
    `,
  });
};
