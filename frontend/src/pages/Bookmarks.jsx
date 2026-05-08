import { useState, useEffect } from 'react';
import StoryCard from '../components/StoryCard';
import API from '../api/axios';
import './Bookmarks.css';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/stories/bookmarks');
      setBookmarks(data.bookmarks);
    } catch (err) {
      setError(`Failed to load bookmarks. Please try again. ERROR: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const loadBookmarks = async () => {
    await fetchBookmarks();
   };
   loadBookmarks();
  }, []);

  // When a bookmark is removed on this page, remove it from the list
  const handleBookmarkChange = (storyId, isNowBookmarked) => {
    if (!isNowBookmarked) {
      setBookmarks((prev) =>
        prev.filter((story) => story._id !== storyId)
      );
    }
  };

  return (
    <div className="bookmarks-container">
      {/* Header */}
      <div className="bookmarks-header">
        <div>
          <h1 className="bookmarks-title">🔖 My Bookmarks</h1>
          <p className="bookmarks-subtitle">
            {!loading && `${bookmarks.length} saved ${bookmarks.length === 1 ? 'story' : 'stories'}`}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bookmarks-error">
          <span>⚠️ {error}</span>
          <button onClick={fetchBookmarks}>Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bookmarks-loading">
          <div className="loading-spinner"></div>
          <p>Loading your bookmarks...</p>
        </div>
      )}

      {/* Bookmarks List */}
      {!loading && bookmarks.length > 0 && (
        <div className="bookmarks-list">
          {bookmarks.map((story, index) => (
            <StoryCard
              key={story._id}
              story={story}
              rank={index + 1}
              isBookmarked={true}
              onBookmarkChange={handleBookmarkChange}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && bookmarks.length === 0 && !error && (
        <div className="bookmarks-empty">
          <p className="empty-icon">🔍</p>
          <p className="empty-heading">No bookmarks yet</p>
          <p className="empty-subtext">
            Head to the{' '}
            <a href="/">Home page</a>
            {' '}and bookmark stories you find interesting!
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;