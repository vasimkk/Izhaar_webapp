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
            // Check if it's the current user's mobile
            try {
              const profileRes = await api.get('/profile/me');
              const currentUserMobile = profileRes.data?.mobile;

              // If it's the current user's verified number, mark as verified
              if (currentUserMobile === senderMobile) {
                setIsVerified(true);
                if (!isVerified) {
                  toast.success("Your mobile number is already verified!");
                }
              } else {
                // If it's another user's verified number, show error and reset
                setIsVerified(false);
                toast.error("This mobile number is registered with another account. Please use your own number.");
                // Optionally reset the mobile field
                if (existingMobile) {
                  setSenderMobile(existingMobile);
                  setIsChangingMobile(false);
                }
              }
            } catch (profileErr) {
              console.error('Failed to fetch profile:', profileErr);
              setIsVerified(false);
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

      // First, check if this number is already verified by another user
      try {
        const checkRes = await api.post("/otp/check-verification", { mobile: senderMobile });

        if (checkRes.data.success && checkRes.data.isVerified) {
          // Check if it's verified by the current user or another user
          const profileRes = await api.get('/profile/me');
          const currentUserMobile = profileRes.data?.mobile;

          // If the number is verified but not by current user, show error
          if (currentUserMobile !== senderMobile) {
            toast.error("This mobile number is already registered with another account. Please use your own number.");
            setIsSendingOtp(false);
            return;
          }
        }
      } catch (checkErr) {
        // If check endpoint fails, continue with OTP send
        console.log("Verification check failed, continuing with OTP send");
      }

      const res = await api.post("/otp/send", { mobile: senderMobile });

      if (res.data.success) {
        toast.success("OTP sent successfully to your mobile!");
        setOtpSent(true);
        setCountdown(300); // 5 minutes
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send OTP";

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes("already registered") ||
        errorMessage.toLowerCase().includes("another account")) {
        toast.error("This mobile number is already registered with another account. Please use your own number.");
      } else {
        toast.error(errorMessage);
      }
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

        // Update the existing mobile if verification successful
        if (senderMobile !== existingMobile) {
          setExistingMobile(senderMobile);
          setIsChangingMobile(false);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid OTP. Please try again.";

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes("already verified") ||
        errorMessage.toLowerCase().includes("another user") ||
        errorMessage.toLowerCase().includes("another account")) {
        toast.error("This mobile number is already registered with another account.");
        // Reset the form
        setOtpSent(false);
        setOtp("");
        setSenderMobile("");
        setIsVerified(false);
      } else {
        toast.error(errorMessage);
      }
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

      <div className="min-h-screen w-full overflow-hidden relative" style={{
        background: 'var(--letter, linear-gradient(349deg, #01095E 0%, #000 103.43%))',
        backgroundAttachment: 'fixed'
      }}>

        {/* Ambient Background Lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px]" />
        </div>



        <style jsx>{`
          @keyframes floatIcon {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 0.2;
            }
            50% {
              transform: translate(-10px, -30px) rotate(10deg);
              opacity: 0.4;
            }
          }
          @keyframes glow {
             0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
             50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.5); }
          }
        `}</style>

        {/* Content */}

        <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 py-8">

          {/* Mobile Back Button */}
          <div className="w-full relative z-10 pt-2 md:pt-4">
            <button
              onClick={() => step === 1 ? navigate("/user/dashboard") : setStep(1)}
              className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white shadow-lg active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>

          <div className="w-full max-w-md mx-auto pt-8 sm:pt-12">
            {/* Header / Title Section */}
            <div className="text-center mb-10 px-4">
              <h1 className="text-3xl sm:text-4xl font-['Playfair_Display'] font-bold text-white mb-2 tracking-tight">Receiver Details</h1>
              <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full opacity-60" />
              <p className="text-[10px] text-pink-400 font-black uppercase tracking-[4px] mt-4">The First Step of Izhaar</p>
            </div>

            {/* Form Card */}
            <div
              className="rounded-3xl p-6 sm:p-10 shadow-3xl backdrop-blur-xl border border-white/10 relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Step Indicator */}
              <div className="mb-6">
                <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(step / 2) * 100}%`,
                      background: "linear-gradient(90deg, #F472B6 0%, #A855F7 50%, #3B82F6 100%)",
                      boxShadow: "0 0 10px rgba(168, 85, 247, 0.5)"
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-white/50">Step {step} of 2</span>
                  <span className="text-xs text-white font-medium tracking-wide">
                    {step === 1 ? "Receiver Details" : "Sender Verification"}
                  </span>
                </div>
              </div>

              {/* Card Title - Minimized for Mobile */}
              <h3 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold text-white mb-8 text-center">
                {step === 1 ? "Recipient Info" : "Security Check"}
              </h3>

              {/* Step 1: Receiver Details */}
              {step === 1 && (
                <form onSubmit={handleReceiverSubmit} className="flex flex-col gap-5">
                  {/* Name Input */}
                  <div className="group">
                    <label className="block text-sm font-medium text-white/80 mb-2 ml-1 group-focus-within:text-pink-400 transition-colors">
                      Receiver Name <span className="text-pink-500">*</span>
                    </label>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-black/20 text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 placeholder-white/30 backdrop-blur-sm transition-all focus:bg-black/30"
                      placeholder="Enter full name"
                      type="text"
                      value={receiverName}
                      onChange={e => setReceiverName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Mobile Input */}
                  <div className="group">
                    <label className="block text-sm font-medium text-white/80 mb-2 ml-1 group-focus-within:text-pink-400 transition-colors">
                      Mobile Number <span className="text-pink-500">*</span>
                    </label>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-black/20 text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 placeholder-white/30 backdrop-blur-sm transition-all focus:bg-black/30"
                      placeholder="10-digit mobile number"
                      type="tel"
                      maxLength={10}
                      value={receiverMobile}
                      onChange={e => setReceiverMobile(e.target.value.replace(/\D/g, ""))}
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className="group">
                    <label className="block text-sm font-medium text-white/80 mb-2 ml-1 group-focus-within:text-pink-400 transition-colors">
                      Email Address <span className="text-white/40 text-xs ml-1">(Optional)</span>
                    </label>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-black/20 text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 placeholder-white/30 backdrop-blur-sm transition-all focus:bg-black/30"
                      placeholder="name@example.com"
                      type="email"
                      value={receiverEmail}
                      onChange={e => setReceiverEmail(e.target.value)}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                      type="button"
                      className="px-8 bg-white/5 text-white/70 font-semibold py-2.5 text-[13px] rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 font-bold py-2.5 text-[13px] rounded-2xl transition-all shadow-lg text-white hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim())
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                        cursor: (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim()) ? 'not-allowed' : 'pointer',
                        opacity: (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim()) ? 0.5 : 1
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
                <form onSubmit={handleFinalSubmit} className="flex flex-col gap-5">
                  <p className="text-xs text-white/60 mb-2 text-center bg-white/5 py-2 rounded-lg border border-white/5">
                    Verify your number for delivery updates
                  </p>

                  {/* Sender Mobile Input */}
                  <div className="group">
                    <label className="block text-sm font-medium text-white/80 mb-2 ml-1 group-focus-within:text-pink-400 transition-colors">
                      Your Mobile Number <span className="text-pink-500">*</span>
                    </label>

                    {/* Show existing mobile with change option */}
                    {existingMobile && !isChangingMobile ? (
                      <div className="flex items-center justify-between p-3 rounded-xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
                        <div className="flex-1">
                          <p className="text-xs text-purple-300 mb-0.5">Current Verified Mobile</p>
                          <p className="text-base font-bold text-white tracking-wide">{existingMobile}</p>
                        </div>
                        <button
                          type="button"
                          className="ml-2 px-3 py-1.5 text-xs text-white/90 bg-white/10 font-semibold hover:bg-white/20 rounded-lg transition-colors border border-white/10"
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
                          className="w-full rounded-xl border border-white/10 bg-black/20 text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 placeholder-white/30 backdrop-blur-sm transition-all focus:bg-black/30"
                          placeholder="Enter your 10-digit mobile"
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
                            borderColor: isVerified ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255,255,255,0.1)',
                            paddingRight: isVerified ? '40px' : '16px'
                          }}
                        />
                        {isVerified && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-lg drop-shadow-md">✓</span>
                        )}
                        {isChangingMobile && (
                          <button
                            type="button"
                            className="mt-3 text-sm text-pink-300 hover:text-pink-200 transition-colors flex items-center gap-1"
                            onClick={() => {
                              setIsChangingMobile(false);
                              setSenderMobile(existingMobile);
                              setIsVerified(false);
                              setOtpSent(false);
                              setOtp("");
                            }}
                          >
                            <span>←</span> Use existing number
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* OTP Section */}
                  {isVerified ? (
                    <div className="flex items-center justify-center p-3 rounded-xl border border-green-500/30 bg-green-500/10 backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                      <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm font-bold text-green-400">Verified Successfully</p>
                    </div>
                  ) : (
                    <div>
                      {!otpSent ? (
                        <button
                          type="button"
                          className="w-full text-white font-bold text-sm rounded-xl py-3.5 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                          style={{
                            background: senderMobile.length === 10 && !isSendingOtp
                              ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                              : 'rgba(255,255,255,0.1)',
                            boxShadow: senderMobile.length === 10 ? '0 0 20px rgba(139, 92, 246, 0.4)' : 'none',
                          }}
                          onClick={sendOtp}
                          disabled={senderMobile.length !== 10 || isSendingOtp}
                        >
                          {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                        </button>
                      ) : (
                        <>
                          {/* OTP Input */}
                          <div className="mb-4 group">
                            <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
                              Enter OTP <span className="text-pink-500">*</span>
                            </label>
                            <input
                              type="tel"
                              className="w-full rounded-xl border border-white/10 bg-black/20 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 placeholder-white/20 backdrop-blur-sm text-center text-2xl tracking-[0.5em] font-mono transition-all focus:bg-black/30"
                              placeholder="••••••"
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

                          <div className="flex gap-3">
                            <button
                              type="button"
                              className="flex-1 text-white font-bold text-sm rounded-xl py-3.5 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                              style={{
                                background: otp.length === 6 && !isVerifying
                                  ? 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)'
                                  : 'rgba(255,255,255,0.1)',
                                boxShadow: otp.length === 6 ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
                              }}
                              onClick={verifyOtp}
                              disabled={otp.length !== 6 || isVerifying}
                            >
                              {isVerifying ? "Verifying..." : "Verify OTP"}
                            </button>
                            <button
                              type="button"
                              className="flex-1 text-white/80 font-semibold text-sm py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                              onClick={sendOtp}
                              disabled={countdown > 0 || isSendingOtp}
                            >
                              {countdown > 0
                                ? `Resend in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
                                : "Resend OTP"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-white/10">
                    <button
                      type="button"
                      className="px-8 bg-white/5 backdrop-blur-sm text-white/70 font-semibold py-2.5 text-[13px] rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-8 font-bold py-2.5 text-[13px] rounded-2xl transition-all shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: (loading || !isVerified)
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                        boxShadow: (!loading && isVerified) ? '0 0 25px rgba(233, 30, 99, 0.5)' : 'none',
                        cursor: (loading || !isVerified) ? 'not-allowed' : 'pointer'
                      }}
                      disabled={loading || !isVerified}
                    >
                      {loading ? "Submitting..." : "Continue ➜"}
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
