import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";

export default function ReceiverForLetter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setReceiverDetails } = useReceiverForLetter();

  const [receiverName, setReceiverName] = useState("");
  const [receiverMobile, setReceiverMobile] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverInstagramId, setReceiverInstagramId] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidMobile = (value) => /^\d{10}$/.test(value.trim());
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasValidMobile = isValidMobile(receiverMobile);
    const hasValidEmail = isValidEmail(receiverEmail);
    const hasInstagramId = !!receiverInstagramId.trim();

    if (!hasValidMobile && !hasValidEmail && !hasInstagramId) {
      alert("Enter at least one: Mobile or Email or Instagram ID");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        receiverName: receiverName.trim() || null,
        receiverMobile: hasValidMobile ? receiverMobile : null,
        receiverEmail: hasValidEmail ? receiverEmail : null,
        receiverInstagramId: hasInstagramId ? receiverInstagramId : null,
      };
      const res = await api.post("/chat/receiver", payload);
      setReceiverName("");
      setReceiverMobile("");
      setReceiverEmail("");
      setReceiverInstagramId("");
      setReceiverDetails(res.data); // Store in context
      const cameFromSongFlow = location.state?.from === "/user/song" || location.state?.from === "/user/song/payment-subscription";
      if (cameFromSongFlow) {
        navigate("/user/song/create", { replace: true });
      } else {
        navigate("/user/letter-izhaar/write-prompt", { state: { data: res.data } });
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Failed to submit receiver details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setReceiverName("");
    setReceiverMobile("");
    setReceiverEmail("");
    setReceiverInstagramId("");
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Content */}
      
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 py-8"  style={{
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
          animation: 'gradientShift 15s ease infinite'
        }}>
        
        {/* Mobile Back Button */}
        <div className="w-full relative z-10 pt-2 md:pt-4">
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
        </div>
          
        <div className="w-full max-w-lg mx-auto">
          {/* Form Card */}
          <div
            className="rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-lg border border-white/10"
           style={{
              borderColor: 'rgba(212, 197, 232, 0.3)',
              background: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px 0 rgba(45, 27, 78, 0.15), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
              animation: 'glow 4s ease-in-out infinite'
            }}
          >
            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center">
              Receiver Details?
            </h3>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Receiver Name <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full rounded-xl border border-black bg-white/10 text-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 backdrop-blur-sm"
                  placeholder="John Doe"
                  type="text"
                  value={receiverName}
                  onChange={e => setReceiverName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Mobile Input */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full rounded-xl border border-black bg-white/10 text-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 backdrop-blur-sm"
                  placeholder="10-digit mobile"
                  type="tel"
                  maxLength={10}
                  value={receiverMobile}
                  onChange={e => setReceiverMobile(e.target.value.replace(/\D/g, ""))}
                  disabled={loading}
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Email Address <span className="text-black-400 text-xs">(optional)</span>
                </label>
                <input
                  className="w-full rounded-xl border border-black bg-white/10 text-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 backdrop-blur-sm"
                  placeholder="your@email.com"
                  type="email"
                  value={receiverEmail}
                  onChange={e => setReceiverEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Instagram Input */}
              {/* <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Instagram ID <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  className="w-full rounded-xl border border-white/20 bg-white/10 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 backdrop-blur-sm"
                  placeholder="@username"
                  type="text"
                  value={receiverInstagramId}
                  onChange={e => setReceiverInstagramId(e.target.value)}
                  disabled={loading}
                />
              </div> */}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="button"
                  className="flex-1 bg-white/20 backdrop-blur-sm text-black font-semibold py-3 rounded-xl border border-black hover:bg-white/30 transition-all"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 font-semibold py-3 rounded-xl transition-all shadow-lg text-white"
                  style={{
                    background: loading || (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim())
                      ? 'rgba(100, 100, 100, 0.5)'
                      : 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                    cursor: loading || (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim()) ? 'not-allowed' : 'pointer',
                    opacity: loading || (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim()) ? 0.6 : 1
                  }}
                  disabled={loading || (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim())}
                >
                  {loading ? "Submitting..." : "Continue ➜"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

