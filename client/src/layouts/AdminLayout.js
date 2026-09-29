import React from 'react';
import '../styles/layouts/AdminLayout.css';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-container">
        <AdminSidebar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;