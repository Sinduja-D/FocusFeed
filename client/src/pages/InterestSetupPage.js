import React, { useState, useContext } from 'react';
import '../styles/pages/InterestSetupPage.css';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../context/PreferenceContext';
import { toast } from 'react-hot-toast';
import { 
  Computer, 
  FlaskConical, 
  GraduationCap, 
  Trophy, 
  Palette, 
  Film, 
  Heart, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const InterestSetupPage = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePreferences } = usePreferences();
  const navigate = useNavigate();

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
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }

    setIsSubmitting(true);

    try {
      // Update user preferences
      updatePreferences({ interests: selectedInterests });
      
      // In a real app, this would save to the backend
      await fetch('/api/users/interests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ interests: selectedInterests })
      });

      toast.success('Interests saved successfully!');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to save interests. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="interest-setup-page">
      <div className="container">
        <div className="setup-header">
          <h1>Choose Your Interests</h1>
          <p>Select topics you're interested in to personalize your feed</p>
        </div>

        <div className="interests-container">
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
                  <Icon size={32} />
                  <span>{interest.label}</span>
                  {isSelected && <CheckCircle size={20} className="check-icon" />}
                </button>
              );
            })}
          </div>

          <div className="selection-info">
            <div className="selection-counter">
              <span>Selected: {selectedInterests.length} interests</span>
            </div>
            
            <div className="selection-tips">
              <h3>Tips for better experience:</h3>
              <ul>
                <li>Select topics you're genuinely interested in</li>
                <li>You can change your interests anytime in your profile</li>
                <li>The more interests you select, the more diverse your feed will be</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="setup-footer">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/home')}
          >
            Skip for Now
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting || selectedInterests.length === 0}
          >
            {isSubmitting ? 'Saving...' : 'Continue to FocusFeed'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestSetupPage;