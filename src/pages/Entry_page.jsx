import { useState, useEffect } from "react";
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#581C87] via-[#312E81] to-[#1E3A8A]">
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
          background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
          animation: 'gradientShift 15s ease infinite'
        }}
      >
        {/* Animated gradient overlay for depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
      </div>

      {/* ✨ SPARKLES & STARS LAYER ✨ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Random twinkling stars */}
        {[...Array(60)].map((_, i) => {
          const colors = ['#EC4899', '#A855F7', '#3B82F6', '#FACC15', '#FFFFFF', '#F472B6'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: randomColor,
                '--sparkle-color': randomColor,
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: 0,
                animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          );
        })}

        {/* Shooting Stars */}
        <div className="shooting-star" style={{ top: '15%', left: '20%', animationDelay: '0s' }}></div>
        <div className="shooting-star" style={{ top: '35%', left: '60%', animationDelay: '4s' }}></div>
        <div className="shooting-star" style={{ top: '75%', left: '10%', animationDelay: '7s' }}></div>
        <div className="shooting-star" style={{ top: '55%', left: '85%', animationDelay: '2.5s' }}></div>
      </div>

      {/* Animated floating hearts - Visible layer with different colors */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {[...Array(25)].map((_, i) => {
          // Different heart colors
          const colors = [
            { fill: 'rgba(233, 30, 99, 0.7)', stroke: 'rgba(233, 30, 99, 0.5)' },  // Pink
            { fill: 'rgba(156, 39, 176, 0.7)', stroke: 'rgba(156, 39, 176, 0.5)' }, // Purple
            { fill: 'rgba(255, 87, 34, 0.7)', stroke: 'rgba(255, 87, 34, 0.5)' },   // Orange
            { fill: 'rgba(244, 67, 54, 0.7)', stroke: 'rgba(244, 67, 54, 0.5)' },   // Red
            { fill: 'rgba(236, 64, 122, 0.7)', stroke: 'rgba(236, 64, 122, 0.5)' }, // Rose
          ];
          const colorIndex = i % colors.length;
          const color = colors[colorIndex];

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${40 + Math.random() * 80}px`,
                height: `${40 + Math.random() * 80}px`,
                opacity: 0.6,
                animation: `continuousFloat ${6 + Math.random() * 8}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`,
                left: `${Math.random() * 100}%`,
                bottom: '-150px'
              }}
            >
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: `drop-shadow(0 4px 8px ${color.stroke})` }}>
                <path
                  d="M50,85 C20,70 5,55 5,40 C5,25 15,15 25,15 C35,15 45,25 50,35 C55,25 65,15 75,15 C85,15 95,25 95,40 C95,55 80,70 50,85 Z"
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth="2"
                />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12 relative" style={{ zIndex: 1 }}>

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
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border rounded-3xl backdrop-blur-xl"
            style={{
              borderColor: 'rgba(236, 72, 153, 0.3)',
              background: 'rgba(0, 0, 0, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
              animation: 'glow 4s ease-in-out infinite'
            }}
          >
            <div className="mb-6 sm:mb-8 text-center" style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}>
              <h2
                className="text-4xl sm:text-5xl font-bold mb-2 sm:mb-3 gradient-text"
                style={{
                  animation: 'textGlow 3s ease-in-out infinite',
                  fontStyle: 'italic',
                  fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                  letterSpacing: '0.5px'
                }}
              >
                Welcome to Izhaar

              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Share your feelings — safely, respectfully, your way.              </p>
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
              className="w-full rounded-2xl px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 font-semibold text-sm sm:text-base md:text-base mb-4 sm:mb-5 transition-all shadow-lg text-white hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 50%, #EF4444 100%)',
                boxShadow: '0 4px 15px 0 rgba(236, 72, 153, 0.4)',
                animation: 'fadeInUp 1s ease-out 0.7s both'
              }}
              onClick={() => navigate("/login")}
              onMouseEnter={(e) => {
                e.target.style.animation = 'buttonHoverPulse 0.6s ease-in-out';
              }}
            >
              <span style={{ position: 'relative', zIndex: 2 }}>Sign in</span>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 0.5s ease',
                  zIndex: 1
                }}
                className="group-hover:translate-x-full"
              />
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
                  background: 'linear-gradient(to right, #7C3AED, #4F46E5, #2563EB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
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
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 12px 3px var(--sparkle-color); }
        }

        /* Shooting Star Animation */
        .shooting-star {
          position: absolute;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%);
          transform: rotate(-45deg) translateX(-100px);
          opacity: 0;
          animation: shootingStar 6s linear infinite;
          box-shadow: 0 0 10px 1px rgba(255, 255, 255, 0.5);
        }

        @keyframes shootingStar {
          0% {
            transform: rotate(-45deg) translateX(-100px);
            opacity: 0;
          }
          10% {
             opacity: 1;
          }
          20% {
            transform: rotate(-45deg) translateX(calc(100vw + 100px));
            opacity: 0;
          }
          100% {
            transform: rotate(-45deg) translateX(calc(100vw + 100px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}