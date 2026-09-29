import React from 'react';
import '../styles/components/InterestSelector.css';
import { 
  Computer, 
  FlaskConical, 
  GraduationCap, 
  Trophy, 
  Palette, 
  Film, 
  Heart, 
  Users
} from 'lucide-react';

const InterestSelector = ({ selectedInterests, onInterestsChange }) => {
  const interests = [
    { id: 'Technology', icon: Computer, label: 'Technology' },
    { id: 'Science', icon: FlaskConical, label: 'Science' },
    { id: 'Education', icon: GraduationCap, label: 'Education' },
    { id: 'Sports', icon: Trophy, label: 'Sports' },
    { id: 'Art', icon: Palette, label: 'Art' },
    { id: 'Entertainment', icon: Film, label: 'Entertainment' },
    { id: 'Personal Stories', icon: Heart, label: 'Personal Stories' },
    { id: 'Social Causes', icon: Users, label: 'Social Causes' }
  ];

  const toggleInterest = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      onInterestsChange(selectedInterests.filter(id => id !== interestId));
    } else {
      onInterestsChange([...selectedInterests, interestId]);
    }
  };

  return (
    <div className="interest-selector">
      <h3>Select Your Interests</h3>
      <p>Choose topics you're interested in to personalize your feed</p>
      
      <div className="interests-grid">
        {interests.map((interest) => {
          const Icon = interest.icon;
          const isSelected = selectedInterests.includes(interest.id);
          
          return (
            <button
              key={interest.id}
              className={`interest-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleInterest(interest.id)}
            >
              <Icon size={24} />
              <span>{interest.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="selection-info">
        <p>Selected: {selectedInterests.length} interests</p>
        <p className="selection-tip">
          You can change your interests later in your profile settings
        </p>
      </div>
    </div>
  );
};

export default InterestSelector;