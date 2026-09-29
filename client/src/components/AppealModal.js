import React, { useState } from 'react';
import '../styles/components/AppealModal.css';
import { Modal } from 'react-bootstrap';
import { Gavel, AlertTriangle, FileText, Users, MessageSquare, Eye, X, CheckCircle } from 'lucide-react';

const AppealModal = ({ show, onHide, postId, onSubmit }) => {
  const [appealData, setAppealData] = useState({
    reason: '',
    description: ''
  });

  const appealDecisions = [
    { id: 'Content Restricted', icon: AlertTriangle, label: 'Content Restricted' },
    { id: 'Account Suspended', icon: Users, label: 'Account Suspended' },
    { id: 'Post Removed', icon: FileText, label: 'Post Removed' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(postId, appealData);
    onHide();
  };

  const getDecisionIcon = (decisionId) => {
    const decision = appealDecisions.find(d => d.id === decisionId);
    return decision ? decision.icon : Gavel;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Appeal Decision</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h5>What decision are you appealing?</h5>
            <p className="text-muted">Select the decision you want to challenge</p>
            
            <div className="row g-2 mb-3">
              {appealDecisions.map((decision) => {
                const Icon = decision.icon;
                return (
                  <div key={decision.id} className="col-6">
                    <div 
                      className={`appeal-decision-card ${appealData.decision === decision.id ? 'selected' : ''}`}
                      onClick={() => setAppealData({...appealData, decision: decision.id})}
                    >
                      <Icon size={20} />
                      <span>{decision.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <h5>Why are you appealing this decision?</h5>
            <p className="text-muted">Explain why you believe this decision is incorrect</p>
            <textarea
              className="form-control"
              rows={3}
              value={appealData.reason}
              onChange={(e) => setAppealData({...appealData, reason: e.target.value})}
              placeholder="Explain why you believe this decision is incorrect..."
              required
            />
          </div>

          <div className="mb-4">
            <h5>Additional Information</h5>
            <p className="text-muted">Provide any supporting evidence or context (optional)</p>
            <textarea
              className="form-control"
              rows={3}
              value={appealData.description}
              onChange={(e) => setAppealData({...appealData, description: e.target.value})}
              placeholder="Provide additional details or evidence..."
            />
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onHide}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!appealData.decision || !appealData.reason}
            >
              Submit Appeal
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AppealModal;