import React, { useState, useEffect } from 'react';
import '../styles/admin/AdminFakeAccounts.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Eye, 
  Search, 
  Filter, 
  UserCheck,
  UserX,
  Shield,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Users,
  X
} from 'lucide-react';

const AdminFakeAccounts = () => {
  const [fakeAccounts, setFakeAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFakeAccounts();
  }, []);

  const fetchFakeAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/fake-accounts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFakeAccounts(data.data.accounts || []);
      } else {
        toast.error('Failed to load fake accounts');
      }
    } catch (error) {
      toast.error('An error occurred while loading fake accounts');
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

  const handleAccountAction = (action, accountId) => {
    setSelectedAccount(accountId);
    setShowAccountModal(true);
  };

  const filteredAccounts = fakeAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'high-risk') {
      return matchesSearch && account.riskLevel === 'high';
    }
    
    if (filter === 'medium-risk') {
      return matchesSearch && account.riskLevel === 'medium';
    }
    
    if (filter === 'banned') {
      return matchesSearch && account.status === 'banned';
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { text: 'Active', class: 'success' };
      case 'banned':
        return { text: 'Banned', class: 'danger' };
      case 'suspended':
        return { text: 'Suspended', class: 'warning' };
      default:
        return { text: 'Unknown', class: 'normal' };
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-fake-accounts">
      <div className="admin-header">
        <h1>Fake Accounts Detection</h1>
        <p>Manage potentially fake or suspicious accounts</p>
      </div>

      <div className="accounts-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All Accounts</option>
            <option value="high-risk">High Risk</option>
            <option value="medium-risk">Medium Risk</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      <div className="accounts-stats">
        <div className="stat-card">
          <Users size={20} />
          <div>
            <span className="stat-value">{fakeAccounts.length}</span>
            <span className="stat-label">Total Accounts</span>
          </div>
        </div>
        
        <div className="stat-card">
          <AlertTriangle size={20} />
          <div>
            <span className="stat-value">{fakeAccounts.filter(a => a.riskLevel === 'high').length}</span>
            <span className="stat-label">High Risk</span>
          </div>
        </div>
        
        <div className="stat-card">
          <UserX size={20} />
          <div>
            <span className="stat-value">{fakeAccounts.filter(a => a.status === 'banned').length}</span>
            <span className="stat-label">Banned</span>
          </div>
        </div>
        
        <div className="stat-card">
          <TrendingUp size={20} />
          <div>
            <span className="stat-value">{Math.round(fakeAccounts.reduce((sum, a) => sum + a.suspicionScore, 0) / fakeAccounts.length)}</span>
            <span className="stat-label">Avg. Suspicion</span>
          </div>
        </div>
      </div>

      <div className="accounts-table">
        <table>
          <thead>
            <tr>
              <th>Account</th>
              <th>Risk Level</th>
              <th>Status</th>
              <th>Suspicion Score</th>
              <th>Created</th>
              <th>Last Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => {
              const riskBadge = getRiskBadge(account.riskLevel);
              const statusBadge = getStatusBadge(account.status);
              
              return (
                <tr key={account._id}>
                  <td>
                    <div className="account-info">
                      <div className="account-avatar">
                        <img 
                          src={account.profileImage || `https://ui-avatars.com/api/?name=${account.name}&background=dc2626&color=fff`} 
                          alt={account.name} 
                        />
                      </div>
                      <div>
                        <div className="account-name">{account.name}</div>
                        <div className="account-email">{account.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className={`risk-badge ${riskBadge.class}`}>
                      {riskBadge.text}
                    </div>
                  </td>
                  
                  <td>
                    <div className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </div>
                  </td>
                  
                  <td>
                    <div className="suspicion-score">
                      {Math.round(account.suspicionScore * 100)}%
                    </div>
                  </td>
                  
                  <td>
                    <div className="account-date">{formatDate(account.createdAt)}</div>
                  </td>
                  
                  <td>
                    <div className="activity-date">{formatDate(account.lastActive)}</div>
                  </td>
                  
                  <td>
                    <div className="account-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleAccountAction('view', account._id)}
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button 
                        className="action-btn"
                        onClick={() => handleAccountAction('manage', account._id)}
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

      {filteredAccounts.length === 0 && (
        <div className="empty-state">
          <h3>No suspicious accounts found</h3>
          <p>The platform is running smoothly</p>
        </div>
      )}

      {showAccountModal && selectedAccount && (
        <div className="account-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Account Details</h2>
              <button onClick={() => setShowAccountModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="account-details">
                {fakeAccounts.find(a => a._id === selectedAccount) && (
                  <>
                    <div className="account-header">
                      <div className="account-avatar">
                        <img 
                          src={fakeAccounts.find(a => a._id === selectedAccount).profileImage || `https://ui-avatars.com/api/?name=${fakeAccounts.find(a => a._id === selectedAccount).name}&background=dc2626&color=fff`} 
                          alt={fakeAccounts.find(a => a._id === selectedAccount).name} 
                        />
                      </div>
                      <div>
                        <h3>{fakeAccounts.find(a => a._id === selectedAccount).name}</h3>
                        <p>{fakeAccounts.find(a => a._id === selectedAccount).email}</p>
                      </div>
                    </div>
                    
                    <div className="account-stats">
                      <div className="stat-item">
                        <Calendar size={16} />
                        <span>Created: {formatDate(fakeAccounts.find(a => a._id === selectedAccount).createdAt)}</span>
                      </div>
                      <div className="stat-item">
                        <Calendar size={16} />
                        <span>Last Active: {formatDate(fakeAccounts.find(a => a._id === selectedAccount).lastActive)}</span>
                      </div>
                    </div>
                    
                    <div className="risk-assessment">
                      <h4>Risk Assessment</h4>
                      <div className="risk-factors">
                        {fakeAccounts.find(a => a._id === selectedAccount).riskFactors.map((factor, index) => (
                          <div key={index} className="risk-factor">
                            <AlertTriangle size={16} />
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                      <div className="suspicion-score">
                        <h5>Suspicion Score: {Math.round(fakeAccounts.find(a => a._id === selectedAccount).suspicionScore * 100)}%</h5>
                        <div className="score-bar">
                          <div 
                            className="score-fill" 
                            style={{ width: `${fakeAccounts.find(a => a._id === selectedAccount).suspicionScore * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="account-actions">
                <h3>Actions</h3>
                <div className="actions-grid">
                  <button className="action-btn success">
                    <UserCheck size={16} />
                    <span>Approve</span>
                  </button>
                  
                  <button className="action-btn warning">
                    <Shield size={16} />
                    <span>Suspend</span>
                  </button>
                  
                  <button className="action-btn danger">
                    <UserX size={16} />
                    <span>Ban</span>
                  </button>
                  
                  <button className="action-btn secondary">
                    <Eye size={16} />
                    <span>View Activity</span>
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

export default AdminFakeAccounts;