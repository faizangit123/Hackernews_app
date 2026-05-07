const express = require('express');
const router = express.Router();
const { triggerScrape } = require('../controllers/scrapeController');

// POST /api/scrape  — Manually trigger the scraper
router.post('/', triggerScrape);

module.exports = router;