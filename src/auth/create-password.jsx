import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

export default function CreatePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // -----------------------------
  // Password Validation
  // -----------------------------
  const validatePassword = () => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 12) return "Password must be max 12 characters";
    if (!/[A-Za-z]/.test(password)) return "Must include letters (A–Z)";
    if (!/[0-9]/.test(password)) return "Must include numbers (0–9)";
    return null;
  };

  // -----------------------------
  // SUBMIT PASSWORD
  // -----------------------------
  const submitPassword = async (e) => {
    e.preventDefault();
    const error = validatePassword();
    if (error) return alert(error);
    if (password !== confirmPassword)
      return alert("Passwords do not match");
    setLoading(true);
    try {
      const res = await api.post("/auth/set-password", {
        mobile,
        password,
      });
      alert("Password set successfully!");
      navigate("/login"); // Redirect to login or dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Error setting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-2">
      <form
        className="w-full max-w-md bg-black rounded-xl p-8 flex flex-col items-center shadow-lg"
        onSubmit={submitPassword}
      >
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Create a password</h2>
        <p className="text-gray-400 text-base mb-6 text-center">
          Set a secure password to protect your account and sign in anytime.
        </p>
        <div className="w-full relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Create Password"
            maxLength={12}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-base text-white"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "See"}
          </button>
        </div>
        <div className="w-full relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Confirm Password"
            maxLength={12}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-base text-white"
            onClick={() => setShowConfirm(!showConfirm)}
            tabIndex={-1}
          >
            {showConfirm ? "Hide" : "See"}
          </button>
        </div>
        <button
          type="submit"
          className={`w-full bg-pink-500 text-white rounded-lg py-3 font-semibold text-base mb-4 transition-colors ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-pink-600'}`}
          disabled={loading}
        >
          {loading ? "Setting..." : "Set Password"}
        </button>
      </form>
    </div>
  );
}
