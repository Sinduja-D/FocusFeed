import React from 'react';
import '../styles/components/ContributionCard.css';
import { User, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const ContributionCard = ({ contribution }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = () => {
    switch (contribution.status) {
      case 'Pending':
        return <Clock size={20} />;
      case 'Approved':
        return <CheckCircle size={20} />;
      case 'Rejected':
        return <XCircle size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const getStatusColor = () => {
    switch (contribution.status) {
      case 'Pending':
        return 'pending';
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  return (
    <div className="contribution-card">
      <div className="contribution-header">
        <div className={`status-badge ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{contribution.status}</span>
        </div>
        <div className="contributor-info">
          <User size={20} />
          <span>{contribution.contributor.name}</span>
        </div>
      </div>
      
      <div className="contribution-content">
        <p>{contribution.content}</p>
        
        {contribution.media && (
          <div className="contribution-media">
            <img src={contribution.media} alt="Contribution" />
          </div>
        )}
      </div>
      
      <div className="contribution-meta">
        <div className="meta-item">
          <Calendar size={16} />
          <span>Submitted {formatDate(contribution.createdAt)}</span>
        </div>
      </div>
      
      {contribution.moderatorComment && (
        <div className="moderator-feedback">
          <h4>Moderator Feedback:</h4>
          <p>{contribution.moderatorComment}</p>
        </div>
      )}
      
      {contribution.consent && (
        <div className="consent-info">
          <CheckCircle size={16} className="consent-icon" />
          <span>Consent given for contribution</span>
        </div>
      )}
    </div>
  );
};

export default ContributionCard;