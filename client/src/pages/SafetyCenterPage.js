import React, { useState, useEffect } from 'react';
import '../styles/pages/SafetyCenterPage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Filter,
  Eye,
  Lock,
  CheckCircle,
  XCircle,
  Settings,
  Flag,
  Ban
} from 'lucide-react';

const SafetyCenterPage = () => {
  const [safetySettings, setSafetySettings] = useState({
    contentFiltering: 'Medium',
    teenProtection: false
  });
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [blockedAccounts, setBlockedAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSafetySettings();
    fetchReports();
    fetchBlockedAccounts();
  }, []);

  const fetchSafetySettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/safety', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSafetySettings(data.data.safetySettings);
      }
    } catch (error) {
      toast.error('Failed to load safety settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.data);
      }
    } catch (error) {
      toast.error('Failed to load reports');
    }
  };

  const fetchBlockedAccounts = async () => {
    try {
      // Mock data for demo
      setBlockedAccounts([
        { id: '1', name: 'Spammer Account', reason: 'Spam', blockedAt: '2023-10-01' },
        { id: '2', name: 'Harasser Account', reason: 'Harassment', blockedAt: '2023-09-15' }
      ]);
    } catch (error) {
      toast.error('Failed to load blocked accounts');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/users/safety', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ safetySettings })
      });

      if (response.ok) {
        toast.success('Safety settings updated successfully!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update safety settings');
      }
    } catch (error) {
      toast.error('An error occurred while updating safety settings');
    }
  };

  const handleUnblockAccount = async (accountId) => {
    try {
      // Mock unblock action
      setBlockedAccounts(prev => prev.filter(acc => acc.id !== accountId));
      toast.success('Account unblocked successfully');
    } catch (error) {
      toast.error('Failed to unblock account');
    }
  };

  const getFilteringDescription = (level) => {
    switch (level) {
      case 'Low':
        return 'Show most content with minimal filtering';
      case 'Medium':
        return 'Filter out potentially sensitive content';
      case 'High':
        return 'Strict filtering for maximum safety';
      default:
        return '';
    }
  };

  const safetyFeatures = [
    {
      icon: Shield,
      title: 'Privacy Controls',
      description: 'Control who can see your content and interact with you',
      action: () => navigate('/settings/privacy')
    },
    {
      icon: Filter,
      title: 'Content Filtering',
      description: 'Filter content based on your sensitivity preferences',
      action: () => {}
    },
    {
      icon: Users,
      title: 'Blocked Accounts',
      description: 'Manage accounts you\'ve blocked',
      action: () => {}
    },
    {
      icon: Flag,
      title: 'Reporting',
      description: 'Report content that violates our guidelines',
      action: () => navigate('/reports')
    },
    {
      icon: AlertTriangle,
      title: 'Safety Alerts',
      description: 'Get notified about safety-related updates',
      action: () => {}
    },
    {
      icon: Lock,
      title: 'Teen Protection',
      description: 'Enhanced safety features for underage users',
      action: () => {}
    }
  ];

  return (
    <div className="safety-center-page">
      <div className="safety-header">
        <h1>Safety Center</h1>
        <p>Manage your privacy and safety settings</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="safety-content">
          <div className="safety-overview">
            <div className="overview-card">
              <CheckCircle className="overview-icon" size={48} />
              <h3>Your Safety Status</h3>
              <p>Your account is protected with standard safety measures</p>
            </div>
            
            <div className="overview-stats">
              <div className="stat-item">
                <Shield size={20} />
                <span>Protected</span>
              </div>
              <div className="stat-item">
                <Eye size={20} />
                <span>Private</span>
              </div>
              <div className="stat-item">
                <Users size={20} />
                <span>{blockedAccounts.length} Blocked</span>
              </div>
            </div>
          </div>

          <div className="safety-features">
            <h2>Safety Features</h2>
            <div className="features-grid">
              {safetyFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="feature-card" onClick={feature.action}>
                    <div className="feature-icon">
                      <Icon size={24} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="safety-settings">
            <h2>Safety Settings</h2>
            
            <div className="settings-section">
              <h3>Content Filtering</h3>
              <p className="section-description">
                {getFilteringDescription(safetySettings.contentFiltering)}
              </p>
              
              <div className="filtering-options">
                <div className="filter-option">
                  <input
                    type="radio"
                    id="low"
                    name="contentFiltering"
                    value="Low"
                    checked={safetySettings.contentFiltering === 'Low'}
                    onChange={(e) => setSafetySettings({...safetySettings, contentFiltering: e.target.value})}
                  />
                  <label htmlFor="low">Low</label>
                </div>
                
                <div className="filter-option">
                  <input
                    type="radio"
                    id="medium"
                    name="contentFiltering"
                    value="Medium"
                    checked={safetySettings.contentFiltering === 'Medium'}
                    onChange={(e) => setSafetySettings({...safetySettings, contentFiltering: e.target.value})}
                  />
                  <label htmlFor="medium">Medium</label>
                </div>
                
                <div className="filter-option">
                  <input
                    type="radio"
                    id="high"
                    name="contentFiltering"
                    value="High"
                    checked={safetySettings.contentFiltering === 'High'}
                    onChange={(e) => setSafetySettings({...safetySettings, contentFiltering: e.target.value})}
                  />
                  <label htmlFor="high">High</label>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Teen Protection</h3>
              <p>Enable enhanced safety features for underage users</p>
              
              <div className="switch-container">
                <label className="switch-label">
                  <input
                    type="checkbox"
                    name="teenProtection"
                    checked={safetySettings.teenProtection}
                    onChange={(e) => setSafetySettings({...safetySettings, teenProtection: e.target.checked})}
                  />
                  <span className="switch"></span>
                  <span className="switch-text">Enable Teen Protection</span>
                </label>
              </div>
            </div>
          </div>

          <div className="blocked-accounts">
            <h2>Blocked Accounts</h2>
            <p>Accounts you\'ve blocked from interacting with you</p>
            
            {blockedAccounts.length > 0 ? (
              <div className="blocked-list">
                {blockedAccounts.map((account) => (
                  <div key={account.id} className="blocked-item">
                    <div className="blocked-info">
                      <div className="blocked-avatar">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${account.name}&background=dc2626&color=fff`} 
                          alt={account.name} 
                        />
                      </div>
                      <div className="blocked-details">
                        <h4>{account.name}</h4>
                        <p>Blocked for: {account.reason}</p>
                        <p>Blocked on: {new Date(account.blockedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button 
                      className="btn btn-secondary unblock-btn"
                      onClick={() => handleUnblockAccount(account.id)}
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No blocked accounts</h3>
                <p>You haven't blocked any accounts yet</p>
              </div>
            )}
          </div>

          <div className="recent-activity">
            <h2>Recent Safety Activity</h2>
            
            {reports.length > 0 ? (
              <div className="activity-list">
                {reports.slice(0, 5).map((report) => (
                  <div key={report._id} className="activity-item">
                    <div className="activity-icon">
                      <Flag size={20} />
                    </div>
                    <div className="activity-details">
                      <h4>Reported: {report.post.title || 'Post'}</h4>
                      <p>Reason: {report.reason}</p>
                      <p>Reported on: {new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No recent activity</h3>
                <p>You haven't reported any content recently</p>
              </div>
            )}
          </div>

          <div className="safety-actions">
            <button className="btn btn-primary" onClick={handleSaveSettings}>
              <Settings size={20} />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyCenterPage;