import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import bgimg from "../assets/images/bg.png";
import couplePose from "../assets/images/couple_pose_1.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // -----------------------------
  // PASSWORD VALIDATION
  // -----------------------------
  const validatePassword = () => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 12) return "Password must be max 12 characters";
    if (!/[A-Za-z]/.test(password)) return "Must include letters (A–Z)";
    if (!/[0-9]/.test(password)) return "Must include numbers (0–9)";
    return null;
  };

  // -----------------------------
  // SUBMIT NEW PASSWORD
  // -----------------------------
  const resetPassword = async (e) => {
    e.preventDefault();
    const error = validatePassword();
    if (error) return alert(error);

    if (password !== confirmPassword)
      return alert("Passwords do not match");

    try {
      setLoading(true);
      await api.post("/auth/forgot-password/set-password", {
        mobile,
        password,
      });

      alert("Password reset successful! Please login.");
      navigate("/login", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
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
        
        {/* Left Side - Couple Image */}
        <div className="hidden md:flex flex-1 items-center justify-center w-full">
          <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg">
            <img
              src={couplePose}
              alt="Couple"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-white/20"
            style={{
              borderRadius: '18px',
              background: 'rgba(0, 0, 0, 0.28)',
              boxShadow: '0 4px 31px 0 rgba(0, 0, 0, 0.38)',
              backdropFilter: 'blur(48.25px)'
            }}
            onSubmit={resetPassword}
          >
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Reset Password</h2>
              <p className="text-white/80 text-xs sm:text-sm mb-2">
                Account: +91 {mobile}
              </p>
              <p className="text-white/80 text-xs sm:text-sm">
                Enter your new password to continue.
              </p>
            </div>

            {/* New Password Input */}
            <div className="w-full relative mb-4 sm:mb-5">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.28)'
                }}
                placeholder="New Password"
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

            {/* Reset Password Button */}
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
              {loading ? 'Saving...' : 'Reset Password'}
            </button>

            {/* Back to Login */}
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-white/80 text-xs sm:text-sm hover:text-white transition-colors underline"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
