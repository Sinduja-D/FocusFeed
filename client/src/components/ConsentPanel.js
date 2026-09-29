import React, { useState } from 'react';
import '../styles/components/ConsentPanel.css';
import { CheckCircle, XCircle } from 'lucide-react';

const ConsentPanel = ({ onSubmit, onCancel }) => {
  const [consent, setConsent] = useState({
    contribution: false,
    reuse: false
  });

  const handleConsentChange = (type, value) => {
    setConsent(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = () => {
    if (consent.contribution) {
      onSubmit(consent);
    }
  };

  return (
    <div className="consent-panel">
      <div className="consent-header">
        <h3>Contribution Consent</h3>
        <p>Please review and accept the terms before submitting</p>
      </div>
      
      <div className="consent-items">
        <div className="consent-item">
          <div className="consent-checkbox">
            <input
              type="checkbox"
              id="contribution-consent"
              checked={consent.contribution}
              onChange={(e) => handleConsentChange('contribution', e.target.checked)}
            />
            <label htmlFor="contribution-consent">
              <CheckCircle size={20} />
              <span>
                I confirm that this content belongs to me or I have permission to submit it.
              </span>
            </label>
          </div>
        </div>
        
        <div className="consent-item">
          <div className="consent-checkbox">
            <input
              type="checkbox"
              id="reuse-consent"
              checked={consent.reuse}
              onChange={(e) => handleConsentChange('reuse', e.target.checked)}
            />
            <label htmlFor="reuse-consent">
              <CheckCircle size={20} />
              <span>
                I allow this contribution to be included in the collaborative creation.
              </span>
            </label>
          </div>
        </div>
        
        <div className="consent-item">
          <div className="consent-checkbox">
            <input
              type="checkbox"
              id="future-reuse"
              checked={consent.reuse}
              onChange={(e) => handleConsentChange('reuse', e.target.checked)}
            />
            <label htmlFor="future-reuse">
              <CheckCircle size={20} />
              <span>
                I allow future reuse of this contribution.
              </span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="consent-footer">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={!consent.contribution}
        >
          Submit Contribution
        </button>
      </div>
    </div>
  );
};

export default ConsentPanel;