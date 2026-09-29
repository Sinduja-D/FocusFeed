import React, { useState, useEffect } from 'react';
import '../styles/admin/AdminUsers.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Shield,
  UserCheck,
  UserX,
  Ban,
  Mail,
  Calendar,
  Eye,
  BarChart3,
  X
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users || []);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      toast.error('An error occurred while loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleUserAction = (action, userId) => {
    setSelectedUser(userId);
    setShowUserModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'admin') {
      return matchesSearch && user.role === 'admin';
    }
    
    if (filter === 'banned') {
      return matchesSearch && user.status === 'banned';
    }
    
    if (filter === 'suspicious') {
      return matchesSearch && user.riskLevel === 'suspicious';
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return { text: 'High Risk', class: 'danger' };
      case 'medium':
        return { text: 'Medium Risk', class: 'warning' };
      case 'low':
        return { text: 'Low Risk', class: 'success' };
      default:
        return { text: 'Normal', class: 'normal' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { text: 'Active', class: 'success' };
      case 'banned':
        return { text: 'Banned', class: 'danger' };
      case 'suspended':
        return { text: 'Suspended', class: 'warning' };
      default:
        return { text: 'Unknown', class: 'normal' };
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>Users Management</h1>
        <p>Manage user accounts and permissions</p>
      </div>

      <div className="users-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All Users</option>
            <option value="admin">Admins</option>
            <option value="banned">Banned</option>
            <option value="suspicious">Suspicious</option>
          </select>
        </div>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <Users size={20} />
          <div>
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        
        <div className="stat-card">
          <UserCheck size={20} />
          <div>
            <span className="stat-value">{users.filter(u => u.role === 'admin').length}</span>
            <span className="stat-label">Admins</span>
          </div>
        </div>
        
        <div className="stat-card">
          <UserX size={20} />
          <div>
            <span className="stat-value">{users.filter(u => u.status === 'banned').length}</span>
            <span className="stat-label">Banned</span>
          </div>
        </div>
        
        <div className="stat-card">
          <BarChart3 size={20} />
          <div>
            <span className="stat-value">{users.filter(u => u.riskLevel === 'high').length}</span>
            <span className="stat-label">High Risk</span>
          </div>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Risk Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const riskBadge = getRiskBadge(user.riskLevel);
              const statusBadge = getStatusBadge(user.status);
              
              return (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        <img 
                          src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff`} 
                          alt={user.name} 
                        />
                      </div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-id">@{user.username || 'user' + user._id.slice(-4)}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="user-email">{user.email}</div>
                  </td>
                  
                  <td>
                    <div className="user-joined">{formatDate(user.createdAt)}</div>
                  </td>
                  
                  <td>
                    <div className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </div>
                  </td>
                  
                  <td>
                    <div className={`risk-badge ${riskBadge.class}`}>
                      {riskBadge.text}
                    </div>
                  </td>
                  
                  <td>
                    <div className="user-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleUserAction('view', user._id)}
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button 
                        className="action-btn"
                        onClick={() => handleUserAction('manage', user._id)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showUserModal && selectedUser && (
        <div className="user-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>User Management</h2>
              <button onClick={() => setShowUserModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="user-details">
                <div className="user-info">
                  <div className="user-avatar">
                    <img 
                      src={users.find(u => u._id === selectedUser)?.profileImage || `https://ui-avatars.com/api/?name=${users.find(u => u._id === selectedUser)?.name}&background=2563eb&color=fff`} 
                      alt={users.find(u => u._id === selectedUser)?.name} 
                    />
                  </div>
                  <div>
                    <h3>{users.find(u => u._id === selectedUser)?.name}</h3>
                    <p>{users.find(u => u._id === selectedUser)?.email}</p>
                  </div>
                </div>
                
                <div className="user-stats">
                  <div className="stat-item">
                    <Calendar size={16} />
                    <span>Joined: {formatDate(users.find(u => u._id === selectedUser)?.createdAt)}</span>
                  </div>
                  <div className="stat-item">
                    <Mail size={16} />
                    <span>Email: {users.find(u => u._id === selectedUser)?.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="user-actions">
                <h3>Actions</h3>
                <div className="actions-grid">
                  <button className="action-btn primary">
                    <Shield size={16} />
                    <span>Make Admin</span>
                  </button>
                  
                  <button className="action-btn warning">
                    <Ban size={16} />
                    <span>Suspend</span>
                  </button>
                  
                  <button className="action-btn danger">
                    <UserX size={16} />
                    <span>Ban</span>
                  </button>
                  
                  <button className="action-btn secondary">
                    <Mail size={16} />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;