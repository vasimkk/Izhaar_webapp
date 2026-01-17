import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserId } from "../../../hooks/useUserId";
import api from "../../../utils/api";
import groupImg from "../../../assets/images/music-group.png";

export default function SongIzhaarInfo() {
  const navigate = useNavigate();
  const userId = useUserId();
  
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
                className="w-full h-auto md:h-[550px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right Side - Terms and Button */}
          <div className="w-full md:w-1/2 max-w-xl">
            {/* Terms Card */}
            <div 
              className="w-full rounded-tl-3xl rounded-br-3xl p-4 sm:p-5 md:p-6 lg:p-8 mb-4 sm:mb-5 shadow-2xl backdrop-blur-lg border border-white/20" 
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%)'
              }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 tracking-tight drop-shadow-lg">
                Song wala IZHAAR
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto px-2">
                Transform Your Emotions Into A Beautiful Love Song. A Personalized Musical Message They'll Cherish.
              </p>
              <div className="w-full flex items-center my-2 sm:my-3 md:my-4">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="px-2 sm:px-3 md:px-4 text-white/50 text-xs">*</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>
              <div className="text-white text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed space-y-1.5 sm:space-y-2">
                <p><span className="font-bold text-orange-400 mr-1">1.</span> By uploading a recording, you grant Izhaar permission to process and deliver it.</p>
                <p><span className="font-bold text-orange-400 mr-1">2.</span> Audio submitted cannot be replaced or modified after confirmation.</p>
                <p><span className="font-bold text-orange-400 mr-1">3.</span> Izhaar is not liable for the receiver's reaction or response.</p>
                <p><span className="font-bold text-orange-400 mr-1">4.</span> Delivery of the audio will follow Izhaar's standard digital or code-based delivery flow.</p>
                <p><span className="font-bold text-orange-400 mr-1">5.</span> Service charges for Song are final and non-refundable.</p>
                <p><span className="font-bold text-orange-400 mr-1">6.</span> Users must ensure the audio does not include copyrighted music they do not own.</p>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleGenerate}
              className="w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base transition-all shadow-lg text-white hover:opacity-90"
              style={{
                background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
              }}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
