import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [country, setCountry] = useState({
    name: "India",
    code: "+91",
    flag: "🇮🇳",
  });
  const [formStep, setFormStep] = useState(1);

  // OTP related states
  const [showOtpView, setShowOtpView] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Real-time validation error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const countries = [
    { name: "India", code: "+91", flag: "🇮🇳" },
    { name: "United States", code: "+1", flag: "🇺🇸" },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { name: "Canada", code: "+1", flag: "🇨🇦" },
    { name: "Australia", code: "+61", flag: "🇦🇺" },
    { name: "Germany", code: "+49", flag: "🇩🇪" },
    { name: "France", code: "+33", flag: "🇫🇷" },
    { name: "Singapore", code: "+65", flag: "🇸🇬" },
    { name: "UAE", code: "+971", flag: "🇦🇪" },
    { name: "Nepal", code: "+977", flag: "🇳🇵" },
  ];

  const mobileValidationRules = {
    "+91": { length: 10, regex: /^[6-9]\d{9}$/, flag: "🇮🇳" },
    "+1": { length: 10, regex: /^\d{10}$/, flag: "🇺🇸" },
    "+44": { length: 10, regex: /^\d{10}$/, flag: "🇬🇧" },
    "+61": { length: 9, regex: /^\d{9}$/, flag: "🇦🇺" },
    "+49": { length: 10, regex: /^\d{10}$/, flag: "🇩🇪" },
    "+33": { length: 9, regex: /^\d{9}$/, flag: "🇫🇷" },
    "+65": { length: 8, regex: /^\d{8}$/, flag: "🇸🇬" },
    "+971": { length: 9, regex: /^\d{9}$/, flag: "🇦🇪" },
    "+977": { length: 10, regex: /^\d{10}$/, flag: "🇳🇵" },
  };

  // Timer for resend
  React.useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateEmail = (value = email) => {
    const trimmedEmail = value.trim();
    if (!trimmedEmail) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return "Please enter a valid email address";
    return "";
  };

  const handleSendOtp = async () => {
    const err = validateEmail();
    if (err) {
      toast.error(err);
      setEmailError(err);
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await api.post("/auth/register-send-otp", { email: email.trim() });
      if (res.data.success) {
        toast.success("OTP sent to your email!");
        setShowOtpView(true);
        setOtpTimer(300); // 5 minutes
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length < 4) {
      toast.error("Please enter 4-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register-verify-otp", {
        email: email.trim(),
        otp: otpString,
      });
      if (res.data.success) {
        toast.success("Email verified successfully!");
        setIsEmailVerified(true);
        setShowOtpView(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // OTP inputs handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleNextStep = () => {
    const nameErr = validateName();
    const mobileErr = validateMobile();
    const emailErr = validateEmail();

    if (nameErr || mobileErr || emailErr) {
      toast.error("Please fill all details correctly");
      setNameError(nameErr);
      setMobileError(mobileErr);
      setEmailError(emailErr);
      return;
    }

    if (!isEmailVerified) {
      toast.warn("Please verify your email first");
      return;
    }

    setFormStep(2);
  };

  const validateName = (value = name) => {
    const trimmedName = value.trim();
    if (!trimmedName) return "Name is required";
    if (trimmedName.length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateMobile = (value = mobile) => {
    if (!value) return "Phone number is required";
    const rule = mobileValidationRules[country.code];
    if (value.length !== rule.length) return `Must be ${rule.length} digits`;
    return "";
  };

  const validatePassword = (value = password) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Min 6 characters required";
    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      toast.warn("Please verify your email first");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const nameErr = validateName();
    const mobileErr = validateMobile();
    const passwordErr = validatePassword();

    if (nameErr || mobileErr || passwordErr) {
      toast.error("Please fix errors before signing up");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        mobile,
        password,
      });

      if (auth?.setAccessToken) auth.setAccessToken(res.data.accessToken);
      if (auth?.setRefreshToken) await auth.setRefreshToken(res.data.refreshToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
      toast.success("Registration successful!");
      navigate("/welcome", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)",
      }}
    >
      <ToastContainer position="top-center" theme="dark" />

      {/* Mobile Back Button */}
      <button
        onClick={() => navigate("/entry")}
        className="md:hidden fixed top-6 left-5 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-xl shadow-2xl transition-all active:scale-90"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5 text-white/80"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Gradient Background Layer */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "#000",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)",
            animation: "float 20s ease-in-out infinite",
          }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 md:px-8 py-8 relative z-10">
        {/* Registration Form View */}
        {!showOtpView && (
          <div className="w-full flex justify-center animate-fadeInUp">
            <form
              className="w-full max-w-[420px] p-5 sm:p-10 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.3)] relative overflow-hidden transition-all duration-500"
              onSubmit={handleRegister}
            >
              {/* Soft Romantic Gradients */}
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/20 blur-[100px] rounded-full"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full"></div>

              <div
                className="mb-6 sm:mb-8 text-center relative z-10"
                style={{ animation: "fadeInUp 1s ease-out 0.3s both" }}
              >
                <h2
                  className="text-[24px] sm:text-[36px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EC4891] to-[#A928ED] tracking-tight mb-2"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    animation: "textGlow 3s ease-in-out infinite",
                  }}
                >
                  Create account
                </h2>
                <p className="text-[#D1D5DC] text-[12px] sm:text-[13px] font-semibold leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Join Izhaar and begin something beautiful.
                </p>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${formStep >= 1 ? 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,145,0.5)]' : 'bg-white/10'}`} />
                  <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${formStep >= 2 ? 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,145,0.5)]' : 'bg-white/10'}`} />
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {formStep === 1 ? (
                  <>
                    {/* User Name */}
                    <div style={{ animation: "fadeInUp 0.8s ease-out both" }}>
                      <label className="block text-xs sm:text-sm text-gray-300 mb-1.5 font-semibold tracking-wider ml-1">
                        User Name <span className="text-pink-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 h-[48px] rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm focus:outline-none focus:border-pink-500/50 focus:bg-white/10 border border-white/10 placeholder-gray-500 transition-all"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setNameError("");
                        }}
                        required
                      />
                      {nameError && <p className="text-[10px] text-pink-500 ml-1 mt-1 font-bold">{nameError}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div style={{ animation: "fadeInUp 0.8s ease-out 0.1s both" }}>
                      <label className="block text-xs sm:text-sm text-gray-300 mb-1.5 font-semibold tracking-wider ml-1">
                        Mobile number <span className="text-pink-500">*</span>
                      </label>
                      <div className={`flex items-center h-[48px] bg-white/5 backdrop-blur-md border ${mobileError ? 'border-pink-500/50' : 'border-white/10'} rounded-2xl px-4 shadow-lg`}>
                        <button
                          type="button"
                          onClick={() => setShowCountryPicker(!showCountryPicker)}
                          className="flex items-center gap-2 pr-3 border-r border-white/10"
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="text-white text-sm font-bold">{country.code}</span>
                          <span className="text-[10px] text-gray-400">▼</span>
                        </button>
                        <input
                          type="tel"
                          className="flex-1 bg-transparent text-white text-sm ml-4 outline-none placeholder-gray-500"
                          placeholder="9688665555"
                          value={mobile}
                          onChange={(e) => {
                            setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                            setMobileError("");
                          }}
                        />
                      </div>
                      {mobileError && <p className="text-[10px] text-pink-500 ml-1 mt-1 font-bold">{mobileError}</p>}
                    </div>

                    {/* Email Address */}
                    <div className="relative" style={{ animation: "fadeInUp 0.8s ease-out 0.2s both" }}>
                      <label className="block text-xs sm:text-sm text-gray-300 mb-1.5 font-semibold tracking-wider ml-1">
                        Email <span className="text-pink-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          className={`w-full px-5 h-[48px] rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm focus:outline-none focus:border-pink-500/50 focus:bg-white/10 border ${emailError ? 'border-pink-500/50' : 'border-white/10'} placeholder-gray-500 transition-all pr-20`}
                          placeholder="Enter mail Id"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                            if (isEmailVerified) setIsEmailVerified(false);
                          }}
                          required
                        />
                        {!isEmailVerified ? (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-black text-pink-400/60 hover:text-pink-400 transition-colors uppercase tracking-tighter"
                            disabled={isSendingOtp}
                          >
                            {isSendingOtp ? "..." : "Verify"}
                          </button>
                        ) : (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-xs sm:text-sm font-bold flex items-center gap-1">
                            Verified ✓
                          </span>
                        )}
                      </div>
                      {emailError && <p className="text-[10px] text-pink-500 ml-1 mt-1 font-bold">{emailError}</p>}
                    </div>

                    <div className="pt-4" style={{ animation: "fadeInUp 0.8s ease-out 0.3s both" }}>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className={`w-full h-[40px] transition-all border flex items-center justify-center gap-2 group relative overflow-hidden rounded-2xl font-bold ${isEmailVerified
                            ? "bg-gradient-to-r from-[#de238d] to-[#9130e5] text-white border-white/20 shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98]"
                            : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                          }`}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Next Step <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                        </span>
                        {isEmailVerified && (
                          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer" />
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Password Fields wrapper */}
                    <div className="space-y-4" style={{ animation: "fadeInUp 0.8s ease-out both" }}>
                      <div>
                        <label className="block text-xs sm:text-sm text-gray-300 mb-1.5 font-semibold tracking-wider ml-1">
                          Create Password <span className="text-pink-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-5 h-[48px] rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm focus:outline-none focus:border-pink-500/50 focus:bg-white/10 border border-white/10 placeholder-gray-500 transition-all"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-black text-pink-400/60 hover:text-pink-400 transition-colors tracking-tighter"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Hide" : "See"}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm text-gray-300 mb-1.5 font-semibold tracking-wider ml-1">
                          Re-enter Password <span className="text-pink-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full px-5 h-[48px] rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm focus:outline-none focus:border-pink-500/50 focus:bg-white/10 border border-white/10 placeholder-gray-500 transition-all"
                            placeholder="Enter here"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-black text-pink-400/60 hover:text-pink-400 transition-colors tracking-tighter"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? "Hide" : "See"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 grid grid-cols-2 gap-3" style={{ animation: "fadeInUp 0.8s ease-out 0.1s both" }}>
                      <button
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="h-[40px] bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-2xl transition-all border border-white/10"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className={`h-[40px] bg-gradient-to-r from-[#de238d] to-[#9130e5] text-white font-bold rounded-2xl shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/20 flex items-center justify-center relative overflow-hidden ${loading ? "opacity-60" : ""}`}
                        disabled={loading}
                      >
                        <span className="relative z-10">{loading ? "..." : "Sign Up"}</span>
                        {!loading && (
                          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer" />
                        )}
                      </button>
                    </div>
                  </>
                )}

                <div className="flex justify-center items-center gap-2 pt-2" style={{ animation: "fadeInUp 1s ease-out 0.9s both" }}>
                  <span className="text-gray-500 text-[10px] font-black tracking-widest uppercase">
                    Already have an account?
                  </span>
                  <button
                    type="button"
                    className="font-black text-xs sm:text-sm underline transition-all duration-300 hover:scale-110"
                    style={{
                      background: 'linear-gradient(to right, #ec4899, #a855f7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* OTP Verification View */}
        {showOtpView && (
          <div className="w-full flex justify-center animate-fadeInUp">
            <div className="w-full max-w-[420px] p-6 sm:p-10 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.3)] relative overflow-hidden">
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/20 blur-[100px] rounded-full"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full"></div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>
                OTP Verification
              </h2>
              <p className="text-[#D1D5DC] text-[12px] sm:text-sm mb-8 sm:mb-10 leading-relaxed relative z-10">
                Enter the OTP sent to your registered Email id to complete verification
              </p>

              <div className="flex justify-between gap-3 mb-8 relative z-10">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/20 text-white text-xl sm:text-2xl font-bold text-center focus:border-[#ec4891] outline-none transition-all shadow-lg backdrop-blur-md"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  />
                ))}
              </div>

              <div className="text-center mb-8 sm:mb-10 relative z-10 font-bold tracking-widest text-[10px]">
                <span className="text-gray-500 uppercase">Didn't get code? </span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpTimer > 0}
                  className={`text-[#ec4891] font-black uppercase ${otpTimer > 0 ? "opacity-40 cursor-not-allowed" : "hover:underline"}`}
                >
                  {otpTimer > 0
                    ? `Resend in ${Math.floor(otpTimer / 60)}:${String(otpTimer % 60).padStart(2, '0')}`
                    : "Resend it"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full h-[44px] sm:h-[48px] bg-gradient-to-r from-[#de238d] to-[#9130e5] text-white font-bold rounded-2xl shadow-lg shadow-pink-500/20 active:scale-95 transition-all relative z-10 border border-white/20"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>

              <button
                type="button"
                onClick={() => setShowOtpView(false)}
                className="w-full mt-4 text-gray-500 font-bold text-[10px] tracking-widest uppercase hover:text-gray-400 relative z-10"
              >
                Go back
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
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
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}