import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import couplePose from "../assets/images/C.png";
import { useAuth } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // Added state for email
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState({
    name: 'India',
    code: '+91',
    flag: '🇮🇳',
  });

  // Real-time validation error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const countries = [
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    { name: 'Germany', code: '+49', flag: '🇩🇪' },
    { name: 'France', code: '+33', flag: '🇫🇷' },
    { name: 'Singapore', code: '+65', flag: '🇸🇬' },
    { name: 'UAE', code: '+971', flag: '🇦🇪' },
    { name: 'Nepal', code: '+977', flag: '🇳🇵' },
  ];

  // Mobile number validation rules by country code
  const mobileValidationRules = {
    '+91': { length: 10, regex: /^[6-9]\d{9}$/, flag: '🇮🇳' }, // India
    '+1': { length: 10, regex: /^\d{10}$/, flag: '🇺🇸' }, // US/Canada
    '+44': { length: 10, regex: /^\d{10}$/, flag: '🇬🇧' }, // UK (simplified)
    '+61': { length: 9, regex: /^\d{9}$/, flag: '🇦🇺' }, // Australia (without leading 0)
    '+49': { length: 10, regex: /^\d{10}$/, flag: '🇩🇪' }, // Germany (simplified)
    '+33': { length: 9, regex: /^\d{9}$/, flag: '🇫🇷' }, // France (without leading 0)
    '+65': { length: 8, regex: /^\d{8}$/, flag: '🇸🇬' }, // Singapore
    '+971': { length: 9, regex: /^\d{9}$/, flag: '🇦🇪' }, // UAE
    '+977': { length: 10, regex: /^\d{10}$/, flag: '🇳🇵' }, // Nepal
  };

  // Name validation
  const validateName = (value = name) => {
    const trimmedName = value.trim();
    if (!trimmedName) return "Name is required";
    if (trimmedName.length < 2) return "Name must be at least 2 characters";
    if (trimmedName.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) return "Only letters, spaces, hyphens, and apostrophes allowed";
    if (/\s{2,}/.test(trimmedName)) return "Cannot contain multiple consecutive spaces";
    return "";
  };

  // Email validation
  const validateEmail = (value = email) => {
    const trimmedEmail = value.trim();
    if (!trimmedEmail) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return "Please enter a valid email address";
    return "";
  };

  // Mobile validation
  const validateMobile = (value = mobile) => {
    if (!value) return "Phone number is required";
    const rule = mobileValidationRules[country.code];
    if (!rule) return "Please select a valid country";
    if (value.length !== rule.length) return `Must be ${rule.length} digits for ${country.name}`;
    if (!rule.regex.test(value)) return `Invalid phone number for ${country.name}`;
    return "";
  };

  // Password validation
  const validatePassword = (value = password) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (value.length > 12) return "Password must be max 12 characters";
    if (!/[A-Za-z]/.test(value)) return "Must include letters (A–Z)";
    if (!/[0-9]/.test(value)) return "Must include numbers (0–9)";
    return "";
  };

  // Real-time validation handlers
  const handleNameChange = (value) => {
    setName(value);
    if (value.length > 0) {
      setNameError(validateName(value));
    } else {
      setNameError("");
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (value.length > 0) {
      setEmailError(validateEmail(value));
    } else {
      setEmailError("");
    }
  };

  const handleMobileChange = (value) => {
    const numericValue = value.replace(/\D/g, '');
    setMobile(numericValue);
    if (numericValue.length > 0) {
      setMobileError(validateMobile(numericValue));
    } else {
      setMobileError("");
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value.length > 0) {
      setPasswordError(validatePassword(value));
    } else {
      setPasswordError("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate all fields and set errors
    const nameErr = validateName();
    const emailErr = validateEmail();
    const mobileErr = validateMobile();
    const passwordErr = validatePassword();

    setNameError(nameErr);
    setEmailError(emailErr);
    setMobileError(mobileErr);
    setPasswordError(passwordErr);

    // If any errors exist, show first error and stop
    if (nameErr) {
      toast.error(nameErr);
      return;
    }
    if (emailErr) {
      toast.error(emailErr);
      return;
    }
    if (mobileErr) {
      toast.error(mobileErr);
      return;
    }
    if (passwordErr) {
      toast.error(passwordErr);
      return;
    }

    setLoading(true);
    try {
      console.log("Data being sent to backend:", {
        name: name.trim(),
        email: email.trim(),
        mobile,
        password,
      });

      const res = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(), // Include email in the payload
        mobile,
        password,
      });

      if (auth?.setAccessToken) auth.setAccessToken(res.data.accessToken);
      if (auth?.setRefreshToken) await auth.setRefreshToken(res.data.refreshToken);
      if (res.data.role && auth?.setRole) auth.setRole(res.data.role);

      let roleValue = res.data.role;
      if (!roleValue && res.data.accessToken) {
        try {
          const payload = JSON.parse(atob(res.data.accessToken.split('.')[1]));
          roleValue = payload.role;
        } catch (err) {
          console.error('Failed to decode JWT for role:', err);
        }
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;

      toast.success("Registration successful!");

      if (roleValue && roleValue.toLowerCase() === "admin") {
        navigate("/admin-dashboard", { replace: true });
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
              const historyData = historyRes.data;
              const historyList = Array.isArray(historyData) ? historyData : (historyData?.history || historyData?.templates || historyData?.data || []);

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
      console.error("Registration error:", err);
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#581C87] via-[#312E81] to-[#1E3A8A]">
      <ToastContainer />

      {/* Mobile Back Button */}
      <button
        onClick={() => navigate("/login")}
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

        {/* Right Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-md p-6 sm:p-8 border rounded-3xl backdrop-blur-xl"
            style={{
              borderColor: 'rgba(236, 72, 153, 0.3)',
              background: 'rgba(0, 0, 0, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
              animation: 'glow 4s ease-in-out infinite'
            }}
            onSubmit={handleRegister}
          >
            <div className="mb-6 sm:mb-8 text-center" style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 gradient-text"
                style={{
                  animation: 'textGlow 3s ease-in-out infinite',
                  fontStyle: 'italic',
                  fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                  letterSpacing: '0.5px'
                }}
              >
                Sign Up
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                This helps us verify and avoid spam profiles
              </p>
            </div>

            {/* Name Input */}
            <label className="block text-sm text-gray-200 mb-2 font-medium">
              User Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className={`w-full mb-1 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white text-sm border-2 placeholder-gray-400/50 focus:outline-none shadow-md transition-all ${nameError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#EC4899]/50'
                }`}
              placeholder="Your name"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              autoComplete="name"
              required
            />
            {nameError && (
              <p className="text-red-400 text-xs mb-3 ml-1">{nameError}</p>
            )}
            {!nameError && name && (
              <div className="mb-3"></div>
            )}

            {/* Email Input */}
            <label className="block text-sm text-gray-200 mb-2 font-medium">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              className={`w-full mb-1 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white text-sm border-2 placeholder-gray-400/50 focus:outline-none shadow-md transition-all ${emailError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#EC4899]/50'
                }`}
              placeholder="Your email"
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              autoComplete="email"
              required
            />
            {emailError && (
              <p className="text-red-400 text-xs mb-3 ml-1">{emailError}</p>
            )}
            {!emailError && email && (
              <div className="mb-3"></div>
            )}

            {/* Phone Number Input */}
            <div className="relative mb-4">
              {showCountryPicker && (
                <div
                  className="absolute top-14 left-0 w-full bg-gray-900/95 backdrop-blur-md rounded-lg border border-[#EC4899]/30 max-h-60 overflow-y-auto z-50 shadow-lg"
                >
                  {countries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors text-left border-b border-white/10 last:border-b-0 text-white"
                      onClick={() => {
                        setCountry(c);
                        setShowCountryPicker(false);
                        setMobile('');
                        setMobileError('');
                      }}
                    >
                      <span className="text-lg text-white">{c.flag}</span>
                      <span className="text-white text-sm flex-1">{c.name}</span>
                      <span className="text-gray-400 text-sm">{c.code}</span>
                    </button>
                  ))}
                </div>
              )}

              <label className="block text-sm text-gray-200 mb-2 font-medium">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div
                className={`flex items-center border-2 rounded-lg bg-white/10 backdrop-blur-md px-4 shadow-md ${mobileError ? 'border-red-500' : 'border-white/10'
                  }`}
                style={{ height: "2.5rem" }}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 mr-2 hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setShowCountryPicker(!showCountryPicker);
                  }}
                >
                  <span className="text-lg text-white">{country.flag}</span>
                  <span className="text-white font-medium text-sm">{country.code}</span>
                  <span className={`text-gray-400 text-xs transition-transform ${showCountryPicker ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <span className="text-gray-400/40 mr-2">|</span>
                <input
                  type="tel"
                  className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-400/50"
                  placeholder="9642424298"
                  maxLength={mobileValidationRules[country.code]?.length || 10}
                  value={mobile}
                  onChange={e => handleMobileChange(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              {mobileError && (
                <p className="text-red-400 text-xs mt-1 ml-1">{mobileError}</p>
              )}
            </div>

            {/* Password Input */}
            <label className="block text-sm text-gray-200 mb-2 font-medium">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="w-full relative mb-1">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 rounded-lg bg-white/10 backdrop-blur-md text-white text-sm border-2 placeholder-gray-400/50 focus:outline-none shadow-md transition-all ${passwordError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#EC4899]/50'
                  }`}
                style={{ height: "2.5rem" }}
                placeholder="Create password"
                maxLength={12}
                value={password}
                onChange={e => handlePasswordChange(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-sm text-gray-400 hover:text-[#EC4899] transition-colors font-medium"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "See"}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-400 text-xs mb-3 ml-1">{passwordError}</p>
            )}
            {!passwordError && password && (
              <div className="mb-3"></div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full rounded-lg px-4 py-2 font-semibold text-sm mb-4 transition-all shadow-md text-white hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden ${loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              style={{
                background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 50%, #EF4444 100%)',
                boxShadow: '0 4px 15px 0 rgba(236, 72, 153, 0.4)',
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
              disabled={loading}
            >
              <span style={{ position: 'relative', zIndex: 2 }}>{loading ? "Registering..." : "Register"}</span>
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
              <span className="text-gray-400 text-xs">Already have an account?</span>
              <button
                type="button"
                className="font-semibold text-xs underline transition-all hover:scale-110"
                style={{
                  background: 'linear-gradient(to right, #7C3AED, #4F46E5, #2563EB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
                onClick={() => navigate("/login")}
              >
                Login
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
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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