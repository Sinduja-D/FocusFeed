import React, { useState, useEffect } from 'react';
import '../styles/pages/PrivacySettingsPage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Shield, 
  Eye, 
  MessageSquare, 
  Users,
  Globe,
  Lock,
  Save,
  RefreshCw
} from 'lucide-react';

const PrivacySettingsPage = () => {
  const [settings, setSettings] = useState({
    profileVisibility: 'Public',
    messaging: 'Everyone',
    comments: 'Everyone',
    onlineStatus: true,
    contentReuse: false
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrivacySettings();
  }, []);

  const fetchPrivacySettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/privacy', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data.privacySettings);
      }
    } catch (error) {
      toast.error('Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/users/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ privacySettings: settings })
      });

      if (response.ok) {
        toast.success('Privacy settings updated successfully!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update privacy settings');
      }
    } catch (error) {
      toast.error('An error occurred while updating privacy settings');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const getVisibilityDescription = (visibility) => {
    switch (visibility) {
      case 'Public':
        return 'Anyone can see your profile and posts';
      case 'Community':
        return 'Only community members can see your profile and posts';
      case 'Private':
        return 'Only you can see your profile and posts';
      default:
        return '';
    }
  };

  const getMessagingDescription = (messaging) => {
    switch (messaging) {
      case 'Everyone':
        return 'Anyone can send you messages';
      case 'Followers':
        return 'Only your followers can send you messages';
      case 'Nobody':
        return 'No one can send you messages';
      default:
        return '';
    }
  };

  const getCommentsDescription = (comments) => {
    switch (comments) {
      case 'Everyone':
        return 'Anyone can comment on your posts';
      case 'Followers':
        return 'Only your followers can comment on your posts';
      case 'Nobody':
        return 'No one can comment on your posts';
      default:
        return '';
    }
  };

  return (
    <div className="privacy-settings-page">
      <div className="settings-header">
        <h1>Privacy Settings</h1>
        <p>Control who can see your content and interact with you</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="settings-content">
          <div className="settings-section">
            <h2>Profile Visibility</h2>
            <p className="section-description">
              {getVisibilityDescription(settings.profileVisibility)}
            </p>
            
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <Globe size={20} />
                    <span>Public</span>
                  </div>
                  <p>Anyone can see your profile and posts</p>
                </div>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="Public"
                    checked={settings.profileVisibility === 'Public'}
                    onChange={handleInputChange}
                  />
                  <span></span>
                </label>
              </div>
              
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <Users size={20} />
                    <span>Community</span>
                  </div>
                  <p>Only community members can see your profile and posts</p>
                </div>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="Community"
                    checked={settings.profileVisibility === 'Community'}
                    onChange={handleInputChange}
                  />
                  <span></span>
                </label>
              </div>
              
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <Lock size={20} />
                    <span>Private</span>
                  </div>
                  <p>Only you can see your profile and posts</p>
                </div>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="Private"
                    checked={settings.profileVisibility === 'Private'}
                    onChange={handleInputChange}
                  />
                  <span></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Messaging</h2>
            <p className="section-description">
              {getMessagingDescription(settings.messaging)}
            </p>
            
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <MessageSquare size={20} />
                    <span>Everyone</span>
                  </div>
                  <p>Anyone can send you messages</p>
                </div>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="messaging"
                    value="Everyone"
                    checked={settings.messaging === 'Everyone'}
                    onChange={handleInputChange}
                  />
                  <span></span>
                </label>
              </div>
              
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <Users size={20} />
                    <span>Followers</span>
                  </div>
                  <p>Only your followers can send you messages</p>
                </div>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="messaging"
                    value="Followers"
                    checked={settings.messaging === 'Followers'}
                    onChange={handleInputChange}
                  />
                  <span></span>
                </label>
              </div>
              
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <Lock size={20} />
                    <span>Nobody</span>
                  </div>
                  <p>No one can send you messages</p>
                </div>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="messaging"
                    value="Nobody"
                    checked={settings.messaging === 'Nobody'}
                    onChange={handleInputChange}
                  />
                  <span></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Comments</h2>
            <p className="section-description">
              {getCommentsDescription(settings.comments)}
            </p>
            
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <MessageSquare size={20} />
                    <span>Everyone</span>
                  </div>
                  <p>Anyone can comment on your posts</p>
                </div>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="comments"
                    value="Everyone"
                    checked={settings.comments === 'Everyone'}
                    onChange={handleInputChange}
                  />
                  <span></span>
                </label>
              </div>
              
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <Users size={20} />
                    <span>Followers</span>
                  </div>
                  <p>Only your followers can comment on your posts</p>
                </div>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="comments"
                    value="Followers"
                    checked={settings.comments === 'Followers'}
                    onChange={handleInputChange}
                  />
                  <span></span>
                </label>
              </div>
              
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <Lock size={20} />
                    <span>Nobody</span>
                  </div>
                  <p>No one can comment on your posts</p>
                </div>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="comments"
                    value="Nobody"
                    checked={settings.comments === 'Nobody'}
                    onChange={handleInputChange}
                  />
                  <span></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Other Settings</h2>
            
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <Eye size={20} />
                    <span>Show Online Status</span>
                  </div>
                  <p>Let others see when you're active</p>
                </div>
                <label className="switch-label">
                  <input
                    type="checkbox"
                    name="onlineStatus"
                    checked={settings.onlineStatus}
                    onChange={handleInputChange}
                  />
                  <span className="switch"></span>
                </label>
              </div>
              
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <RefreshCw size={20} />
                    <span>Allow Content Reuse</span>
                  </div>
                  <p>Allow others to reuse your content</p>
                </div>
                <label className="switch-label">
                  <input
                    type="checkbox"
                    name="contentReuse"
                    checked={settings.contentReuse}
                    onChange={handleInputChange}
                  />
                  <span className="switch"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn btn-secondary" onClick={fetchPrivacySettings}>
              Reset to Default
            </button>
            <button className="btn btn-primary" onClick={handleSaveSettings}>
              <Save size={20} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySettingsPage;