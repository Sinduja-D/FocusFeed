import React, { useState, useEffect } from 'react';
import '../styles/admin/AdminPosts.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FileText, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Flag,
  Shield,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  MessageSquare,
  X
} from 'lucide-react';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/posts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.data.posts || []);
      } else {
        toast.error('Failed to load posts');
      }
    } catch (error) {
      toast.error('An error occurred while loading posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handlePostAction = (action, postId) => {
    setSelectedPost(postId);
    setShowPostModal(true);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'flagged') {
      return matchesSearch && post.moderationStatus === 'REVIEW';
    }
    
    if (filter === 'restricted') {
      return matchesSearch && post.moderationStatus === 'RESTRICTED';
    }
    
    if (filter === 'ai-generated') {
      return matchesSearch && post.aiLabel !== 'Human Created';
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getModerationBadge = (status) => {
    switch (status) {
      case 'SAFE':
        return { text: 'Safe', class: 'success' };
      case 'REVIEW':
        return { text: 'Under Review', class: 'warning' };
      case 'RESTRICTED':
        return { text: 'Restricted', class: 'danger' };
      default:
        return { text: 'Unknown', class: 'normal' };
    }
  };

  const getAIBadge = (label) => {
    switch (label) {
      case 'AI Generated':
        return { text: 'AI Generated', class: 'ai-generated' };
      case 'AI Assisted':
        return { text: 'AI Assisted', class: 'ai-assisted' };
      case 'AI Origin Uncertain':
        return { text: 'AI Uncertain', class: 'ai-uncertain' };
      default:
        return { text: 'Human Created', class: 'human-created' };
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-posts">
      <div className="admin-header">
        <h1>Posts Management</h1>
        <p>Review and moderate user posts</p>
      </div>

      <div className="posts-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All Posts</option>
            <option value="flagged">Flagged</option>
            <option value="restricted">Restricted</option>
            <option value="ai-generated">AI Generated</option>
          </select>
        </div>
      </div>

      <div className="posts-stats">
        <div className="stat-card">
          <FileText size={20} />
          <div>
            <span className="stat-value">{posts.length}</span>
            <span className="stat-label">Total Posts</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Flag size={20} />
          <div>
            <span className="stat-value">{posts.filter(p => p.moderationStatus === 'REVIEW').length}</span>
            <span className="stat-label">Flagged</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Shield size={20} />
          <div>
            <span className="stat-value">{posts.filter(p => p.moderationStatus === 'RESTRICTED').length}</span>
            <span className="stat-label">Restricted</span>
          </div>
        </div>
        
        <div className="stat-card">
          <FileText size={20} />
          <div>
            <span className="stat-value">{posts.filter(p => p.aiLabel !== 'Human Created').length}</span>
            <span className="stat-label">AI Content</span>
          </div>
        </div>
      </div>

      <div className="posts-table">
        <table>
          <thead>
            <tr>
              <th>Post</th>
              <th>Author</th>
              <th>Date</th>
              <th>Moderation</th>
              <th>AI Label</th>
              <th>Engagement</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => {
              const moderationBadge = getModerationBadge(post.moderationStatus);
              const aiBadge = getAIBadge(post.aiLabel);
              
              return (
                <tr key={post._id}>
                  <td>
                    <div className="post-preview">
                      <div className="post-content">
                        <p>{post.content.substring(0, 100)}...</p>
                      </div>
                      {post.image && (
                        <div className="post-image-preview">
                          <img src={post.image} alt="Post preview" />
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    <div className="author-info">
                      <div className="author-avatar">
                        <img 
                          src={post.author.profileImage || `https://ui-avatars.com/api/?name=${post.author.name}&background=2563eb&color=fff`} 
                          alt={post.author.name} 
                        />
                      </div>
                      <div>
                        <div className="author-name">{post.author.name}</div>
                        <div className="post-date">{formatDate(post.createdAt)}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="post-date">{formatDate(post.createdAt)}</div>
                  </td>
                  
                  <td>
                    <div className={`moderation-badge ${moderationBadge.class}`}>
                      {moderationBadge.text}
                    </div>
                  </td>
                  
                  <td>
                    <div className={`ai-badge ${aiBadge.class}`}>
                      {aiBadge.text}
                    </div>
                  </td>
                  
                  <td>
                    <div className="engagement-stats">
                      <div className="stat-item">
                        <Eye size={16} />
                        <span>{post.likes.length}</span>
                      </div>
                      <div className="stat-item">
                        <MessageSquare size={16} />
                        <span>{post.comments.length}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="post-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handlePostAction('view', post._id)}
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button 
                        className="action-btn"
                        onClick={() => handlePostAction('moderate', post._id)}
                      >
                        <Shield size={16} />
                      </button>
                      
                      <button 
                        className="action-btn"
                        onClick={() => handlePostAction('manage', post._id)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredPosts.length === 0 && (
        <div className="empty-state">
          <h3>No posts found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showPostModal && selectedPost && (
        <div className="post-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Post Moderation</h2>
              <button onClick={() => setShowPostModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="post-details">
                {posts.find(p => p._id === selectedPost) && (
                  <>
                    <div className="post-header">
                      <div className="author-info">
                        <div className="author-avatar">
                          <img 
                            src={posts.find(p => p._id === selectedPost).author.profileImage || `https://ui-avatars.com/api/?name=${posts.find(p => p._id === selectedPost).author.name}&background=2563eb&color=fff`} 
                            alt={posts.find(p => p._id === selectedPost).author.name} 
                          />
                        </div>
                        <div>
                          <h3>{posts.find(p => p._id === selectedPost).author.name}</h3>
                          <p>{formatDate(posts.find(p => p._id === selectedPost).createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="post-content">
                      <p>{posts.find(p => p._id === selectedPost).content}</p>
                      
                      {posts.find(p => p._id === selectedPost).image && (
                        <div className="post-image">
                          <img src={posts.find(p => p._id === selectedPost).image} alt="Post" />
                        </div>
                      )}
                    </div>
                    
                    <div className="post-meta">
                      <div className="meta-item">
                        <Eye size={16} />
                        <span>{posts.find(p => p._id === selectedPost).likes.length} likes</span>
                      </div>
                      <div className="meta-item">
                        <MessageSquare size={16} />
                        <span>{posts.find(p => p._id === selectedPost).comments.length} comments</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="moderation-actions">
                <h3>Moderation Actions</h3>
                <div className="actions-grid">
                  <button className="action-btn success">
                    <CheckCircle size={16} />
                    <span>Approve</span>
                  </button>
                  
                  <button className="action-btn warning">
                    <Shield size={16} />
                    <span>Restrict</span>
                  </button>
                  
                  <button className="action-btn danger">
                    <XCircle size={16} />
                    <span>Remove</span>
                  </button>
                  
                  <button className="action-btn secondary">
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPosts;