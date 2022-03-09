// const axios = require('axios').default;

const { getBirdleOfDay } = require('../src/lib/helpers');

const { RAPID_API_KEY } = process.env;

module.exports = async (req, res) => {
  const birdle = getBirdleOfDay();

  console.log(birdle);
  
  res.status(200);
};
