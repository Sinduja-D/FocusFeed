import React, { useState, useEffect } from 'react';
import '../styles/pages/NotificationsPage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import NotificationItem from '../components/NotificationItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Bell, 
  CheckCircle, 
  Settings,
  Filter,
  Trash2,
  RefreshCw
} from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data);
        
        // Count unread notifications
        const unread = data.data.filter(n => !n.read).length;
        setUnreadCount(unread);
      } else {
        toast.error('Failed to load notifications');
      }
    } catch (error) {
      toast.error('An error occurred while loading notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n._id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        if (!notifications.find(n => n._id === notificationId)?.read) {
          setUnreadCount(prev => prev - 1);
        }
        toast.success('Notification deleted');
      }
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return !notification.read;
    }
    if (filter === 'read') {
      return notification.read;
    }
    return true;
  });

  const notificationTypes = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'reports', label: 'Reports' },
    { value: 'appeals', label: 'Appeals' },
    { value: 'collaborations', label: 'Collaborations' }
  ];

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-content">
          <h1>Notifications</h1>
          <p>Stay updated with your activity</p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={markAllAsRead}>
            <CheckCircle size={20} />
            <span>Mark All Read</span>
          </button>
          
          <button className="btn btn-outline" onClick={fetchNotifications}>
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="notifications-stats">
        <div className="stat-card">
          <Bell size={20} />
          <div>
            <span className="stat-value">{notifications.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Bell size={20} />
          <div>
            <span className="stat-value unread">{unreadCount}</span>
            <span className="stat-label">Unread</span>
          </div>
        </div>
      </div>

      <div className="notifications-controls">
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {notificationTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="notifications-list">
        {loading ? (
          <LoadingSpinner />
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div key={notification._id} className="notification-wrapper">
              <NotificationItem notification={notification} />
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    className="action-btn"
                    onClick={() => markAsRead(notification._id)}
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
                <button 
                  className="action-btn delete"
                  onClick={() => deleteNotification(notification._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;