import React from 'react';
import '../styles/components/SafetyBadge.css';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle 
} from 'lucide-react';

const SafetyBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'SAFE':
        return {
          icon: CheckCircle,
          text: 'Safe',
          className: 'safe'
        };
      case 'REVIEW':
        return {
          icon: AlertTriangle,
          text: 'Under Review',
          className: 'review'
        };
      case 'RESTRICTED':
        return {
          icon: XCircle,
          text: 'Restricted',
          className: 'restricted'
        };
      default:
        return {
          icon: CheckCircle,
          text: 'Safe',
          className: 'safe'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className={`safety-badge ${config.className}`}>
      <Icon size={14} />
      <span>{config.text}</span>
    </div>
  );
};

export default SafetyBadge;