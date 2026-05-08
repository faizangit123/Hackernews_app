import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';
import API from '../api/axios';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  const [stories, setStories] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchStories = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/stories?page=${page}&limit=10`);
      setStories(data.stories);
      setPagination(data.pagination);
    } catch (err) {
      setError(`Failed to load stories. Please try again. ERROR: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const { data } = await API.get('/stories/bookmarks');
      // Store only the IDs for quick lookup
      const ids = data.bookmarks.map((story) => story._id);
      setBookmarkedIds(ids);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err.message);
    }
  };

useEffect(() => {
  const loadStories = async () => {
    await fetchStories(currentPage);
  };

  loadStories();
}, [currentPage]);

useEffect(() => {
  const loadBookmarks = async () => {
    if (user) {
      await fetchBookmarks();
    } else {
      setBookmarkedIds([]);
    }
  };

  loadBookmarks();
}, [user]);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await API.post('/scrape');
      // After scraping, refresh stories from page 1
      setCurrentPage(1);
      await fetchStories(1);
      if (user) await fetchBookmarks();
    } catch (err) {
      setError(`Scraping failed. Please try again. ERROR: ${err}`);
    } finally {
      setScraping(false);
    }
  };

  const handleBookmarkChange = (storyId, isNowBookmarked) => {
    if (isNowBookmarked) {
      setBookmarkedIds((prev) => [...prev, storyId]);
    } else {
      setBookmarkedIds((prev) => prev.filter((id) => id !== storyId));
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <div className="home-header-text">
          <h1 className="home-title">🔶 Top HN Stories</h1>
          <p className="home-subtitle">
            Top stories from{' '}
            <a
              href="https://news.ycombinator.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hacker News
            </a>
            , sorted by points
          </p>
        </div>

        <button
          className={`scrape-btn ${scraping ? 'scraping' : ''}`}
          onClick={handleScrape}
          disabled={scraping}
        >
          {scraping ? (
            <>
              <span className="spinner"></span>
              Scraping...
            </>
          ) : (
            <>🔄 Refresh Stories</>
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="home-error">
          <span>⚠️ {error}</span>
          <button onClick={() => fetchStories(currentPage)}>Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-left">
                <div className="skeleton-box skeleton-rank"></div>
                <div className="skeleton-box skeleton-points"></div>
              </div>
              <div className="skeleton-content">
                <div className="skeleton-box skeleton-title"></div>
                <div className="skeleton-box skeleton-title short"></div>
                <div className="skeleton-box skeleton-meta"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stories List */}
      {!loading && stories.length > 0 && (
        <>
          <div className="stories-list">
            {stories.map((story, index) => (
              <StoryCard
                key={story._id}
                story={story}
                rank={(currentPage - 1) * 10 + index + 1}
                isBookmarked={bookmarkedIds.includes(story._id)}
                onBookmarkChange={handleBookmarkChange}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                ← Prev
              </button>

              <div className="page-numbers">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-num ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && stories.length === 0 && !error && (
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <p className="empty-text">No stories found.</p>
          <p className="empty-subtext">
            Click "Refresh Stories" to fetch the latest from HackerNews.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;