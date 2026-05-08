import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './StoryCard.css';

const StoryCard = ({ story, rank, isBookmarked, onBookmarkChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleBookmark = async () => {
    // If not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    setBookmarkLoading(true);
    try {
      const { data } = await API.post(`/stories/${story._id}/bookmark`);
      setBookmarked(data.bookmarked);

      if (onBookmarkChange) {
        onBookmarkChange(story._id, data.bookmarked);
      }
    } catch (error) {
      console.error('Bookmark error:', error.message);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleTitleClick = (e) => {
    if (!story.url || story.url === '') {
      e.preventDefault();
    }
  };

  const formatPoints = (points) => {
    if (points >= 1000) return `${(points / 1000).toFixed(1)}k`;
    return points;
  };

  return (
    <div className="story-card">
      {/* Left: Rank + Points */}
      <div className="story-left">
        <span className="story-rank">#{rank}</span>
        <div className="story-points">
          <span className="points-arrow">▲</span>
          <span className="points-value">{formatPoints(story.points)}</span>
        </div>
      </div>

      {/* Middle: Main Content */}
      <div className="story-content">
        <a
          href={story.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="story-title"
          onClick={handleTitleClick}
        >
          {story.title}
          </a>
      
        {story.url && story.url.startsWith('http') && (
          <span className="story-domain">
          ({new URL(story.url).hostname.replace('www.', '')})
          </span>
          )}

        <div className="story-meta">
          <span className="meta-item">
            <span className="meta-icon">✍️</span>
            {story.author}
          </span>
          <span className="meta-divider">·</span>
          <span className="meta-item">
            <span className="meta-icon">🕐</span>
            {story.postedAt}
          </span>
          <span className="meta-divider">·</span>
          <span className="meta-item">
            <span className="meta-icon">⬆️</span>
            {story.points} points
          </span>
        </div>
      </div>

      {/* Right: Bookmark Button */}
      <div className="story-right">
        <button
          className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
          disabled={bookmarkLoading}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark this story'}
        >
          {bookmarkLoading ? '⏳' : bookmarked ? '🔖' : '📌'}
        </button>
      </div>
    </div>
  );
};

export default StoryCard;