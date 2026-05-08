const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const scrapeRoutes = require('./routes/scrapeRoutes');
const storyRoutes = require('./routes/storyRoutes');
const scrapeHackerNews = require('./scraper/hackerNewsScraper');

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('HackerNews API is running.');
});

app.use('/api/auth', authRoutes);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/stories', storyRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  try {
    console.log('⏳ Running initial scrape on server start...');
    await scrapeHackerNews();
    console.log('✅ Initial scrape complete');
  } catch (error) {
    console.error('❌ Initial scrape failed:', error.message);
  }
});