
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import bgimg from "../assets/images/bg.png";
import couplePose from "../assets/images/couple_pose_1.png";
import { useAuth } from "../context/AuthContext";
import { setAccessToken, setRefreshToken } from "../utils/tokenStore";
export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prevent back navigation after login - redirect if already logged in
  useEffect(() => {
    if (auth?.accessToken) {
      // User is already logged in, redirect to dashboard
      navigate("/user/dashboard", { replace: true });
    }
    
    // Clear browser history to prevent going back after login
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, '', window.location.href);
      if (auth?.accessToken) {
        navigate("/user/dashboard", { replace: true });
      }
    };

    return () => {
      window.onpopstate = null;
    };
  }, [auth?.accessToken, navigate]);


  const validatePassword = () => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 12) return "Password must be max 12 characters";
    if (!/[A-Za-z]/.test(password)) return "Must include letters (A–Z)";
    if (!/[0-9]/.test(password)) return "Must include numbers (0–9)";
    return null;
  };
  const [role, setRole] = useState(null);
  const setRoleAndStore = (r) => {
    setRole(r);
    if (auth?.setRole) auth.setRole(r);
  };

  const loginUser = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) return alert("Enter valid 10-digit mobile number");
    const error = validatePassword();
    if (error) return alert(error);
    setLoading(true);
    try {
      const res = await api.post("/auth/login-password", { mobile, password });
      // Save access + refresh token
      // Store tokens in cookies
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      if (auth?.setAccessToken) auth.setAccessToken(res.data.accessToken);
      if (auth?.setRefreshToken) await auth.setRefreshToken(res.data.refreshToken);
      if (res.data.role && auth?.setRole) auth.setRole(res.data.role);
      // Extract role from response or JWT accessToken
      let roleValue = res.data.role;
      if (!roleValue && res.data.accessToken) {
        try {
          const payload = JSON.parse(atob(res.data.accessToken.split('.')[1]));
          roleValue = payload.role;
        } catch (e) {
          console.error('Failed to decode JWT for role:', e);
        }
      }
      if (roleValue) setRoleAndStore(roleValue);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
      // Debug: log role value
      console.log('[Login] Effective role:', roleValue);
      if (roleValue && roleValue.toLowerCase() === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }
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
          if (hasProfile) {
            try {
              const historyRes = await api.get("/user/template-history");
              if (historyRes.data && historyRes.data.length > 0) {
                navigate("/user/dashboard", { replace: true });
                return;
              } else {
                navigate("/user/dashboard", { replace: true });
                return;
              }
            } catch {
              navigate("/user/dashboard", { replace: true });
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
      
      // Handle different error types
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        alert("Connection timeout. Please check:\n1. Backend server is running\n2. Network connection\n3. Backend URL is correct");
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Failed to fetch') || err.message?.includes('ERR_CONNECTION')) {
        alert("Cannot connect to server. Please check:\n1. Backend server is running at: " + (window.location.hostname.includes('localhost') ? 'http://localhost:5000' : 'http://192.168.0.124:5000') + "\n2. Network connection\n3. Firewall settings");
      } else if (err.response) {
        console.error("API response:", err.response);
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
      {/* Background image - Optimized */}
      <div className="fixed inset-0 -z-10">
        <img
          src={bgimg}
          alt="Background"
          className="w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Two Column Layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12">
        
        {/* Left Side - Couple Image */}
        <div className="hidden md:flex flex-1 items-center justify-center w-full">
          <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg">
            <img
              src={couplePose}
              alt="Couple"
              className="w-full h-auto object-contain drop-shadow-2xl"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-white/20"
            style={{
              borderRadius: '18px',
              background: 'rgba(0, 0, 0, 0.28)',
              boxShadow: '0 4px 31px 0 rgba(0, 0, 0, 0.38)',
              backdropFilter: 'blur(48.25px)'
            }}
            onSubmit={loginUser}
          >
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Login</h2>
              <p className="text-white/80 text-xs sm:text-sm">
                Welcome back! Please login to your account
              </p>
            </div>
            <label className="block text-sm sm:text-base text-white mb-2 font-medium">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              className="w-full mb-5 sm:mb-6 px-3 sm:px-4 rounded-xl bg-black/30 backdrop-blur-md text-white text-sm sm:text-base border-2 border-white/20 placeholder-white/50 focus:outline-none focus:border-white/40 shadow-lg"
              style={{ height: '3rem' }}
              placeholder="Mobile Number"
              maxLength={10}
              value={mobile}
              onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
              required
            />
            <label className="block text-sm sm:text-base text-white mb-2 font-medium">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="w-full relative mb-5 sm:mb-6">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 sm:px-4 rounded-xl bg-black/30 backdrop-blur-md text-white text-sm sm:text-base border-2 border-white/20 placeholder-white/50 focus:outline-none focus:border-white/40 shadow-lg"
                style={{ height: '3rem' }}
                placeholder="Password"
                maxLength={12}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 sm:top-3.5 text-xl"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
               {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
            <button
              type="submit"
              className={`w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5 transition-all shadow-lg text-white ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
              style={{
                background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
              }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            
            <div className="flex justify-between items-center w-full gap-2 mt-2">
              <button
                type="button"
                className="text-white/90 text-xs sm:text-sm font-medium underline hover:text-white"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
              <button
                type="button"
                className="text-white font-semibold text-xs sm:text-sm underline hover:text-white/90"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
