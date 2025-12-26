import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState({
    name: 'India',
    code: '+91',
    flag: '🇮🇳',
  });

  const countries = [
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    { name: 'Germany', code: '+49', flag: '🇩🇪' },
    { name: 'France', code: '+33', flag: '🇫🇷' },
    { name: 'Singapore', code: '+65', flag: '🇸🇬' },
    { name: 'UAE', code: '+971', flag: '🇦🇪' },
    { name: 'Nepal', code: '+977', flag: '🇳🇵' },
  ];

  // Mobile number validation rules by country code
  const mobileValidationRules = {
    '+91': { length: 10, regex: /^[6-9]\d{9}$/ }, // India
    '+1': { length: 10, regex: /^\d{10}$/ }, // US/Canada
    '+44': { length: 10, regex: /^\d{10}$/ }, // UK (simplified)
    '+61': { length: 9, regex: /^\d{9}$/ }, // Australia (without leading 0)
    '+49': { length: 10, regex: /^\d{10}$/ }, // Germany (simplified)
    '+33': { length: 9, regex: /^\d{9}$/ }, // France (without leading 0)
    '+65': { length: 8, regex: /^\d{8}$/ }, // Singapore
    '+971': { length: 9, regex: /^\d{9}$/ }, // UAE
    '+977': { length: 10, regex: /^\d{10}$/ }, // Nepal
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const rule = mobileValidationRules[country.code];
    if (!rule) {
      alert('Please select a valid country.');
      return;
    }
    if (mobile.length !== rule.length || !rule.regex.test(mobile)) {
      alert(`Enter a valid mobile number for ${country.name}`);
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { mobile, role: "user" });
      alert("OTP sent! (Demo)");
      navigate("/otp"); // Update to your OTP route
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-2">
      <form
        className="w-full max-w-md bg-black rounded-xl p-8 flex flex-col items-center shadow-lg"
        onSubmit={handleRegister}
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Enter your mobile number</h2>
          <p className="text-gray-400 text-base">
            We’ll send a one-time verification code to confirm your number and keep your account secure.
          </p>
        </div>
        <div className="w-full mb-4">
          <select
            className="w-full bg-zinc-900 text-white rounded-lg border border-zinc-700 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={country.code}
            onChange={e => setCountry(countries.find(c => c.code === e.target.value))}
          >
            {countries.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
        <div className="w-full flex items-center border border-zinc-700 rounded-lg bg-zinc-900 mb-8 px-3 py-2">
          <span className="text-white font-semibold min-w-[48px] text-center">{country.code}</span>
          <span className="text-gray-500 mx-2">|</span>
          <input
            type="tel"
            className="flex-1 bg-transparent outline-none text-white py-2 px-2 text-base"
            placeholder="Enter mobile number"
            maxLength={mobileValidationRules[country.code]?.length || 10}
            value={mobile}
            onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
            autoComplete="tel"
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-pink-500 text-white rounded-lg py-3 font-semibold text-base mb-4 transition-colors ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-pink-600'}`}
          disabled={loading}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
        <div className="flex justify-center items-center gap-2 mt-2">
          <span className="text-gray-400 text-base">Already registered?</span>
          <button
            type="button"
            className="text-white font-bold underline text-base"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
