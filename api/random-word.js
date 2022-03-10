const axios = require('axios').default;

const fullWordList = require('../src/lib/words');

const { RAPID_API_KEY } = process.env;

const getBirdleOfDay = () => {
  const now = new Date();
  const start = new Date(2022, 0, 0);
  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));

  while (day > fullWordList.words.length) {
    day -= fullWordList.words.length;
  }

  return {
    word: fullWordList.words[day],
    day,
  };
};

module.exports = async (req, res) => {
  const currentBirdle = getBirdleOfDay();
  const axiosOptions = {
    method: 'GET',
    url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
    params: { count: '20', excludes: currentBirdle.word, wordLength: '5' },
    headers: {
      'x-rapidapi-host': 'random-words5.p.rapidapi.com',
      'x-rapidapi-key': RAPID_API_KEY,
    },
  };

  const words = await axios
    .request(axiosOptions)
    .then((response) => {
      // console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json(error);
    });

  res.setHeader('Cache-Control', 'max-age=3600, s-maxage=3600');
  res.status(200).json(words);
};
