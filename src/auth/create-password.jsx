
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import bgimg from "../assets/images/bg.png";
import couplePose from "../assets/images/couple_pose_1.png";
import { useAuth } from "../context/AuthContext";

export default function CreatePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const auth = useAuth();
  // -----------------------------
  // Password Validation
  // -----------------------------
  const validatePassword = () => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 12) return "Password must be max 12 characters";
    if (!/[A-Za-z]/.test(password)) return "Must include letters (A–Z)";
    if (!/[0-9]/.test(password)) return "Must include numbers (0–9)";
    return null;
  };

  // -----------------------------
  // SUBMIT PASSWORD
  // -----------------------------
  const submitPassword = async (e) => {
    e.preventDefault();
    const error = validatePassword();
    if (error) return toast.error(error);
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");
    
    setLoading(true);
    try {
      const res = await api.post("/auth/set-password", {
        mobile,
        password,
      });
      
      // Save access + refresh token
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
      
      // Set axios default header
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
      
      toast.success("Password set successfully!");
      
      // Debug: log role value
      console.log('[CreatePassword] Effective role:', roleValue);
      
      // Redirect based on role
      if (roleValue && roleValue.toLowerCase() === "admin") {
        navigate("/admin-dashboard", { replace: true });
        return;
      }
      
      // For regular users
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
      console.error("Create password error:", err);
      if (err.response) {
        console.error("API response:", err.response);
        toast.error(err.response?.data?.message || `Error: ${err.response.status}`);
      } else {
        toast.error("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src={bgimg}
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Two Column Layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12">
        
        

        {/* Right Side - Create Password Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-white/20"
            style={{
              borderRadius: '18px',
              background: 'rgba(0, 0, 0, 0.28)',
              boxShadow: '0 4px 31px 0 rgba(0, 0, 0, 0.38)',
              backdropFilter: 'blur(48.25px)'
            }}
            onSubmit={submitPassword}
          >
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Create a password</h2>
              <p className="text-white/80 text-xs sm:text-sm">
                Set a secure password to protect your account and sign in anytime.
              </p>
            </div>

            {/* Create Password Input */}
            <div className="w-full relative mb-4 sm:mb-5">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.28)'
                }}
                placeholder="Create Password"
                maxLength={12}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/80 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "See"}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="w-full relative mb-6 sm:mb-8">
              <input
                type={showConfirm ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.28)'
                }}
                placeholder="Confirm Password"
                maxLength={12}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/80 hover:text-white"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? "Hide" : "See"}
              </button>
            </div>

            {/* Set Password Button */}
            <button
              type="submit"
              className={`w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base transition-all shadow-lg text-white ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{
                background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
              }}
              disabled={loading}
            >
              {loading ? 'Setting...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
