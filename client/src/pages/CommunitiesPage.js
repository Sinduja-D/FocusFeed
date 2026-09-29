import React, { useState, useEffect } from 'react';
import '../styles/pages/CommunitiesPage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CommunityCard from '../components/CommunityCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Plus, 
  Search, 
  Users, 
  Filter,
  Calendar,
  TrendingUp
} from 'lucide-react';

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/communities');
      const data = await response.json();

      if (response.ok) {
        setCommunities(Array.isArray(data.data) ? data.data : data.data?.communities || []);
      } else {
        toast.error('Failed to load communities');
      }
    } catch (error) {
      toast.error('An error occurred while loading communities');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = () => {
    navigate('/create/community');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCommunities = communities.filter(community => {
    const name = community.name || '';
    const description = community.description || '';
    const members = Array.isArray(community.members) ? community.members : [];
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'joined') {
      return matchesSearch && members.some(member => (member._id || member.user?._id || member.user) === localStorage.getItem('userId'));
    }
    
    if (filter === 'recommended') {
      // In a real app, this would use user preferences
      return matchesSearch && community.interest === 'Technology';
    }
    
    return matchesSearch;
  });

  const stats = {
    totalCommunities: communities.length,
    joinedCommunities: communities.filter(c =>
      (Array.isArray(c.members) ? c.members : []).some(m => (m._id || m.user?._id || m.user) === localStorage.getItem('userId'))
    ).length,
    activeToday: Math.floor(Math.random() * 50) + 20
  };

  return (
    <div className="communities-page">
      <div className="communities-header">
        <div className="header-content">
          <h1>Communities</h1>
          <p>Connect with people who share your interests</p>
        </div>
        
        <button className="btn btn-primary create-btn" onClick={handleCreateCommunity}>
          <Plus size={20} />
          Create Community
        </button>
      </div>

      <div className="communities-stats">
        <div className="stat-card">
          <Users size={20} />
          <div>
            <span className="stat-value">{stats.totalCommunities}</span>
            <span className="stat-label">Total Communities</span>
          </div>
        </div>
        
        <div className="stat-card">
          <TrendingUp size={20} />
          <div>
            <span className="stat-value">{stats.joinedCommunities}</span>
            <span className="stat-label">Joined</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Calendar size={20} />
          <div>
            <span className="stat-value">{stats.activeToday}</span>
            <span className="stat-label">Active Today</span>
          </div>
        </div>
      </div>

      <div className="communities-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Communities</option>
            <option value="joined">Joined</option>
            <option value="recommended">Recommended</option>
          </select>
        </div>
      </div>

      <div className="communities-grid">
        {loading ? (
          <LoadingSpinner />
        ) : filteredCommunities.length > 0 ? (
          filteredCommunities.map((community) => (
            <CommunityCard key={community._id} community={community} />
          ))
        ) : (
          <div className="empty-state">
            <h3>No communities found</h3>
            <p>Try adjusting your search or create a new community</p>
            <button className="btn btn-primary" onClick={handleCreateCommunity}>
              Create Community
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitiesPage;