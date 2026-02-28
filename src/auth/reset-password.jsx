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

      {/* Two Column Layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12 relative" style={{ zIndex: 1 }}>
        {/* Left Side - Couple Image */}
        <div className="hidden md:flex flex-1 items-center justify-center w-full">
          <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg flex items-center justify-center">
            <div
              className="absolute w-96 h-96 rounded-full opacity-15 blur-3xl"
              style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                animation: 'pulse 4s ease-in-out infinite, glow 3s ease-in-out infinite'
              }}
            />
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

        {/* Right Side - Reset Password Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border rounded-3xl backdrop-blur-xl"
            style={{
              borderColor: 'rgba(236, 72, 153, 0.3)',
              background: 'rgba(0, 0, 0, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
              animation: 'glow 4s ease-in-out infinite'
            }}
            onSubmit={resetPassword}
          >
            <div className="mb-6 sm:mb-8 text-center" style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}>
              <h2
                className="text-2xl sm:text-5xl font-bold mb-2 sm:mb-3 gradient-text"
                style={{
                  animation: 'textGlow 3s ease-in-out infinite',
                  fontStyle: 'italic',
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: '0.5px'
                }}
              >
                Reset Password
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Enter your new password to continue.
              </p>
            </div>

            {/* New Password Input */}
            <div className="w-full relative mb-4 sm:mb-5">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white text-sm sm:text-base border-2 placeholder-gray-400/50 focus:outline-none focus:border-[#EC4899]/50 shadow-lg transition-all"
                style={{
                  height: '3rem',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
                placeholder="New Password"
                maxLength={12}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-[#EC4899] transition-colors"
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
                className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white text-sm sm:text-base border-2 placeholder-gray-400/50 focus:outline-none focus:border-[#EC4899]/50 shadow-lg transition-all"
                style={{
                  height: '3rem',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
                placeholder="Confirm Password"
                maxLength={12}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-[#EC4899] transition-colors"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? "Hide" : "See"}
              </button>
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              className={`w-full rounded-2xl px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 font-semibold text-sm sm:text-base md:text-base mb-4 sm:mb-5 transition-all shadow-lg text-white hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden ${loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              style={{
                background: 'linear-gradient(90deg, #EC4891 -12.18%, #A928ED 76.79%)',
                boxShadow: '0 4px 15px 0 rgba(236, 72, 153, 0.4)',
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Reset Password'}
            </button>

            {/* Back to Login */}
            <div className="mt-4 text-center" style={{ animation: 'fadeInUp 1s ease-out 0.7s both' }}>
              <button
                type="button"
                className="text-gray-400 text-xs sm:text-sm font-medium underline hover:text-[#EC4899] transition-colors"
                onClick={() => navigate("/login")}
              >
                Back to Login
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
