import React, { useState, useEffect } from 'react';
import '../styles/pages/CommunityDetailPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Users, 
  Calendar, 
  ArrowLeft, 
  Plus,
  Settings,
  Bell,
  Share2
} from 'lucide-react';

const CommunityDetailPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunity();
    fetchPosts();
  }, [id]);

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/communities/${id}`);
      const data = await response.json();

      if (response.ok) {
        const loadedCommunity = data.data?.community || data.data;
        const members = Array.isArray(loadedCommunity.members) ? loadedCommunity.members : [];
        setCommunity(loadedCommunity);
        // Check if user is a member
        const userId = localStorage.getItem('userId');
        setIsMember(members.some(member => (member._id || member.user?._id || member.user) === userId));
      } else {
        toast.error('Failed to load community');
      }
    } catch (error) {
      toast.error('An error occurred while loading community');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?community=${id}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.data);
      }
    } catch (error) {
      toast.error('Failed to load posts');
    }
  };

  const handleJoinCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setIsMember(true);
        toast.success('Joined community successfully!');
        fetchCommunity(); // Refresh community data
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to join community');
      }
    } catch (error) {
      toast.error('An error occurred while joining community');
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setIsMember(false);
        toast.success('Left community successfully!');
        fetchCommunity(); // Refresh community data
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to leave community');
      }
    } catch (error) {
      toast.error('An error occurred while leaving community');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!community) {
    return (
      <div className="error-state">
        <h3>Community not found</h3>
        <p>The community you're looking for doesn't exist</p>
        <button className="btn btn-primary" onClick={() => navigate('/communities')}>
          Back to Communities
        </button>
      </div>
    );
  }

  return (
    <div className="community-detail-page">
      <div className="community-header">
        <button className="back-btn" onClick={() => navigate('/communities')}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <div className="community-info">
          <div className="community-icon">
            <Users size={48} />
          </div>
          <div className="community-details">
            <h1>{community.name}</h1>
            <p>{community.description}</p>
            <div className="community-meta">
              <div className="meta-item">
                <Users size={16} />
                <span>{(Array.isArray(community.members) ? community.members : []).length} members</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>Created {formatDate(community.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="community-actions">
          {isMember ? (
            <button className="btn btn-secondary" onClick={handleLeaveCommunity}>
              Leave Community
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleJoinCommunity}>
              Join Community
            </button>
          )}
          
          <button className="btn btn-outline">
            <Bell size={20} />
            <span>Notify</span>
          </button>
          
          <button className="btn btn-outline">
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="community-content">
        <div className="community-tabs">
          <button className="tab-btn active">
            Posts
          </button>
          <button className="tab-btn">
            About
          </button>
          <button className="tab-btn">
            Members
          </button>
          <button className="tab-btn">
            Events
          </button>
        </div>

        <div className="posts-section">
          <div className="posts-header">
            <h2>Community Posts</h2>
            <button className="btn btn-primary create-post-btn" onClick={() => navigate('/create/post')}>
              <Plus size={20} />
              Create Post
            </button>
          </div>
          
          <div className="posts-list">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className="empty-state">
                <h3>No posts yet</h3>
                <p>Be the first to share something in this community</p>
                <button className="btn btn-primary" onClick={() => navigate('/create/post')}>
                  Create Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;