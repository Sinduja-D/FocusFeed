import React, { useState, useEffect } from 'react';
import '../styles/admin/AdminAppeals.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Gavel, 
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
  X
} from 'lucide-react';

const AdminAppeals = () => {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppeals();
  }, []);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/appeals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppeals(data.data.appeals || []);
      } else {
        toast.error('Failed to load appeals');
      }
    } catch (error) {
      toast.error('An error occurred while loading appeals');
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

  const handleAppealAction = (action, appealId) => {
    setSelectedAppeal(appealId);
    setShowAppealModal(true);
  };

  const filteredAppeals = appeals.filter(appeal => {
    const matchesSearch = appeal.post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appeal.post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appeal.appealedBy.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'pending') {
      return matchesSearch && appeal.status === 'pending';
    }
    
    if (filter === 'resolved') {
      return matchesSearch && appeal.status === 'resolved';
    }
    
    if (filter === 'rejected') {
      return matchesSearch && appeal.status === 'rejected';
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getAppealBadge = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending', class: 'warning' };
      case 'resolved':
        return { text: 'Resolved', class: 'success' };
      case 'rejected':
        return { text: 'Rejected', class: 'danger' };
      default:
        return { text: 'Unknown', class: 'normal' };
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-appeals">
      <div className="admin-header">
        <h1>Appeals Management</h1>
        <p>Review and resolve user appeals</p>
      </div>

      <div className="appeals-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search appeals..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All Appeals</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="appeals-stats">
        <div className="stat-card">
          <Gavel size={20} />
          <div>
            <span className="stat-value">{appeals.length}</span>
            <span className="stat-label">Total Appeals</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Clock size={20} />
          <div>
            <span className="stat-value">{appeals.filter(a => a.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        
        <div className="stat-card">
          <CheckCircle size={20} />
          <div>
            <span className="stat-value">{appeals.filter(a => a.status === 'resolved').length}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
        
        <div className="stat-card">
          <XCircle size={20} />
          <div>
            <span className="stat-value">{appeals.filter(a => a.status === 'rejected').length}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>
      </div>

      <div className="appeals-table">
        <table>
          <thead>
            <tr>
              <th>Appeal</th>
              <th>Appealer</th>
              <th>Reported Post</th>
              <th>Decision</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppeals.map((appeal) => {
              const appealBadge = getAppealBadge(appeal.status);
              
              return (
                <tr key={appeal._id}>
                  <td>
                    <div className="appeal-preview">
                      <div className="appeal-content">
                        <p>{appeal.post.content.substring(0, 100)}...</p>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="appealer-info">
                      <div className="appealer-avatar">
                        <img 
                          src={appeal.user.profileImage || `https://ui-avatars.com/api/?name=${appeal.user.name}&background=2563eb&color=fff`} 
                          alt={appeal.user.name} 
                        />
                      </div>
                      <div>
                        <div className="appealer-name">{appeal.user.name}</div>
                        <div className="appeal-date">{formatDate(appeal.createdAt)}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="post-info">
                      <div className="post-author">{appeal.post.author.name}</div>
                      <div className="post-date">{formatDate(appeal.post.createdAt)}</div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="appeal-decision">{appeal.decision}</div>
                  </td>
                  
                  <td>
                    <div className="appeal-date">{formatDate(appeal.createdAt)}</div>
                  </td>
                  
                  <td>
                    <div className={`status-badge ${appealBadge.class}`}>
                      {appealBadge.text}
                    </div>
                  </td>
                  
                  <td>
                    <div className="appeal-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleAppealAction('view', appeal._id)}
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button 
                        className="action-btn"
                        onClick={() => handleAppealAction('resolve', appeal._id)}
                      >
                        <CheckCircle size={16} />
                      </button>
                      
                      <button 
                        className="action-btn"
                        onClick={() => handleAppealAction('reject', appeal._id)}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAppeals.length === 0 && (
        <div className="empty-state">
          <h3>No appeals found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showAppealModal && selectedAppeal && (
        <div className="appeal-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Appeal Details</h2>
              <button onClick={() => setShowAppealModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="appeal-details">
                {appeals.find(a => a._id === selectedAppeal) && (
                  <>
                    <div className="appeal-header">
                      <div className="appealer-info">
                        <div className="appealer-avatar">
                          <img 
                            src={appeals.find(a => a._id === selectedAppeal).appealedBy.profileImage || `https://ui-avatars.com/api/?name=${appeals.find(a => a._id === selectedAppeal).appealedBy.name}&background=087f75&color=fff`}
                            alt={appeals.find(a => a._id === selectedAppeal).appealedBy.name}
                          />
                        </div>
                        <div>
                          <h3>{appeals.find(a => a._id === selectedAppeal).appealedBy.name}</h3>
                          <p>{formatDate(appeals.find(a => a._id === selectedAppeal).createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="post-preview">
                      <h4>Reported Post</h4>
                      <p>{appeals.find(a => a._id === selectedAppeal).post.content}</p>
                      <div className="post-author">
                        <img 
                          src={appeals.find(a => a._id === selectedAppeal).post.author.profileImage || `https://ui-avatars.com/api/?name=${appeals.find(a => a._id === selectedAppeal).post.author.name}&background=2563eb&color=fff`} 
                          alt={appeals.find(a => a._id === selectedAppeal).post.author.name} 
                        />
                        <span>{appeals.find(a => a._id === selectedAppeal).post.author.name}</span>
                      </div>
                    </div>
                    
                    <div className="appeal-reason">
                      <h4>Appeal Reason</h4>
                      <p>{appeals.find(a => a._id === selectedAppeal).reason}</p>
                      {appeals.find(a => a._id === selectedAppeal).description && (
                        <p>{appeals.find(a => a._id === selectedAppeal).description}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div className="appeal-actions">
                <h3>Actions</h3>
                <div className="actions-grid">
                  <button className="action-btn success">
                    <CheckCircle size={16} />
                    <span>Resolve</span>
                  </button>
                  
                  <button className="action-btn danger">
                    <XCircle size={16} />
                    <span>Reject</span>
                  </button>
                  
                  <button className="action-btn warning">
                    <Clock size={16} />
                    <span>Mark as Under Review</span>
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

export default AdminAppeals;