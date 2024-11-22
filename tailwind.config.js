import * as colors from 'tailwindcss/colors';
import * as defaultTheme from 'tailwindcss/defaultTheme';

export default {
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
        absent: '#3a3a3c',
        present: '#b59f3b',
        correct: '#538d4e',
      },
      screens: {
        short: { raw: '(max-height: 664px)' },
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [],
};
