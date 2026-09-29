import React, { useState, useEffect } from 'react';
import '../styles/admin/AdminCollaborations.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Target, 
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  User,
  MessageSquare,
  Play,
  X
} from 'lucide-react';

const AdminCollaborations = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/collaborations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCollaborations(data.data.collaborations || []);
      } else {
        toast.error('Failed to load collaborations');
      }
    } catch (error) {
      toast.error('An error occurred while loading collaborations');
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

  const handleCollaborationAction = (action, collaborationId) => {
    setSelectedCollaboration(collaborationId);
    setShowCollaborationModal(true);
  };

  const filteredCollaborations = collaborations.filter(collaboration => {
    const matchesSearch = collaboration.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collaboration.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'pending') {
      return matchesSearch && collaboration.status === 'Open';
    }
    
    if (filter === 'in-progress') {
      return matchesSearch && collaboration.status === 'In Progress';
    }
    
    if (filter === 'completed') {
      return matchesSearch && collaboration.status === 'Completed';
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return { text: 'Open', class: 'success' };
      case 'In Progress':
        return { text: 'In Progress', class: 'warning' };
      case 'Completed':
        return { text: 'Completed', class: 'info' };
      case 'Cancelled':
        return { text: 'Cancelled', class: 'danger' };
      default:
        return { text: 'Unknown', class: 'normal' };
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-collaborations">
      <div className="admin-header">
        <h1>Collaborations Management</h1>
        <p>Review and manage collaborative projects</p>
      </div>

      <div className="collaborations-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search collaborations..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All Collaborations</option>
            <option value="pending">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="collaborations-stats">
        <div className="stat-card">
          <Target size={20} />
          <div>
            <span className="stat-value">{collaborations.length}</span>
            <span className="stat-label">Total Collaborations</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Clock size={20} />
          <div>
            <span className="stat-value">{collaborations.filter(c => c.status === 'Open').length}</span>
            <span className="stat-label">Open</span>
          </div>
        </div>
        
        <div className="stat-card">
          <AlertTriangle size={20} />
          <div>
            <span className="stat-value">{collaborations.filter(c => c.status === 'In Progress').length}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        
        <div className="stat-card">
          <CheckCircle size={20} />
          <div>
            <span className="stat-value">{collaborations.filter(c => c.status === 'Completed').length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <div className="collaborations-table">
        <table>
          <thead>
            <tr>
              <th>Collaboration</th>
              <th>Creator</th>
              <th>Contributors</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCollaborations.map((collaboration) => {
              const statusBadge = getStatusBadge(collaboration.status);
              
              return (
                <tr key={collaboration._id}>
                  <td>
                    <div className="collaboration-preview">
                      <div className="collaboration-content">
                        <h4>{collaboration.title}</h4>
                        <p>{collaboration.description.substring(0, 100)}...</p>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="creator-info">
                      <div className="creator-avatar">
                        <img 
                          src={collaboration.creator.profileImage || `https://ui-avatars.com/api/?name=${collaboration.creator.name}&background=2563eb&color=fff`} 
                          alt={collaboration.creator.name} 
                        />
                      </div>
                      <div>
                        <div className="creator-name">{collaboration.creator.name}</div>
                        <div className="collaboration-date">{formatDate(collaboration.createdAt)}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="contributors-count">
                      {collaboration.contributors.length} contributors
                    </div>
                  </td>
                  
                  <td>
                    <div className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </div>
                  </td>
                  
                  <td>
                    <div className="collaboration-date">{formatDate(collaboration.createdAt)}</div>
                  </td>
                  
                  <td>
                    <div className="collaboration-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleCollaborationAction('view', collaboration._id)}
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button 
                        className="action-btn"
                        onClick={() => handleCollaborationAction('moderate', collaboration._id)}
                      >
                        <CheckCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredCollaborations.length === 0 && (
        <div className="empty-state">
          <h3>No collaborations found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showCollaborationModal && selectedCollaboration && (
        <div className="collaboration-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Collaboration Details</h2>
              <button onClick={() => setShowCollaborationModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="collaboration-details">
                {collaborations.find(c => c._id === selectedCollaboration) && (
                  <>
                    <div className="collaboration-header">
                      <h3>{collaborations.find(c => c._id === selectedCollaboration).title}</h3>
                      <div className="collaboration-status">
                        {getStatusBadge(collaborations.find(c => c._id === selectedCollaboration).status).text}
                      </div>
                    </div>
                    
                    <div className="collaboration-content">
                      <h4>Description</h4>
                      <p>{collaborations.find(c => c._id === selectedCollaboration).description}</p>
                      
                      <h4>Purpose</h4>
                      <p>{collaborations.find(c => c._id === selectedCollaboration).purpose}</p>
                    </div>
                    
                    <div className="collaboration-creator">
                      <h4>Creator</h4>
                      <div className="creator-info">
                        <div className="creator-avatar">
                          <img 
                            src={collaborations.find(c => c._id === selectedCollaboration).creator.profileImage || `https://ui-avatars.com/api/?name=${collaborations.find(c => c._id === selectedCollaboration).creator.name}&background=2563eb&color=fff`} 
                            alt={collaborations.find(c => c._id === selectedCollaboration).creator.name} 
                          />
                        </div>
                        <div>
                          <div className="creator-name">{collaborations.find(c => c._id === selectedCollaboration).creator.name}</div>
                          <div className="creator-date">{formatDate(collaborations.find(c => c._id === selectedCollaboration).createdAt)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="collaboration-contributors">
                      <h4>Contributors ({collaborations.find(c => c._id === selectedCollaboration).contributors.length})</h4>
                      <div className="contributors-list">
                        {collaborations.find(c => c._id === selectedCollaboration).contributors.map((contributor, index) => (
                          <div key={index} className="contributor-item">
                            <div className="contributor-avatar">
                              <img 
                                src={contributor.user.profileImage || `https://ui-avatars.com/api/?name=${contributor.user.name}&background=2563eb&color=fff`} 
                                alt={contributor.user.name} 
                              />
                            </div>
                            <div className="contributor-info">
                              <span>{contributor.user.name}</span>
                              <span>{contributor.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="collaboration-actions">
                <h3>Actions</h3>
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
                  
                  {collaborations.find(c => c._id === selectedCollaboration)?.finalVideo && (
                    <button className="action-btn secondary">
                      <Play size={16} />
                      <span>Preview Video</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCollaborations;