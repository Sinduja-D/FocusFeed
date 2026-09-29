import React from 'react';
import '../styles/components/AIContentBadge.css';
import { 
  Sparkles, 
  Bot, 
  User,
  AlertCircle
} from 'lucide-react';

const AIContentBadge = ({ type }) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'AI Generated':
        return {
          icon: Bot,
          text: 'AI Generated',
          className: 'ai-generated'
        };
      case 'AI Assisted':
        return {
          icon: Sparkles,
          text: 'AI Assisted',
          className: 'ai-assisted'
        };
      case 'AI Origin Uncertain':
        return {
          icon: AlertCircle,
          text: 'AI Origin Uncertain',
          className: 'ai-uncertain'
        };
      default:
        return {
          icon: User,
          text: 'Human Created',
          className: 'human-created'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className={`ai-content-badge ${config.className}`}>
      <Icon size={14} />
      <span>{config.text}</span>
    </div>
  );
};

export default AIContentBadge;