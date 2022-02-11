export const setData = (key, data) => {
  const dataToSet = JSON.stringify(data);
  localStorage.setItem(key, dataToSet);
};

export const getData = (key) => {
  const dataToGet = localStorage.getItem(key);
  return JSON.parse(dataToGet);
};

export const clearData = (key) => {
  localStorage.removeItem(key);
};

export const resetData = () => {
  localStorage.clear();
};

export const isCached = (key) => {
  return getData(key) !== null;
};
