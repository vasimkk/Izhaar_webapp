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
      console.log("hasPayment:", hasPayment);
      console.log("paymentAmount (raw):", paymentAmount, typeof paymentAmount);
      console.log("paymentAmountNumber:", paymentAmountNumber, typeof paymentAmountNumber);
      console.log("creditStatus:", creditStatus);
      console.log("Condition result:", hasPayment && paymentAmountNumber >= 99 && creditStatus === 'SUCCESS');
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
    <div className="min-h-screen w-full overflow-hidden relative">
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: translate(10px, -20px) scale(1.2);
            opacity: 1;
          }
          50% {
            transform: translate(-5px, -40px) scale(0.8);
            opacity: 0.6;
          }
          75% {
            transform: translate(15px, -25px) scale(1.1);
            opacity: 0.9;
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
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
      `}</style>

      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1  ,
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
          animation: 'gradientShift 15s ease infinite'
        }}>
        {[...Array(30)].map((_, i) => {
          const colors = ['#E91E63', '#9C27B0', '#3B82F6', '#FF5722', '#EC407A'];
          const size = Math.random() * 8 + 4;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const duration = Math.random() * 4 + 3;
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
                boxShadow: `0 0 ${size * 2}px ${colors[Math.floor(Math.random() * colors.length)]}`,
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
       {/* Mobile Back Button */}
      <button
        onClick={() => navigate("/user/dashboard")}
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

        {/* Main Content - Two Column Layout on Desktop, Stacked on Mobile */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 pb-4 sm:pb-6">
          
          {/* Left Side - Letter Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center animate-fade-in-left">
            <div className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg">
              <img
                src={letterImg}
                alt="Letter Izhaar"
                className="w-full h-auto md:h-[550px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right Side - Terms and Button */}
          <div className="w-full md:w-1/2 max-w-xl animate-fade-in-up">
            <div className="w-full p-4 sm:p-5 md:p-6 lg:p-8 mb-4 sm:mb-5">
              <h5 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 tracking-tight italic bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
                Letter Izhaar
              </h5>
              
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#6B5B8E] mb-4 sm:mb-5">
                Izhaar turns your feelings into beautiful, heartfelt letters—instantly and effortlessly.
              </p>
              
              <div className="w-full flex items-center my-3 sm:my-4 md:my-5">
                <div className="flex-1 h-px bg-[#E91E63]/20"></div>
                <span className="px-2 sm:px-3 md:px-4 text-[#9C27B0]/50 text-xs">*</span>
                <div className="flex-1 h-px bg-[#E91E63]/20"></div>
              </div>
              
              <div className="text-[#2D1B4E] text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed space-y-1.5 sm:space-y-2 mb-6 sm:mb-7 md:mb-8">
                <p><span className="font-bold text-[#E91E63] mr-1">1.</span> By submitting a letter, you confirm the content belongs to you and does not violate any laws.</p>
                <p><span className="font-bold text-[#E91E63] mr-1">2.</span> Once a letter is submitted, it cannot be edited or cancelled.</p>
                <p><span className="font-bold text-[#E91E63] mr-1">3.</span> Delivery timelines may vary based on location and availability.</p>
                <p><span className="font-bold text-[#E91E63] mr-1">4.</span> Izhaar is not responsible for the receiver's reaction or response.</p>
                <p><span className="font-bold text-[#E91E63] mr-1">5.</span> Fees paid for the Letter service are final and non-refundable.</p>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full rounded-xl px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3 font-semibold text-xs sm:text-sm md:text-base text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                  boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)'
                }}
              >
                Continue
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
 