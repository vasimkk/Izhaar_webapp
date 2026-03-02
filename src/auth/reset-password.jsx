import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import couplePose from "../assets/images/C.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    console.log("Location state:", location.state); // Debug statement to verify email

    // Clear local storage keys related to forgot password
    localStorage.removeItem("forgotPasswordStep");
    localStorage.removeItem("forgotPasswordEmail");
    localStorage.removeItem("forgotPasswordOtp");
    localStorage.removeItem("forgotPasswordTimeLeft");
  }, [location.state]);

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
      await api.post("/auth/update-password", {
        email,
        newPassword: password,
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background Gradient */}
      {/* Background Gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: '#000'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
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
                width: `${15 + Math.random() * 20}px`,
                height: `${15 + Math.random() * 20}px`,
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

      {/* Main Layout - Centered for both Mobile & Desktop */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 md:px-8 py-8 lg:py-0 relative" style={{ zIndex: 1 }}>
        {/* Reset Password Form Container */}
        <div className="flex items-center justify-center w-full">
          <form
            className="w-full max-w-[380px] sm:max-w-md p-6 sm:p-10 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.3)] relative overflow-hidden transition-all duration-500"

            onSubmit={resetPassword}
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
                Reset Password
              </h2>
              <p className="text-[#D1D5DC] text-[12px] sm:text-[14px] md:text-[15px] font-semibold leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Enter your new password to continue.
              </p>
            </div>

            {/* New Password Input */}
            <div className="w-full relative mb-4 sm:mb-5 relative z-10">
              <label className="block text-xs sm:text-sm text-gray-300 mb-1 font-bold uppercase tracking-wider ml-1">
                New Password <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-5 h-[48px] rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm sm:text-base border border-white/10 placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 shadow-lg transition-all"
                  placeholder="New Password"
                  maxLength={12}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-pink-400/60 hover:text-pink-400 transition-colors uppercase tracking-tighter"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "See"}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="w-full relative mb-6 sm:mb-8 relative z-10">
              <label className="block text-xs sm:text-sm text-gray-300 mb-1 font-bold uppercase tracking-wider ml-1">
                Confirm Password <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full px-5 h-[48px] rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm sm:text-base border border-white/10 placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 shadow-lg transition-all"
                  placeholder="Confirm Password"
                  maxLength={12}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-pink-400/60 hover:text-pink-400 transition-colors uppercase tracking-tighter"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  {showConfirm ? "Hide" : "See"}
                </button>
              </div>
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              className={`w-full h-[40px] bg-gradient-to-r from-[#EC4891] to-[#A928ED] hover:scale-[1.02] active:scale-[0.98] text-white font-semibold rounded-3xl shadow-lg shadow-pink-500/20 flex items-center justify-center space-x-2 transition-all text-sm sm:text-base tracking-wider border border-white/20 mb-4 sm:mb-5 relative overflow-hidden z-10 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              style={{
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
              disabled={loading}
            >
              <span className="relative z-10">{loading ? 'Saving...' : 'Reset Password'}</span>
              {!loading && (
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer" />
              )}
            </button>

            {/* Back to Login */}
            <div className="mt-4 text-center relative z-10" style={{ animation: 'fadeInUp 1s ease-out 0.7s both' }}>
              <button
                type="button"
                className="font-black text-xs underline transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(to right, #ec4899, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
                onClick={() => navigate("/login")}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(5deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(233, 30, 99, 0.3), inset 0 0 20px rgba(156, 39, 176, 0); }
          50% { box-shadow: 0 0 40px rgba(233, 30, 99, 0.5), inset 0 0 30px rgba(156, 39, 176, 0.2); }
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
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(233, 30, 99, 0), 0 0 20px rgba(156, 39, 176, 0); }
          50% { text-shadow: 0 0 10px rgba(233, 30, 99, 0.5), 0 0 20px rgba(156, 39, 176, 0.3); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
        .gradient-text {
          background: linear-gradient(135deg, #EC4899 0%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
      `}</style>
    </div>
  );
}