export function setData(key, data) {
  const dataToSet = JSON.stringify(data);
  localStorage.setItem(key, dataToSet);
}

export function getData(key) {
  const dataToGet = localStorage.getItem(key);
  return JSON.parse(dataToGet);
}

export function clearData(key) {
  localStorage.removeItem(key);
}

export function resetData() {
  localStorage.clear();
}

export function isCached(key) {
  return getData(key) !== null;
}

// const stats = {
//   currentStreak: 2,
//   maxStreak: 3,
//   guesses: { 1: 1, 2: 0, 3: 1, 4: 2, 5: 2, 6: 1, fail: 1 },
//   winPercentage: 88,
//   gamesPlayed: 8,
//   gamesWon: 7,
//   averageGuesses: 4,
// };
