import React, { useState, useEffect } from 'react';
import '../styles/pages/AppealPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Gavel, 
  AlertTriangle, 
  FileText, 
  Users, 
  MessageSquare,
  Eye,
  X,
  Send,
  CheckCircle,
  Clock
} from 'lucide-react';

const AppealPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [appeal, setAppeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appealData, setAppealData] = useState({
    reason: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchAppeal();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();

      if (response.ok) {
        setPost(data.data);
      } else {
        toast.error('Failed to load post');
        navigate('/home');
      }
    } catch (error) {
      toast.error('An error occurred while loading post');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppeal = async () => {
    try {
      const response = await fetch(`/api/appeals/my?post=${postId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppeal(data.data[0]); // Get first appeal for this post
      }
    } catch (error) {
      toast.error('Failed to load appeal');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppealData({
      ...appealData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/appeals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          postId,
          decision: 'Content Restricted', // This would come from the actual decision
          reason: appealData.reason,
          description: appealData.description
        })
      });

      if (response.ok) {
        toast.success('Appeal submitted successfully!');
        navigate('/home');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to submit appeal');
      }
    } catch (error) {
      toast.error('An error occurred while submitting appeal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const appealDecisions = [
    { id: 'Content Restricted', icon: AlertTriangle, label: 'Content Restricted' },
    { id: 'Account Suspended', icon: Users, label: 'Account Suspended' },
    { id: 'Post Removed', icon: FileText, label: 'Post Removed' }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="appeal-page">
      <div className="appeal-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <X size={20} />
          <span>Back</span>
        </button>
        
        <h1>Appeal Decision</h1>
        <p>Challenge a moderation decision</p>
      </div>

      <div className="appeal-content">
        {appeal ? (
          <div className="existing-appeal">
            <div className="appeal-status">
              <div className={`status-badge ${appeal.status.toLowerCase()}`}>
                <Clock size={20} />
                <span>{appeal.status}</span>
              </div>
            </div>
            
            <div className="appeal-details">
              <h2>Current Appeal</h2>
              <p>Decision: {appeal.decision}</p>
              <p>Reason: {appeal.reason}</p>
              <p>Submitted: {new Date(appeal.createdAt).toLocaleDateString()}</p>
              
              {appeal.adminComment && (
                <div className="admin-feedback">
                  <h3>Admin Response</h3>
                  <p>{appeal.adminComment}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="post-preview">
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">
                    <img 
                      src={post.author.profileImage || `https://ui-avatars.com/api/?name=${post.author.name}&background=2563eb&color=fff`} 
                      alt={post.author.name} 
                    />
                  </div>
                  <div className="author-info">
                    <h3>{post.author.name}</h3>
                    <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="post-content">
                <p>{post.content}</p>
                
                {post.image && (
                  <div className="post-image">
                    <img src={post.image} alt="Post" />
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="appeal-form">
              <div className="form-section">
                <h2>What decision are you appealing?</h2>
                <p>Select the decision you want to challenge</p>
                
                <div className="decisions-grid">
                  {appealDecisions.map((decision) => {
                    const Icon = decision.icon;
                    return (
                      <div 
                        key={decision.id}
                        className={`decision-card ${appealData.decision === decision.id ? 'selected' : ''}`}
                        onClick={() => setAppealData({...appealData, decision: decision.id})}
                      >
                        <Icon size={24} />
                        <span>{decision.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-section">
                <h2>Why are you appealing this decision?</h2>
                <p>Explain why you believe this decision is incorrect</p>
                
                <div className="form-group">
                  <textarea
                    name="reason"
                    value={appealData.reason}
                    onChange={handleInputChange}
                    placeholder="Explain why you believe this decision is incorrect..."
                    required
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Additional Information</h2>
                <p>Provide any supporting evidence or context (optional)</p>
                
                <div className="form-group">
                  <textarea
                    name="description"
                    value={appealData.description}
                    onChange={handleInputChange}
                    placeholder="Provide additional details or evidence..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="appeal-info">
                <div className="info-card">
                  <CheckCircle size={20} className="info-icon" />
                  <div>
                    <h3>What happens next?</h3>
                    <p>Our review team will examine your appeal and respond within 48 hours.</p>
                  </div>
                </div>
                
                <div className="info-card warning">
                  <AlertTriangle size={20} className="info-icon" />
                  <div>
                    <h3>Appeal guidelines</h3>
                    <p>Be honest and provide accurate information. False appeals may result in restrictions.</p>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/home')}
                >
                  Cancel
                </button>
                
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={!appealData.decision || !appealData.reason || isSubmitting}
                >
                  <Send size={20} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Appeal'}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AppealPage;