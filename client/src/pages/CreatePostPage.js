import React, { useState, useEffect } from 'react';
import '../styles/pages/CreatePostPage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Image, 
  Video, 
  Send,
  Eye,
  Users,
  Target,
  Bot,
  Sparkles,
  FileText,
  CheckCircle,
  X
} from 'lucide-react';

const CreatePostPage = () => {
  const [formData, setFormData] = useState({
    content: '',
    interest: 'Technology',
    audience: 'Public',
    creationType: 'Human Created',
    image: null,
    video: null
  });
  const [aiContent, setAiContent] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const navigate = useNavigate();

  const interests = [
    'Technology', 'Science', 'Education', 'Sports', 'Art', 
    'Entertainment', 'Personal Stories', 'Social Causes'
  ];

  const audiences = ['Public', 'Community', 'Followers'];

  const creationTypes = ['Human Created', 'AI Assisted', 'AI Generated'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    }
  };

  const generateAiContent = async () => {
    try {
      // In a real app, this would call an AI service
      // For demo, we'll return mock content
      const mockSuggestions = [
        'Check out this amazing new technology trend!',
        'What do you think about the latest innovations in AI?',
        'Here are my thoughts on the future of technology...'
      ];
      
      setAiSuggestions(mockSuggestions);
      setShowAiPanel(true);
    } catch (error) {
      toast.error('Failed to generate AI suggestions');
    }
  };

  const handleAiSuggestion = (suggestion) => {
    setFormData({
      ...formData,
      content: suggestion,
      creationType: 'AI Assisted'
    });
    setShowAiPanel(false);
  };

  const runAiSafetyCheck = async () => {
    try {
      // In a real app, this would call an AI moderation service
      // For demo, we'll return mock analysis
      const mockAnalysis = {
        status: 'SAFE',
        confidence: 0.92,
        reason: 'No obvious harmful content detected'
      };
      
      setAiAnalysis(mockAnalysis);
      toast.success('Content passed safety check');
    } catch (error) {
      toast.error('Safety check failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('content', formData.content);
      submitData.append('interest', formData.interest);
      submitData.append('audience', formData.audience);
      submitData.append('creationType', formData.creationType);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      if (formData.video) {
        submitData.append('video', formData.video);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Post created successfully!');
        navigate('/home');
      } else {
        toast.error(data.message || data.error || 'Failed to create post');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while creating post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-header">
        <button className="back-btn" onClick={() => navigate('/create')}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <h1>Create Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-section">
          <div className="post-content">
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="What's on your mind?"
              rows={6}
              required
            />
            
            <div className="content-actions">
              <div className="formatting-tools">
                <button type="button" className="tool-btn">
                  <FileText size={20} />
                </button>
                <button type="button" className="tool-btn">
                  <Image size={20} />
                </button>
                <button type="button" className="tool-btn">
                  <Video size={20} />
                </button>
              </div>
              
              <button 
                type="button"
                className="ai-btn"
                onClick={generateAiContent}
              >
                <Sparkles size={20} />
                <span>AI Assist</span>
              </button>
            </div>
          </div>

          {formData.image && (
            <div className="media-preview">
              <div className="image-preview">
                <img src={URL.createObjectURL(formData.image)} alt="Preview" />
                <button type="button" className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          )}

          {formData.video && (
            <div className="media-preview">
              <div className="video-preview">
                <video controls>
                  <source src={URL.createObjectURL(formData.video)} type="video/mp4" />
                </video>
                <button type="button" className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          )}

          <div className="file-upload">
            <label className="upload-label">
              <Image size={20} />
              <span>Add Photo</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
            
            <label className="upload-label">
              <Video size={20} />
              <span>Add Video</span>
              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Post Settings</h3>
          
          <div className="setting-group">
            <label>Interest</label>
            <select
              name="interest"
              value={formData.interest}
              onChange={handleInputChange}
            >
              {interests.map((interest) => (
                <option key={interest} value={interest}>{interest}</option>
              ))}
            </select>
          </div>
          
          <div className="setting-group">
            <label>Audience</label>
            <select
              name="audience"
              value={formData.audience}
              onChange={handleInputChange}
            >
              {audiences.map((audience) => (
                <option key={audience} value={audience}>{audience}</option>
              ))}
            </select>
          </div>
          
          <div className="setting-group">
            <label>Creation Type</label>
            <select
              name="creationType"
              value={formData.creationType}
              onChange={handleInputChange}
            >
              {creationTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {showAiPanel && (
          <div className="ai-panel">
            <div className="ai-header">
              <h3>AI Suggestions</h3>
              <button type="button" onClick={() => setShowAiPanel(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="ai-suggestions">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="suggestion-item">
                  <p>{suggestion}</p>
                  <button 
                    type="button"
                    onClick={() => handleAiSuggestion(suggestion)}
                  >
                    Use This
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {aiAnalysis && (
          <div className="ai-analysis">
            <div className={`analysis-result ${aiAnalysis.status.toLowerCase()}`}>
              <CheckCircle size={20} />
              <div>
                <h4>Safety Check</h4>
                <p>{aiAnalysis.reason}</p>
                <span>Confidence: {Math.round(aiAnalysis.confidence * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={runAiSafetyCheck}
          >
            <Eye size={20} />
            <span>Run Safety Check</span>
          </button>
          
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <Send size={20} />
            <span>{isSubmitting ? 'Creating...' : 'Create Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;