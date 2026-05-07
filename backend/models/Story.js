const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {  
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    url: {
      type: String,
      default: '',
    },
    points: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    postedAt: {
      type: String,
      default: '',
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.model('Story', storySchema);

module.exports = Story;