import React from 'react';
import '../styles/components/MobileBottomNav.css';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  SlidersHorizontal,
  Users, 
  Plus, 
  Users2, 
  Bell, 
  User 
} from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', href: '/home' },
    { icon: SlidersHorizontal, label: 'Interests', href: '/interests/setup' },
    { icon: Plus, label: 'Create', href: '/create' },
    { icon: Users2, label: 'Collaborations', href: '/collaborations' },
    { icon: Bell, label: 'Alerts', href: '/notifications' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-nav-container">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`mobile-nav-item ${isActive(item.href) ? 'active' : ''}`}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;