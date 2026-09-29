import React, { useState, useEffect } from 'react';
import '../styles/admin/AdminModeration.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Shield, 
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  User,
  X
} from 'lucide-react';

const AdminModeration = () => {
  const [moderationQueue, setModerationQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModerationQueue();
  }, []);

  const fetchModerationQueue = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/moderation', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setModerationQueue(data.data.items || []);
      } else {
        toast.error('Failed to load moderation queue');
      }
    } catch (error) {
      toast.error('An error occurred while loading moderation queue');
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

  const handleItemAction = (action, itemId) => {
    setSelectedItem(itemId);
    setShowItemModal(true);
  };

  const filteredItems = moderationQueue.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'posts') {
      return matchesSearch && item.type === 'post';
    }
    
    if (filter === 'communities') {
      return matchesSearch && item.type === 'community';
    }
    
    if (filter === 'users') {
      return matchesSearch && item.type === 'user';
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'post':
        return FileText;
      case 'community':
        return User;
      case 'user':
        return User;
      default:
        return FileText;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'post':
        return { text: 'Post', class: 'blue' };
      case 'community':
        return { text: 'Community', class: 'purple' };
      case 'user':
        return { text: 'User', class: 'green' };
      default:
        return { text: 'Unknown', class: 'gray' };
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const selectedModerationItem = moderationQueue.find(i => i._id === selectedItem);
  const SelectedTypeIcon = selectedModerationItem ? getTypeIcon(selectedModerationItem.type) : null;

  return (
    <div className="admin-moderation">
      <div className="admin-header">
        <h1>Moderation Queue</h1>
        <p>Review and moderate flagged content</p>
      </div>

      <div className="moderation-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search moderation queue..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All Items</option>
            <option value="posts">Posts</option>
            <option value="communities">Communities</option>
            <option value="users">Users</option>
          </select>
        </div>
      </div>

      <div className="moderation-stats">
        <div className="stat-card">
          <Shield size={20} />
          <div>
            <span className="stat-value">{moderationQueue.length}</span>
            <span className="stat-label">Total Items</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Clock size={20} />
          <div>
            <span className="stat-value">{moderationQueue.filter(i => i.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        
        <div className="stat-card">
          <CheckCircle size={20} />
          <div>
            <span className="stat-value">{moderationQueue.filter(i => i.status === 'approved').length}</span>
            <span className="stat-label">Approved</span>
          </div>
        </div>
        
        <div className="stat-card">
          <XCircle size={20} />
          <div>
            <span className="stat-value">{moderationQueue.filter(i => i.status === 'rejected').length}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>
      </div>

      <div className="moderation-table">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              const typeBadge = getTypeBadge(item.type);
              
              return (
                <tr key={item._id}>
                  <td>
                    <div className="item-preview">
                      <div className="item-content">
                        <p>{item.content.substring(0, 100)}...</p>
                      </div>
                      {item.image && (
                        <div className="item-image">
                          <img src={item.image} alt="Item preview" />
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    <div className={`type-badge ${typeBadge.class}`}>
                      <TypeIcon size={16} />
                      <span>{typeBadge.text}</span>
                    </div>
                  </td>
                  
                  <td>
                    <div className="author-info">
                      <div className="author-avatar">
                        <img 
                          src={item.author.profileImage || `https://ui-avatars.com/api/?name=${item.author.name}&background=2563eb&color=fff`} 
                          alt={item.author.name} 
                        />
                      </div>
                      <div>
                        <div className="author-name">{item.author.name}</div>
                        <div className="item-date">{formatDate(item.createdAt)}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="item-date">{formatDate(item.createdAt)}</div>
                  </td>
                  
                  <td>
                    <div className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </div>
                  </td>
                  
                  <td>
                    <div className="item-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleItemAction('view', item._id)}
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button 
                        className="action-btn"
                        onClick={() => handleItemAction('moderate', item._id)}
                      >
                        <Shield size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <h3>No items in moderation queue</h3>
          <p>The platform is running smoothly</p>
        </div>
      )}

      {showItemModal && selectedItem && (
        <div className="item-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Moderation Details</h2>
              <button onClick={() => setShowItemModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="item-details">
                {moderationQueue.find(i => i._id === selectedItem) && (
                  <>
                    <div className="item-header">
                      <div className="item-type">
                        {SelectedTypeIcon && (
                          <SelectedTypeIcon size={24} />
                        )}
                        <span>{getTypeBadge(moderationQueue.find(i => i._id === selectedItem).type).text}</span>
                      </div>
                      <div className="item-status">
                        {moderationQueue.find(i => i._id === selectedItem).status}
                      </div>
                    </div>
                    
                    <div className="item-content">
                      <h4>Content</h4>
                      <p>{moderationQueue.find(i => i._id === selectedItem).content}</p>
                      
                      {moderationQueue.find(i => i._id === selectedItem).image && (
                        <div className="item-image">
                          <img src={moderationQueue.find(i => i._id === selectedItem).image} alt="Item" />
                        </div>
                      )}
                    </div>
                    
                    <div className="item-author">
                      <h4>Author</h4>
                      <div className="author-info">
                        <div className="author-avatar">
                          <img 
                            src={moderationQueue.find(i => i._id === selectedItem).author.profileImage || `https://ui-avatars.com/api/?name=${moderationQueue.find(i => i._id === selectedItem).author.name}&background=2563eb&color=fff`} 
                            alt={moderationQueue.find(i => i._id === selectedItem).author.name} 
                          />
                        </div>
                        <div>
                          <div className="author-name">{moderationQueue.find(i => i._id === selectedItem).author.name}</div>
                          <div className="author-date">{formatDate(moderationQueue.find(i => i._id === selectedItem).createdAt)}</div>
                        </div>
                      </div>
                    </div>
                    
                    {moderationQueue.find(i => i._id === selectedItem).flags && (
                      <div className="item-flags">
                        <h4>Flags</h4>
                        <ul>
                          {moderationQueue.find(i => i._id === selectedItem).flags.map((flag, index) => (
                            <li key={index}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                    <Clock size={16} />
                    <span>Mark as Under Review</span>
                  </button>
                  
                  <button className="action-btn danger">
                    <XCircle size={16} />
                    <span>Reject</span>
                  </button>
                  
                  <button className="action-btn secondary">
                    <AlertTriangle size={16} />
                    <span>Escalate</span>
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

export default AdminModeration;