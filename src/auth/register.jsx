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
              const historyRes = await api.get("/user/template-history");
              const historyData = historyRes.data;
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden " style={{ background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)' }}>
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

      >

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
            className="w-full max-w-md p-6 sm:p-8 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.3)] relative overflow-hidden"

            onSubmit={handleRegister}
          >
            {/* Soft Romantic Gradients */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full"></div>

            <div className="mb-6 sm:mb-8 text-center relative z-10" style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}>
              <h2
                className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 tracking-tight font-serif italic drop-shadow-sm mb-2"
                style={{
                  animation: 'textGlow 3s ease-in-out infinite'
                }}
              >
                Sign Up
              </h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
                Join our community safely and respectfully.
              </p>
            </div>

            <div className="relative z-10">
              {/* Name Input */}
              <label className="block text-xs sm:text-sm text-gray-300 mb-2 font-bold uppercase tracking-wider ml-1">
                User Name <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full mb-1 px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm border-2 placeholder-gray-500 focus:outline-none shadow-lg transition-all ${nameError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-pink-500/50'
                  }`}
                placeholder="Your name"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                autoComplete="name"
                required
              />
              {nameError && (
                <p className="text-red-400 text-[10px] mb-3 ml-1 font-bold uppercase tracking-tighter">{nameError}</p>
              )}
              {!nameError && name && (
                <div className="mb-3"></div>
              )}

              {/* Email Input */}
              <label className="block text-xs sm:text-sm text-gray-300 mb-2 font-bold uppercase tracking-wider ml-1">
                Email <span className="text-pink-500">*</span>
              </label>
              <input
                type="email"
                className={`w-full mb-1 px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm border-2 placeholder-gray-500 focus:outline-none shadow-lg transition-all ${emailError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-pink-500/50'
                  }`}
                placeholder="Your email"
                value={email}
                onChange={e => handleEmailChange(e.target.value)}
                autoComplete="email"
                required
              />
              {emailError && (
                <p className="text-red-400 text-[10px] mb-3 ml-1 font-bold uppercase tracking-tighter">{emailError}</p>
              )}
              {!emailError && email && (
                <div className="mb-3"></div>
              )}

              {/* Phone Number Input */}
              <div className="relative mb-4">
                {showCountryPicker && (
                  <div
                    className="absolute top-14 left-0 w-full bg-gray-900/95 backdrop-blur-md rounded-2xl border border-pink-500/30 max-h-60 overflow-y-auto z-50 shadow-2xl ring-1 ring-white/10"
                  >
                    {countries.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-b-0 text-white"
                        onClick={() => {
                          setCountry(c);
                          setShowCountryPicker(false);
                          setMobile('');
                          setMobileError('');
                        }}
                      >
                        <span className="text-lg text-white">{c.flag}</span>
                        <span className="text-white text-sm font-bold flex-1 tracking-tight">{c.name}</span>
                        <span className="text-gray-400 text-xs font-black">{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}

                <label className="block text-xs sm:text-sm text-gray-300 mb-2 font-bold uppercase tracking-wider ml-1">
                  Phone Number <span className="text-pink-500">*</span>
                </label>
                <div
                  className={`flex items-center border-2 rounded-2xl bg-white/5 backdrop-blur-md px-5 shadow-lg ${mobileError ? 'border-red-500/50' : 'border-white/10'
                    }`}
                  style={{ height: "3.5rem" }}
                >
                  <button
                    type="button"
                    className="flex items-center gap-2 mr-3 hover:opacity-80 transition-opacity"
                    onClick={() => {
                      setShowCountryPicker(!showCountryPicker);
                    }}
                  >
                    <span className="text-lg text-white">{country.flag}</span>
                    <span className="text-white font-black text-sm tracking-tighter">{country.code}</span>
                    <span className={`text-gray-500 text-[10px] transition-transform ${showCountryPicker ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  <span className="text-white/10 mr-3 text-xl">|</span>
                  <input
                    type="tel"
                    className="flex-1 bg-transparent outline-none text-white text-sm font-medium placeholder-gray-500"
                    placeholder="9688665555"
                    maxLength={mobileValidationRules[country.code]?.length || 10}
                    value={mobile}
                    onChange={e => handleMobileChange(e.target.value)}
                    autoComplete="tel"
                  />
                </div>
                {mobileError && (
                  <p className="text-red-400 text-[10px] mt-1 ml-1 font-bold uppercase tracking-tighter">{mobileError}</p>
                )}
              </div>

              {/* Password Input */}
              <label className="block text-xs sm:text-sm text-gray-300 mb-2 font-bold uppercase tracking-wider ml-1">
                Password <span className="text-pink-500">*</span>
              </label>
              <div className="w-full relative mb-1">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-5 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm border-2 placeholder-gray-500 focus:outline-none shadow-lg transition-all ${passwordError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-pink-500/50'
                    }`}
                  style={{ height: "3.5rem" }}
                  placeholder="Create password"
                  maxLength={12}
                  value={password}
                  onChange={e => handlePasswordChange(e.target.value)}
                  autoComplete="new-password"
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
              {passwordError && (
                <p className="text-red-400 text-[10px] mb-3 ml-1 font-bold uppercase tracking-tighter">{passwordError}</p>
              )}
              {!passwordError && password && (
                <div className="mb-3"></div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-center space-x-2 transition-all text-sm sm:text-base uppercase tracking-wider border border-white/20 mb-4 sm:mb-5 relative z-10 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              style={{
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
              disabled={loading}
            >
              <span>{loading ? "Registering..." : "Register"}</span>
              {!loading && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.5s ease',
                  }}
                  className="hover:translate-x-full"
                />
              )}
            </button>

            <div
              className="flex justify-between items-center w-full gap-2 mt-2 relative z-10"
              style={{ animation: 'fadeInUp 1s ease-out 0.7s both' }}
            >
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-none">Already joined?</span>
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
                Sign in here
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



      `}</style>
    </div>
  );

}