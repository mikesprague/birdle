import { words } from './words';
import { allowed } from './allowed';

module.exports.getBirdleOfDay = () => {
  const now = new Date();
  const start = new Date(2022, 0, 0);
  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));
  while (day > words.length) {
    day -= words.length;
  }
  return words[day];
};

module.exports.isGuessValid = (word) =>
  words.includes(word.toLowerCase()) ||
  allowed.includes(word.toLowerCase()) ||
  words.includes(word.toUpperCase()) ||
  allowed.includes(word.toUpperCase());

module.exports.successStrings = [
  'Genius',
  'Magnificent',
  'Impressive',
  'Splendid',
  'Great',
  'Phew',
];
