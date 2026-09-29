import React, { useState, useEffect } from 'react';
import '../styles/admin/AdminSafety.css';
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
  AlertTriangle,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  X
} from 'lucide-react';

const AdminSafety = () => {
  const [safetyData, setSafetyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSafetyData();
  }, []);

  const fetchSafetyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/safety', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSafetyData(data.data.safetyData || []);
      } else {
        toast.error('Failed to load safety data');
      }
    } catch (error) {
      toast.error('An error occurred while loading safety data');
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

  const filteredData = safetyData.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'high-risk') {
      return matchesSearch && item.riskLevel === 'high';
    }
    
    if (filter === 'moderated') {
      return matchesSearch && item.moderationStatus !== 'SAFE';
    }
    
    if (filter === 'ai-content') {
      return matchesSearch && item.aiLabel !== 'Human Created';
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return { text: 'High Risk', class: 'danger' };
      case 'medium':
        return { text: 'Medium Risk', class: 'warning' };
      case 'low':
        return { text: 'Low Risk', class: 'success' };
      default:
        return { text: 'Normal', class: 'normal' };
    }
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-safety">
      <div className="admin-header">
        <h1>Safety Center</h1>
        <p>Monitor and manage platform safety</p>
      </div>

      <div className="safety-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search safety data..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All Items</option>
            <option value="high-risk">High Risk</option>
            <option value="moderated">Moderated</option>
            <option value="ai-content">AI Content</option>
          </select>
        </div>
      </div>

      <div className="safety-stats">
        <div className="stat-card">
          <Shield size={20} />
          <div>
            <span className="stat-value">{safetyData.length}</span>
            <span className="stat-label">Total Items</span>
          </div>
        </div>
        
        <div className="stat-card">
          <AlertTriangle size={20} />
          <div>
            <span className="stat-value">{safetyData.filter(i => i.riskLevel === 'high').length}</span>
            <span className="stat-label">High Risk</span>
          </div>
        </div>
        
        <div className="stat-card">
          <FileText size={20} />
          <div>
            <span className="stat-value">{safetyData.filter(i => i.moderationStatus !== 'SAFE').length}</span>
            <span className="stat-label">Moderated</span>
          </div>
        </div>
        
        <div className="stat-card">
          <TrendingUp size={20} />
          <div>
            <span className="stat-value">{safetyData.filter(i => i.aiLabel !== 'Human Created').length}</span>
            <span className="stat-label">AI Content</span>
          </div>
        </div>
      </div>

      <div className="safety-table">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Author</th>
              <th>Risk Level</th>
              <th>Moderation</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => {
              const riskBadge = getRiskBadge(item.riskLevel);
              const moderationBadge = getModerationBadge(item.moderationStatus);
              
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
                    <div className={`risk-badge ${riskBadge.class}`}>
                      {riskBadge.text}
                    </div>
                  </td>
                  
                  <td>
                    <div className={`moderation-badge ${moderationBadge.class}`}>
                      {moderationBadge.text}
                    </div>
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

      {filteredData.length === 0 && (
        <div className="empty-state">
          <h3>No safety data found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showItemModal && selectedItem && (
        <div className="item-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Safety Details</h2>
              <button onClick={() => setShowItemModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="safety-details">
                {safetyData.find(i => i._id === selectedItem) && (
                  <>
                    <div className="item-header">
                      <h3>{safetyData.find(i => i._id === selectedItem).title}</h3>
                      <div className="risk-level">
                        Risk: {getRiskBadge(safetyData.find(i => i._id === selectedItem).riskLevel).text}
                      </div>
                    </div>
                    
                    <div className="item-content">
                      <h4>Content</h4>
                      <p>{safetyData.find(i => i._id === selectedItem).content}</p>
                    </div>
                    
                    <div className="sessment">
                      <h4>Safety Assessment</h4>
                      <div className="assessment-grid">
                        <div className="assessment-item">
                          <AlertTriangle size={16} />
                          <span>Risk Score: {Math.round(safetyData.find(i => i._id === selectedItem).riskScore)}%</span>
                        </div>
                        <div className="assessment-item">
                          <Shield size={16} />
                          <span>Moderation: {getModerationBadge(safetyData.find(i => i._id === selectedItem).moderationStatus).text}</span>
                        </div>
                        <div className="assessment-item">
                          <Calendar size={16} />
                          <span>Checked: {formatDate(safetyData.find(i => i._id === selectedItem).lastChecked)}</span>
                        </div>
                        <div className="assessment-item">
                          <TrendingUp size={16} />
                          <span>AI Label: {safetyData.find(i => i._id === selectedItem).aiLabel}</span>
                        </div>
                      </div>
                    </div>
                    
                    {safetyData.find(i => i._id === selectedItem).safetyFlags && (
                      <div className="safety-flags">
                        <h4>Safety Flags</h4>
                        <ul>
                          {safetyData.find(i => i._id === selectedItem).safetyFlags.map((flag, index) => (
                            <li key={index}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="safety-actions">
                <h3>Actions</h3>
                <div className="actions-grid">
                  <button className="action-btn success">
                    <CheckCircle size={16} />
                    <span>Mark as Safe</span>
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
                    <Eye size={16} />
                    <span>View History</span>
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

export default AdminSafety;