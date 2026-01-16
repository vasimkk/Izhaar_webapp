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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#f5f1f8] via-[#f0e8f8] to-[#e8dff5]">
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
          animation: 'gradientShift 15s ease infinite'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(233, 30, 99, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(156, 39, 176, 0.06) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12 relative" style={{ zIndex: 1 }}>
        <div className="hidden md:flex flex-1 items-center justify-center w-full">
          <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg flex items-center justify-center">
            <div
              className="absolute w-96 h-96 rounded-full opacity-15 blur-3xl"
              style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                animation: 'pulse 4s ease-in-out infinite, glow 3s ease-in-out infinite'
              }}
            />
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

        <div className="flex-1 flex items-center justify-center w-full">
          <form
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border rounded-3xl backdrop-blur-md"
            style={{
              borderColor: 'rgba(212, 197, 232, 0.3)',
              background: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px 0 rgba(45, 27, 78, 0.15), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
              animation: 'glow 4s ease-in-out infinite'
            }}
            onSubmit={step === 1 ? sendOtp : verifyOtp}
          >
            <div className="mb-6 sm:mb-8 text-center" style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}>
              <h2 
                className="text-4xl sm:text-5xl font-bold mb-2 sm:mb-3 gradient-text"
                style={{ 
                  animation: 'textGlow 3s ease-in-out infinite',
                  fontStyle: 'italic',
                  fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                  letterSpacing: '0.5px'
                }}
              >
                {step === 1 ? "Forgot Password?" : "Verify OTP"}
              </h2>
              <p className="text-[#6B5B8E] text-sm sm:text-base leading-relaxed">
                {step === 1
                  ? "Enter your email to receive a verification code."
                  : `Enter the OTP sent to your email (${email}) to verify.`}
              </p>
            </div>

            {step === 1 && (
              <div className="w-full mb-6 sm:mb-8">
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none focus:border-[#E91E63]/50 shadow-lg transition-all"
                  style={{ 
                    height: '3rem',
                    borderColor: 'rgba(212, 197, 232, 0.3)'
                  }}
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div className="w-full mb-6 sm:mb-8">
                <div className="flex justify-between gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 border-[#E91E63]/50 focus:outline-none focus:border-[#E91E63]"
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(e, index)}
                    />
                  ))}
                </div>
                
              </div>
            )}

            <button
              type="submit"
              className={`w-full rounded-2xl px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 font-semibold text-sm sm:text-base md:text-base mb-4 sm:mb-5 transition-all shadow-lg text-white hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden ${
                loading || timeLeft <= 0 ? "opacity-60 cursor-not-allowed" : ""
              }`}
              style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)',
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
              disabled={loading || timeLeft <= 0}
            >
              {loading ? (step === 1 ? 'Sending...' : 'Verifying...') : (step === 1 ? 'Send OTP' : 'Verify OTP')}
            </button>
            
            {step === 2 && (
              <div className="mt-4 text-center text-sm text-[#6B5B8E]">
                {timeLeft > 0 ? (
                  <p>Resend OTP in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</p>
                ) : (
                  <button
                    type="button"
                    className="text-[#E91E63] font-semibold underline hover:text-[#9C27B0] transition-colors"
                    onClick={resetOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              
            )}
            {step ===2 &&(
              <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-[#E91E63] font-semibold underline hover:text-[#9C27B0] transition-colors"
                    onClick={() => {
                      localStorage.removeItem("forgotPasswordStep");
                      localStorage.removeItem("forgotPasswordEmail");
                      localStorage.removeItem("forgotPasswordOtp");
                      localStorage.removeItem("forgotPasswordTimeLeft");
                      setStep(1);
                      setEmail("");
                      setOtp("");
                      setTimeLeft(300); // Reset the timer to its initial value
                    }}
                  >
                    Change Email Address
                  </button>
                </div>
            )

            }
            {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                <div className="bg-black bg-opacity-80 p-4 rounded-lg shadow-lg text-center w-80 relative">
                  <p className="text-white text-sm sm:text-base leading-relaxed mb-4">
                    This account was created using Google Sign-In. Please log in using <a href="/entry" className="text-[#E91E63] underline hover:text-[#9C27B0]">Google</a>.
                  </p>
                  <button
                    className="bg-[#E91E63] text-white px-4 py-2 rounded-lg hover:bg-[#9C27B0] transition-colors"
                    onClick={() => setShowPopup(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 text-center" style={{ animation: 'fadeInUp 1s ease-out 0.7s both' }}>
              <button
                type="button"
                className="text-[#6B5B8E] text-xs sm:text-sm font-medium underline hover:text-[#E91E63] transition-colors"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
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
          background: linear-gradient(135deg, #E91E63 0%, #9C27B0 50%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}
