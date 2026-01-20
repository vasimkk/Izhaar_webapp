import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserLayout from "./UserLayout";
import SlideSection from "./SlideSection";
import FeaturesSection from "./FeaturesSection";
import OurServices from "./OurServices";
import Magazine from "../Magazines/Magazine";
import Gifts from "../Gifts";
import api from "../../../utils/api";
import { io } from "socket.io-client";
import { BASE_URL } from "../../../config/config";
import LetterSection from "./LetterSection";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);

  const handleNavigation = (path) => {
    navigate(path);
  };

  /* =========================================================
     1️⃣ ROUTE GUARD – onboarding / profile / template checks
     ========================================================= */
  useEffect(() => {
    let isMounted = true;

    const checkOnboardingComplete = async () => {
      try {
        // Agreement check
        const agreeRes = await api.get("/user-agreement/status");
        if (!agreeRes.data?.agreed) {
          navigate("/welcome", { replace: true });
          return;
        }

        // Profile check
        const profileRes = await api.get("/profile/me");
        const profileData = profileRes.data?.profile || profileRes.data;
        const hasProfile = profileData && (profileData.id || profileData._id);

        if (!hasProfile) {
          navigate("/profile", { replace: true });
          return;
        }

        // Store profile in state
        setCurrentUser(profileData);

        // Template check
        try {
          const templateRes = await api.get("/user/template-history");
          if (!templateRes.data || templateRes.data.length === 0) {
            navigate("/user/select-template", { replace: true });
            return;
          }
        } catch {
          navigate("/user/select-template", { replace: true });
          return;
        }

        // All good
        if (isMounted) setChecking(false);
      } catch (err) {
        if (err.response?.status === 404) {
          navigate("/profile", { replace: true });
        } else {
          console.error("Onboarding check failed:", err);
          if (isMounted) setChecking(false);
        }
      }
    };

    checkOnboardingComplete();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  /* =========================================================
     2️⃣ SOCKET INITIALIZATION & GLOBAL LISTENERS
     ========================================================= */
  useEffect(() => {
    if (!currentUser || !currentUser.user_id) return;

    const newSocket = io(BASE_URL, {
      query: { userId: currentUser.user_id },
    });
    setSocket(newSocket);

    // We can also centralize watch party invites here later if needed

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  /* =========================================================
     3️⃣ PREVENT BACK NAVIGATION TO AUTH / ONBOARDING
     ========================================================= */
  useEffect(() => {
    if (location.pathname !== "/user/dashboard") return;

    const handlePopState = () => {
      const path = window.location.pathname;

      const blocked =
        path.includes("/login") ||
        path.includes("/register") ||
        (path.includes("/profile") && !path.includes("/user/profile")) ||
        path.includes("/user/select-template") ||
        path.includes("/welcome");

      if (blocked) {
        window.history.pushState(null, "", "/user/dashboard");
        navigate("/user/dashboard", { replace: true });
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, navigate]);

  /* =========================================================
     4️⃣ LOADING STATE
     ========================================================= */
  if (checking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)' }}>
        <div className="text-[#2D1B4E] text-xl font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <UserLayout showHeader={true}>

      {/* Slide Section */}
      <div className="container-fuild ">
        <SlideSection />
      </div>

  {/* Our Services Section */}
      <OurServices />
      <LetterSection/>
      <Magazine/>

    </UserLayout>
  );
}
