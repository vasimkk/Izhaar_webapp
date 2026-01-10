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
      } catch {
        navigate("/welcome", { replace: true });
        return;
      }

      try {
        const profileRes = await api.get("/profile/me");
        const profileData = profileRes.data.profile || profileRes.data;
        const hasProfile = profileData && (profileData.id || profileData._id);

        if (hasProfile) {
          try {
            await api.get("/user/template-history"); // optional check
            navigate("/user/dashboard", { replace: true });
            return;
          } catch {
            navigate("/user/dashboard", { replace: true });
            return;
          }
        } else {
          navigate("/profile", { replace: true });
          return;
        }
      } catch {
        navigate("/profile", { replace: true });
        return;
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Gradient Background - Black to Deep Rose */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a15 25%, #2d0a1f 50%, #1a0a15 75%, #0f0f0f 100%)',
          animation: 'gradientShift 15s ease infinite'
        }}
      >
        {/* Animated gradient overlay for depth - Rose Gold accents */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(215, 123, 83, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(184, 134, 11, 0.06) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />

        {/* Animated floating hearts */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${30 + i * 10}px`,
              height: `${30 + i * 10}px`,
              opacity: 0.2 + i * 0.05,
              animation: `heartFloat${i % 4} ${12 + i * 2}s infinite ease-in-out`,
              left: `${10 + i * 12}%`,
              top: `${20 + i * 10}%`,
              zIndex: 1
            }}
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 8px rgba(215, 150, 74, 0.3))' }}>
              <path
                d="M50,85 C20,70 5,55 5,40 C5,25 15,15 25,15 C35,15 45,25 50,35 C55,25 65,15 75,15 C85,15 95,25 95,40 C95,55 80,70 50,85 Z"
                fill="rgba(215, 150, 74, 0.8)"
                stroke="rgba(215, 150, 74, 0.5)"
                strokeWidth="1"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12">
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
                  background: 'radial-gradient(circle, rgba(215, 150, 74, 0.8), transparent)',
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
                  background: 'radial-gradient(circle, rgba(201, 169, 97, 0.6), transparent)',
                  borderRadius: '50%',
                  top: '50%',
                  left: '50%',
                  filter: 'blur(8px)'
                }}
              />
            </div>

            {/* Rose Gold glow effect */}
            <div
              className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{
                background: 'linear-gradient(135deg, #d7964a 0%, #c9a961 100%)',
                animation: 'pulse 4s ease-in-out infinite, glow 3s ease-in-out infinite'
              }}
            />
            {/* Couple Image */}
            <img
              src={couplePose}
              alt="Couple"
              className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(215, 150, 74, 0.3))'
              }}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border rounded-3xl backdrop-blur-md"
            style={{
              borderColor: 'rgba(215, 150, 74, 0.3)',
              background: 'linear-gradient(135deg, rgba(31, 15, 25, 0.85) 0%, rgba(45, 10, 31, 0.85) 100%)',
              boxShadow: '0 8px 32px 0 rgba(215, 150, 74, 0.15), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
              animation: 'glow 4s ease-in-out infinite'
            }}
            onSubmit={loginUser}
          >
            <div className="mb-6 sm:mb-8 text-center" style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}>
              <h2 
                className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-200 bg-clip-text text-transparent mb-2 sm:mb-3"
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
                Mobile Number / Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                className="w-full mb-5 sm:mb-6 px-4 sm:px-5 rounded-2xl bg-black/30 backdrop-blur-md text-white text-sm sm:text-base border-2 placeholder-gray-400 focus:outline-none focus:border-yellow-300/50 shadow-lg transition-all"
                style={{ 
                  height: '3rem',
                  borderColor: 'rgba(215, 150, 74, 0.3)'
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
                  className="w-full px-4 sm:px-5 rounded-2xl bg-black/30 backdrop-blur-md text-white text-sm sm:text-base border-2 placeholder-gray-400 focus:outline-none focus:border-yellow-300/50 shadow-lg transition-all"
                  style={{ 
                    height: '3rem',
                    borderColor: 'rgba(215, 150, 74, 0.3)'
                  }}
                  placeholder="Password"
                  maxLength={12}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 sm:top-3.5 text-sm text-gray-300 hover:text-yellow-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "See"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full rounded-2xl px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 font-semibold text-sm sm:text-base md:text-base mb-4 sm:mb-5 transition-all shadow-lg text-white hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              style={{
                background: 'linear-gradient(135deg, #d7794a 0%, #c9614a 50%, #a03f2a 100%)',
                boxShadow: '0 4px 15px 0 rgba(215, 121, 74, 0.4)',
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
                className="text-gray-300 text-xs sm:text-sm font-medium underline hover:text-yellow-300 transition-colors"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
              <button
                type="button"
                className="text-gray-200 font-semibold text-xs sm:text-sm underline hover:text-yellow-300 transition-colors"
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
          0%, 100% { box-shadow: 0 0 20px rgba(215, 121, 74, 0.5), inset 0 0 20px rgba(215, 121, 74, 0.1); }
          50% { box-shadow: 0 0 40px rgba(215, 121, 74, 0.8), inset 0 0 30px rgba(215, 121, 74, 0.2); }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(215, 150, 74, 0), 0 0 20px rgba(215, 150, 74, 0); }
          50% { text-shadow: 0 0 10px rgba(215, 150, 74, 0.5), 0 0 20px rgba(215, 150, 74, 0.3); }
        }
      `}</style>
    </div>
  );
}
