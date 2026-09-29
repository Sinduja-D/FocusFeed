import React, { useState, useEffect } from 'react';
import '../styles/admin/AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Flag, 
  Shield, 
  Eye,
  Users2,
  MessageSquare,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Gavel,
  TrendingUp,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    flaggedPosts: 0,
    pendingReports: 0,
    pendingAppeals: 0,
    fakeAccounts: 0,
    unusualEngagement: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data.stats);
        setRecentActivity(statsData.data.recentActivity);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      change: '+12%',
      color: 'blue'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Users2,
      change: '+8%',
      color: 'green'
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      change: '+15%',
      color: 'purple'
    },
    {
      title: 'Flagged Posts',
      value: stats.flaggedPosts,
      icon: Flag,
      change: '-5%',
      color: 'red'
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports,
      icon: Shield,
      change: '0%',
      color: 'yellow'
    },
    {
      title: 'Pending Appeals',
      value: stats.pendingAppeals,
      icon: Gavel,
      change: '0%',
      color: 'orange'
    },
    {
      title: 'Fake Accounts',
      value: stats.fakeAccounts,
      icon: Eye,
      change: '-10%',
      color: 'red'
    },
    {
      title: 'Unusual Engagement',
      value: stats.unusualEngagement,
      icon: TrendingUp,
      change: '+20%',
      color: 'yellow'
    }
  ];

  const activityTypes = [
    { type: 'user', icon: Users, color: 'blue' },
    { type: 'post', icon: FileText, color: 'purple' },
    { type: 'report', icon: Flag, color: 'red' },
    { type: 'appeal', icon: Gavel, color: 'orange' },
    { type: 'moderation', icon: Shield, color: 'green' },
    { type: 'safety', icon: AlertTriangle, color: 'yellow' }
  ];

  const getActivityIcon = (type) => {
    const activityType = activityTypes.find(at => at.type === type);
    if (activityType) {
      const Icon = activityType.icon;
      return <Icon size={20} className={`activity-icon ${activityType.color}`} />;
    }
    return <FileText size={20} />;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of platform activity and moderation</p>
      </div>

      <div className="stats-grid">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <h3>{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <span className={`stat-change ${stat.color}`}>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content">
        <div className="recent-activity">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button className="btn btn-secondary view-all" onClick={() => navigate('/admin/reports')}>
              View All
            </button>
          </div>
          
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-details">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <p className="activity-time">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="activity-status">
                    {activity.status === 'resolved' ? (
                      <CheckCircle className="status-icon resolved" />
                    ) : (
                      <Clock className="status-icon pending" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>No recent activity</h3>
                <p>The platform is running smoothly</p>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-card" onClick={() => navigate('/admin/users')}>
              <Users size={24} />
              <span>Manage Users</span>
            </button>
            
            <button className="action-card" onClick={() => navigate('/admin/posts')}>
              <FileText size={24} />
              <span>Review Posts</span>
            </button>
            
            <button className="action-card" onClick={() => navigate('/admin/reports')}>
              <Flag size={24} />
              <span>Handle Reports</span>
            </button>
            
            <button className="action-card" onClick={() => navigate('/admin/moderation')}>
              <Shield size={24} />
              <span>Moderation Queue</span>
            </button>
            
            <button className="action-card" onClick={() => navigate('/admin/fake-accounts')}>
              <Eye size={24} />
              <span>Fake Accounts</span>
            </button>
            
            <button className="action-card" onClick={() => navigate('/admin/engagement')}>
              <TrendingUp size={24} />
              <span>Engagement Analysis</span>
            </button>
            
            <button className="action-card" onClick={() => navigate('/admin/collaborations')}>
              <Target size={24} />
              <span>Collaborations</span>
            </button>
            
            <button className="action-card" onClick={() => navigate('/admin/appeals')}>
              <Gavel size={24} />
              <span>Appeals</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;