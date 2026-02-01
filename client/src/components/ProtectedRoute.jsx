import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. If we are still checking local storage, show a spinner (or nothing)
  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>Loading...</div>;
  }

  // 2. If check is done and no user found, redirect to Login
  if (!user) {
    return <Navigate to="/" />;
  }

  // 3. If user exists, show the page
  return children;
};

export default ProtectedRoute;