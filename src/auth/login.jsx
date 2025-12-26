
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import bgimg from "../assets/images/bgimg.png";
import {useAuth } from "../context/AuthContext";
import { setAccessToken, setRefreshToken } from "../utils/tokenStore";
export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const validatePassword = () => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 12) return "Password must be max 12 characters";
    if (!/[A-Za-z]/.test(password)) return "Must include letters (A–Z)";
    if (!/[0-9]/.test(password)) return "Must include numbers (0–9)";
    return null;
  };


  const loginUser = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) return alert("Enter valid 10-digit mobile number");
    const error = validatePassword();
    if (error) return alert(error);
    setLoading(true);
    try {
      const res = await api.post("/auth/login-password", { mobile, password });
      // Save access + refresh token
      // Store tokens in cookies
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      if (auth?.setAccessToken) auth.setAccessToken(res.data.accessToken);
      if (auth?.setRefreshToken) await auth.setRefreshToken(res.data.refreshToken);
      if (res.data.role && auth?.setRole) auth.setRole(res.data.role);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
      if (res.data.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }
      try {
        const agreeRes = await api.get("/user-agreement/status");
        if (!agreeRes.data?.agreed) {
          navigate("/welcome", { replace: true });
          return;
        }
        try {
          const profileRes = await api.get("/profile/me");
          const profileData = profileRes.data.profile || profileRes.data;
          const hasProfile = profileData && (profileData.id || profileData._id);
          if (hasProfile) {
            try {
              const historyRes = await api.get("/user/template-history");
              if (historyRes.data && historyRes.data.length > 0) {
                navigate("/user/dashboard", { replace: true });
                return;
              } else {
                navigate("/user/dashboard", { replace: true });
                return;
              }
            } catch {
              navigate("/user/dashboard", { replace: true });
              return;
            }
          }
        } catch {
          // Profile not found
        }
        navigate("/profile", { replace: true });
      } catch {
        navigate("/welcome", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        console.error("API response:", err.response);
        alert(err.response?.data?.message || `Login error: ${err.response.status}`);
      } else {
        alert("Login error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-2 relative">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src={bgimg}
          alt="Background"
          className="w-full h-full object-cover object-center blur-md brightness-110"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* Content centered and responsive */}
      <form
        className="w-full max-w-md bg-black/80 rounded-xl p-8 flex flex-col items-center shadow-lg backdrop-blur-md"
        onSubmit={loginUser}
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Log In</h2>
        <input
          type="tel"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Mobile Number"
          maxLength={10}
          value={mobile}
          onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
          required
        />
        <div className="w-full relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Password"
            maxLength={12}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-xl"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <button
          type="submit"
          className={`w-full bg-pink-500 text-white rounded-lg py-3 font-semibold text-base mb-4 transition-colors ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-pink-600'}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="flex justify-between w-full mt-2">
          <button
            type="button"
            className="text-pink-500 font-semibold underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
          <button
            type="button"
            className="text-white font-bold underline"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
