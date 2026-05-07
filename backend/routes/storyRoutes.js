const express = require('express');
const router = express.Router();
const {
  getAllStories,
  getSingleStory,
  toggleBookmark,
  getBookmarkedStories,
} = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/stories         — Get all stories (public)
router.get('/', getAllStories);

// GET /api/stories/bookmarks — Get user's bookmarked stories (private)
router.get('/bookmarks', protect, getBookmarkedStories);

// GET /api/stories/:id     — Get single story (public)
router.get('/:id', getSingleStory);

// POST /api/stories/:id/bookmark — Toggle bookmark (private)
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;