
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useLetter } from "../../../context/LetterContext";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";
import bg1 from '../../../assets/temp/letter_01.jpeg';
import bg2 from '../../../assets/temp/letter_02.png';
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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden">

      <div className="relative z-10 w-full max-w-2xl px-3 sm:px-6 py-6 sm:py-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-white drop-shadow-lg">
          Your Love Letter Preview
        </h2>

        {/* Letter preview with template image background */}
        <div className={`relative w-full mx-auto rounded-tl-2xl rounded-br-2xl shadow-2xl border-1 overflow-hidden mb-6 sm:mb-8 min-h-[500px] sm:min-h-[600px] ${paperStyle}`}>
          <img 
            src={templateImage} 
            alt="Letter template"
            className="absolute inset-0 w-full h-full object-cover brightness-110"
          />
          <div className="absolute inset-0 " />
          <div className="relative p-4 sm:p-6 md:p-8 h-full flex flex-col">
            <div className="text-right text-xs text-gray-700 mb-3 sm:mb-4">Template #{templateId}</div>
            <div className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 font-serif whitespace-pre-line flex-1">
              {letterContent}
            </div>
            <div className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg italic text-gray-700">With all my love,</div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-center px-4">
          <button
            className={`w-full sm:w-auto px-8 sm:px-10 py-3 rounded-lg text-base sm:text-lg font-bold text-white transition-all duration-200 shadow-lg ${loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}
            style={{
              background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
            }}
            onClick={handleSubmitLetter}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Letter ❤️"}
          </button>
        </div>
      </div>
    </div>
  );
}
