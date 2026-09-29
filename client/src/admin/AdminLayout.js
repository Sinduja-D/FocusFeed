import React from 'react';
import '../styles/layouts/AdminLayout.css';
import { Link, useLocation } from 'react-router-dom';

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
  TrendingUp,
  Clock,
  Gavel
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/users', icon: Users2, label: 'Users' },
    { path: '/admin/posts', icon: FileText, label: 'Posts' },
    { path: '/admin/reports', icon: Flag, label: 'Reports' },
    { path: '/admin/moderation', icon: Shield, label: 'Moderation' },
    { path: '/admin/fake-accounts', icon: Eye, label: 'Fake Accounts' },
    { path: '/admin/engagement', icon: TrendingUp, label: 'Engagement' },
    { path: '/admin/collaborations', icon: Target, label: 'Collaborations' },
    { path: '/admin/appeals', icon: Gavel, label: 'Appeals' },
    { path: '/admin/safety', icon: AlertTriangle, label: 'Safety' }
  ];

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h1>FocusFeed Admin</h1>
        </div>
        
        <nav className="admin-nav">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="admin-footer">
          <p>FocusFeed Admin Panel</p>
          <p>© 2023 FocusFeed</p>
        </div>
      </div>
      
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <h1>Admin Panel</h1>
            <p>Welcome back, Admin!</p>
          </div>
        </header>
        
        <main className="admin-content">
  {children}
</main>
      </div>
    </div>
  );
};

export default AdminLayout;