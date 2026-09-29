import React, { useState, useEffect } from 'react';
import '../styles/pages/CollaborationsPage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CollaborationCard from '../components/CollaborationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Plus, 
  Search, 
  Users, 
  Target,
  Calendar,
  Filter,
  ArrowRight
} from 'lucide-react';

const CollaborationsPage = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collaborations');
      const data = await response.json();

      if (response.ok) {
        setCollaborations(Array.isArray(data.data) ? data.data : data.data?.collaborations || []);
      } else {
        toast.error('Failed to load collaborations');
      }
    } catch (error) {
      toast.error('An error occurred while loading collaborations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollaboration = () => {
    navigate('/create/collaboration');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCollaborations = collaborations.filter(collaboration => {
    const matchesSearch = (collaboration.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
               (collaboration.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'my-contributions') {
      // In a real app, this would check if user is a contributor
      return matchesSearch;
    }
    
    if (filter === 'open') {
      return matchesSearch && collaboration.status === 'Open';
    }
    
    if (filter === 'in-progress') {
      return matchesSearch && collaboration.status === 'In Progress';
    }
    
    return matchesSearch;
  });

  const stats = {
    totalCollaborations: collaborations.length,
    myContributions: collaborations.filter(c =>
      (Array.isArray(c.contributors) ? c.contributors : []).some(contributor =>
        (contributor.user?._id || contributor.user || contributor._id) === localStorage.getItem('userId')
      )
    ).length,
    activeNow: Math.floor(Math.random() * 20) + 10
  };

  return (
    <div className="collaborations-page">
      <div className="collaborations-header">
        <div className="header-content">
          <h1>Collaborations</h1>
          <p>Work together with others on creative projects</p>
        </div>
        
        <button className="btn btn-primary create-btn" onClick={handleCreateCollaboration}>
          <Plus size={20} />
          Start Collaboration
        </button>
      </div>

      <div className="collaborations-stats">
        <div className="stat-card">
          <Target size={20} />
          <div>
            <span className="stat-value">{stats.totalCollaborations}</span>
            <span className="stat-label">Total Projects</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Users size={20} />
          <div>
            <span className="stat-value">{stats.myContributions}</span>
            <span className="stat-label">My Contributions</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Calendar size={20} />
          <div>
            <span className="stat-value">{stats.activeNow}</span>
            <span className="stat-label">Active Now</span>
          </div>
        </div>
      </div>

      <div className="collaborations-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search collaborations..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Collaborations</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="my-contributions">My Contributions</option>
          </select>
        </div>
      </div>

      <div className="collaborations-grid">
        {loading ? (
          <LoadingSpinner />
        ) : filteredCollaborations.length > 0 ? (
          filteredCollaborations.map((collaboration) => (
            <CollaborationCard key={collaboration._id} collaboration={collaboration} />
          ))
        ) : (
          <div className="empty-state">
            <h3>No collaborations found</h3>
            <p>Start a new collaboration or join existing projects</p>
            <button className="btn btn-primary" onClick={handleCreateCollaboration}>
              Start Collaboration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationsPage;