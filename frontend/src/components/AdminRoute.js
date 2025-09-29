import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.user.role !== 'ADMIN') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
