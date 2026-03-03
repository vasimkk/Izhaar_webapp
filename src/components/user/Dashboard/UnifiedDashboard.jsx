import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../../../context/NotificationContext";
import UserLayout from "./UserLayout";

import ExpressWithGift from "./FeaturesSection";
import OurServices from "./OurServices";
import ValentineMarquee from "./ValentineMarquee";
import ValentineAd from "./ValentineAd";
import ValentineLiveFeed from "./ValentineLiveFeed";
import MagazineSection from "./MagazineSection";
import LoveCardFeaturedSection from "./LoveCardFeaturedSection";
import api from "../../../utils/api";
import LetterSection from "./Lettersection";
import SuccessStories from "./SuccessStories";
import PromoBanner from "./PromoBanner";
import ActivityTrackerSection from "./ActivityTrackerSection";
import QuizInviteModal from "../Quiz/QuizInviteModal";



import { requestNotificationPermission } from "../../../utils/pushNotification";
import { PiQuotesFill } from "react-icons/pi";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSingleMode, setIsSingleMode] = useState(true);
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
            if (isMounted) {
              setCurrentUser(profileData);
              setChecking(false);
              requestNotificationPermission();
            }
            return;
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
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-2 border-pink-500 rotate-45 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 bg-pink-500/50" />
        </div>
      </div>
    );
  }

  return (
    <UserLayout showHeader={true}>
      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(-30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-10deg); }
        }
        .animate-premium-in {
          animation: slideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        @keyframes textLoop {
          0%, 20% { transform: translateY(0); }
          25%, 45% { transform: translateY(-25%); }
          50%, 70% { transform: translateY(-50%); }
          75%, 95% { transform: translateY(-75%); }
          100% { transform: translateY(0); }
        }
        @keyframes labelLoop {
          0%, 40% { transform: translateY(0); }
          50%, 90% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-knob-text {
          animation: textLoop 4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        .animate-label-text {
          animation: labelLoop 3s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
      <div className="text-white selection:bg-pink-500/30 relative z-10">

        {/* PWA Install Banner - Boutique Style */}
        {showInstallBanner && (
          <div className="fixed top-24 left-6 right-6 z-[100] bg-black border border-pink-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-premium-in">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-900 flex items-center justify-center text-white text-3xl">❤️</div>
              <div>
                <h4 className="dashboard-head-text text-xl  tracking-widest text-wrap">The Signature App</h4>
                <p className="dashboard-subtext text-[10px] tracking-[0.2em]">Luxe Mobile Access</p>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={() => setShowInstallBanner(false)}
                className="flex-1 md:flex-none px-8 py-3 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition"
              >
                DISMISS
              </button>
              <button
                onClick={handleInstallClick}
                className="dashboard-button flex-1 md:flex-none px-8"
              >
                INSTALL
              </button>
            </div>
          </div>
        )}



        {/* Valentine Marquee */}
        {/* <ValentineMarquee /> */}

        {/* Dedicated Valentine Offer Ad Section */}
        {/* <ValentineAd /> */}

        {/* Live Activity Feed */}
        {/* <ValentineLiveFeed /> */}

        <div className="max-w-6xl mx-auto pb-48">

          {/* SIGNATURE COLLECTION */}
          <section className="mb-40">
            <OurServices />
          </section>

          {/* ART OF GIFTING */}
          {/* <section className="mb-40">
            <ExpressWithGift />
          </section> */}

          {/* SPECIAL FEATURE: LOVE CARD */}
          {/* <section className="mb-40">
            <LoveCardFeaturedSection />
          </section> */}

          {/* <ValentineMarquee />
          <PromoBanner />
          <ActivityTrackerSection />
          <SuccessStories /> */}

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
