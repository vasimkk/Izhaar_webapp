import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import bgimg from "../assets/images/bg.png";
import couplePose from "../assets/images/couple_pose_1.png";

import api from "../utils/api";
import { setAccessToken, setRefreshToken } from "../utils/tokenStore";
import { useAuth } from "../context/AuthContext";

export default function Entry() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      /* =======================
         1️⃣ GOOGLE AUTH
      ======================= */
      const idToken = credentialResponse?.credential;
      const res = await api.post("/googleLogin", { idToken });

      const { accessToken, refreshToken, role } = res.data;

      // Store tokens
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      auth?.setAccessToken?.(accessToken);
      auth?.setRefreshToken?.(refreshToken);

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      /* =======================
         2️⃣ ROLE CHECK
      ======================= */
      let resolvedRole = role;

      if (!resolvedRole && accessToken) {
        try {
          const payload = JSON.parse(
            atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
          );
          resolvedRole = payload.role;
        } catch {}
      }

      if (resolvedRole?.toLowerCase() === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      /* =======================
         3️⃣ AGREEMENT CHECK
      ======================= */
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

      /* =======================
         4️⃣ PROFILE CHECK
      ======================= */
      let hasProfile = false;
      try {
        const profileRes = await api.get("/profile/me");
        const profile = profileRes.data?.profile || profileRes.data;
        hasProfile = Boolean(profile?.id || profile?._id);
      } catch {
        navigate("/profile", { replace: true });
        return;
      }

      if (!hasProfile) {
        navigate("/profile", { replace: true });
        return;
      }

      /* =======================
         5️⃣ TEMPLATE SELECTION CHECK
      ======================= */
      try {
        const templateRes = await api.get("/user/template-selection/status");
        if (!templateRes.data?.selected) {
          navigate("/select-template", { replace: true });
          return;
        }
      } catch {
        navigate("/select-template", { replace: true });
        return;
      }

      /* =======================
         6️⃣ FINAL → DASHBOARD
      ======================= */
      navigate("/user/dashboard", { replace: true });

    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed", { position: "top-center" });
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed", { position: "top-center" });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <ToastContainer />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <img src={bgimg} alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 gap-10">

        {/* Left Image */}
        <div className="hidden md:flex flex-1 justify-center">
          <img
            src={couplePose}
            alt="Couple"
            className="max-w-md drop-shadow-2xl"
          />
        </div>

        {/* Right Card */}
        <div className="flex-1 flex justify-center">
          <div
            className="w-full max-w-md p-8 border border-white/20"
            style={{
              borderRadius: 18,
              background: "rgba(0,0,0,0.28)",
              backdropFilter: "blur(48px)",
            }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-3">
              Hello there
            </h2>
            <p className="text-white/70 text-center mb-6">
              Sign up or log in to your account
            </p>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              theme="filled_black"
              shape="pill"
            />

            <div className="flex items-center my-5">
              <div className="flex-grow border-t border-white/20" />
              <span className="mx-3 text-white/60 text-xs">OR</span>
              <div className="flex-grow border-t border-white/20" />
            </div>

            <button
              onClick={() => navigate("/register")}
              className="w-full rounded-xl py-3 font-semibold text-white shadow-lg"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,71,71,.7), rgba(157,209,255,.7))",
              }}
            >
              Continue with phone
            </button>

            <div className="text-center mt-4 text-white/70 text-sm">
              Already have an account?{" "}
              <button
                className="underline font-semibold"
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
