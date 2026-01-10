
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import cosmicBg from "../assets/images/Background.png";
import couplePose from "../assets/images/C.png";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState({
    name: 'India',
    code: '+91',
    flag: '🇮🇳',
  });

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

  // Password validation mirrors CreatePassword screen
  const validatePassword = () => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 12) return "Password must be max 12 characters";
    if (!/[A-Za-z]/.test(password)) return "Must include letters (A–Z)";
    if (!/[0-9]/.test(password)) return "Must include numbers (0–9)";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const rule = mobileValidationRules[country.code];
    if (!rule) {
      toast.error("Please select a valid country.");
      return;
    }
    if (mobile.length !== rule.length || !rule.regex.test(mobile)) {
      toast.error(`Enter a valid mobile number for ${country.name}`);
      return;
    }

    const passwordError = validatePassword();
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: name.trim(),
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
              if (historyRes.data && historyRes.data.length > 0) {
                navigate("/user/dashboard", { replace: true });
                return;
              }
              navigate("/user/dashboard", { replace: true });
              return;
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src={cosmicBg}
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
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-white/20"
            style={{
              borderRadius: "18px",
              background: "rgba(0, 0, 0, 0.28)",
              boxShadow: "0 4px 31px 0 rgba(0, 0, 0, 0.38)",
              backdropFilter: "blur(48.25px)"
            }}
            onSubmit={handleRegister}
          >
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Sign Up</h2>
              <p className="text-white/80 text-xs sm:text-sm">
                This helps us verify and avoid spam profiles
              </p>
            </div>

            {/* Name */}
            <label className="block text-sm sm:text-base text-white mb-2 font-medium">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full mb-5 sm:mb-6 px-3 sm:px-4 rounded-xl bg-black/30 backdrop-blur-md text-white text-sm sm:text-base border-2 border-white/20 placeholder-white/50 focus:outline-none focus:border-white/40 shadow-lg"
              style={{ height: "3rem" }}
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              required
            />

            {/* Country Picker Dropdown */}
            <div className="relative mb-5 sm:mb-6">
              {showCountryPicker && (
                <div 
                  className="absolute top-14 left-0 w-full bg-black/80 backdrop-blur-md rounded-xl border border-white/30 max-h-60 overflow-y-auto z-50 shadow-2xl"
                 
                >
                  {countries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/20 transition-colors text-left border-b border-white/10 last:border-b-0"
                      onClick={() => {
                        setCountry(c);
                        setShowCountryPicker(false);
                        setMobile('');
                      }}
                    >
                      <span className="text-xl text-white">{c.flag}</span>
                      <span className="text-white text-sm flex-1">{c.name}</span>
                      <span className="text-white/60 text-sm">{c.code}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Phone Input */}
              <label className="block text-sm sm:text-base text-white mb-2 font-medium">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div 
                className="flex items-center border-2 border-white/20 rounded-xl bg-black/30 backdrop-blur-md px-3 sm:px-4 shadow-lg"
                style={{ height: "3rem" }}
              >
                <button
                  type="button"
                  className="flex items-center gap-1.5 mr-2.5 hover:opacity-80 transition-opacity"
                  onClick={() => setShowCountryPicker(!showCountryPicker)}
                >
                  <span className="text-lg sm:text-xl text-white">{country.flag}</span>
                  <span className="text-white font-medium text-xs sm:text-sm">{country.code}</span>
                  <span className={`text-white/60 text-xs transition-transform ${showCountryPicker ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <span className="text-white/40 mr-2.5">|</span>
                <input
                  type="tel"
                  className="flex-1 bg-transparent outline-none text-white text-sm sm:text-base placeholder-white/50"
                  placeholder="9642424298"
                  maxLength={mobileValidationRules[country.code]?.length || 10}
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <label className="block text-sm sm:text-base text-white mb-2 font-medium">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="w-full relative mb-5 sm:mb-6">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 sm:px-4 rounded-xl bg-black/30 backdrop-blur-md text-white text-sm sm:text-base border-2 border-white/20 placeholder-white/50 focus:outline-none focus:border-white/40 shadow-lg"
                style={{ height: "3rem" }}
                placeholder="Create password"
                maxLength={12}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 sm:top-3.5 text-sm text-white/80 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "See"}
              </button>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className={`w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5 transition-all shadow-lg text-white ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{
                background:
                  "linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)",
              }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <div className="flex justify-between items-center w-full gap-2 mt-2">
              <span className="text-white/70 text-xs sm:text-sm">Already have an account?</span>
              <button
                type="button"
                className="text-white font-semibold text-xs sm:text-sm underline hover:text-white/90"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
           
          </form>
        </div>
      </div>
    </div>
  );

}