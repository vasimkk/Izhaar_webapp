import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../utils/api";

const GuestRoute = ({ children }) => {
  const { accessToken, isAuthLoading } = useAuth();
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
          // 1. Agreement check
          const agreeRes = await api.get("/user-agreement/status");
          if (!agreeRes.data?.agreed) {
            setContent(<Navigate to="/welcome" replace />);
            return;
          }

          // 2. Profile check
          try {
            const profileRes = await api.get("/profile/me");
            const profileData = profileRes.data.profile || profileRes.data;
            const hasProfile = profileData && (profileData.id || profileData._id);
            const isProfileComplete = hasProfile && profileData.mobile && profileData.gender;

            if (isProfileComplete) {
              // 3. Template check
              try {
                const templateRes = await api.get("/user/template-history");
                const historyData = templateRes.data;
                const historyList = Array.isArray(historyData) ? historyData
                  : (Array.isArray(historyData?.history) ? historyData.history
                    : (Array.isArray(historyData?.templates) ? historyData.templates
                      : (Array.isArray(historyData?.data) ? historyData.data : [])));

                if (historyList && historyList.length > 0) {
                  setContent(<Navigate to="/user/dashboard" replace />);
                } else {
                  setContent(<Navigate to="/user/select-template" replace />);
                }
                return;
              } catch {
                setContent(<Navigate to="/user/select-template" replace />);
                return;
              }
            }
          } catch {
            // Profile not found
          }
          setContent(<Navigate to="/profile" replace />);
        } catch {
          setContent(<Navigate to="/welcome" replace />);
        }
      } else {
        setContent(children);
      }
    };

    checkUserStatus();
  }, [accessToken, isAuthLoading, children]);

  if (isAuthLoading || !content) {
    return (
      <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return content;
};

export default GuestRoute;