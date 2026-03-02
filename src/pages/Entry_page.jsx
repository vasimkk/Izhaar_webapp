import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import couplePose from "../assets/images/C.png";
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";

import 'react-toastify/dist/ReactToastify.css';
import api from "../utils/api";
import { setAccessToken, setRefreshToken } from "../utils/tokenStore";
export default function Entry() {
  const navigate = useNavigate();
  const auth = useAuth();
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

    // Check periodically for 15 seconds
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
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential: idToken } = credentialResponse;

      const res = await api.post("/googleLogin", { idToken });

      const { accessToken, refreshToken, role } = res.data;

      // 1️⃣ Save tokens
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      if (auth?.setAccessToken) auth.setAccessToken(accessToken);
      if (auth?.setRefreshToken) await auth.setRefreshToken(refreshToken);

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // 2️⃣ Resolve role (same as password login)
      let roleValue = role || null;
      if (!roleValue && accessToken) {
        try {
          const payload = JSON.parse(
            atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
          );
          roleValue = payload.role;
        } catch (e) {
          console.error("Failed to decode JWT role:", e);
        }
      }

      if (roleValue) setRoleAndStore(roleValue);

      console.log("[Google Login] Effective role:", roleValue);

      // 3️⃣ Admin redirect
      if (roleValue?.toLowerCase().trim() === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // 4️⃣ Agreement check
      try {
        const agreeRes = await api.get("/user-agreement/status");
        if (!agreeRes.data?.agreed) {
          navigate("/welcome", { replace: true });
          return;
        }

        // 5️⃣ Profile check
        try {
          const profileRes = await api.get("/profile/me");
          const profileData = profileRes.data.profile || profileRes.data;
          const hasProfile = profileData && (profileData.id || profileData._id);
          const isProfileComplete = hasProfile && profileData.mobile && profileData.gender;

          if (isProfileComplete) {
            try {
              const templateRes = await api.get("/user/template-history");
              const historyData = templateRes.data;
              // Robust checking for array in various response locations
              const historyList = Array.isArray(historyData) ? historyData
                : (Array.isArray(historyData?.history) ? historyData.history
                  : (Array.isArray(historyData?.templates) ? historyData.templates
                    : (Array.isArray(historyData?.data) ? historyData.data : [])));

              if (historyList && historyList.length > 0) {
                navigate("/user/dashboard", { replace: true });
              } else {
                navigate("/user/select-template", { replace: true });
              }
              return;
            } catch {
              navigate("/user/select-template", { replace: true });
              return;
            }
          }
        } catch {
          // Profile not found
        }
        navigate("/profile", { replace: true });
      } catch {
        navigate("/welcome", { replace: true });
      }

    } catch (err) {
      console.error("Google login error:", err);
      // toast.error("Google login failed", { position: "top-center" });
    }
  };





  const handleGoogleError = () => {
    toast.error('Google login failed', { position: 'top-center' });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden " style={{ background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)' }}>
      <ToastContainer />

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed top-20 left-4 right-4 z-[100] bg-gray-900/90 backdrop-blur-xl border border-pink-500/30 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between animate-bounce-in ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#EC4899] to-[#A855F7] rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
              ❤️
            </div>
            <div>
              <h4 className="font-extrabold text-white leading-tight">Install Izhaar App</h4>
              <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Premium Mobile Experience</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={dismissBanner}
              className="px-3 py-2 text-gray-300 text-xs font-bold hover:bg-white/10 rounded-lg transition"
            >
              LATER
            </button>
            <button
              onClick={handleInstallClick}
              className="px-5 py-2 bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white rounded-xl text-xs font-black shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter"
            >
              INSTALL NOW
            </button>
          </div>
        </div>
      )}

      {/* Mobile Back Button */}
      <button
        onClick={() => navigate("/")}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5 text-white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Gradient Background - Light Theme */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: '#000'
        }}
      >
        {/* Animated gradient overlay for depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 35%, rgba(236, 72, 153, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 85%, rgba(168, 85, 247, 0.15) 0%, transparent 40%)',
            animation: 'float 15s ease-in-out infinite'
          }}
        />
      </div>





      {/* Two Column Layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-start py-12 lg:justify-center min-h-screen px-4 sm:px-6 md:px-8 lg:py-0 gap-6 md:gap-8 lg:gap-12 relative" style={{ zIndex: 1 }}>

        {/* Left Side - Couple Image with Rose Gold glow */}
        <div className="hidden md:flex flex-1 items-center justify-center w-full">
          <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg flex items-center justify-center">
            {/* Animated orbiting glow particles */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', inset: 0 }}>
              <div
                style={{
                  position: 'absolute',
                  width: '30px',
                  height: '30px',
                  background: 'radial-gradient(circle, rgba(233, 30, 99, 0.5), transparent)',
                  borderRadius: '50%',

                  top: '50%',
                  left: '50%',
                  filter: 'blur(8px)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '20px',
                  height: '20px',
                  background: 'radial-gradient(circle, rgba(156, 39, 176, 0.4), transparent)',
                  borderRadius: '50%',
                  top: '50%',
                  left: '50%',
                  filter: 'blur(8px)',
                }}
              />
            </div>

            {/* Gradient glow effect */}
            <div
              className="absolute w-96 h-96 rounded-full opacity-15 blur-3xl"
              style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                animation: 'pulse 4s ease-in-out infinite, glow 3s ease-in-out infinite'
              }}
            />
            {/* Couple Image */}
            <img
              src={couplePose}
              alt="Couple"
              className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(233, 30, 99, 0.2))'
              }}
            />
          </div>
        </div>

        {/* Right Side - Entry Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.3)] relative overflow-hidden">
            {/* Soft Romantic Gradients - Matching QuizLobby */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full"></div>
            {/* Mobile Back Button */}


            <div className="mb-6 sm:mb-8 text-center" style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}>
              <h2
                className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 tracking-tight font-serif italic drop-shadow-sm mb-2"
                style={{
                  animation: 'textGlow 3s ease-in-out infinite'
                }}
              >
                Welcome to Izhaar
              </h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
                Share your feelings — safely, respectfully, your way.
              </p>
            </div>

            {/* GOOGLE BUTTON */}
            <div
              className="w-full mb-4 sm:mb-5"
              style={{ animation: 'fadeInUp 1s ease-out 0.5s both' }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="large"
                theme="filled_black"
                shape="pill"
              />
            </div>

            <div className="relative flex items-center py-4 sm:py-5" style={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}>
              <div className="flex-grow border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}></div>
              <span className="flex-shrink mx-3 sm:mx-4 text-gray-400 text-xs font-semibold uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}></div>
            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <button
              className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-center space-x-2 transition-all text-sm sm:text-base uppercase tracking-wider border border-white/20 mb-4 sm:mb-5"
              style={{
                animation: 'fadeInUp 1s ease-out 0.7s both'
              }}
              onClick={() => navigate("/login")}
            >
              <span>Sign in</span>
              <FaArrowRight className="text-sm" />
            </button>

            {/* SIGN IN LINK */}
            <div
              className="flex justify-center items-center gap-2 sm:gap-2.5"
              style={{ animation: 'fadeInUp 1s ease-out 0.8s both' }}
            >
              <span className="text-gray-300 text-md sm:text-md">New to Izhaar?</span>
              <button
                className="font-bold text-xs sm:text-sm underline transition-all duration-300 hover:scale-110 relative"
                style={{
                  background: 'linear-gradient(to right, #ec4899, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
                onClick={() => navigate("/register")}
              >
                Join now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(5deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes continuousFloat {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            transform: translateY(-50vh) translateX(30px) rotate(180deg) scale(1);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-120vh) translateX(-20px) rotate(360deg) scale(0.7);
            opacity: 0;
          }
        }
        @keyframes heartFloat0 {
          0% { transform: translateY(100vh) translateX(0px) scale(0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-100vh) translateX(50px) scale(1); opacity: 0; }
        }
        @keyframes heartFloat1 {
          0% { transform: translateY(100vh) translateX(0px) scale(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.35; }
          90% { opacity: 0.25; }
          100% { transform: translateY(-100vh) translateX(-60px) scale(1) rotate(360deg); opacity: 0; }
        }
        @keyframes heartFloat2 {
          0% { transform: translateY(100vh) translateX(0px) scale(0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-100vh) translateX(80px) scale(1); opacity: 0; }
        }
        @keyframes heartFloat3 {
          0% { transform: translateY(100vh) translateX(0px) scale(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.32; }
          90% { opacity: 0.22; }
          100% { transform: translateY(-100vh) translateX(-70px) scale(1) rotate(-360deg); opacity: 0; }
        }
        @keyframes floatImage {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          25% { transform: translateY(-15px) translateX(-5px) scale(1.02); }
          50% { transform: translateY(-25px) translateX(5px) scale(1.03); }
          75% { transform: translateY(-10px) translateX(-3px) scale(1.02); }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(233, 30, 99, 0.3), inset 0 0 20px rgba(156, 39, 176, 0.1); }
          50% { box-shadow: 0 0 40px rgba(233, 30, 99, 0.5), inset 0 0 30px rgba(156, 39, 176, 0.2); }
        }
        @keyframes orbitFloat {
          0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
        @keyframes buttonHoverPulse {
          0%, 100% { box-shadow: 0 4px 15px rgba(233, 30, 99, 0.4); }
          50% { box-shadow: 0 8px 30px rgba(233, 30, 99, 0.8), 0 0 20px rgba(233, 30, 99, 0.6); }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(233, 30, 99, 0), 0 0 20px rgba(156, 39, 176, 0); }
          50% { text-shadow: 0 0 10px rgba(233, 30, 99, 0.5), 0 0 20px rgba(156, 39, 176, 0.3); }
        }
        .gradient-text {
          background: linear-gradient(135deg, #EC4899 0%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Sparkle Animations */



      `}</style>
    </div>
  );
}