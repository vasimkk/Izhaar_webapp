
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";

export default function ReceiverForLetter() {
  const navigate = useNavigate();
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
      navigate("/user/letter-izhaar/write-prompt", { state: { data: res.data } });
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
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-2">
      {/* HEADER */}
      <div className="flex flex-row items-center justify-between w-full max-w-md px-4 pt-8 pb-4">
        
        <div className="w-8" />
      </div>
      {/* FORM */}
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-zinc-900 rounded-xl p-8 flex flex-col gap-4 shadow-lg">
        <h2 className="text-xl font-bold text-pink-300 mb-2">Who should receive this letter?</h2>
        {/* Name Input */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Receiver Name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
          <label className="block text-sm font-semibold text-white mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
          <label className="block text-sm font-semibold text-white mb-1">Email Address (optional)</label>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="your@email.com"
            type="email"
            value={receiverEmail}
            onChange={e => setReceiverEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        {/* Instagram Input */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Instagram ID (optional)</label>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="@username"
            type="text"
            value={receiverInstagramId}
            onChange={e => setReceiverInstagramId(e.target.value)}
            disabled={loading}
          />
        </div>
        {/* Buttons */}
        <div className="flex flex-row gap-3 mt-2">
          <button
            type="button"
            className="flex-1 bg-zinc-200 text-zinc-800 font-bold py-3 rounded-lg border border-zinc-300 hover:bg-zinc-300 transition-colors"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`flex-1 font-bold py-3 rounded-lg border transition-colors ${loading || (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim()) ? 'bg-zinc-400 text-white border-zinc-400 cursor-not-allowed' : 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600'}`}
            disabled={loading || (!isValidMobile(receiverMobile) && !isValidEmail(receiverEmail) && !receiverInstagramId.trim())}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

