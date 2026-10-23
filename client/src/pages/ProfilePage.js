import React, { useState, useEffect, useCallback } from 'react';
import '../styles/pages/ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Edit, 
  Calendar, 
  Users,
  Target,
  Shield,
  Settings,
  LogOut,
  Camera,
  Heart,
  Eye,
  MessageSquare,
  Share2
} from 'lucide-react';

const ProfilePage = () => {
  const { auth, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    profileImage: null
  });
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    posts: 0,
    communities: 0,
    collaborations: 0,
    joined: new Date().toLocaleDateString()
  });
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        setEditForm({
          name: data.data.name,
          bio: data.data.bio || '',
          profileImage: null
        });
        
        // Calculate stats
        setStats(current => ({
          ...current,
          joined: new Date(data.data.createdAt).toLocaleDateString()
        }));
      } else {
        toast.error('Failed to load user data');
      }
    } catch (error) {
      toast.error('An error occurred while loading profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserPosts = useCallback(async () => {
    const userId = auth.user?.id || auth.user?._id;
    if (!userId) return;

    try {
      const response = await fetch(`/api/posts?author=${encodeURIComponent(userId)}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        const userPosts = Array.isArray(data.data) ? data.data : [];
        setPosts(userPosts);
        setStats(current => ({ ...current, posts: userPosts.length }));
      }
    } catch (error) {
      toast.error('Failed to load user posts');
    }
  }, [auth.token, auth.user?._id, auth.user?.id]);

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [fetchUserData, fetchUserPosts]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: user.name,
      bio: user.bio || '',
      profileImage: null
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('bio', editForm.bio);
      
      if (editForm.profileImage) {
        formData.append('profileImage', editForm.profileImage);
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditForm({
        ...editForm,
        profileImage: e.target.files[0]
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar">
            <img 
              src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff`} 
              alt={user.name} 
            />
            {isEditing && (
              <label className="avatar-upload">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
        </div>
        
        <div className="profile-info">
          <div className="profile-basic">
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleEditCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1>{user.name}</h1>
                <p className="profile-email">{user.email}</p>
                <p className="profile-bio">{user.bio || 'No bio yet'}</p>
                <div className="profile-meta">
                  <span>Joined {formatDate(user.createdAt)}</span>
                  <span>•</span>
                  <span>{stats.posts} posts</span>
                  <span>•</span>
                  <span>{stats.communities} communities</span>
                  <span>•</span>
                  <span>{stats.collaborations} collaborations</span>
                </div>
              </>
            )}
          </div>
          
          <div className="profile-actions">
            {!isEditing ? (
              <>
                <button className="btn btn-primary" onClick={handleEditProfile}>
                  <Edit size={20} />
                  <span>Edit Profile</span>
                </button>
                
                <button className="btn btn-secondary" onClick={() => navigate('/settings/privacy')}>
                  <Settings size={20} />
                  <span>Privacy Settings</span>
                </button>
                
                <button className="btn btn-secondary" onClick={() => navigate('/safety')}>
                  <Shield size={20} />
                  <span>Safety Center</span>
                </button>
                
                <button className="btn btn-outline" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-stats">
            <h3>Profile Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <Heart size={20} />
                <span>{stats.posts}</span>
                <span>Posts</span>
              </div>
              
              <div className="stat-item">
                <Users size={20} />
                <span>{stats.communities}</span>
                <span>Communities</span>
              </div>
              
              <div className="stat-item">
                <Target size={20} />
                <span>{stats.collaborations}</span>
                <span>Collaborations</span>
              </div>
              
              <div className="stat-item">
                <Calendar size={20} />
                <span>{stats.joined}</span>
                <span>Joined</span>
              </div>
            </div>
          </div>
          
          <div className="profile-interests">
            <h3>Interests</h3>
            <div className="interests-list">
              {(user.interests || []).map((interest, index) => (
                <span key={index} className="interest-tag">{interest}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-tabs">
            <button className="tab-btn active">Posts</button>
            <button className="tab-btn">About</button>
            <button className="tab-btn">Activity</button>
          </div>
          
          <div className="posts-section">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="profile-post">
                  <div className="post-header">
                    <div className="post-meta">
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="post-content">
                    <p>{post.content}</p>
                    
                    {post.image && (
                      <div className="post-image">
                        <img src={post.image} alt="Post" />
                      </div>
                    )}
                  </div>
                  
                  <div className="post-stats">
                    <div className="stat-item">
                      <Eye size={16} />
                      <span>{post.likes.length} likes</span>
                    </div>
                    <div className="stat-item">
                      <MessageSquare size={16} />
                      <span>{post.comments.length} comments</span>
                    </div>
                    <div className="stat-item">
                      <Share2 size={16} />
                      <span>{post.shares} shares</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>No posts yet</h3>
                <p>Start sharing your thoughts with the world</p>
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

export default ProfilePage;