import React from 'react';
import '../styles/components/FocusModeSelector.css';
import { 
  Target, 
  Zap, 
  Compass, 
  Star,
  GraduationCap,
  Film,
  Heart,
  Users
} from 'lucide-react';

const FocusModeSelector = ({ currentMode, onModeChange }) => {
  const modes = [
    { 
      id: 'Technology', 
      icon: Target, 
      label: 'Technology',
      description: 'Focus on technology content'
    },
    { 
      id: 'Science', 
      icon: Zap, 
      label: 'Science',
      description: 'Focus on science content'
    },
    { 
      id: 'Sports', 
      icon: Star, 
      label: 'Sports',
      description: 'Focus on sports content'
    },
    { 
      id: 'Art', 
      icon: Compass, 
      label: 'Art',
      description: 'Focus on art content'
    },
    { 
      id: 'Education', 
      icon: GraduationCap, 
      label: 'Education',
      description: 'Focus on education content'
    },
    { 
      id: 'Entertainment', 
      icon: Film, 
      label: 'Entertainment',
      description: 'Focus on entertainment content'
    },
    { 
      id: 'Personal Stories', 
      icon: Heart, 
      label: 'Personal Stories',
      description: 'Focus on personal stories'
    },
    { 
      id: 'Social Causes', 
      icon: Users,
      label: 'Social Causes',
      description: 'Focus on social causes'
    },
    { 
      id: 'Explore', 
      icon: Compass, 
      label: 'Explore',
      description: 'Discover new interests'
    }
  ];

  return (
    <div className="focus-mode-selector">
      <h3>Your Focus</h3>
      <p>Choose what to focus on right now</p>
      
      <div className="focus-modes-grid">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = currentMode === mode.id;
          
          return (
            <button
              key={mode.id}
              className={`focus-mode-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onModeChange(mode.id)}
            >
              <Icon size={24} />
              <div className="mode-info">
                <span className="mode-label">{mode.label}</span>
                <span className="mode-description">{mode.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FocusModeSelector;