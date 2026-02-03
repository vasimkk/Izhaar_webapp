import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserId } from "../../../hooks/useUserId";
import api from "../../../utils/api";
import groupImg from "../../../assets/images/music-group.png";

export default function SongIzhaarInfo() {
  const navigate = useNavigate();
  const userId = useUserId();

  // Check status explicitly when requested
  const handleStatusCheck = () => {
    navigate("/user/song/list");
  };

  const handleGenerate = async () => {
    try {
      // Pass userId and service as query params
      const res = await api.get("/razorpay/payment-status", {
        params: { userId, service: 'song' }
      });
      console.log("Payment status response:", res.data);
      if (!res.data) {
        // No payment status at all
        console.log("No payment status found, redirecting to subscription.");
        navigate('/user/song/payment-subscription', { replace: true });
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
      console.log("Condition result:", hasPayment && paymentAmountNumber >= 499 && creditStatus === 'SUCCESS');
      if (
        hasPayment &&
        paymentAmountNumber >= 499 &&
        creditStatus === 'SUCCESS'
      ) {
        navigate('/user/receiver', { replace: true, state: { from: '/user/song' } });
      } else {
        navigate('/user/song/payment-subscription', { replace: true });
      }
    } catch (err) {
      console.error("Payment status error:", err);
      toast.error("Could not check payment status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative" style={{
      background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
      animation: 'gradientShift 15s ease infinite'
    }}>

      {/* Animated floating music notes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {[...Array(30)].map((_, i) => {
          const musicNotes = ['♪', '♫', '♬', '🎵', '🎶'];
          const colors = [
            'rgba(233, 30, 99, 0.8)',    // Pink
            'rgba(156, 39, 176, 0.8)',   // Purple
            'rgba(59, 130, 246, 0.8)',   // Blue
            'rgba(16, 185, 129, 0.8)',   // Green
            'rgba(245, 158, 11, 0.8)',   // Orange
            'rgba(236, 72, 153, 0.8)',   // Rose
          ];
          const noteIndex = i % musicNotes.length;
          const colorIndex = i % colors.length;
          const note = musicNotes[noteIndex];
          const color = colors[colorIndex];

          // Random angle for each note to spread in different directions
          const angle = Math.random() * 360;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                fontSize: `${30 + Math.random() * 40}px`,
                color: color,
                opacity: 0,
                animation: `floatMusic-${i} ${8 + Math.random() * 12}s ease-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                left: '30%',
                top: '50%',
                textShadow: `0 0 20px ${color}, 0 0 30px ${color}`,
                filter: 'blur(0.5px)',
                '--angle': `${angle}deg`,
              }}
            >
              {note}
            </div>
          );
        })}
      </div>

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

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">

        {/* Main Content - Two Column Layout on Desktop, Stacked on Mobile */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 pb-4 sm:pb-6">

          {/* Left Side - Music Group Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg">
              <img
                src={groupImg}
                alt="Music Group"
                className="w-full h-auto aspect-square max-w-[400px] object-contain drop-shadow-2xl "
              />
            </div>
          </div>

          {/* Right Side - Terms and Button */}
          <div className="w-full md:w-1/2 max-w-xl">
            {/* Terms Card */}
            <div
              className="w-full  p-4 sm:p-5 md:p-6 lg:p-8 mb-4 sm:mb-5 "
            >
              <h5 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 tracking-tight italic bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
                Song wala IZHAAR
              </h5>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#6B5B8E] mb-4 sm:mb-5">
                Transform Your Emotions Into A Beautiful Love Song. A Personalized Musical Message They'll Cherish.
              </p>

              <div className="w-full flex items-center my-3 sm:my-4 md:my-5">
                <div className="flex-1 h-px bg-[#E91E63]/20"></div>
                <span className="px-2 sm:px-3 md:px-4 text-[#9C27B0]/50 text-xs">*</span>
                <div className="flex-1 h-px bg-[#E91E63]/20"></div>
              </div>

              <div className="text-[#2D1B4E] text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed space-y-1.5 sm:space-y-2 mb-6 sm:mb-7 md:mb-8">
                <p><span className="font-bold text-[#E91E63] mr-1">1.</span> By uploading a recording, you grant Izhaar permission to process and deliver it.</p>
                <p><span className="font-bold text-[#E91E63] mr-1">2.</span> Audio submitted cannot be replaced or modified after confirmation.</p>
                <p><span className="font-bold text-[#E91E63] mr-1">3.</span> Izhaar is not liable for the receiver's reaction or response.</p>
                <p><span className="font-bold text-[#E91E63] mr-1">4.</span> Delivery of the audio will follow Izhaar's standard digital or code-based delivery flow.</p>
                <p><span className="font-bold text-[#E91E63] mr-1">5.</span> Service charges for Song are final and non-refundable.</p>
                <p><span className="font-bold text-[#E91E63] mr-1">6.</span> Users must ensure the audio does not include copyrighted music they do not own.</p>
              </div>

              <div className="flex flex-col gap-3">
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

                <button
                  onClick={handleStatusCheck}
                  className="w-full rounded-xl px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3 font-semibold text-xs sm:text-sm md:text-base text-[#E91E63] border-2 border-[#E91E63]/20 hover:bg-[#E91E63]/5 transition-all duration-300"
                >
                  My Song List / Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        ${[...Array(30)].map((_, i) => {
        const angle = Math.random() * 360;
        const distance = 500 + Math.random() * 800;
        const endX = Math.cos(angle * Math.PI / 180) * distance;
        const endY = Math.sin(angle * Math.PI / 180) * distance;

        return `
            @keyframes floatMusic-${i} {
              0% {
                transform: translate(-50%, -50%) rotate(0deg) scale(0.3);
                opacity: 0;
              }
              10% {
                opacity: 0.9;
              }
              50% {
                opacity: 0.8;
              }
              90% {
                opacity: 0.3;
              }
              100% {
                transform: translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) rotate(${360 + Math.random() * 360}deg) scale(${0.8 + Math.random() * 0.5});
                opacity: 0;
              }
            }
          `;
      }).join('')}

        @keyframes gradientShift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
