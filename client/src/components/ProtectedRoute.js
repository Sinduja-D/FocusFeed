import React from 'react';
import '../styles/components/ProtectedRoute.css';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  
  if (!auth.token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute;
