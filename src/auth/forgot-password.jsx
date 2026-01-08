

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import bgimg from "../assets/images/bg.png";
import couplePose from "../assets/images/couple_pose_1.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      return alert("Enter a valid 10-digit mobile number");
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password/send-otp", { mobile });
      
      // Navigate to OTP screen
      navigate("/otp", {
        state: { mobile, type: "forgot" },
      });
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

        {/* Right Side - Forgot Password Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-white/20"
            style={{
              borderRadius: '18px',
              background: 'rgba(0, 0, 0, 0.28)',
              boxShadow: '0 4px 31px 0 rgba(0, 0, 0, 0.38)',
              backdropFilter: 'blur(48.25px)'
            }}
            onSubmit={sendOtp}
          >
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Forgot Password?</h2>
              <p className="text-white/80 text-xs sm:text-sm">
                Enter your mobile number to receive a verification code.
              </p>
            </div>

            {/* Mobile Input */}
            <div className="w-full mb-6 sm:mb-8">
              <input
                type="tel"
                className="w-full px-4 py-3 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-center text-lg font-semibold"
                style={{
                  background: 'rgba(0, 0, 0, 0.28)'
                }}
                placeholder="Mobile Number"
                keyboardType="tel"
                maxLength={10}
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

            {/* Send OTP Button */}
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
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            {/* Back to Login Link */}
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
