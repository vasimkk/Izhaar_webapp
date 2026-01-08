import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const GuestRoute = ({ children }) => {
  const { accessToken, isAuthLoading } = useAuth();
  const location = useLocation();

  // Prevent back navigation to auth pages after login
  useEffect(() => {
    if (accessToken) {
      // Clear history stack to prevent going back
      window.history.replaceState(null, '', window.location.href);
      
      // Block back navigation
      const handlePopState = (e) => {
        window.history.pushState(null, '', window.location.href);
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [accessToken]);

  if (isAuthLoading) return <div>Loading...</div>;

  if (accessToken) {
    // Redirect to dashboard if already logged in
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
