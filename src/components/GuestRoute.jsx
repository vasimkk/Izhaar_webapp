import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../utils/api";

const GuestRoute = ({ children }) => {
  const { accessToken, isAuthLoading } = useAuth();
  const location = useLocation();
  const [content, setContent] = useState(null);

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

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isAuthLoading) return;

      if (accessToken) {
        try {
          const templateRes = await api.get("/user/template-history");
          const historyData = templateRes.data;
          const historyList = Array.isArray(historyData) ? historyData : (historyData?.history || historyData?.templates || historyData?.data || []);

          if (historyList && historyList.length > 0) {
            setContent(<Navigate to="/user/dashboard" replace />);
          } else {
            setContent(<Navigate to="/user/select-template" replace />);
          }
        } catch {
          setContent(<Navigate to="/user/select-template" replace />);
        }
      } else {
        setContent(children);
      }
    };

    checkUserStatus();
  }, [accessToken, isAuthLoading, children]);

  if (isAuthLoading) return <div>Loading...</div>;
  if (!content) return <div>Loading...</div>;

  return content;
};

export default GuestRoute;
