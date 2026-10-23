import React from 'react';
import '../styles/layouts/MainLayout.css';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="main-container">
        <main className="main-content">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;