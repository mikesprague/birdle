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
