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
    // Check if app is already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    const checkPrompt = () => {
      if (window.deferredPrompt) {
        setDeferredPrompt(window.deferredPrompt);
        setShowInstallBanner(true);
        return true;
      }
      return false;
    };

    // If dismissed in this session, don't show
    if (sessionStorage.getItem('pwa_dismissed') === 'true') {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
      window.deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Initial check
    checkPrompt();

    // Check periodically for 15 seconds (some systems fire late)
    const interval = setInterval(() => {
      if (checkPrompt()) clearInterval(interval);
    }, 2000);

    const timeout = setTimeout(() => clearInterval(interval), 15000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (!promptEvent) {
      alert("To install: Open Browser Menu (3 dots) and select 'Install app' or 'Add to Home Screen'");
      return;
    }

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      window.deferredPrompt = null;
    }
    setShowInstallBanner(false);
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('pwa_dismissed', 'true');
  };

  /* =========================================================
     4️⃣ LOADING STATE
     ========================================================= */
  if (checking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)' }}>
        <div className="text-white text-xl font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <UserLayout showHeader={true}>
      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed top-20 left-4 right-4 z-[100] bg-white/95 backdrop-blur-xl border-2 border-purple-400/30 p-4 rounded-2xl shadow-[0_20px_50px_rgba(156,39,176,0.3)] flex items-center justify-between animate-bounce-in ring-4 ring-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
              ❤️
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 leading-tight">Install Izhaar App</h4>
              <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest">Premium Mobile Experience</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={dismissBanner}
              className="px-3 py-2 text-gray-500 text-xs font-bold hover:bg-gray-100 rounded-lg transition"
            >
              LATER
            </button>
            <button
              onClick={handleInstallClick}
              className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-xs font-black shadow-xl shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter"
            >
              INSTALL NOW
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
