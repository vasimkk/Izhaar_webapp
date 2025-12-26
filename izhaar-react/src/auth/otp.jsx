
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

export default function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile || "";
  const type = location.state?.type || "register";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) return alert("Enter valid 4-digit OTP");
    setLoading(true);
    try {
      let endpoint = "";
      if (type === "forgot") {
        endpoint = "/auth/forgot-password/verify-otp";
      } else {
        endpoint = "/auth/verify-otp";
      }
      await api.post(endpoint, { mobile, otp });
      if (type === "forgot") {
        navigate("/reset-password", { state: { mobile } });
      } else {
        navigate("/create-password", { state: { mobile } });
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const regenerateOtp = async () => {
    try {
      let endpoint = "";
      if (type === "forgot") {
        endpoint = "/auth/forgot-password/regenerate-otp";
      } else {
        endpoint = "/auth/regenerate-otp";
      }
      await api.post(endpoint, { mobile });
      alert("New OTP sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending new OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-2">
      <form
        className="w-full max-w-md bg-black rounded-xl p-8 flex flex-col items-center shadow-lg"
        onSubmit={verifyOTP}
      >
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Verify OTP</h2>
        <p className="text-gray-400 text-base mb-6 text-center">
          We’ve sent you a code via SMS. Please enter it to continue.
        </p>
        <input
          type="tel"
          className="w-full px-4 py-3 rounded-lg bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-center text-xl tracking-widest mb-4"
          placeholder="Enter OTP"
          maxLength={4}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
          required
        />
        <button
          type="submit"
          className={`w-full bg-pink-500 text-white rounded-lg py-3 font-semibold text-base mb-4 transition-colors ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-pink-600'}`}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <button
          type="button"
          className="w-full text-pink-500 font-semibold underline text-base mt-2"
          onClick={regenerateOtp}
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
}
