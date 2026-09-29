import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { auth } = useAuth();
  
  if (!auth.token || auth.user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default AdminRoute;