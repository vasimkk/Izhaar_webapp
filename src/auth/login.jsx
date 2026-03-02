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
    if (!username.trim()) return alert("Please enter mobile number, name, or email");

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
            navigate("/user/dashboard", { replace: true });
            return;
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden " style={{ background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)' }}>
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
          background: '#000'
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






      {/* Main Layout - Centered for both Mobile & Desktop */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 md:px-8 py-8 lg:py-0 relative" style={{ zIndex: 1 }}>
        {/* Login Form Container */}
        <div className="flex items-center justify-center w-full">
          <form
            className="w-full max-w-[380px] sm:max-w-md p-6 sm:p-10 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.3)] relative overflow-hidden transition-all duration-500"


            onSubmit={loginUser}
          >
            {/* Soft Romantic Gradients */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full"></div>

            <div className="mb-6 sm:mb-8 text-center relative z-10" style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}>
              <h2
                className="text-[22px] xs:text-[24px] sm:text-[32px] md:text-[40px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EC4891] to-[#A928ED] tracking-tight drop-shadow-sm mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  animation: 'textGlow 3s ease-in-out infinite'
                }}
              >
                Welcome Back
              </h2>
              <p className="text-[#D1D5DC] text-[12px] sm:text-[14px] md:text-[15px] font-semibold leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Login to your account safely and respectfully.
              </p>
            </div>

            <div className="relative z-10" style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}>
              <label className="block text-xs sm:text-sm text-gray-300 mb-2 font-semibold  tracking-wider ml-1">
                Mobile OR Email <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                className="w-full h-[48px] mb-4 sm:mb-6 px-5 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm sm:text-base border border-white/10 placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 shadow-lg transition-all"
                placeholder="Enter mobile, email, or name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="relative z-10" style={{ animation: 'fadeInUp 1s ease-out 0.5s both' }}>
              <label className="block text-xs sm:text-sm text-gray-300 mb-2 font-semibold  tracking-wider ml-1">
                Password <span className="text-pink-500">*</span>
              </label>
              <div className="w-full relative mb-4 sm:mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-[48px] px-5 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm sm:text-base border border-white/10 placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 shadow-lg transition-all"
                  placeholder="Password"
                  maxLength={12}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-pink-400/60 hover:text-pink-400 transition-colors  tracking-tighter"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "See"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full h-[40px] bg-gradient-to-r from-[#EC4891] to-[#A928ED] hover:scale-[1.02] active:scale-[0.98] text-white font-semibold rounded-3xl sm:rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-center space-x-2 transition-all text-sm sm:text-base tracking-wider border border-white/20 mb-4 sm:mb-5 relative overflow-hidden ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              style={{
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
              disabled={loading}
            >
              <span className="relative z-10">{loading ? "Logging in..." : "Sign in"}</span>
              {!loading && (
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer" />
              )}
            </button>

            <div
              className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 mt-2 relative z-10"
              style={{ animation: 'fadeInUp 1s ease-out 0.7s both' }}
            >
              <button
                type="button"
                className="text-gray-400 text-[10px] font-black  tracking-widest hover:text-pink-400 transition-colors"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-[10px] font-black  tracking-widest">New User?</span>
                <button
                  type="button"
                  className="font-black text-xs sm:text-sm underline transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'linear-gradient(to right, #ec4899, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                  onClick={() => navigate("/register")}
                >
                  Register Here
                </button>
              </div>
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
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
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