import React, { useCallback, useEffect, useState } from 'react';
import '../styles/pages/HomePage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePreferences } from '../context/PreferenceContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowDown, ArrowUp, Compass, Plus, RefreshCw, SlidersHorizontal } from 'lucide-react';

const INTERESTS = [
  'Technology', 'Science', 'Education', 'Sports', 'Art',
  'Entertainment', 'Personal Stories', 'Social Causes'
];

const DISCOVERY_LEVELS = [
  { value: 'Focus Only', label: 'Focused' },
  { value: 'Mostly My Interests', label: 'Mostly familiar' },
  { value: 'Balanced', label: 'Balanced' },
  { value: 'Explore More', label: 'Explore more' }
];

const HomePage = () => {
  const { preferences, updatePreferences } = usePreferences();
  const { auth } = useAuth();
  const location = useLocation();
  const [createdPost] = useState(() => location.state?.createdPost || null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedMode, setFeedMode] = useState('interests');
  const [exploreTopic, setExploreTopic] = useState(preferences.focusMode);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const navigate = useNavigate();
  const selectedInterests = preferences.interests.length > 0
    ? preferences.interests
    : auth.user?.interests || [];
  const selectedTopic = feedMode === 'discover'
    ? exploreTopic
    : selectedInterests.includes(preferences.focusMode)
      ? preferences.focusMode
      : selectedInterests[0] || INTERESTS[0];

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        focusMode: selectedTopic,
        discoveryLevel: feedMode === 'discover' ? preferences.discoveryLevel : 'Focus Only'
      });

      const response = await fetch(`/api/posts?${params}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to load posts');

      const fetchedPosts = Array.isArray(data.data) ? data.data : [];
      const nextPosts = createdPost
        ? [createdPost, ...fetchedPosts.filter(post => post._id !== createdPost._id)]
        : fetchedPosts;
      setPosts(nextPosts);
      setActiveIndex(0);
      setSlideDirection('next');
    } catch (error) {
      toast.error(error.message || 'An error occurred while loading posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [auth.token, createdPost, feedMode, preferences.discoveryLevel, selectedTopic]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (location.state?.createdPost) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state?.createdPost, navigate]);

  const stepPost = useCallback((direction) => {
    const nextIndex = Math.max(0, Math.min(posts.length - 1, activeIndex + direction));
    if (nextIndex === activeIndex) return;
    setSlideDirection(direction > 0 ? 'next' : 'previous');
    setActiveIndex(nextIndex);
  }, [activeIndex, posts.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        stepPost(1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        stepPost(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepPost]);

  const handlePostUpdated = (updatedPost) => {
    setPosts(currentPosts => currentPosts.map(post => (
      post._id === updatedPost._id ? { ...post, ...updatedPost } : post
    )));
  };

  const updateTopic = (topic) => {
    if (feedMode === 'discover') {
      setExploreTopic(topic);
    } else {
      updatePreferences({ focusMode: topic });
    }
  };

  const handleModeChange = (mode) => {
    if (mode === 'discover' && selectedInterests.length > 0) {
      setExploreTopic(selectedInterests[0]);
    }
    setFeedMode(mode);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-heading">
          <span className="home-eyebrow">FOCUSFEED</span>
          <h1>Your feed</h1>
        </div>
        <div className="home-header-actions">
          <button className="icon-button" type="button" onClick={handleRefresh} disabled={refreshing} aria-label="Refresh feed" title="Refresh feed">
            <RefreshCw size={18} />
          </button>
          <button className="create-post-btn" type="button" onClick={() => navigate('/create/post')}>
            <Plus size={18} /><span>New post</span>
          </button>
        </div>
      </header>

      <section className="feed-controls" aria-label="Feed controls">
        <div className="feed-mode-tabs" role="tablist" aria-label="Feed mode">
          <button
            type="button"
            role="tab"
            aria-selected={feedMode === 'interests'}
            className={feedMode === 'interests' ? 'active' : ''}
            onClick={() => handleModeChange('interests')}
          >
            <SlidersHorizontal size={16} /> Interests
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={feedMode === 'discover'}
            className={feedMode === 'discover' ? 'active' : ''}
            onClick={() => handleModeChange('discover')}
          >
            <Compass size={16} /> Discover
          </button>
        </div>

        <div className="feed-filter-row">
          <label htmlFor="feed-topic">{feedMode === 'interests' ? 'Your interests' : 'Explore a topic'}</label>
          <select id="feed-topic" value={selectedTopic} onChange={event => updateTopic(event.target.value)}>
            {(feedMode === 'interests' && selectedInterests.length > 0 ? selectedInterests : INTERESTS).map(interest => (
              <option key={interest} value={interest}>{interest}</option>
            ))}
          </select>
          {feedMode === 'discover' && (
            <>
              <label className="discovery-label" htmlFor="feed-discovery-level">Discovery</label>
              <select
                id="feed-discovery-level"
                value={preferences.discoveryLevel}
                onChange={event => updatePreferences({ discoveryLevel: event.target.value })}
              >
                {DISCOVERY_LEVELS.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
              </select>
            </>
          )}
        </div>
        {feedMode === 'interests' && selectedInterests.length === 0 && (
          <p className="feed-interest-prompt">
            Pick topics to personalize your feed. <button type="button" onClick={() => navigate('/interests/setup')}>Set interests</button>
          </p>
        )}
      </section>

      <div className="feed-status" aria-live="polite">
        {loading ? 'Loading posts…' : posts.length ? `Post ${activeIndex + 1} of ${posts.length}` : 'No posts in this feed'}
      </div>

      {loading ? (
        <div className="feed-loading"><LoadingSpinner /></div>
      ) : posts.length > 0 ? (
        <section className="feed-stage" aria-label={`Post ${activeIndex + 1} of ${posts.length}`}>
          <div className={`post-stage-card slide-${slideDirection}`} key={`${posts[activeIndex]._id}-${activeIndex}`}>
            <PostCard post={posts[activeIndex]} onPostUpdated={handlePostUpdated} />
          </div>
          <div className="feed-step-controls" aria-label="Post navigation">
            <button type="button" onClick={() => stepPost(-1)} disabled={activeIndex === 0} aria-label="Previous post" title="Previous post (up arrow)">
              <ArrowUp size={19} />
            </button>
            <button type="button" onClick={() => stepPost(1)} disabled={activeIndex >= posts.length - 1} aria-label="Next post" title="Next post (down arrow)">
              <ArrowDown size={19} />
            </button>
          </div>
        </section>
      ) : (
        <div className="feed-empty">
          <h2>No posts in this feed</h2>
          <p>Try another topic or switch to Discover.</p>
          <button type="button" className="create-post-btn" onClick={() => setFeedMode('discover')}>Explore posts</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;