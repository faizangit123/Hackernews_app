const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const HN_URL = 'https://news.ycombinator.com';

const scrapeHackerNews = async () => {
  try {
    console.log('🔄 Starting HackerNews scrape...');

    // Fetch the HTML page
    const { data } = await axios.get(HN_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    // Load HTML into cheerio 
    const $ = cheerio.load(data);

    const stories = [];

    // Find all story rows (each has class "athing")
    const storyRows = $('.athing').slice(0, 10);

    storyRows.each((index, element) => {
      // ---- Get Title and URL ----
      const titleElement = $(element).find('.titleline > a').first();
      const title = titleElement.text().trim();
      const url = titleElement.attr('href') || '';

      // ---- Get the next sibling row (has points, author, time) ----
      const subtextRow = $(element).next();

      // ---- Get Points ----
      const pointsText = subtextRow.find('.score').text();
      // pointsText looks like "342 points" 
      const points = parseInt(pointsText) || 0;

      // ---- Get Author ----
      const author = subtextRow.find('.hnuser').text().trim() || 'unknown';

      // ---- Get Posted Time ----
      const postedAt = subtextRow.find('.age').text().trim() || '';

      // Only add story if it has a title
      if (title) {
        stories.push({ title, url, points, author, postedAt });
      }
    });

    console.log(`✅ Scraped ${stories.length} stories from HackerNews`);

    // Clear old stories from DB and save new ones
    await Story.deleteMany({});
    console.log('🗑️  Cleared old stories from database');

    await Story.insertMany(stories);
    console.log('💾 New stories saved to database');

    return stories;
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    throw error;
  }
};

module.exports = scrapeHackerNews;