import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import couplePose from "../assets/images/C.png";
import { useAuth } from "../context/AuthContext";
import { setAccessToken, setRefreshToken } from "../utils/tokenStore";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper to store role
  const setRoleAndStore = (r) => {
    if (auth?.setRole) auth.setRole(r);
  };

  // Redirect if already logged in, now role-aware
  useEffect(() => {
    if (auth?.accessToken && auth?.role) {
      if (auth.role.toLowerCase().trim() === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    }

    // Prevent back navigation
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
      if (auth?.accessToken && auth?.role) {
        if (auth.role.toLowerCase().trim() === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
      }
    };

    return () => (window.onpopstate = null);
  }, [auth?.accessToken, auth?.role, navigate]);

  // Password validation
  const validatePassword = () => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 12) return "Password must be max 12 characters";
    if (!/[A-Za-z]/.test(password)) return "Must include letters (A–Z)";
    if (!/[0-9]/.test(password)) return "Must include numbers (0–9)";
    return null;
  };

  // Login function
  const loginUser = async (e) => {
    e.preventDefault();
    if (!username.trim()) return alert("Please enter mobile number or name");

    const error = validatePassword();
    if (error) return alert(error);

    setLoading(true);
    try {
      const res = await api.post("/auth/login-password", { username, password });

      // Save tokens
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      if (auth?.setAccessToken) auth.setAccessToken(res.data.accessToken);
      if (auth?.setRefreshToken) await auth.setRefreshToken(res.data.refreshToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;

      // Determine role from response or JWT
      let roleValue = res.data.role || null;
      if (!roleValue && res.data.accessToken) {
        try {
          const payload = JSON.parse(
            atob(res.data.accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
          );
          roleValue = payload.role;
        } catch (e) {
          console.error("Failed to decode JWT for role:", e);
        }
      }

      if (roleValue) setRoleAndStore(roleValue);
      console.log("[Login] Effective role:", `"${roleValue}"`);

      // Admin redirect
      if (roleValue && roleValue.toLowerCase().trim() === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // User flow
      try {
        const agreeRes = await api.get("/user-agreement/status");
        if (!agreeRes.data?.agreed) {
          navigate("/welcome", { replace: true });
          return;
        }

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
      console.error("Login error:", err);

      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        alert(
          "Connection timeout. Please check:\n1. Backend server is running\n2. Network connection\n3. Backend URL is correct"
        );
      } else if (
        err.code === "ERR_NETWORK" ||
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("ERR_CONNECTION")
      ) {
        alert("Cannot connect to server. Please check your backend and network.");
      } else if (err.response) {
        const errorMessage = err.response?.data?.message || `Login error: ${err.response.status}`;
        alert(errorMessage);
      } else {
        alert("Login error: " + (err.message || "Unknown error occurred"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#581C87] via-[#312E81] to-[#1E3A8A]">
      {/* Mobile Back Button */}
      <button
        onClick={() => navigate("/entry")}
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
          const colors = [
            { fill: 'rgba(233, 30, 99, 0.7)', stroke: 'rgba(233, 30, 99, 0.5)' },
            { fill: 'rgba(156, 39, 176, 0.7)', stroke: 'rgba(156, 39, 176, 0.5)' },
            { fill: 'rgba(255, 87, 34, 0.7)', stroke: 'rgba(255, 87, 34, 0.5)' },
            { fill: 'rgba(244, 67, 54, 0.7)', stroke: 'rgba(244, 67, 54, 0.5)' },
            { fill: 'rgba(236, 64, 122, 0.7)', stroke: 'rgba(236, 64, 122, 0.5)' },
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
        {/* Left Side - Couple Image */}
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
                  filter: 'blur(8px)'
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
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border rounded-3xl backdrop-blur-xl"
            style={{
              borderColor: 'rgba(236, 72, 153, 0.3)',
              background: 'rgba(0, 0, 0, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
              animation: 'glow 4s ease-in-out infinite'
            }}
            onSubmit={loginUser}
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
                Welcome Back
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Login to your account
              </p>
            </div>

            <div style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}>
              <label className="block text-sm sm:text-base text-gray-200 mb-2 font-medium">
                Mobile Number  <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                className="w-full mb-5 sm:mb-6 px-4 sm:px-5 rounded-2xl bg-white/10 backdrop-blur-md text-white text-sm sm:text-base border-2 placeholder-gray-400/50 focus:outline-none focus:border-[#EC4899]/50 shadow-lg transition-all"
                style={{
                  height: '3rem',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
                placeholder="Enter mobile number or name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div style={{ animation: 'fadeInUp 1s ease-out 0.5s both' }}>
              <label className="block text-sm sm:text-base text-gray-200 mb-2 font-medium">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="w-full relative mb-5 sm:mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 sm:px-5 rounded-2xl bg-white/10 backdrop-blur-md text-white text-sm sm:text-base border-2 placeholder-gray-400/50 focus:outline-none focus:border-[#EC4899]/50 shadow-lg transition-all"
                  style={{
                    height: '3rem',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  placeholder="Password"
                  maxLength={12}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 sm:top-3.5 text-sm text-gray-400 hover:text-[#EC4899] transition-colors font-medium"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "See"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full rounded-2xl px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 font-semibold text-sm sm:text-base md:text-base mb-4 sm:mb-5 transition-all shadow-lg text-white hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden ${loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              style={{
                background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 50%, #EF4444 100%)',
                boxShadow: '0 4px 15px 0 rgba(236, 72, 153, 0.4)',
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
              disabled={loading}
            >
              <span style={{ position: 'relative', zIndex: 2 }}>{loading ? "Logging in..." : "Login"}</span>
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

            <div
              className="flex justify-between items-center w-full gap-2 mt-2"
              style={{ animation: 'fadeInUp 1s ease-out 0.7s both' }}
            >
              <button
                type="button"
                className="text-gray-400 text-xs sm:text-sm font-medium underline hover:text-[#EC4899] transition-colors"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
              <button
                type="button"
                className="font-semibold text-xs sm:text-sm underline transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(to right, #7C3AED, #4F46E5, #2563EB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          </form>
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
