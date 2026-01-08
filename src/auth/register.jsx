
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import cosmicBg from "../assets/images/Background.png";
import couplePose from "../assets/images/C.png";

export default function Register() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
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

  const handleRegister = async (e) => {
    e.preventDefault();
    const rule = mobileValidationRules[country.code];
    if (!rule) {
      alert('Please select a valid country.');
      return;
    }
    if (mobile.length !== rule.length || !rule.regex.test(mobile)) {
      alert(`Enter a valid mobile number for ${country.name}`);
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { mobile, role: "user" });
      toast.success("OTP sent!");
      setTimeout(() => {
        navigate("/otp", { state: { mobile } });
      }, 500);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
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
            />
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-white/20"
            style={{
              borderRadius: '18px',
              background: 'rgba(0, 0, 0, 0.28)',
              boxShadow: '0 4px 31px 0 rgba(0, 0, 0, 0.38)',
              backdropFilter: 'blur(48.25px)'
            }}
            onSubmit={handleRegister}
          >
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Sign Up</h2>
              <p className="text-white/80 text-xs sm:text-sm">
                This helps us verify and avoid spam profiles
              </p>
            </div>

            {/* Country Picker Dropdown */}
            <div className="relative mb-4 sm:mb-5 md:mb-6">
              {showCountryPicker && (
                <div 
                  className="absolute top-16 left-0 bg-black/80 backdrop-blur-md rounded-xl border border-white/30 max-h-64 overflow-y-auto z-50 shadow-2xl"
                 
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
                      <span className="text-2xl text-white">{c.flag}</span>
                      <span className="text-white text-sm md:text-base flex-1">{c.name}</span>
                      <span className="text-white/60 text-sm md:text-base">{c.code}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Phone Input */}
              <label className="block text-sm sm:text-base text-white mb-2 font-medium">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div 
                className="flex items-center border-2 border-white/20 rounded-xl bg-black/30 backdrop-blur-md px-3 sm:px-4 md:px-5 shadow-lg"
                style={{  height: '3rem'}}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mr-2 sm:mr-2.5 md:mr-3 hover:opacity-80 transition-opacity"
                  onClick={() => setShowCountryPicker(!showCountryPicker)}
                >
                  <span className="text-lg sm:text-xl md:text-2xl text-white">{country.flag}</span>
                  <span className="text-white font-medium text-xs sm:text-sm md:text-base">{country.code}</span>
                  <span className={`text-white/60 text-xs transition-transform ${showCountryPicker ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <span className="text-white/40 mr-2 sm:mr-2.5 md:mr-3">|</span>
                <input
                  type="tel"
                  className="flex-1 bg-transparent outline-none text-white text-xs sm:text-sm md:text-base placeholder-white/50"
                  placeholder="9642424298"
                  maxLength={mobileValidationRules[country.code]?.length || 10}
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className={`w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5 transition-all shadow-lg text-white ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
              style={{
                background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
              }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>
            
            {/* Already have an Account */}
            
            
            {/* Divider */}
            <div className="w-full flex items-center my-2 sm:my-3 md:my-4">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="px-2 sm:px-3 md:px-4 text-white/50 text-xs">(or)</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>
            
           <div className="flex justify-center items-center gap-1 sm:gap-1.5 mb-4 sm:mb-5 md:mb-6">
              <span className="text-white/70 text-xs sm:text-sm md:text-base">Already have an Account?</span>
              <button
                type="button"
                className="text-white font-semibold text-xs sm:text-sm md:text-base underline hover:text-white/90"
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
