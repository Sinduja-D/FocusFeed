import React, { useState } from 'react';
import '../styles/components/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferenceContext';
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
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: Home, label: 'Home', href: '/home' },
    { icon: Search, label: 'Discover', href: '/discover' },
    { icon: Users, label: 'Communities', href: '/communities' },
    { icon: Plus, label: 'Create', href: '/create' },
    { icon: Users2, label: 'Collaborations', href: '/collaborations' },
    { icon: Bell, label: 'Alerts', href: '/notifications' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <span className="brand-name">FOCUSFEED</span>
          </Link>
        </div>
        
        <div className="navbar-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="nav-link"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="navbar-right">
          <div className="user-menu">
            <Link to="/profile" className="user-avatar">
              {auth.user ? (
                <img 
                  src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=2563eb&color=fff`} 
                  alt={auth.user.name} 
                />
              ) : (
                <User size={24} />
              )}
            </Link>
            
            <div className="user-dropdown">
              <div className="user-info">
                {auth.user ? (
                  <>
                    <div className="user-name">{auth.user.name}</div>
                    <div className="user-email">{auth.user.email}</div>
                  </>
                ) : (
                  <div className="guest-text">Guest</div>
                )}
              </div>
              
              <div className="dropdown-divider"></div>
              
              <Link to="/profile" className="dropdown-item">
                <User size={16} />
                <span>Profile</span>
              </Link>
              
              <Link to="/settings/privacy" className="dropdown-item">
                <Settings size={16} />
                <span>Privacy</span>
              </Link>
              
              <Link to="/safety" className="dropdown-item">
                <Bell size={16} />
                <span>Safety</span>
              </Link>
              
              <div className="dropdown-divider"></div>
              
              <button onClick={handleLogout} className="dropdown-item logout">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;