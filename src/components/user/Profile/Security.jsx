import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../utils/api";

export default function Security() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showVerifyMobile, setShowVerifyMobile] = useState(false);
  
  const [mobileNumber, setMobileNumber] = useState("");
  const [currentMobile, setCurrentMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Fetch current mobile number
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        const profile = res.data.profile || res.data;
        setCurrentMobile(profile.mobile || "");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Send OTP
  const sendOtp = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setIsSendingOtp(true);
      const res = await api.post("/otp/send", { mobile: mobileNumber });
      
      if (res.data.success) {
        toast.success("OTP sent successfully to your mobile!");
        setOtpSent(true);
        setCountdown(60);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP and update mobile
  const verifyAndUpdateMobile = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      
      // Verify OTP
      const verifyRes = await api.post("/otp/verify", { 
        mobile: mobileNumber, 
        otp: otp 
      });
      
      if (verifyRes.data.success || verifyRes.data.verified) {
        // Update profile with new mobile number
        const profileRes = await api.get("/profile/me");
        const profile = profileRes.data.profile || profileRes.data;
        
        await api.put(`/profile/${profile.id}`, {
          ...profile,
          mobile: mobileNumber
        });
        
        toast.success("Mobile number updated successfully!");
        setCurrentMobile(mobileNumber);
        setMobileNumber("");
        setOtp("");
        setOtpSent(false);
        setShowVerifyMobile(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="min-h-screen w-full overflow-hidden relative" style={{
        background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
        animation: 'gradientShift 15s ease infinite'
      }}>
        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10">
          {/* Mobile Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(212, 197, 232, 0.3)',
              boxShadow: '0 4px 12px rgba(45, 27, 78, 0.15)'
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2.5} 
              stroke="currentColor" 
              className="w-5 h-5 text-[#2D1B4E]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Header */}
          <div className="w-full flex flex-col items-center mb-6 sm:mb-8">
            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D1B4E] tracking-tight">Mobile Verification</h4>
            <div className="mt-3 h-px w-full max-w-2xl bg-purple-200/30" />
          </div>

          <div className="w-full max-w-2xl">
            {/* Current Mobile Number Display */}
            {currentMobile && (
              <div className="rounded-2xl p-6 mb-4 shadow-xl backdrop-blur-lg border border-purple-200/30"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 255, 240, 0.95) 100%)'
                }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm text-[#6B5B8E] mb-1">Current Number</h3>
                    <p className="text-xl font-bold text-[#2D1B4E]">{currentMobile}</p>
                  </div>
                  <span className="text-green-600 text-2xl">✓</span>
                </div>
              </div>
            )}

            {/* Update Mobile Number Card */}
            <div className="rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-lg border border-purple-200/30"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 240, 255, 0.95) 100%)'
              }}>
              <h3 className="text-lg font-bold text-[#2D1B4E] mb-6">Update Mobile Number</h3>

              <div className="space-y-4">
                {/* Mobile Number Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#2D1B4E] mb-2">New Mobile Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-md text-[#2D1B4E] border-2 border-purple-200 placeholder-[#6B5B8E]/50 focus:outline-none focus:border-purple-500 transition-all"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setMobileNumber(value);
                        setOtpSent(false);
                        setOtp("");
                      }
                    }}
                    maxLength="10"
                    disabled={otpSent}
                  />
                </div>

                {/* Send OTP Button */}
                {!otpSent ? (
                  <button
                    type="button"
                    className="w-full text-white font-bold rounded-xl py-3 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: mobileNumber.length === 10 && !isSendingOtp 
                        ? 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)' 
                        : 'gray',
                      boxShadow: mobileNumber.length === 10 ? '0 4px 15px 0 rgba(233, 30, 99, 0.4)' : 'none',
                    }}
                    onClick={sendOtp}
                    disabled={mobileNumber.length !== 10 || isSendingOtp}
                  >
                    {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                  </button>
                ) : (
                  <>
                    {/* OTP Input */}
                    <div>
                      <label className="block text-sm font-semibold text-[#2D1B4E] mb-2">Enter OTP</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-md text-[#2D1B4E] border-2 border-purple-200 placeholder-[#6B5B8E]/50 focus:outline-none focus:border-purple-500 transition-all text-center text-2xl tracking-widest"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 6) {
                            setOtp(value);
                          }
                        }}
                        maxLength="6"
                      />
                    </div>

                    {/* Verify Button */}
                    <button
                      type="button"
                      className="w-full text-white font-bold rounded-xl py-3 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: otp.length === 6 && !isVerifying 
                          ? 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)' 
                          : 'gray',
                        boxShadow: otp.length === 6 ? '0 4px 15px 0 rgba(233, 30, 99, 0.4)' : 'none',
                      }}
                      onClick={verifyAndUpdateMobile}
                      disabled={otp.length !== 6 || isVerifying}
                    >
                      {isVerifying ? "Verifying..." : "Verify OTP"}
                    </button>

                    {/* Resend Button */}
                    <button
                      type="button"
                      className="w-full text-[#6B5B8E] font-semibold py-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={sendOtp}
                      disabled={countdown > 0 || isSendingOtp}
                    >
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
