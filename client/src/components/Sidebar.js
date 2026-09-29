import React from 'react';
import '../styles/components/Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Users, 
  Plus, 
  Users2, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', href: '/home' },
    { icon: Search, label: 'Discover', href: '/discover' },
    { icon: Users, label: 'Communities', href: '/communities' },
    { icon: Plus, label: 'Create', href: '/create' },
    { icon: Users2, label: 'Collaborations', href: '/collaborations' },
    { icon: Bell, label: 'Alerts', href: '/notifications' },
  ];

  const settingsItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Privacy', href: '/settings/privacy' },
    { icon: Bell, label: 'Safety Center', href: '/safety' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Main</h3>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="sidebar-section">
          <h3 className="sidebar-title">Settings</h3>
          <nav className="sidebar-nav">
            {settingsItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;