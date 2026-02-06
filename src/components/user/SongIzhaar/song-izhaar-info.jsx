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
      background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)',
    }}>

      {/* Animated floating music notes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {[...Array(30)].map((_, i) => {
          const musicNotes = ['♪', '♫', '♬', '🎵', '🎶'];
          const colors = [
            'rgba(244, 114, 182, 0.8)',  // Pink 400
            'rgba(192, 132, 252, 0.8)',  // Purple 400
            'rgba(96, 165, 250, 0.8)',   // Blue 400
            'rgba(52, 211, 153, 0.8)',   // Green 400
            'rgba(251, 191, 36, 0.8)',   // Amber 400
            'rgba(248, 113, 113, 0.8)',  // Red 400
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
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 bg-white/10 border border-white/10 text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
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
              <div className="absolute inset-0 bg-pink-500/20 blur-[100px] rounded-full"></div>
              <img
                src={groupImg}
                alt="Music Group"
                className="relative z-10 w-full h-auto aspect-square max-w-[400px] object-contain drop-shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-float"
              />
            </div>
          </div>

          {/* Right Side - Terms and Button */}
          <div className="w-full md:w-1/2 max-w-xl">
            {/* Terms Card */}
            <div
              className="w-full p-6 sm:p-8 md:p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group"
            >
              {/* Card Glow Effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[60px] group-hover:bg-purple-500/30 transition-all duration-700"></div>

              <h5 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-sm">
                Song wala IZHAAR
              </h5>

              <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 font-medium leading-relaxed">
                Transform Your Emotions Into A Beautiful Love Song. A Personalized Musical Message They'll Cherish Forever.
              </p>

              <div className="w-full flex items-center my-5">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="px-3 text-pink-400 text-lg">✨</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              <div className="text-gray-400 text-xs sm:text-sm leading-relaxed space-y-2 mb-8">
                <p><span className="font-bold text-pink-400 mr-2">1.</span> By uploading a recording, you grant Izhaar permission to process and deliver it.</p>
                <p><span className="font-bold text-pink-400 mr-2">2.</span> Audio submitted cannot be replaced or modified after confirmation.</p>
                <p><span className="font-bold text-pink-400 mr-2">3.</span> Izhaar is not liable for the receiver's reaction or response.</p>
                <p><span className="font-bold text-pink-400 mr-2">4.</span> Delivery of the audio will follow Izhaar's standard digital or code-based delivery flow.</p>
                <p><span className="font-bold text-pink-400 mr-2">5.</span> Service charges for Song are final and non-refundable.</p>
                <p><span className="font-bold text-pink-400 mr-2">6.</span> Users must ensure the audio does not include copyrighted music they do not own.</p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleGenerate}
                  className="w-full rounded-xl px-5 py-3.5 font-bold text-sm sm:text-base text-white transition-all duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-pink-500/30 active:scale-95 bg-gradient-to-r from-pink-600 to-purple-600 relative overflow-hidden"
                >
                  <span className="relative z-10">Continue</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300"></div>
                </button>

                <button
                  onClick={handleStatusCheck}
                  className="w-full rounded-xl px-5 py-3.5 font-bold text-sm sm:text-base text-white/70 border border-white/20 hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-sm"
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

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
