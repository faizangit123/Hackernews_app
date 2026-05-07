const scrapeHackerNews = require('../scraper/hackerNewsScraper');

// -------------------------------------------
// @desc    Trigger scraper manually via API
// @route   POST /api/scrape
// @access  Public
// -------------------------------------------
const triggerScrape = async (req, res) => {
  try {
    const stories = await scrapeHackerNews();

    res.status(200).json({
      message: `✅ Scraping successful. ${stories.length} stories saved.`,
      count: stories.length,
      stories,
    });
  } catch (error) {
    res.status(500).json({
      message: '❌ Scraping failed',
      error: error.message,
    });
  }
};

module.exports = { triggerScrape };