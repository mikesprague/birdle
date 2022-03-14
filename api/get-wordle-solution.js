const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  const browser = await puppeteer.launch(
    process.env.AWS_EXECUTION_ENV
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
  );
  const page = await browser.newPage();
  await page.goto('https://www.nytimes.com/games/wordle/index.html');

  const gameState = await page.evaluate(() =>
    // eslint-disable-next-line no-undef
    window.localStorage.getItem('nyt-wordle-state'),
  );
  const { solution } = JSON.parse(gameState);
  console.log(JSON.parse(gameState));
  console.log(solution);

  await browser.close();

  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
  );
  const secondsUntilMidnight = Math.round(
    (midnight.getTime() - now.getTime()) / 1000,
  );

  res.setHeader(
    'Cache-Control',
    `max-age=${secondsUntilMidnight}, s-maxage=${secondsUntilMidnight}`,
  );
  res.status(200).json(solution);
};
