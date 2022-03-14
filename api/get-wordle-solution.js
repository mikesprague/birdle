const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://www.nytimes.com/games/wordle/index.html');

    const gameState = await page.evaluate(() =>
      // eslint-disable-next-line no-undef
      window.localStorage.getItem('nyt-wordle-state'),
    );
    const { solution } = JSON.parse(gameState);
    console.log(solution);

    await browser.close();

    res.status(200).json(solution);
  } catch (error) {
    res.status(500).json(error);
  }
};
