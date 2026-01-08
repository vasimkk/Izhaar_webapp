import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { accessToken, role, isAuthLoading } = useAuth();
  const location = useLocation();

  // Prevent back navigation to login/auth pages after successful login
  useEffect(() => {
    if (accessToken) {
      // Clear history stack to prevent going back to login
      window.history.replaceState(null, '', window.location.href);
      
      // Block back navigation to auth pages
      const handlePopState = (e) => {
        const currentPath = window.location.pathname;
        // If trying to go back to auth pages, prevent it
        if (currentPath.includes('/login') || currentPath.includes('/register') || 
            currentPath.includes('/otp') || currentPath.includes('/forgot-password')) {
          window.history.pushState(null, '', window.location.href);
          // Force redirect to dashboard
          window.location.href = '/user/dashboard';
        } else {
          window.history.pushState(null, '', window.location.href);
        }
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [accessToken]);

  if (isAuthLoading) return <div>Loading...</div>;

  if (!accessToken) {
    return <Navigate to="/entry" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
