
import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import bgimg from "../assets/images/bg.png";
import couplePose from "../assets/images/couple_pose_1.png";

export default function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile || "";
  const type = location.state?.type || "register";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 4) return alert("Enter valid 4-digit OTP");
    setLoading(true);
    try {
      let endpoint = "";
      if (type === "forgot") {
        endpoint = "/auth/forgot-password/verify-otp";
      } else {
        endpoint = "/auth/verify-otp";
      }
      await api.post(endpoint, { mobile, otp: otpString });
      if (type === "forgot") {
        navigate("/reset-password", { state: { mobile } });
      } else {
        navigate("/create-password", { state: { mobile } });
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const regenerateOtp = async () => {
    try {
      let endpoint = "";
      if (type === "forgot") {
        endpoint = "/auth/forgot-password/regenerate-otp";
      } else {
        endpoint = "/auth/regenerate-otp";
      }
      await api.post(endpoint, { mobile });
      alert("New OTP sent!");
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      alert(err.response?.data?.message || "Error sending new OTP");
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
        {/* Right Side - OTP Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-white/20"
            style={{
              borderRadius: '18px',
              background: 'rgba(0, 0, 0, 0.28)',
              boxShadow: '0 4px 31px 0 rgba(0, 0, 0, 0.38)',
              backdropFilter: 'blur(48.25px)'
            }}
            onSubmit={verifyOTP}
          >
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Check your phone</h2>
              <p className="text-white/80 text-xs sm:text-sm">
                We've sent you a code via SMS. Please enter it to continue.
              </p>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className="w-12 h-12 sm:w-14 sm:h-14 border border-white/20 rounded-lg text-white text-center text-lg sm:text-xl font-bold outline-none transition-all"
                  style={{
                    background: 'rgba(0, 0, 0, 0.28)'
                  }}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className={`w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5 transition-all shadow-lg text-white ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{
                background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
              }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Resend OTP */}
            <button
              type="button"
              className="w-full text-white/90 text-xs sm:text-sm font-medium underline hover:text-white transition-colors"
              onClick={regenerateOtp}
            >
              Resend OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
