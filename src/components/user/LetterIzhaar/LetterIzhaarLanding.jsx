import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import letterImg from '../../../assets/images/letter-izhaar-img/image.png';
import { useUserId } from "../../../hooks/useUserId";


export default function LetterIzhaarLanding() {
  const navigate = useNavigate();
  const userId = useUserId();
  const [checkingDraft, setCheckingDraft] = useState(true);

  // Check for existing draft and auto-redirect
  useEffect(() => {
    const checkForDraft = async () => {
      try {
        // Check localStorage first for immediate redirect
        const localDraft = localStorage.getItem('izhaarLetterDraft');
        if (localDraft) {
          const parsed = JSON.parse(localDraft);
          // If draft has meaningful data, redirect to write prompt
          if (parsed.senderName || parsed.receiverName || parsed.generatedLetter) {
            console.log('Draft found in localStorage, redirecting...');
            navigate('/user/letter-izhaar/write-prompt', { replace: true });
            return;
          }
        }

        // Also check backend for drafts
        try {
          const response = await api.get('/letter/drafts');
          if (response.data && response.data.length > 0) {
            // Load the most recent draft to localStorage and redirect
            const latestDraft = response.data[0];
            localStorage.setItem('izhaarLetterDraft', JSON.stringify(latestDraft));
            console.log('Draft found in backend, redirecting...');
            navigate('/user/letter-izhaar/write-prompt', { replace: true });
            return;
          }
        } catch (err) {
          console.log('No backend drafts found');
        }

        // No draft found, stay on landing page
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
      // Pass userId and service as query params
      const res = await api.get("/razorpay/payment-status", {
        params: { userId, service: 'letter' }
      });
      console.log("Payment status response:", res.data);
      if (!res.data) {
        // No payment status at all
        console.log("No payment status found, redirecting to subscription.");
        navigate('/user/letter/payment-subscription', { replace: true });
        return;
      }
      const hasPayment = !!res.data.payment_amount;
      const paymentAmount = res.data.payment_amount;
      const paymentAmountNumber = Number(paymentAmount);
      const creditStatus = res.data.credit_status;

      if (
        hasPayment &&
        paymentAmountNumber >= 99 &&
        creditStatus === 'SUCCESS'
      ) {
        navigate('/user/receiver', { replace: true });
      } else {
        navigate('/user/letter/payment-subscription', { replace: true });
      }
    } catch (err) {
      console.error("Payment status error:", err);
      alert("Could not check payment status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative" style={{
      background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translate(10px, -20px) scale(1.2);
            opacity: 0.8;
          }
          50% {
            transform: translate(-5px, -40px) scale(0.8);
            opacity: 0.3;
          }
          75% {
            transform: translate(15px, -25px) scale(1.1);
            opacity: 0.6;
          }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: floatParticle linear infinite;
          filter: blur(1px);
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

      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {[...Array(30)].map((_, i) => {
          // Brighter/Neon colors for dark mode
          const colors = ['rgba(233, 30, 99, 0.6)', 'rgba(156, 39, 176, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(255, 255, 255, 0.4)'];
          const size = Math.random() * 6 + 2;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const duration = Math.random() * 6 + 4;
          const delay = Math.random() * 2;

          return (
            <div
              key={i}
              className="particle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                background: colors[Math.floor(Math.random() * colors.length)],
                boxShadow: `0 0 ${size * 3}px ${colors[Math.floor(Math.random() * colors.length)]}`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`

              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8" >

        {/* Mobile Back Button */}
        <button
          onClick={() => navigate("/user/dashboard")}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white shadow-lg active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Main Content - Two Column Layout on Desktop, Stacked on Mobile */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 pb-4 sm:pb-6">

          {/* Left Side - Letter Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center animate-fade-in-left">
            <div className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-pink-500/20 blur-[50px] rounded-full transform scale-90"></div>
              <img
                src={letterImg}
                alt="Letter Izhaar"
                className="relative z-10 w-full h-auto md:h-[550px] object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              />
            </div>
          </div>

          {/* Right Side - Terms and Button */}
          <div className="w-full md:w-1/2 max-w-xl animate-fade-in-up">
            <div className="w-full p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <h5 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 tracking-tight italic bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                Letter Izhaar
              </h5>

              <p className="text-sm sm:text-base md:text-lg text-white/70 mb-6 sm:mb-8 font-light leading-relaxed">
                Izhaar turns your feelings into beautiful, heartfelt letters—instantly and effortlessly.
              </p>

              <div className="w-full flex items-center my-4 sm:my-6 md:my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <span className="px-4 text-pink-400 text-lg animate-pulse">✦</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>

              <div className="text-white/60 text-xs sm:text-sm leading-relaxed space-y-3 mb-8">
                <p className="flex items-start gap-2"><span className="font-bold text-pink-400 min-w-[15px]">1.</span> By submitting a letter, you confirm the content belongs to you and does not violate any laws.</p>
                <p className="flex items-start gap-2"><span className="font-bold text-pink-400 min-w-[15px]">2.</span> Once a letter is submitted, it cannot be edited or cancelled.</p>
                <p className="flex items-start gap-2"><span className="font-bold text-pink-400 min-w-[15px]">3.</span> Delivery timelines may vary based on location and availability.</p>
                <p className="flex items-start gap-2"><span className="font-bold text-pink-400 min-w-[15px]">4.</span> Izhaar is not responsible for the receiver's reaction or response.</p>
                <p className="flex items-start gap-2"><span className="font-bold text-pink-400 min-w-[15px]">5.</span> Fees paid for the Letter service are final and non-refundable.</p>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full rounded-2xl px-3 sm:px-4 md:px-5 py-4 font-bold text-sm sm:text-base text-white transition-all duration-300 shadow-[0_0_20px_rgba(233,30,99,0.3)] hover:shadow-[0_0_30px_rgba(233,30,99,0.5)] hover:scale-[1.02] active:scale-[0.98] border border-white/10 relative overflow-hidden group/btn"
                style={{
                  background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Continue To Write
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
