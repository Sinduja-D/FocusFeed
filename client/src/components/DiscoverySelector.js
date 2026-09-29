import React from 'react';
import '../styles/components/DiscoverySelector.css';
import { 
  Target, 
  Filter, 
  Scale, 
  Search 
} from 'lucide-react';

const DiscoverySelector = ({ currentLevel, onLevelChange }) => {
  const levels = [
    { 
      id: 'Focus Only', 
      icon: Target, 
      label: 'Focus Only',
      description: 'Show mostly selected interest + focus mode'
    },
    { 
      id: 'Mostly My Interests', 
      icon: Filter, 
      label: 'Mostly My Interests',
      description: 'Mostly selected interests with limited exploration'
    },
    { 
      id: 'Balanced', 
      icon: Scale, 
      label: 'Balanced',
      description: 'Mix relevant and new topics'
    },
    { 
      id: 'Explore More', 
      icon: Search, 
      label: 'Explore More',
      description: 'Allow more content outside current interests'
    }
  ];

  return (
    <div className="discovery-selector">
      <h3>Discovery Level</h3>
      <p>Control how much new content you see</p>
      
      <div className="discovery-levels-grid">
        {levels.map((level) => {
          const Icon = level.icon;
          const isSelected = currentLevel === level.id;
          
          return (
            <button
              key={level.id}
              className={`discovery-level-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onLevelChange(level.id)}
            >
              <Icon size={24} />
              <div className="level-info">
                <span className="level-label">{level.label}</span>
                <span className="level-description">{level.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DiscoverySelector;