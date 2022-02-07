import { getData, setData } from './local-storage';

module.exports.initStats = () => {
  // get stats if there or create localstorage object if not
  const initialStatsObject = {
    currentStreak: 0,
    maxStreak: 0,
    guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
    winPercentage: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    averageGuesses: 0,
  };
  let stats = getData('stats');
  if (stats === null || stats === undefined) {
    stats = initialStatsObject;
    setData('stats', stats);
  }
  return stats;
};
