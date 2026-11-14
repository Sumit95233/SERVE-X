import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const token = localStorage.getItem('servex_token');
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const RoleGuard = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('servex_token');
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ attempted: location.pathname, requiredRoles: allowedRoles }}
        replace
      />
    );
  }

  return <Outlet />;
};

