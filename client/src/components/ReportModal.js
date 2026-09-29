import React, { useState } from 'react';
import '../styles/components/ReportModal.css';
import { Modal } from 'react-bootstrap';
import { Flag, AlertTriangle, FileText, Users, MessageSquare, Eye, X } from 'lucide-react';

const ReportModal = ({ show, onHide, postId, onSubmit }) => {
  const [reportData, setReportData] = useState({
    reason: '',
    description: ''
  });

  const reportReasons = [
    { id: 'Harassment', icon: AlertTriangle, label: 'Harassment' },
    { id: 'Spam', icon: MessageSquare, label: 'Spam' },
    { id: 'False Information', icon: FileText, label: 'False Information' },
    { id: 'Fake Account', icon: Users, label: 'Fake Account' },
    { id: 'AI Manipulation', icon: Eye, label: 'AI Manipulation' },
    { id: 'Harmful Content', icon: AlertTriangle, label: 'Harmful Content' },
    { id: 'Hidden Advertisement', icon: Flag, label: 'Hidden Advertisement' },
    { id: 'Other', icon: X, label: 'Other' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(postId, reportData);
    onHide();
  };

  const getReasonIcon = (reasonId) => {
    const reason = reportReasons.find(r => r.id === reasonId);
    return reason ? reason.icon : Flag;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Report Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h5>Why are you reporting this post?</h5>
            <p className="text-muted">Select the reason that best applies</p>
            
            <div className="row g-2 mb-3">
              {reportReasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <div key={reason.id} className="col-6">
                    <div 
                      className={`report-reason-card ${reportData.reason === reason.id ? 'selected' : ''}`}
                      onClick={() => setReportData({...reportData, reason: reason.id})}
                    >
                      <Icon size={20} />
                      <span>{reason.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <h5>Additional Information</h5>
            <p className="text-muted">Provide more details about your report (optional)</p>
            <textarea
              className="form-control"
              rows={3}
              value={reportData.description}
              onChange={(e) => setReportData({...reportData, description: e.target.value})}
              placeholder="Describe the issue in detail..."
            />
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onHide}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!reportData.reason}
            >
              Submit Report
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;