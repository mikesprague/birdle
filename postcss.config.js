import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindcss from 'tailwindcss';

const cssSafelistClassArray = [/swal2/, /w-1\/2/];

export default {
  plugins: [
    autoprefixer({}),
    tailwindcss({}),
    cssnano({
      preset: 'default',
    }),
    purgeCSSPlugin({
      content: ['./src/**/*.html', './src/**/*.js'],
      fontFace: true,
      safelist: cssSafelistClassArray,
    }),
  ],
};
