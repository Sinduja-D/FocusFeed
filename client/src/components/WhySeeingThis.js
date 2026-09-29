import React from 'react';
import '../styles/components/WhySeeingThis.css';
import { 
  Eye, 
  Target, 
  Users, 
  Calendar,
  X
} from 'lucide-react';

const WhySeeingThis = ({ post, onClose }) => {
  const reasons = [
    { icon: Target, text: `Matches your ${post.interest} interest` },
    { icon: Users, text: 'From a community you follow' },
    { icon: Calendar, text: 'Fresh content' }
  ];

  return (
    <div className="why-seeing-this-modal">
      <div className="modal-header">
        <h2>Why you're seeing this</h2>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      
      <div className="modal-content">
        <p className="explanation">
          Your feed is controlled by your preferences. This post appears based on:
        </p>
        
        <div className="reasons-list">
          {reasons.map((reason, index) => (
            <div key={index} className="reason-item">
              <reason.icon size={20} />
              <span>{reason.text}</span>
            </div>
          ))}
        </div>
        
        <div className="feedback">
          <p>Not seeing what you want?</p>
          <button className="btn btn-primary">Update Preferences</button>
        </div>
      </div>
    </div>
  );
};

export default WhySeeingThis;