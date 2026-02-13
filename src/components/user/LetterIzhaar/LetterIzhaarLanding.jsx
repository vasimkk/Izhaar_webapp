import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import letterImg from '../../../assets/images/letter-izhaar-img/image.png';
import { useUserId } from "../../../hooks/useUserId";
import { FaTimes } from 'react-icons/fa';

export default function LetterIzhaarLanding() {
  const navigate = useNavigate();
  const userId = useUserId();
  const [checkingDraft, setCheckingDraft] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Check for existing draft and auto-redirect
  useEffect(() => {
    const checkForDraft = async () => {
      try {
        const localDraft = localStorage.getItem('izhaarLetterDraft');
        if (localDraft) {
          const parsed = JSON.parse(localDraft);
          if (parsed.senderName || parsed.receiverName || parsed.generatedLetter) {
            navigate('/user/letter-izhaar/write-prompt', { replace: true });
            return;
          }
        }

        try {
          const response = await api.get('/letter/drafts');
          if (response.data && response.data.length > 0) {
            const latestDraft = response.data[0];
            localStorage.setItem('izhaarLetterDraft', JSON.stringify(latestDraft));
            navigate('/user/letter-izhaar/write-prompt', { replace: true });
            return;
          }
        } catch (err) {
          console.log('No backend drafts found');
        }

        setCheckingDraft(false);
      } catch (err) {
        console.error('Error checking for draft:', err);
        setCheckingDraft(false);
      }
    };

    checkForDraft();
  }, [navigate]);

  const handleGenerate = async () => {
    try {
      const res = await api.get("/razorpay/payment-status", {
        params: { userId, service: 'letter' }
      });
      if (!res.data) {
        navigate('/user/letter/payment-subscription', { replace: true });
        return;
      }
      const hasPayment = !!res.data.payment_amount;
      const paymentAmountNumber = Number(res.data.payment_amount);
      const creditStatus = res.data.credit_status;

      if (hasPayment && paymentAmountNumber >= 99 && creditStatus === 'SUCCESS') {
        navigate('/user/receiver', { replace: true });
      } else {
        navigate('/user/letter/payment-subscription', { replace: true });
      }
    } catch (err) {
      console.error("Payment status error:", err);
      alert("Could not check payment status. Please try again.");
    }
  };

  if (checkingDraft) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#1E3A8A]">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden relative" style={{
      background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          25% { transform: translate(10px, -20px) scale(1.2); opacity: 0.8; }
          50% { transform: translate(-5px, -40px) scale(0.8); opacity: 0.3; }
          75% { transform: translate(15px, -25px) scale(1.1); opacity: 0.6; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: floatParticle linear infinite;
          filter: blur(1px);
        }
        @keyframes floatHeart {
          0% { transform: translateY(10vh) translateX(0) rotate(0deg) scale(0); opacity: 0; }
          10% { opacity: 0.8; scale: 1; }
          100% { transform: translateY(-110vh) translateX(50px) rotate(360deg) scale(1.2); opacity: 0; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .heart-particle {
          position: fixed;
          pointer-events: none;
          animation: floatHeart linear infinite;
          z-index: 1;
          color: rgba(236, 72, 153, 0.3);
        }
        .sparkle-particle {
          position: fixed;
          pointer-events: none;
          animation: sparkle 3s ease-in-out infinite;
          z-index: 1;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px white, 0 0 20px rgba(255,182,193,0.4);
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
      `}</style>

      {/* Ambient Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Romantic Floating Elements */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Floating Hearts */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`heart-${i}`}
            className="heart-particle flex items-center justify-center"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `-10%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            ❤
          </div>
        ))}

        {/* Sparkles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle-particle"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">

        {/* Navigation / Back Button (Top Left) */}
        <button
          onClick={() => navigate("/user/dashboard")}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white shadow-lg active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Info Button (Top Right) */}
        <button
          onClick={() => setShowInfoModal(true)}
          className="fixed top-4 right-4 z-50 w-11 h-11 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 group shadow-[0_0_15px_rgba(183,32,153,0.5)] border border-white/20 overflow-hidden"
          style={{
            background: 'linear-gradient(to right, #9333ea, #db2777)',
          }}
        >
          <div className="absolute inset-0 bg-pink-400/20 rounded-full animate-ping group-hover:animate-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-40" />
          <span className="text-white text-2xl font-serif italic font-bold relative z-10 select-none pb-1">i</span>
        </button>

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 text-white">
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 w-full max-w-lg rounded-3xl border border-white/20 shadow-2xl relative animate-in fade-in zoom-in duration-300">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent italic font-serif">How It Works</h3>
                  <button onClick={() => setShowInfoModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <h6 className="font-bold text-pink-400 flex items-center gap-2">Share your feelings:</h6>
                    <p className="text-sm text-white/70">Write your message in your own words — don’t worry about being perfect. The more honestly you share your feelings, memories, and emotions, the more beautifully Izhaar can shape your letter.</p>
                    <p className="text-xs text-pink-300/80 italic">💡 Tip: Say what you feel, why you feel it, and what makes them special. More details = a more meaningful letter 💌</p>
                  </div>
                  <div className="space-y-1">
                    <h6 className="font-bold text-pink-400">Safe delivery:</h6>
                    <p className="text-sm text-white/70">Your letter is delivered securely while your identity stays private.</p>
                  </div>
                  <div className="space-y-1">
                    <h6 className="font-bold text-pink-400">Delivery updates:</h6>
                    <p className="text-sm text-white/70">You’ll receive real-time updates when your letter is delivered and viewed.</p>
                  </div>
                  <div className="space-y-1">
                    <h6 className="font-bold text-pink-400">Private view & response:</h6>
                    <p className="text-sm text-white/70">They read your letter at their own pace and can choose how to respond:</p>
                    <ul className="text-xs text-white/60 list-disc list-inside mt-1 ml-2 space-y-1">
                      <li><span className="text-white/80">Curious to Know</span> – Start a safe, anonymous chat</li>
                      <li><span className="text-white/80">Not Interested</span> – Close the request respectfully</li>
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <h6 className="font-bold text-pink-400">Connect safely:</h6>
                    <p className="text-sm text-white/70">If mutual interest is felt, you may choose to reveal your identity and take the next step — calmly and safely.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Body Content */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 pb-8">

          {/* Left Column: Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center animate-fade-in-left">
            <div className="relative w-full max-w-[280px] sm:max-w-md lg:max-w-lg">
              <div className="absolute inset-0 bg-pink-500/20 blur-[50px] rounded-full transform scale-90"></div>
              <img src={letterImg} alt="Letter Izhaar" className="relative z-10 w-full h-auto object-contain drop-shadow-2xl" />
            </div>
          </div>

          {/* Right Column: Text & Button */}
          <div className="w-full md:w-1/2 max-w-xl animate-fade-in-up">
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
              <h5 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 tracking-tight italic bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Write a Letter
              </h5>

              <p className="text-lg sm:text-xl text-white/90 mb-10 font-medium leading-relaxed">
                You like someone but don’t have the courage to tell them? <br className="hidden sm:block" />
                Izhaar helps you express your feelings safely, anonymously, and with care.
              </p>

              <button
                onClick={handleGenerate}
                className="w-full sm:max-w-xs rounded-2xl px-8 py-5 font-bold text-lg text-white transition-all duration-300 shadow-[0_0_20px_rgba(219,39,119,0.4)] hover:shadow-[0_0_40px_rgba(219,39,119,0.7)] hover:scale-105 active:scale-95 border border-white/20 relative overflow-hidden group/btn"
                style={{ background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Continue To Write
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
