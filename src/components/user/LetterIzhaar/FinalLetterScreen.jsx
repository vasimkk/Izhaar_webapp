
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useLetter } from "../../../context/LetterContext";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
import bg1 from '../../../assets/temp/letter_01.png';
import bg2 from '../../../assets/temp/letter_02.jpeg';
import bg3 from '../../../assets/temp/letter_03.png';
import bg4 from '../../../assets/temp/letter_04.png';

const templateImages = {
  '1': bg1,
  '2': bg2,
  '3': bg3,
  '4': bg4,
};

const templateStyles = {
  '1': 'border-[#ffb6b9]',
  '2': 'border-[#e75480]',
  '3': 'border-[#a3d8f4]',
  '4': 'border-[#deb887]',
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function FinalLetterScreen() {
  const navigate = useNavigate();
  const query = useQuery();
  const { letter } = useLetter();
  const { receiverDetails } = useReceiverForLetter();
  const templateId = query.get("templateId") || '1';
  const paperStyle = templateStyles[templateId] || templateStyles['1'];
  const templateImage = templateImages[templateId] || templateImages['1'];
  const letterContent = letter || query.get("letter") || "";
  const [loading, setLoading] = useState(false);

  const handleSubmitLetter = async () => {
    try {
      setLoading(true);
      const sender_id = receiverDetails?.sender_id || query.get("sender_id") || "USER123";
      const receiver = receiverDetails?.receiver || receiverDetails || {};
      const payload = {
        izhaar_code: query.get("izhaar_code") || receiverDetails?.izhaar_code || "IZHAAR123",
        sender_id,
        type: "LETTER",
        message: letterContent,
        receiver,
        template_id: templateId,
      };
      console.log('Submitting letter payload:', payload);
      await api.post("/izhaar/submit", payload);

      // After successful letter submission, get latest payment and mark as USED
      try {
        const paymentRes = await api.get("/razorpay/payment-status", {
          params: { userId: sender_id, service: 'letter' }
        });
        const payment = paymentRes.data;
        if (payment && payment.payment_reference) {
          await api.post("/razorpay/mark-used", {
            userId: sender_id,
            paymentReference: payment.payment_reference
          });
          console.log("Payment marked as USED");
        } else {
          console.warn("No valid payment found to mark as USED");
        }
      } catch (err) {
        console.error("Failed to mark payment as USED", err);
      }

      toast.success("Success ❤️ Letter sent beautifully");
      navigate("/user/dashboard");
    } catch (err) {
      toast.error("Error: " + (err.message || "Failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative" style={{
      background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
      backgroundAttachment: 'fixed'
    }}>

      {/* Ambient Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Floating Letter Icons Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {[...Array(20)].map((_, i) => {
          // Letter themed icons
          const icons = ['✉️', '💌', '📝', '📜', '🌹', '✨', '✒️'];
          const icon = icons[Math.floor(Math.random() * icons.length)];
          const size = Math.random() * 20 + 20; // 20px to 40px
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const duration = Math.random() * 10 + 10; // 10s to 20s
          const delay = Math.random() * 5;

          return (
            <div
              key={i}
              className="absolute animate-float-icon"
              style={{
                fontSize: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                animation: `floatIcon ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))',
                opacity: 0.4
              }}
            >
              {icon}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes floatIcon {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translate(-5px, -40px) rotate(-10deg);
            opacity: 0.6;
          }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative z-10 w-full max-w-2xl px-3 sm:px-6 py-6 sm:py-10 mx-auto flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-8 text-white drop-shadow-[0_0_15px_rgba(183,32,153,0.5)] animate-fade-in-up">
          Your Love Letter Preview
        </h2>

        {/* Letter preview with template image background */}
        <div
          className={`relative w-full mx-auto rounded-tl-2xl rounded-br-2xl shadow-2xl border-1 overflow-hidden mb-8 min-h-[500px] sm:min-h-[600px] ${paperStyle} transition-transform hover:scale-[1.01] duration-500`}
          style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}
        >
          <img
            src={templateImage}
            alt="Letter template"
            className="absolute inset-0 w-full h-full object-cover brightness-105"
          />
          <div className="absolute inset-0 bg-black/5" />
          <div className="relative p-6 sm:p-8 md:p-10 h-full flex flex-col">
            <div className="text-right text-xs text-gray-800/60 mb-4 font-bold uppercase tracking-widest">Template #{templateId}</div>
            <div className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-800 font-serif whitespace-pre-line flex-1 drop-shadow-sm">
              {letterContent}
            </div>
            <div className="mt-8 text-sm sm:text-base md:text-lg italic text-gray-800 font-medium">With all my love,</div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-center px-4 w-full">
          <button
            className={`w-full sm:w-auto px-10 py-4 rounded-2xl text-lg font-bold text-white transition-all duration-300 shadow-[0_0_20px_rgba(183,32,153,0.4)] ${loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-[0_0_40px_rgba(183,32,153,0.6)] hover:scale-105"}`}
            style={{
              background: 'linear-gradient(135deg, #FF3F78 0%, #B72099 100%)',
              animation: 'fadeInUp 1s ease-out 0.6s both'
            }}
            onClick={handleSubmitLetter}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Submit Letter ❤️
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
