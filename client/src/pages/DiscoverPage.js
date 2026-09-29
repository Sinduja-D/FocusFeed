import React, { useState, useEffect } from 'react';
import '../styles/pages/DiscoverPage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CommunityCard from '../components/CommunityCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, 
  Users, 
  TrendingUp, 
  Calendar,
  Filter,
  ArrowRight
} from 'lucide-react';

const DiscoverPage = () => {
  const [communities, setCommunities] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [recentCommunities, setRecentCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const getMemberCount = (community) => (Array.isArray(community.members) ? community.members.length : 0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch communities
      const communitiesResponse = await fetch('/api/communities');
      const communitiesData = await communitiesResponse.json();
      
      if (communitiesResponse.ok) {
        const loadedCommunities = Array.isArray(communitiesData.data)
          ? communitiesData.data
          : communitiesData.data?.communities || [];
        setCommunities(loadedCommunities);
        
        // Split into trending and recent
        const sortedCommunities = [...loadedCommunities].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setRecentCommunities(sortedCommunities.slice(0, 6));
        setTrendingTopics(sortedCommunities.slice(0, 4));
      }
    } catch (error) {
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Joined community successfully!');
        fetchData(); // Refresh data
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to join community');
      }
    } catch (error) {
      toast.error('An error occurred while joining community');
    }
  };

  const filteredCommunities = communities.filter(community =>
    (community.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (community.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="discover-page">
      <div className="discover-header">
        <h1>Discover</h1>
        <p>Explore new interests and communities</p>
      </div>

      <div className="search-section">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search communities, topics, or people"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="discover-content">
        <div className="explore-section">
          <h2>Explore New Interests</h2>
          <div className="interests-grid">
            {['Technology', 'Science', 'Sports', 'Art', 'Education', 'Entertainment'].map((interest) => (
              <button
                key={interest}
                className="interest-card"
                onClick={() => navigate(`/discover?interest=${interest}`)}
              >
                <div className="interest-icon">
                  {/* Add appropriate icon based on interest */}
                </div>
                <span>{interest}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="trending-section">
          <div className="section-header">
            <h2>Trending Communities</h2>
            <button className="view-all-btn">
              View All <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="communities-grid">
            {trendingTopics.map((community) => (
              <CommunityCard key={community._id} community={community} />
            ))}
          </div>
        </div>

        <div className="recent-section">
          <div className="section-header">
            <h2>Recently Active Communities</h2>
            <button className="view-all-btn">
              View All <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="communities-list">
            {recentCommunities.map((community) => (
              <div key={community._id} className="community-item">
                <div className="community-info">
                  <div className="community-icon">
                    <Users size={24} />
                  </div>
                  <div className="community-details">
                    <h3>{community.name}</h3>
                    <p>{community.description}</p>
                    <div className="community-meta">
                      <span>{getMemberCount(community)} members</span>
                      <span>•</span>
                      <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleJoinCommunity(community._id)}
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="recommended-section">
          <h2>Recommended For You</h2>
          <div className="recommendations-grid">
            {filteredCommunities.slice(0, 4).map((community) => (
              <CommunityCard key={community._id} community={community} />
            ))}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner />}
    </div>
  );
};

export default DiscoverPage;