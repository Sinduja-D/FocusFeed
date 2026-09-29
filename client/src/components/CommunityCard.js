import React from 'react';
import '../styles/components/CommunityCard.css';
import { Link } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';

const CommunityCard = ({ community }) => {
  const members = Array.isArray(community.members) ? community.members : [];
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="community-card">
      <div className="community-header">
        <div className="community-icon">
          <Users size={24} />
        </div>
        <div className="community-info">
          <Link to={`/community/${community._id}`} className="community-name">
            {community.name}
          </Link>
          <div className="community-meta">
            <span>{members.length} members</span>
            <span>•</span>
            <span>Created {formatDate(community.createdAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="community-description">
        {community.description}
      </div>
      
      <div className="community-footer">
        <div className="community-tags">
          <span className="interest-tag">{community.interest}</span>
        </div>
        
        <Link to={`/community/${community._id}`} className="join-btn">
          View Community
        </Link>
      </div>
    </div>
  );
};

export default CommunityCard;