import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../../../context/NotificationContext";
import UserLayout from "./UserLayout";
import SlideSection from "./SlideSection";
import ExpressWithGift from "./FeaturesSection";
import OurServices from "./OurServices";
import Magazine from "../Magazines/Magazine";
import api from "../../../utils/api";
import LetterSection from "./Lettersection";
import QuizInviteModal from "../Quiz/QuizInviteModal";
import { requestNotificationPermission } from "../../../utils/pushNotification";
import { PiQuotesFill } from "react-icons/pi";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const { activeInvite, setActiveInvite } = useNotifications();

  /* =========================================================
     1️⃣ ROUTE GUARD – onboarding / profile / template checks
     ========================================================= */
  useEffect(() => {
    let isMounted = true;

    const checkOnboardingComplete = async () => {
      try {
        const agreeRes = await api.get("/user-agreement/status");
        if (!agreeRes.data?.agreed) {
          navigate("/welcome", { replace: true });
          return;
        }

        try {
          const profileRes = await api.get("/profile/me");
          const profileData = profileRes.data.profile || profileRes.data;
          const isProfileComplete = profileData && profileData.mobile && profileData.gender;

          if (isProfileComplete) {
            if (isMounted) setCurrentUser(profileData);

            try {
              const templateRes = await api.get("/user/template-history");
              const historyData = templateRes.data;
              const historyList = Array.isArray(historyData) ? historyData
                : (Array.isArray(historyData?.history) ? historyData.history
                  : (Array.isArray(historyData?.templates) ? historyData.templates
                    : (Array.isArray(historyData?.data) ? historyData.data : [])));

              if (historyList && historyList.length > 0) {
                if (isMounted) {
                  setChecking(false);
                  requestNotificationPermission();
                }
                return;
              } else {
                navigate("/user/select-template", { replace: true });
                return;
              }
            } catch {
              navigate("/user/select-template", { replace: true });
              return;
            }
          }
        } catch { }
        navigate("/profile", { replace: true });
      } catch (err) {
        navigate("/welcome", { replace: true });
      }
    };

    checkOnboardingComplete();
    return () => { isMounted = false; };
  }, [location.pathname, navigate]);

  /* =========================================================
     2️⃣ PWA INSTALLATION LOGIC
     ========================================================= */
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    if (sessionStorage.getItem('pwa_dismissed') === 'true') return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
      window.deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (!promptEvent) return;
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      window.deferredPrompt = null;
    }
    setShowInstallBanner(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c]">
        <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <UserLayout showHeader={true}>
      <div className="text-white selection:bg-pink-500/30 relative z-10">

        {/* PWA Install Banner */}
        {showInstallBanner && (
          <div className="fixed top-20 left-4 right-4 z-[100] bg-white/95 backdrop-blur-xl border-2 border-purple-400/30 p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">❤️</div>
              <div>
                <h4 className="font-extrabold text-gray-900 leading-tight">Install Izhaar App</h4>
                <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest">Premium Mobile Experience</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInstallBanner(false)}
                className="px-3 py-2 text-gray-500 text-xs font-bold hover:bg-gray-100 rounded-lg transition"
              >
                LATER
              </button>
              <button
                onClick={handleInstallClick}
                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-xs font-black shadow-xl"
              >
                INSTALL
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="w-full">
          <SlideSection />
        </div>

        <div className="max-w-4xl mx-auto pb-24">

          {/* New Modern Bento Grid Section */}
          <section>
            <OurServices />
          </section>





          {/* Magazine Section */}

        </div>
      </div>

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
