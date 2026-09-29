import React, { useState, useEffect } from 'react';
import '../styles/admin/AdminReports.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Flag, 
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  MessageSquare,
  X
} from 'lucide-react';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reports', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.data.reports || []);
      } else {
        toast.error('Failed to load reports');
      }
    } catch (error) {
      toast.error('An error occurred while loading reports');
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

  const handleReportAction = (action, reportId) => {
    setSelectedReport(reportId);
    setShowReportModal(true);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reportedBy.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'pending') {
      return matchesSearch && report.status === 'pending';
    }
    
    if (filter === 'resolved') {
      return matchesSearch && report.status === 'resolved';
    }
    
    if (filter === 'harassment') {
      return matchesSearch && report.reason === 'Harassment';
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getReportBadge = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending', class: 'warning' };
      case 'resolved':
        return { text: 'Resolved', class: 'success' };
      case 'rejected':
        return { text: 'Rejected', class: 'danger' };
      default:
        return { text: 'Unknown', class: 'normal' };
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-reports">
      <div className="admin-header">
        <h1>Reports Management</h1>
        <p>Review and resolve user reports</p>
      </div>

      <div className="reports-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} />
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="harassment">Harassment</option>
          </select>
        </div>
      </div>

      <div className="reports-stats">
        <div className="stat-card">
          <Flag size={20} />
          <div>
            <span className="stat-value">{reports.length}</span>
            <span className="stat-label">Total Reports</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Clock size={20} />
          <div>
            <span className="stat-value">{reports.filter(r => r.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        
        <div className="stat-card">
          <CheckCircle size={20} />
          <div>
            <span className="stat-value">{reports.filter(r => r.status === 'resolved').length}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
        
        <div className="stat-card">
          <XCircle size={20} />
          <div>
            <span className="stat-value">{reports.filter(r => r.status === 'rejected').length}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>
      </div>

      <div className="reports-table">
        <table>
          <thead>
            <tr>
              <th>Report</th>
              <th>Reporter</th>
              <th>Reported Post</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => {
              const reportBadge = getReportBadge(report.status);
              
              return (
                <tr key={report._id}>
                  <td>
                    <div className="report-preview">
                      <div className="report-content">
                        <p>{report.post.content.substring(0, 100)}...</p>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="reporter-info">
                      <div className="reporter-avatar">
                        <img 
                          src={report.reportedBy.profileImage || `https://ui-avatars.com/api/?name=${report.reportedBy.name}&background=087f75&color=fff`}
                          alt={report.reportedBy.name}
                        />
                      </div>
                      <div>
                        <div className="reporter-name">{report.reportedBy.name}</div>
                        <div className="report-date">{formatDate(report.createdAt)}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="post-info">
                      <div className="post-author">{report.post.author.name}</div>
                      <div className="post-date">{formatDate(report.post.createdAt)}</div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="report-reason">{report.reason}</div>
                  </td>
                  
                  <td>
                    <div className="report-date">{formatDate(report.createdAt)}</div>
                  </td>
                  
                  <td>
                    <div className={`status-badge ${reportBadge.class}`}>
                      {reportBadge.text}
                    </div>
                  </td>
                  
                  <td>
                    <div className="report-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleReportAction('view', report._id)}
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button 
                        className="action-btn"
                        onClick={() => handleReportAction('resolve', report._id)}
                      >
                        <CheckCircle size={16} />
                      </button>
                      
                      <button 
                        className="action-btn"
                        onClick={() => handleReportAction('reject', report._id)}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div className="empty-state">
          <h3>No reports found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showReportModal && selectedReport && (
        <div className="report-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Report Details</h2>
              <button onClick={() => setShowReportModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="report-details">
                {reports.find(r => r._id === selectedReport) && (
                  <>
                    <div className="report-header">
                      <div className="reporter-info">
                        <div className="reporter-avatar">
                          <img 
                            src={reports.find(r => r._id === selectedReport).reportedBy.profileImage || `https://ui-avatars.com/api/?name=${reports.find(r => r._id === selectedReport).reportedBy.name}&background=087f75&color=fff`}
                            alt={reports.find(r => r._id === selectedReport).reportedBy.name}
                          />
                        </div>
                        <div>
                          <h3>{reports.find(r => r._id === selectedReport).reportedBy.name}</h3>
                          <p>{formatDate(reports.find(r => r._id === selectedReport).createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="post-preview">
                      <h4>Reported Post</h4>
                      <p>{reports.find(r => r._id === selectedReport).post.content}</p>
                      <div className="post-author">
                        <img 
                          src={reports.find(r => r._id === selectedReport).post.author.profileImage || `https://ui-avatars.com/api/?name=${reports.find(r => r._id === selectedReport).post.author.name}&background=2563eb&color=fff`} 
                          alt={reports.find(r => r._id === selectedReport).post.author.name} 
                        />
                        <span>{reports.find(r => r._id === selectedReport).post.author.name}</span>
                      </div>
                    </div>
                    
                    <div className="report-reason">
                      <h4>Report Reason</h4>
                      <p>{reports.find(r => r._id === selectedReport).reason}</p>
                      {reports.find(r => r._id === selectedReport).description && (
                        <p>{reports.find(r => r._id === selectedReport).description}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div className="report-actions">
                <h3>Actions</h3>
                <div className="actions-grid">
                  <button className="action-btn success">
                    <CheckCircle size={16} />
                    <span>Resolve</span>
                  </button>
                  
                  <button className="action-btn danger">
                    <XCircle size={16} />
                    <span>Reject</span>
                  </button>
                  
                  <button className="action-btn warning">
                    <Clock size={16} />
                    <span>Mark as Under Review</span>
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

export default AdminReports;