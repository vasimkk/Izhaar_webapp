import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import bgimg from "../assets/images/b.jpg";
import couplePose from "../assets/images/C.png";
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";

import 'react-toastify/dist/ReactToastify.css';
import api from "../utils/api";
import { setAccessToken, setRefreshToken } from "../utils/tokenStore";
export default function Entry() {
  const navigate = useNavigate();
const auth = useAuth();
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const { credential: idToken } = credentialResponse;

    const res = await api.post("/googleLogin", { idToken });

    const { accessToken, refreshToken, role } = res.data;

    // 1️⃣ Save tokens
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    if (auth?.setAccessToken) auth.setAccessToken(accessToken);
    if (auth?.setRefreshToken) await auth.setRefreshToken(refreshToken);

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // 2️⃣ Resolve role (same as password login)
    let roleValue = role || null;
    if (!roleValue && accessToken) {
      try {
        const payload = JSON.parse(
          atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        roleValue = payload.role;
      } catch (e) {
        console.error("Failed to decode JWT role:", e);
      }
    }

    if (roleValue) setRoleAndStore(roleValue);

    console.log("[Google Login] Effective role:", roleValue);

    // 3️⃣ Admin redirect
    if (roleValue?.toLowerCase().trim() === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    // 4️⃣ Agreement check
    try {
      const agreeRes = await api.get("/user-agreement/status");
      if (!agreeRes.data?.agreed) {
        navigate("/welcome", { replace: true });
        return;
      }
    } catch {
      navigate("/welcome", { replace: true });
      return;
    }

    // 5️⃣ Profile check
    try {
      const profileRes = await api.get("/profile/me");
      const profileData = profileRes.data.profile || profileRes.data;
      const hasProfile = profileData && (profileData.id || profileData._id);

      if (hasProfile) {
        navigate("/user/dashboard", { replace: true });
        return;
      } else {
        navigate("/profile", { replace: true });
        return;
      }
    } catch {
      navigate("/profile", { replace: true });
      return;
    }

  } catch (err) {
    console.error("Google login error:", err);
    toast.error("Google login failed", { position: "top-center" });
  }
};





  const handleGoogleError = () => {
    toast.error('Google login failed', { position: 'top-center' });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <ToastContainer />
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src={bgimg}
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Two Column Layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12">
        
        {/* Left Side - Couple Image */}
        <div className="hidden md:flex flex-1 items-center justify-center w-full">
          <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg">
            <img
              src={couplePose}
              alt="Couple"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Right Side - Entry Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div 
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-white/20"
            style={{
              borderRadius: '18px',
              background: 'rgba(0, 0, 0, 0.28)',
              boxShadow: '0 4px 31px 0 rgba(0, 0, 0, 0.38)',
              backdropFilter: 'blur(48.25px)'
            }}
          >
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Hello there</h2>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                Sign up or log in to<br />your account
              </p>
            </div>
            {/* GOOGLE BUTTON */}
            <div className="w-full mb-3 sm:mb-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              
                size="large"
                theme="filled_black"
                shape="pill"
              />
            </div>
            
            <div className="relative flex items-center py-3 sm:py-4">
              <div className="flex-grow border-t border-white/20"></div>
              <span className="flex-shrink mx-2 sm:mx-3 md:mx-4 text-white/60 text-xs font-semibold uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-white/20"></div>
            </div>
            {/* PHONE BUTTON */}
            <button
              className="w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5 transition-all shadow-lg text-white hover:opacity-90 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
              }}
              onClick={() => navigate("/register")}
            >
              Continue with phone
            </button>
            {/* SIGN IN LINK */}
            <div className="flex justify-center items-center gap-1 sm:gap-1.5 mt-2">
              <span className="text-white/70 text-xs sm:text-sm">Already have an account?</span>
              <button
                className="text-white font-semibold text-xs sm:text-sm underline hover:text-white/90"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}