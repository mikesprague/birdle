import Swal from 'sweetalert2';
import { html } from 'common-tags';

module.exports.showInstructions = () => {
  Swal.fire({
    background: '#181818',
    color: '#dedede',
    html: html`
      <div class="instructions">
        <p class="text-lg"><strong>How to Play</strong></p>
        <p>Guess the BIRDLE in 6 tries.</p>
        <p>
          Each guess must be a valid 5 letter word. Hit the enter button to
          submit.
        </p>
        <p>
          After each guess, the color of the tiles will change to show how close
          your guess was to the word.
        </p>
        <!-- <hr />
        <p>
          <strong>Examples</strong>
          <p>
          <div class="guess-row">
            <div class="guess">s</div><div class="guess">t</div><div class="guess">o</div><div class="guess">r</div><div class="guess">m</div>
          </div>
          The letter s is in the word and in the correct spot
          </p>
          <p>
          <div class="guess-row">
            <div class="guess">w</div><div class="guess">o</div><div class="guess">r</div><div class="guess">l</div><div class="guess">d</div>
          </div>
          the letter l is in the word but in the wrong spot
          </p>
          <p>
          <div class="guess-row">
            <div class="guess">w</div><div class="guess">a</div><div class="guess">c</div><div class="guess">k</div><div class="guess">y</div>
          </div>
          the letter k is not in the word
          </p>
        </p>
        <hr /> -->
        <p>A new BIRDLE will be available each day!</p>
      </div>
    `,
  });
};
