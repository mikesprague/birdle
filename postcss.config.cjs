const cssSafelistClassArray = [/swal2/, /w-1\/2/];

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('tailwindcss'),
    require('cssnano')({
      preset: 'default',
    }),
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.html', './src/**/*.js'],
      fontFace: true,
      safelist: cssSafelistClassArray,
    }),
  ],
};
