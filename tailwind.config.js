const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  darkMode: 'media',
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      white: colors.white,
      black: colors.black,
      gray: colors.zinc,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      purple: colors.purple,
      transparent: colors.transparent,
    },
    extend: {
      colors: {
        absent: 'rgb(120, 124, 126)',
        present: 'rgb(201, 180, 88)',
        correct: 'rgb(106, 170, 100)',
      },
    },
  },
  plugins: [],
};
