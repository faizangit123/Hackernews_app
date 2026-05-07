const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const scrapeRoutes = require('./routes/scrapeRoutes');
const scrapeHackerNews = require('./scraper/hackerNewsScraper');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scrape', scrapeRoutes);

// Story routes (coming in Phase 5)
// app.use('/api/stories', storyRoutes);

const PORT = process.env.PORT || 5000;

// Connect DB, then start server, then auto-run scraper
connectDB().then(async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  // Auto-run scraper on every server start
  try {
    console.log('⏳ Running initial scrape on server start...');
    await scrapeHackerNews();
    console.log('✅ Initial scrape complete');
  } catch (error) {
    console.error('❌ Initial scrape failed:', error.message);
  }
});