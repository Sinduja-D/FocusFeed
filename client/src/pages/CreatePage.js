import React, { useState } from 'react';
import '../styles/pages/CreatePage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  FileText, 
  Image, 
  Video, 
  Users, 
  Target, 
  Bot,
  Sparkles,
  Plus,
  ArrowLeft
} from 'lucide-react';

const CreatePage = () => {
  const [activeTab, setActiveTab] = useState('post');
  const [communityForm, setCommunityForm] = useState({ name: '', description: '', interest: 'Technology' });
  const [collaborationForm, setCollaborationForm] = useState({ title: '', description: '', purpose: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitCreation = async (event, type) => {
    event.preventDefault();
    setIsSubmitting(true);
    const endpoint = type === 'community' ? '/api/communities' : '/api/collaborations';
    const payload = type === 'community' ? communityForm : collaborationForm;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `Failed to create ${type}`);
      }

      toast.success(`${type === 'community' ? 'Community' : 'Collaboration'} created successfully`);
      navigate(type === 'community' ? '/communities' : '/collaborations');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const creationOptions = [
    {
      id: 'post',
      icon: FileText,
      title: 'Create Post',
      description: 'Share your thoughts with your network'
    },
    {
      id: 'community',
      icon: Users,
      title: 'Create Community',
      description: 'Start a new community around your interests'
    },
    {
      id: 'collaboration',
      icon: Target,
      title: 'Start Collaboration',
      description: 'Work with others on creative projects'
    }
  ];

  const handleCreate = (type) => {
    switch (type) {
      case 'post':
        navigate('/create/post');
        break;
      case 'community':
        navigate('/create');
        break;
      case 'collaboration':
        navigate('/create');
        break;
      default:
        break;
    }
  };

  return (
    <div className="create-page">
      <div className="create-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <h1>Create</h1>
        <p>Share your ideas and connect with others</p>
      </div>

      <div className="creation-options">
        {creationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div 
              key={option.id}
              className={`creation-card ${activeTab === option.id ? 'active' : ''}`}
              onClick={() => setActiveTab(option.id)}
            >
              <div className="creation-icon">
                <Icon size={32} />
              </div>
              <div className="creation-info">
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {activeTab === 'post' && (
        <div className="post-creation">
          <h2>Create a Post</h2>
          <p>Share your thoughts, photos, or videos with your network</p>
          
          <div className="post-types">
            <button 
              className="post-type-btn"
              onClick={() => handleCreate('post')}
            >
              <div className="type-icon">
                <FileText size={24} />
              </div>
              <div className="type-info">
                <h4>Text Post</h4>
                <p>Share your thoughts and ideas</p>
              </div>
            </button>
            
            <button 
              className="post-type-btn"
              onClick={() => handleCreate('post')}
            >
              <div className="type-icon">
                <Image size={24} />
              </div>
              <div className="type-info">
                <h4>Photo Post</h4>
                <p>Share images and photos</p>
              </div>
            </button>
            
            <button 
              className="post-type-btn"
              onClick={() => handleCreate('post')}
            >
              <div className="type-icon">
                <Video size={24} />
              </div>
              <div className="type-info">
                <h4>Video Post</h4>
                <p>Share videos and clips</p>
              </div>
            </button>
          </div>
          
          <div className="ai-options">
            <h3>AI Assistance</h3>
            <p>Get help creating your content</p>
            
            <div className="ai-features">
              <div className="ai-feature">
                <Sparkles size={20} />
                <div>
                  <h4>AI Suggestions</h4>
                  <p>Get help with writing and ideas</p>
                </div>
              </div>
              
              <div className="ai-feature">
                <Bot size={20} />
                <div>
                  <h4>AI Content Generation</h4>
                  <p>Create content with AI assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <div className="community-creation">
          <h2>Create a Community</h2>
          <p>Bring people together around shared interests</p>

          <form className="creation-form" onSubmit={(event) => submitCreation(event, 'community')}>
            <input required maxLength={50} placeholder="Community name" value={communityForm.name} onChange={(event) => setCommunityForm({ ...communityForm, name: event.target.value })} />
            <textarea required maxLength={500} placeholder="What is this community about?" value={communityForm.description} onChange={(event) => setCommunityForm({ ...communityForm, description: event.target.value })} />
            <select value={communityForm.interest} onChange={(event) => setCommunityForm({ ...communityForm, interest: event.target.value })}>
              {['Technology', 'Science', 'Education', 'Sports', 'Art', 'Entertainment', 'Personal Stories', 'Social Causes'].map(interest => <option key={interest} value={interest}>{interest}</option>)}
            </select>
            <button className="btn btn-primary create-btn" type="submit" disabled={isSubmitting}><Plus size={20} />{isSubmitting ? 'Creating...' : 'Create Community'}</button>
          </form>
        </div>
      )}

      {activeTab === 'collaboration' && (
        <div className="collaboration-creation">
          <h2>Start a Collaboration</h2>
          <p>Work with others on creative projects</p>

          <form className="creation-form" onSubmit={(event) => submitCreation(event, 'collaboration')}>
            <input required maxLength={100} placeholder="Project title" value={collaborationForm.title} onChange={(event) => setCollaborationForm({ ...collaborationForm, title: event.target.value })} />
            <textarea required maxLength={1000} placeholder="Describe the project" value={collaborationForm.description} onChange={(event) => setCollaborationForm({ ...collaborationForm, description: event.target.value })} />
            <textarea required maxLength={500} placeholder="What is the purpose?" value={collaborationForm.purpose} onChange={(event) => setCollaborationForm({ ...collaborationForm, purpose: event.target.value })} />
            <button className="btn btn-primary create-btn" type="submit" disabled={isSubmitting}><Plus size={20} />{isSubmitting ? 'Creating...' : 'Start Collaboration'}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatePage;