import Swal from 'sweetalert2';
import { html } from 'common-tags';

module.exports.showInstructions = () => {
  Swal.fire({
    title: 'How to Play',
    titleText: 'How to Play',
    background: 'rgb(24 24 27)',
    color: '#dedede',
    html: html`
      <div class="instructions">
        <p>Guess the BIRDLE in 6 tries.</p>
        <p>
          Each guess must be a valid 5 letter word. Hit the enter button to
          submit.
        </p>
        <p>
          After each guess, the color of the tiles will change to show how close
          your guess was to the word.
        </p>
        <p>A new BIRDLE will be available each day!</p>
      </div>
    `,
  });
};
