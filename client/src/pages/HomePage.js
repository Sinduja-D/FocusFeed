import React, { useState, useEffect } from 'react';
import '../styles/pages/HomePage.css';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../context/PreferenceContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import PostCard from '../components/PostCard';
import FocusModeSelector from '../components/FocusModeSelector';
import DiscoverySelector from '../components/DiscoverySelector';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  RefreshCw, 
  Filter, 
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';

const HomePage = () => {
  const { preferences, updatePreferences } = usePreferences();
  const { auth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        focusMode: preferences.focusMode,
        discoveryLevel: preferences.discoveryLevel
      });

      if (preferences.interests.length > 0) {
        params.append('interest', preferences.interests[0]);
      }

      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.data);
      } else {
        toast.error('Failed to load posts');
      }
    } catch (error) {
      toast.error('An error occurred while loading posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [preferences]);

  // Keep hooks unconditional so the component has a stable hook order.
  if (auth.loading) {
    return <LoadingSpinner />;
  }

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleFocusModeChange = (newMode) => {
    updatePreferences({ focusMode: newMode });
  };

  const handleDiscoveryLevelChange = (newLevel) => {
    updatePreferences({ discoveryLevel: newLevel });
  };

  const handleCreatePost = () => {
    navigate('/create/post');
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(currentPosts => currentPosts.map(post => (
      post._id === updatedPost._id ? { ...post, ...updatedPost } : post
    )));
  };

  const stats = {
    totalPosts: posts.length,
    todayPosts: posts.filter(post => {
      const postDate = new Date(post.createdAt);
      const today = new Date();
      return postDate.toDateString() === today.toDateString();
    }).length,
    activeUsers: Math.floor(Math.random() * 100) + 50
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="greeting">
          <h1>Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}!</h1>
          <p>Here's what's happening in your feed</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={20} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          
          <button 
            className="filters-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-container">
            <FocusModeSelector 
              currentMode={preferences.focusMode}
              onModeChange={handleFocusModeChange}
            />
            
            <DiscoverySelector 
              currentLevel={preferences.discoveryLevel}
              onLevelChange={handleDiscoveryLevelChange}
            />
          </div>
        </div>
      )}

      <div className="feed-stats">
        <div className="stat-card">
          <TrendingUp size={20} />
          <div>
            <span className="stat-value">{stats.totalPosts}</span>
            <span className="stat-label">Posts</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Calendar size={20} />
          <div>
            <span className="stat-value">{stats.todayPosts}</span>
            <span className="stat-label">Today</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Users size={20} />
          <div>
            <span className="stat-value">{stats.activeUsers}</span>
            <span className="stat-label">Active Users</span>
          </div>
        </div>
      </div>

      <div className="create-post-section">
        <button className="btn btn-primary create-post-btn" onClick={handleCreatePost}>
          Create Post
        </button>
      </div>

      <div className="posts-container">
        {loading ? (
          <LoadingSpinner />
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
          ))
        ) : (
          <div className="empty-state">
            <h3>No posts found</h3>
            <p>Try changing your Focus Mode or Discovery Level</p>
            <button className="btn btn-primary" onClick={handleCreatePost}>
              Create the first post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;