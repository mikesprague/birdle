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

  const apiCallNums = [1, 2, 3, 4, 5];
  const apiCallResults = [];
  let excludeWords = [currentBirdle.word];
  for await (const num of apiCallNums) {
    console.log('apiCallNum: ', num);
    if (num > 1) {
      excludeWords.push(apiCallResults[apiCallResults.length - 1]);
    }
    const words = await axios
      .get('https://random-words5.p.rapidapi.com/getMultipleRandom', {
        params: { count: '20', excludes: excludeWords.join(), wordLength: '5' },
        headers: {
          'x-rapidapi-host': 'random-words5.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY,
        },
      })
      .then((response) => {
        // console.log(response.data);
        return response.data;
      });
    apiCallResults.push(words.join());
  }

  res.setHeader('Cache-Control', 'max-age=86400, s-maxage=86400');
  res.status(200).json([apiCallResults.join()]);
};
