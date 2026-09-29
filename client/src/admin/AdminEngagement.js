import React, { useState, useEffect } from 'react';
import '../styles/admin/AdminEngagement.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Eye,
  BarChart3,
  Users,
  MessageSquare,
  Share2,
  AlertTriangle,
  Calendar,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';

const AdminEngagement = () => {
  const [engagementData, setEngagementData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEngagementData();
  }, []);

  const fetchEngagementData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/engagement', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEngagementData(data.data.engagementData || []);
      } else {
        toast.error('Failed to load engagement data');
      }
    } catch (error) {
      toast.error('An error occurred while loading engagement data');
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

  const filteredData = engagementData.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unusual') {
      return matchesSearch && item.isUnusual;
    }
    
    if (filter === 'high-engagement') {
      return matchesSearch && item.engagementScore > 80;
    }
    
    if (filter === 'recent') {
      return matchesSearch && new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getEngagementBadge = (score) => {
    if (score > 80) return { text: 'Very High', class: 'danger' };
    if (score > 60) return { text: 'High', class: 'warning' };
    if (score > 40) return { text: 'Medium', class: 'info' };
    return { text: 'Low', class: 'success' };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-engagement">
      <div className="admin-header">
        <h1>Engagement Analysis</h1>
        <p>Monitor and analyze user engagement patterns</p>
      </div>

      <div className="engagement-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search engagement data..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All Items</option>
            <option value="unusual">Unusual Engagement</option>
            <option value="high-engagement">High Engagement</option>
            <option value="recent">Recent (7 days)</option>
          </select>
        </div>
      </div>

      <div className="engagement-stats">
        <div className="stat-card">
          <TrendingUp size={20} />
          <div>
            <span className="stat-value">{engagementData.length}</span>
            <span className="stat-label">Total Items</span>
          </div>
        </div>
        
        <div className="stat-card">
          <AlertTriangle size={20} />
          <div>
            <span className="stat-value">{engagementData.filter(i => i.isUnusual).length}</span>
            <span className="stat-label">Unusual</span>
          </div>
        </div>
        
        <div className="stat-card">
          <BarChart3 size={20} />
          <div>
            <span className="stat-value">{Math.round(engagementData.reduce((sum, i) => sum + i.engagementScore, 0) / engagementData.length)}</span>
            <span className="stat-label">Avg. Score</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Calendar size={20} />
          <div>
            <span className="stat-value">{engagementData.filter(i => new Date(i.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</span>
            <span className="stat-label">This Week</span>
          </div>
        </div>
      </div>

      <div className="engagement-table">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Author</th>
              <th>Engagement Score</th>
              <th>Unusual</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => {
              const engagementBadge = getEngagementBadge(item.engagementScore);
              
              return (
                <tr key={item._id}>
                  <td>
                    <div className="item-preview">
                      <div className="item-content">
                        <h4>{item.title}</h4>
                        <p>{item.content.substring(0, 100)}...</p>
                      </div>
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
                    <div className={`engagement-badge ${engagementBadge.class}`}>
                      {engagementBadge.text} ({Math.round(item.engagementScore)})
                    </div>
                  </td>
                  
                  <td>
                    {item.isUnusual ? (
                      <div className="unusual-badge">
                        <AlertTriangle size={16} />
                        <span>Yes</span>
                      </div>
                    ) : (
                      <div className="normal-badge">
                        <CheckCircle size={16} />
                        <span>No</span>
                      </div>
                    )}
                  </td>
                  
                  <td>
                    <div className="item-date">{formatDate(item.createdAt)}</div>
                  </td>
                  
                  <td>
                    <div className="item-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleItemAction('view', item._id)}
                      >
                        <Eye size={16} />
                      </button>
                      
                      {item.isUnusual && (
                        <button 
                          className="action-btn"
                          onClick={() => handleItemAction('investigate', item._id)}
                        >
                          <AlertTriangle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="empty-state">
          <h3>No engagement data found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showItemModal && selectedItem && (
        <div className="item-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Engagement Details</h2>
              <button onClick={() => setShowItemModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="engagement-details">
                {engagementData.find(i => i._id === selectedItem) && (
                  <>
                    <div className="item-header">
                      <h3>{engagementData.find(i => i._id === selectedItem).title}</h3>
                      <div className="engagement-score">
                        Score: {Math.round(engagementData.find(i => i._id === selectedItem).engagementScore)}
                      </div>
                    </div>
                    
                    <div className="item-content">
                      <h4>Content</h4>
                      <p>{engagementData.find(i => i._id === selectedItem).content}</p>
                    </div>
                    
                    <div className="engagement-metrics">
                      <h4>Engagement Metrics</h4>
                      <div className="metrics-grid">
                        <div className="metric-item">
                          <Users size={16} />
                          <span>Likes: {engagementData.find(i => i._id === selectedItem).likes}</span>
                        </div>
                        <div className="metric-item">
                          <MessageSquare size={16} />
                          <span>Comments: {engagementData.find(i => i._id === selectedItem).comments}</span>
                        </div>
                        <div className="metric-item">
                          <Share2 size={16} />
                          <span>Shares: {engagementData.find(i => i._id === selectedItem).shares}</span>
                        </div>
                        <div className="metric-item">
                          <Eye size={16} />
                          <span>Views: {engagementData.find(i => i._id === selectedItem).views}</span>
                        </div>
                      </div>
                    </div>
                    
                    {engagementData.find(i => i._id === selectedItem).isUnusual && (
                      <div className="unusual-analysis">
                        <h4>Unusual Engagement Analysis</h4>
                        <p>{engagementData.find(i => i._id === selectedItem).analysis}</p>
                        <div className="risk-score">
                          Risk Score: {Math.round(engagementData.find(i => i._id === selectedItem).riskScore)}%
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="engagement-actions">
                <h3>Actions</h3>
                <div className="actions-grid">
                  <button className="action-btn success">
                    <CheckCircle size={16} />
                    <span>Mark as Normal</span>
                  </button>
                  
                  <button className="action-btn warning">
                    <AlertTriangle size={16} />
                    <span>Escalate for Review</span>
                  </button>
                  
                  <button className="action-btn danger">
                    <XCircle size={16} />
                    <span>Flag as Suspicious</span>
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

export default AdminEngagement;