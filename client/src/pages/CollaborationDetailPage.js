import React, { useState, useEffect } from 'react';
import '../styles/pages/CollaborationDetailPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ContributionCard from '../components/ContributionCard';
import ConsentPanel from '../components/ConsentPanel';
import VideoPreview from '../components/VideoPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ArrowLeft, 
  Users, 
  Target,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Play,
  Plus,
  Settings,
  Eye,
  Download,
  X
} from 'lucide-react';

const CollaborationDetailPage = () => {
  const { id } = useParams();
  const [collaboration, setCollaboration] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isContributor, setIsContributor] = useState(false);
  const [showConsentPanel, setShowConsentPanel] = useState(false);
  const [newContribution, setNewContribution] = useState({
    content: '',
    media: null
  });
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollaboration();
    fetchContributions();
  }, [id]);

  const fetchCollaboration = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/collaborations/${id}`);
      const data = await response.json();

      if (response.ok) {
        setCollaboration(data.data);
        // Check if user is a contributor
        const userId = localStorage.getItem('userId');
        setIsContributor(data.data.contributors.some(c => c.user._id === userId));
      } else {
        toast.error('Failed to load collaboration');
      }
    } catch (error) {
      toast.error('An error occurred while loading collaboration');
    } finally {
      setLoading(false);
    }
  };

  const fetchContributions = async () => {
    try {
      const response = await fetch(`/api/collaborations/${id}/contributions`);
      const data = await response.json();

      if (response.ok) {
        setContributions(data.data);
      }
    } catch (error) {
      toast.error('Failed to load contributions');
    }
  };

  const handleJoinCollaboration = async () => {
    try {
      const response = await fetch(`/api/collaborations/${id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setIsContributor(true);
        toast.success('Joined collaboration successfully!');
        fetchCollaboration(); // Refresh collaboration data
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to join collaboration');
      }
    } catch (error) {
      toast.error('An error occurred while joining collaboration');
    }
  };

  const handleLeaveCollaboration = async () => {
    try {
      const response = await fetch(`/api/collaborations/${id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setIsContributor(false);
        toast.success('Left collaboration successfully!');
        fetchCollaboration(); // Refresh collaboration data
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to leave collaboration');
      }
    } catch (error) {
      toast.error('An error occurred while leaving collaboration');
    }
  };

  const handleContribute = () => {
    setShowConsentPanel(true);
  };

  const handleConsentSubmit = async (consent) => {
    try {
      const formData = new FormData();
      formData.append('content', newContribution.content);
      formData.append('consent', consent.contribution);
      formData.append('reusePermission', consent.reuse);
      
      if (newContribution.media) {
        formData.append('media', newContribution.media);
      }

      const response = await fetch(`/api/collaborations/${id}/contribute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Contribution submitted successfully!');
        setShowConsentPanel(false);
        setNewContribution({ content: '', media: null });
        fetchContributions(); // Refresh contributions
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to submit contribution');
      }
    } catch (error) {
      toast.error('An error occurred while submitting contribution');
    }
  };

  const handleGenerateVideo = async () => {
    try {
      const response = await fetch(`/api/collaborations/${id}/generate-video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Video generation started!');
        fetchCollaboration(); // Refresh collaboration data
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to generate video');
      }
    } catch (error) {
      toast.error('An error occurred while generating video');
    }
  };

  const handlePublishCollaboration = async () => {
    try {
      const response = await fetch(`/api/collaborations/${id}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Collaboration published successfully!');
        navigate('/collaborations');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to publish collaboration');
      }
    } catch (error) {
      toast.error('An error occurred while publishing collaboration');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!collaboration) {
    return (
      <div className="error-state">
        <h3>Collaboration not found</h3>
        <p>The collaboration you're looking for doesn't exist</p>
        <button className="btn btn-primary" onClick={() => navigate('/collaborations')}>
          Back to Collaborations
        </button>
      </div>
    );
  }

  const approvedContributions = contributions.filter(c => c.status === 'Approved');
  const pendingContributions = contributions.filter(c => c.status === 'Pending');

  return (
    <div className="collaboration-detail-page">
      <div className="collaboration-header">
        <button className="back-btn" onClick={() => navigate('/collaborations')}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <div className="collaboration-info">
          <div className="status-badge">
            {collaboration.status === 'Open' && <Target size={20} />}
            {collaboration.status === 'In Progress' && <Clock size={20} />}
            {collaboration.status === 'Completed' && <CheckCircle size={20} />}
            {collaboration.status === 'Cancelled' && <XCircle size={20} />}
            <span>{collaboration.status}</span>
          </div>
          
          <h1>{collaboration.title}</h1>
          <p>{collaboration.description}</p>
          <div className="collaboration-meta">
            <div className="meta-item">
              <Users size={16} />
              <span>{collaboration.contributors.length} contributors</span>
            </div>
            <div className="meta-item">
              <Calendar size={16} />
              <span>Created {formatDate(collaboration.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="collaboration-actions">
          {!isContributor ? (
            <button className="btn btn-primary" onClick={handleJoinCollaboration}>
              Join Collaboration
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handleLeaveCollaboration}>
              Leave Collaboration
            </button>
          )}
          
          {isContributor && collaboration.status === 'Open' && (
            <button className="btn btn-primary" onClick={handleContribute}>
              <Plus size={20} />
              Contribute
            </button>
          )}
          
          {collaboration.status === 'In Progress' && (
            <button className="btn btn-primary" onClick={handleGenerateVideo}>
              Generate Video
            </button>
          )}
          
          {collaboration.status === 'In Progress' && (
            <button className="btn btn-secondary" onClick={() => setShowVideoPreview(true)}>
              <Play size={20} />
              Preview
            </button>
          )}
          
          {collaboration.status === 'In Progress' && (
            <button className="btn btn-primary" onClick={handlePublishCollaboration}>
              Publish
            </button>
          )}
        </div>
      </div>

      <div className="collaboration-content">
        <div className="collaboration-tabs">
          <button className="tab-btn active">
            Overview
          </button>
          <button className="tab-btn">
            Contributions
          </button>
          <button className="tab-btn">
            Timeline
          </button>
          <button className="tab-btn">
            Settings
          </button>
        </div>

        <div className="overview-section">
          <div className="purpose">
            <h3>Purpose</h3>
            <p>{collaboration.purpose}</p>
          </div>
          
          <div className="contributors">
            <h3>Contributors</h3>
            <div className="contributors-list">
              {collaboration.contributors.map((contributor) => (
                <div key={contributor.user._id} className="contributor-item">
                  <div className="contributor-avatar">
                    <img 
                      src={contributor.user.profileImage || `https://ui-avatars.com/api/?name=${contributor.user.name}&background=2563eb&color=fff`} 
                      alt={contributor.user.name} 
                    />
                  </div>
                  <div className="contributor-info">
                    <span className="contributor-name">{contributor.user.name}</span>
                    <span className="contributor-status">{contributor.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {collaboration.finalVideo && (
            <div className="final-video">
              <h3>Final Video</h3>
              <VideoPreview videoUrl={collaboration.finalVideo} />
              <button className="btn btn-secondary download-btn">
                <Download size={20} />
                <span>Download Video</span>
              </button>
            </div>
          )}
        </div>

        <div className="contributions-section">
          <div className="section-header">
            <h3>Contributions</h3>
            <div className="contribution-stats">
              <span className="stat">{approvedContributions.length} Approved</span>
              <span className="stat">{pendingContributions.length} Pending</span>
            </div>
          </div>
          
          <div className="contributions-list">
            {contributions.length > 0 ? (
              contributions.map((contribution) => (
                <ContributionCard key={contribution._id} contribution={contribution} />
              ))
            ) : (
              <div className="empty-state">
                <h3>No contributions yet</h3>
                <p>Be the first to contribute to this collaboration</p>
                {isContributor && (
                  <button className="btn btn-primary" onClick={handleContribute}>
                    <Plus size={20} />
                    Add Contribution
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showConsentPanel && (
        <ConsentPanel 
          onSubmit={handleConsentSubmit}
          onCancel={() => setShowConsentPanel(false)}
        />
      )}

      {showVideoPreview && collaboration.finalVideo && (
        <div className="video-preview-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Video Preview</h3>
              <button onClick={() => setShowVideoPreview(false)}>
                <X size={24} />
              </button>
            </div>
            <VideoPreview videoUrl={collaboration.finalVideo} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationDetailPage;