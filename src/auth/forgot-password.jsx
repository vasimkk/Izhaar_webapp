import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import couplePose from "../assets/images/C.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [authProvider, setAuthProvider] = useState(null); // To store the auth provider type
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  useEffect(() => {
    // Restore state from local storage on component mount
    const savedStep = localStorage.getItem("forgotPasswordStep");
    const savedEmail = localStorage.getItem("forgotPasswordEmail");
    const savedOtp = localStorage.getItem("forgotPasswordOtp");
    const savedTimeLeft = localStorage.getItem("forgotPasswordTimeLeft");

    if (savedStep) setStep(Number(savedStep));
    if (savedEmail) setEmail(savedEmail);
    if (savedOtp) setOtp(savedOtp);
    if (savedTimeLeft) setTimeLeft(Number(savedTimeLeft));
  }, []);

  useEffect(() => {
    // Save state to local storage whenever it changes
    localStorage.setItem("forgotPasswordStep", step);
    localStorage.setItem("forgotPasswordEmail", email);
    localStorage.setItem("forgotPasswordOtp", otp);
    localStorage.setItem("forgotPasswordTimeLeft", timeLeft);
  }, [step, email, otp, timeLeft]);

  useEffect(() => {
    if (timeLeft > 0 && step === 2) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0) {
      setCanResend(true);
    }
  }, [timeLeft, step]);

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      return alert("Please enter a valid email address");
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/forgot-password/check-auth-provider", { email });
      const { auth_provider } = response.data;
      setAuthProvider(auth_provider);

      if (auth_provider === "google") {
        setShowPopup(true); // Show the popup
        return;
      }

      await api.post("/auth/forgot-password/send-otp", { email });
      alert("OTP sent to your email");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      return alert("The OTP has expired. Please request a new OTP.");
    }

    if (!otp) {
      return alert("Please enter the OTP sent to your email");
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/forgot-password/verify-otp", { email, otp });

      if (response.data.message === "OTP verified successfully") {
        alert("OTP verified successfully");

        // Clear local storage keys related to forgot password
        localStorage.removeItem("forgotPasswordStep");
        localStorage.removeItem("forgotPasswordEmail");
        localStorage.removeItem("forgotPasswordOtp");
        localStorage.removeItem("forgotPasswordTimeLeft");

        navigate("/reset-password", {
          state: { email },
        });
      } else {
        alert("Invalid OTP or OTP expired");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetOtp = async () => {
    if (!email) {
      return alert("Please enter a valid email address before resending the OTP.");
    }

    try {
      setCanResend(false);
      setTimeLeft(300); // Reset timer to 5 minutes
      setLoading(true);
      await api.post("/auth/forgot-password/send-otp", { email });
      alert("A new OTP has been sent to your email.");
    } catch (err) {
      alert(err.response?.data?.message || "Error resending OTP");
    } finally {
      setLoading(false);
    }
  };

  const createPassword = () => {
    navigate("/create-password", { state: { email } });
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 1) return;

    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    // Move to the next input box if a digit is entered
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden " style={{ background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)' }}>
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: '#000'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
      </div>



      {/* Main Layout - Centered for both Mobile & Desktop */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 md:px-8 py-8 lg:py-0 relative" style={{ zIndex: 1 }}>
        {/* Forgot Password Form Container */}
        <div className="flex items-center justify-center w-full">
          <form
            className="w-full max-w-[380px] sm:max-w-md p-6 sm:p-10 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.3)] relative overflow-hidden transition-all duration-500"


            onSubmit={step === 1 ? sendOtp : verifyOtp}
          >
            {/* Soft Romantic Gradients */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full"></div>

            <div className="mb-6 sm:mb-8 text-center relative z-10" style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}>
              <h2
                className="text-[22px] xs:text-[24px] sm:text-[32px] md:text-[40px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EC4891] to-[#A928ED] tracking-tight drop-shadow-sm mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  animation: 'textGlow 3s ease-in-out infinite'
                }}
              >
                {step === 1 ? "Forgot Password?" : "Verify OTP"}
              </h2>
              <p className="text-[#D1D5DC] text-[12px] sm:text-[14px] md:text-[15px] font-semibold leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {step === 1
                  ? "Enter your email to receive a verification code."
                  : `Enter the OTP sent to your email (${email}) to verify.`}
              </p>
            </div>

            {step === 1 && (
              <div className="w-full mb-6 sm:mb-8 relative z-10">
                <label className="block text-xs sm:text-sm text-gray-300 mb-2 font-bold uppercase tracking-wider ml-1">
                  Email Address <span className="text-pink-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm sm:text-base border border-white/10 placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 shadow-lg transition-all"
                  style={{
                    height: '3.5rem'
                  }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div className="w-full mb-6 sm:mb-8 relative z-10">
                <div className="flex justify-between gap-3 px-2">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength={1}
                      className="w-14 h-14 text-center text-xl font-black rounded-2xl bg-white/5 text-white border-2 border-white/10 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all shadow-lg"
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(e, index)}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full h-[40px] sm:h-[48px] bg-gradient-to-r from-[#EC4891] to-[#A928ED] hover:scale-[1.02] active:scale-[0.98] text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-center space-x-2 transition-all text-sm sm:text-base tracking-wider border border-white/20 mb-4 sm:mb-5 relative z-10 ${loading || (step === 2 && timeLeft <= 0) ? "opacity-60 cursor-not-allowed" : ""}`}
              style={{
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
              disabled={loading || (step === 2 && timeLeft <= 0)}
            >
              <span>{loading ? (step === 1 ? 'Sending...' : 'Verifying...') : (step === 1 ? 'Send OTP' : 'Verify OTP')}</span>
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

            <div className="relative z-10">
              {step === 2 && (
                <div className="mt-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {timeLeft > 0 ? (
                    <p>Resend OTP in <span className="text-pink-400">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span></p>
                  ) : (
                    <button
                      type="button"
                      className="text-pink-500 font-black underline hover:text-pink-400 transition-colors uppercase tracking-widest"
                      onClick={resetOtp}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] underline hover:text-white transition-colors"
                    onClick={() => {
                      localStorage.removeItem("forgotPasswordStep");
                      localStorage.removeItem("forgotPasswordEmail");
                      localStorage.removeItem("forgotPasswordOtp");
                      localStorage.removeItem("forgotPasswordTimeLeft");
                      setStep(1);
                      setEmail("");
                      setOtp("");
                      setTimeLeft(300);
                    }}
                  >
                    Change Email Address
                  </button>
                </div>
              )}

              <div className="mt-8 text-center" style={{ animation: 'fadeInUp 1s ease-out 0.7s both' }}>
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
                  Back to Sign In
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Premium Google Auth Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[100] backdrop-blur-md animate-fade-in">
            <div className="bg-black/60 border border-pink-500/30 p-8 rounded-[2.5rem] shadow-[0_40px_100px_rgba(236,72,153,0.3)] text-center w-full max-w-sm mx-4 relative overflow-hidden backdrop-blur-3xl">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-600/20 blur-[60px] rounded-full"></div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-lg mb-4">
                  G
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Google Account Detected</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  This account was created via Google Sign-In. Please sign in with your Google account.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-pink-500/20 hover:scale-105 transition-all"
                  onClick={() => navigate("/entry")}
                >
                  Continue with Google
                </button>
                <button
                  className="w-full bg-white/5 text-gray-400 font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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


      `}</style>
    </div>
  );
}