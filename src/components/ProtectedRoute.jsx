// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) return <div className="text-center mt-5">Loading...</div>;

  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
