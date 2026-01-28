import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../../../context/NotificationContext";
import UserLayout from "./UserLayout";
import SlideSection from "./SlideSection";
import FeaturesSection from "./FeaturesSection";
import OurServices from "./OurServices";
import Magazine from "../Magazines/Magazine";
import Gifts from "../Gifts";
import api from "../../../utils/api";
import LetterSection from "./LetterSection";
import QuizInviteModal from "../Quiz/QuizInviteModal";
import { registerPushNotification, requestNotificationPermission } from "../../../utils/pushNotification";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const { activeInvite, setActiveInvite } = useNotifications();

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
        if (isMounted) {
          setChecking(false);
          // Always ask for notification permission when entering dashboard
          requestNotificationPermission();
        }
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

  // Socket is now handled globally in NotificationContext

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
     5️⃣ PWA INSTALLATION LOGIC
     ========================================================= */
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User responded to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

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
      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed top-20 left-4 right-4 z-[100] bg-white/90 backdrop-blur-xl border border-purple-200 p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
              ❤️
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Install Izhaar</h4>
              <p className="text-xs text-gray-500">Add to your home screen for better experience</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInstallBanner(false)}
              className="px-3 py-2 text-gray-400 text-sm font-medium"
            >
              Later
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-purple-500/20"
            >
              Install
            </button>
          </div>
        </div>
      )}

      {/* Slide Section */}
      <div className="container-fuild ">
        <SlideSection />
      </div>

      {/* Our Services Section */}
      <OurServices />
      <LetterSection />
      <Magazine />

      {/* Real-time Quiz Invitation Modal */}
      {activeInvite && (
        <QuizInviteModal
          invite={activeInvite}
          onAccept={(roomId) => {
            navigate(`/user/quiz?roomId=${roomId}`);
            setActiveInvite(null);
          }}
          onDecline={() => setActiveInvite(null)}
        />
      )}

    </UserLayout>
  );
}
