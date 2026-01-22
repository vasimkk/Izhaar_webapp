import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReceiverForLetter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setReceiverDetails } = useReceiverForLetter();

  // Step management
  const [step, setStep] = useState(1); // 1: Receiver Details, 2: Sender Verification

  // Receiver details
  const [receiverName, setReceiverName] = useState("");
  const [receiverMobile, setReceiverMobile] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverInstagramId, setReceiverInstagramId] = useState("");
  
  // Sender verification
  const [senderMobile, setSenderMobile] = useState("");
  const [existingMobile, setExistingMobile] = useState("");
  const [isChangingMobile, setIsChangingMobile] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const [loading, setLoading] = useState(false);

  // Fetch existing user mobile number
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/profile/me');
        if (response.data?.mobile) {
          setExistingMobile(response.data.mobile);
          setSenderMobile(response.data.mobile);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Check if mobile is already verified when step changes to 2 or mobile changes
  useEffect(() => {
    const checkVerification = async () => {
      if (step === 2 && senderMobile && senderMobile.length === 10) {
        try {
          console.log('Checking verification for mobile:', senderMobile);
          const res = await api.post("/otp/check-verification", { mobile: senderMobile });
          console.log('Verification check response:', res.data);
          
          if (res.data.success && res.data.isVerified) {
            setIsVerified(true);
            if (!isVerified) {
              toast.success("Your mobile number is already verified!");
            }
          } else {
            // Mobile is not verified, reset verification state
            console.log('Mobile not verified:', res.data);
            setIsVerified(false);
          }
        } catch (error) {
          // Silently fail if endpoint doesn't exist or verification check fails
          // User can still verify via OTP
          console.error('Verification check error:', error.response?.status, error.message);
          if (error.response?.status !== 404) {
            console.error('Failed to check verification:', error);
          }
          // Reset verification state on error
          setIsVerified(false);
        }
      }
    };
    checkVerification();
  }, [step, senderMobile]);

  const isValidMobile = (value) => /^\d{10}$/.test(value.trim());
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  // Send OTP to sender
  const sendOtp = async () => {
    if (!senderMobile || senderMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setIsSendingOtp(true);
      const res = await api.post("/otp/send", { mobile: senderMobile });
      
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

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await api.post("/otp/verify", { 
        mobile: senderMobile, 
        otp: otp 
      });
      
      if (res.data.success || res.data.verified) {
        toast.success("Mobile number verified successfully!");
        setIsVerified(true);
        setOtpSent(false);
        setOtp("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Step 1: Receiver Details
  const handleReceiverSubmit = (e) => {
    e.preventDefault();
    const hasValidMobile = isValidMobile(receiverMobile);
    const hasValidEmail = isValidEmail(receiverEmail);
    const hasInstagramId = !!receiverInstagramId.trim();

    if (!hasValidMobile && !hasValidEmail && !hasInstagramId) {
      toast.warning("Enter at least one: Mobile or Email or Instagram ID");
      return;
    }

    setStep(2); // Move to sender verification step
  };

  // Handle Step 2: Final submission
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    
    if (!isVerified) {
      toast.warning("Please verify your mobile number first");
      return;
    }

    setLoading(true);
    try {
      const hasValidMobile = isValidMobile(receiverMobile);
      const hasValidEmail = isValidEmail(receiverEmail);
      const hasInstagramId = !!receiverInstagramId.trim();

      const payload = {
        receiverName: receiverName.trim() || null,
        receiverMobile: hasValidMobile ? receiverMobile : null,
        receiverEmail: hasValidEmail ? receiverEmail : null,
        receiverInstagramId: hasInstagramId ? receiverInstagramId : null,
        senderMobile: senderMobile, // Add sender mobile for delivery status
      };
      
      const res = await api.post("/chat/receiver", payload);
      setReceiverDetails(res.data);
      
      toast.success("Details submitted successfully!");
      
      const cameFromSongFlow = location.state?.from === "/user/song" || location.state?.from === "/user/song/payment-subscription";
      if (cameFromSongFlow) {
        navigate("/user/song/create", { replace: true });
      } else {
        navigate("/user/letter-izhaar/write-prompt", { state: { data: res.data } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setReceiverName("");
    setReceiverMobile("");
    setReceiverEmail("");
    setReceiverInstagramId("");
    navigate(-1);
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
      
      <div className="min-h-screen w-full overflow-hidden relative">
      {/* Content */}
      
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 py-8"  style={{
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
          animation: 'gradientShift 15s ease infinite'
        }}>
        
        {/* Mobile Back Button */}
        <div className="w-full relative z-10 pt-2 md:pt-4">
        <button
        onClick={() => step === 1 ? navigate("/user/dashboard") : setStep(1)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
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
        </div>
          
        <div className="w-full max-w-md mx-auto">
          {/* Form Card */}
          <div
            className="rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-lg border border-white/10"
           style={{
              borderColor: 'rgba(212, 197, 232, 0.3)',
              background: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px 0 rgba(45, 27, 78, 0.15), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
              animation: 'glow 4s ease-in-out infinite'
            }}
          >
            {/* Step Indicator */}
            <div className="mb-4">
              <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(step / 2) * 100}%`,
                    background: "linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)",
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-neutral-400">Step {step} of 2</span>
                <span className="text-xs text-[#2D1B4E] font-medium">
                  {step === 1 ? "Receiver Details" : "Sender Verification"}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 text-center">
              {step === 1 ? "Receiver Details?" : "Your Contact Details"}
            </h3>
            
            {/* Step 1: Receiver Details */}
            {step === 1 && (
              <form onSubmit={handleReceiverSubmit} className="flex flex-col gap-3">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-black mb-1.5">
                  Receiver Name <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full rounded-lg border border-black bg-white/10 text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 backdrop-blur-sm"
                  placeholder="John Doe"
                  type="text"
                  value={receiverName}
                  onChange={e => setReceiverName(e.target.value)}
                  required
                />
              </div>

              {/* Mobile Input */}
              <div>
                <label className="block text-sm font-medium text-black mb-1.5">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full rounded-lg border border-black bg-white/10 text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 backdrop-blur-sm"
                  placeholder="10-digit mobile"
                  type="tel"
                  maxLength={10}
                  value={receiverMobile}
                  onChange={e => setReceiverMobile(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-black mb-1.5">
                  Email Address <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <input
                  className="w-full rounded-lg border border-black bg-white/10 text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 backdrop-blur-sm"
                  placeholder="your@email.com"
                  type="email"
                  value={receiverEmail}
                  onChange={e => setReceiverEmail(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 mt-3">
                <button
                  type="button"
                  className="flex-1 bg-white/20 backdrop-blur-sm text-black font-semibold py-2.5 text-sm rounded-lg border border-black hover:bg-white/30 transition-all"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 font-semibold py-2.5 text-sm rounded-lg transition-all shadow-lg text-white"
                  style={{
                    background: (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim())
                      ? 'rgba(100, 100, 100, 0.5)'
                      : 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                    cursor: (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim()) ? 0.6 : 1
                  }}
                  disabled={!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim()}
                >
                  Continue ➜
                </button>
              </div>
            </form>
            )}

            {/* Step 2: Sender Verification */}
            {step === 2 && (
              <form onSubmit={handleFinalSubmit} className="flex flex-col gap-3">
                <p className="text-xs text-gray-600 mb-1 text-center">
                  Verify your mobile number to receive delivery status updates
                </p>

                {/* Sender Mobile Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Your Mobile Number <span className="text-red-400">*</span>
                  </label>
                  
                  {/* Show existing mobile with change option */}
                  {existingMobile && !isChangingMobile ? (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-purple-200 bg-purple-50/50 backdrop-blur-sm">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">Current Mobile</p>
                        <p className="text-sm font-semibold text-black">{existingMobile}</p>
                      </div>
                      <button
                        type="button"
                        className="ml-2 px-3 py-1 text-xs text-purple-600 font-semibold hover:text-purple-800 hover:bg-purple-100 rounded-md transition-colors"
                        onClick={() => {
                          setIsChangingMobile(true);
                          setSenderMobile("");
                          setIsVerified(false);
                          setOtpSent(false);
                          setOtp("");
                        }}
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        className="w-full rounded-lg border border-black bg-white/10 text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 backdrop-blur-sm"
                        placeholder="Enter 10-digit mobile number"
                        type="tel"
                        maxLength={10}
                        value={senderMobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            setSenderMobile(value);
                            setIsVerified(false);
                            setOtpSent(false);
                            setOtp("");
                          }
                        }}
                        disabled={otpSent || isVerified}
                        style={{
                          borderColor: isVerified ? 'rgba(34, 197, 94, 0.5)' : 'black',
                          paddingRight: isVerified ? '36px' : '12px'
                        }}
                      />
                      {isVerified && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-lg">✓</span>
                      )}
                      {isChangingMobile && (
                        <button
                          type="button"
                          className="mt-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                          onClick={() => {
                            setIsChangingMobile(false);
                            setSenderMobile(existingMobile);
                            setIsVerified(false);
                            setOtpSent(false);
                            setOtp("");
                          }}
                        >
                          ← Use existing number
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* OTP Section */}
                {isVerified ? (
                  <div className="flex items-center justify-center p-2.5 rounded-lg border border-green-200 bg-green-50/50 backdrop-blur-sm">
                    <svg className="w-4 h-4 text-green-600 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-xs font-semibold text-green-700">Your mobile number is verified</p>
                  </div>
                ) : (
                  <div>
                    {!otpSent ? (
                      <button
                        type="button"
                        className="w-full text-white font-semibold text-sm rounded-lg py-2.5 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: senderMobile.length === 10 && !isSendingOtp 
                            ? 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)' 
                            : 'gray',
                          boxShadow: senderMobile.length === 10 ? '0 4px 15px 0 rgba(233, 30, 99, 0.4)' : 'none',
                        }}
                        onClick={sendOtp}
                        disabled={senderMobile.length !== 10 || isSendingOtp}
                      >
                        {isSendingOtp ? "Sending..." : "Send OTP"}
                      </button>
                    ) : (
                      <>
                        {/* OTP Input */}
                        <div className="mb-2.5">
                          <label className="block text-sm font-medium text-black mb-1.5">
                            Enter OTP <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="tel"
                            className="w-full rounded-lg border border-black bg-white/10 text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 backdrop-blur-sm text-center text-xl tracking-widest"
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

                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="flex-1 text-white font-semibold text-sm rounded-lg py-2.5 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{
                              background: otp.length === 6 && !isVerifying 
                                ? 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)' 
                                : 'gray',
                              boxShadow: otp.length === 6 ? '0 4px 15px 0 rgba(233, 30, 99, 0.4)' : 'none',
                            }}
                            onClick={verifyOtp}
                            disabled={otp.length !== 6 || isVerifying}
                          >
                            {isVerifying ? "Verifying..." : "Verify"}
                          </button>
                          <button
                            type="button"
                            className="flex-1 text-black font-semibold text-sm py-2.5 rounded-lg border border-black bg-white/20 hover:bg-white/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={sendOtp}
                            disabled={countdown > 0 || isSendingOtp}
                          >
                            {countdown > 0 ? `${countdown}s` : "Resend"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 mt-3">
                  <button
                    type="button"
                    className="flex-1 bg-white/20 backdrop-blur-sm text-black font-semibold py-2.5 text-sm rounded-lg border border-black hover:bg-white/30 transition-all"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 font-semibold py-2.5 text-sm rounded-lg transition-all shadow-lg text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: (loading || !isVerified)
                        ? 'rgba(100, 100, 100, 0.5)'
                        : 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                      cursor: (loading || !isVerified) ? 'not-allowed' : 'pointer',
                      opacity: (loading || !isVerified) ? 0.6 : 1
                    }}
                    disabled={loading || !isVerified}
                  >
                    {loading ? "Submitting..." : "Submit ✓"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

