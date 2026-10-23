import React from 'react';
import '../styles/components/NotificationItem.css';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell, 
  MessageSquare, 
  Users, 
  FileVideo, 
  CheckCircle, 
  XCircle,
  Info
} from 'lucide-react';

const NotificationItem = ({ notification }) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'Report Decision':
        return <CheckCircle size={20} />;
      case 'Appeal Decision':
        return <Info size={20} />;
      case 'Collaboration Invitation':
        return <Users size={20} />;
      case 'Contribution Approved':
        return <CheckCircle size={20} />;
      case 'Contribution Rejected':
        return <XCircle size={20} />;
      case 'Collaboration Published':
        return <FileVideo size={20} />;
      case 'Community Activity':
        return <MessageSquare size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case 'Report Decision':
        return 'blue';
      case 'Appeal Decision':
        return 'yellow';
      case 'Collaboration Invitation':
        return 'green';
      case 'Contribution Approved':
        return 'green';
      case 'Contribution Rejected':
        return 'red';
      case 'Collaboration Published':
        return 'purple';
      case 'Community Activity':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <div className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
      <div className={`notification-icon ${getNotificationColor()}`}>
        {getNotificationIcon()}
      </div>
      
      <div className="notification-content">
        <p className="notification-message">
          {notification.message}
        </p>
        
        <div className="notification-meta">
          <span className="notification-time">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
          
          {notification.relatedPost && (
            <Link to="/home" className="notification-link">
              View Feed
            </Link>
          )}
          
          {notification.relatedCollaboration && (
            <Link to={`/collaborations/${notification.relatedCollaboration}`} className="notification-link">
              View Collaboration
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;