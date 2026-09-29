import React from 'react';
import '../styles/components/CollaborationCard.css';
import { Link } from 'react-router-dom';
import { Users, Calendar, Target, CheckCircle, Clock, XCircle } from 'lucide-react';

const CollaborationCard = ({ collaboration }) => {
  const contributors = Array.isArray(collaboration.contributors) ? collaboration.contributors : [];
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = () => {
    switch (collaboration.status) {
      case 'Open':
        return <Target size={20} />;
      case 'In Progress':
        return <Clock size={20} />;
      case 'Completed':
        return <CheckCircle size={20} />;
      case 'Cancelled':
        return <XCircle size={20} />;
      default:
        return <Target size={20} />;
    }
  };

  const getStatusColor = () => {
    switch (collaboration.status) {
      case 'Open':
        return 'open';
      case 'In Progress':
        return 'progress';
      case 'Completed':
        return 'completed';
      case 'Cancelled':
        return 'cancelled';
      default:
        return 'open';
    }
  };

  return (
    <div className="collaboration-card">
      <div className="collaboration-header">
        <div className={`status-badge ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{collaboration.status}</span>
        </div>
        <Link to={`/collaborations/${collaboration._id}`} className="collaboration-title">
          {collaboration.title}
        </Link>
      </div>
      
      <div className="collaboration-description">
        {collaboration.description}
      </div>
      
      <div className="collaboration-purpose">
        <h4>Purpose:</h4>
        <p>{collaboration.purpose}</p>
      </div>
      
      <div className="collaboration-meta">
        <div className="meta-item">
          <Users size={16} />
          <span>{contributors.length} contributors</span>
        </div>
        <div className="meta-item">
          <Calendar size={16} />
          <span>Created {formatDate(collaboration.createdAt)}</span>
        </div>
      </div>
      
      <div className="collaboration-footer">
        <Link to={`/collaborations/${collaboration._id}`} className="view-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CollaborationCard;