const Story = require('../models/Story');
const User = require('../models/User');

// -------------------------------------------
// @desc    Get all stories sorted by points
// @route   GET /api/stories
// @access  Public
// -------------------------------------------
const getAllStories = async (req, res) => {
  try {
    // Get page and limit from query params (for bonus pagination)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch stories sorted by points descending
    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const totalStories = await Story.countDocuments();
    const totalPages = Math.ceil(totalStories / limit);

    res.status(200).json({
      stories,
      pagination: {
        currentPage: page,
        totalPages,
        totalStories,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// -------------------------------------------
// @desc    Get a single story by ID
// @route   GET /api/stories/:id
// @access  Public
// -------------------------------------------
const getSingleStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.status(200).json(story);
  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid story ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// -------------------------------------------
// @desc    Toggle bookmark on a story
// @route   POST /api/stories/:id/bookmark
// @access  Private (requires JWT)
// -------------------------------------------
const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user._id;

    // Check if the story actually exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Find the logged-in user
    const user = await User.findById(userId);

    // Check if this story is already bookmarked by this user
    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      // Remove bookmark — filter out this storyId
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== storyId.toString()
      );
      await user.save();

      return res.status(200).json({
        message: 'Bookmark removed',
        bookmarked: false,
        bookmarks: user.bookmarks,
      });
    } else {
      // Add bookmark
      user.bookmarks.push(storyId);
      await user.save();

      return res.status(200).json({
        message: 'Story bookmarked',
        bookmarked: true,
        bookmarks: user.bookmarks,
      });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid story ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// -------------------------------------------
// @desc    Get all bookmarked stories for logged-in user
// @route   GET /api/stories/bookmarks
// @access  Private (requires JWT)
// -------------------------------------------
const getBookmarkedStories = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user and populate the bookmarks array with full story objects
    const user = await User.findById(userId).populate('bookmarks');

    res.status(200).json({
      bookmarks: user.bookmarks,
      count: user.bookmarks.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllStories,
  getSingleStory,
  toggleBookmark,
  getBookmarkedStories,
};