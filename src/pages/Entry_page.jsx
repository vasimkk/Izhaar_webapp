import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import bgimg from "../assets/images/bgimg.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Entry() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential: idToken } = credentialResponse;
      const res = await axios.post("/googleLogin", { idToken });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      window.location.reload();
    } catch (err) {
      toast.error('Google login failed', { position: 'top-center' });
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed', { position: 'top-center' });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-2 relative">
      <ToastContainer />
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
      <div className="w-full max-w-md bg-black/80 px-6 py-12 rounded-xl flex flex-col items-center justify-center shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Hello there</h2>
        <p className="text-sm text-gray-400 mb-8 text-center leading-6">
          Sign up or log in to<br />your account
        </p>
        {/* GOOGLE BUTTON */}
        <div className="mb-4 w-full rounded-full py-6">
          <GoogleLogin
            width="100%"
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
        <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-rose-100"></div>
              <span className="flex-shrink mx-4 text-rose-300 text-xs font-bold uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-rose-100"></div>
          </div>
        {/* PHONE BUTTON */}
        <button
          className="flex items-center justify-center bg-zinc-800 py-4 rounded-full w-full mb-6 gap-2 font-semibold text-white text-base"
          onClick={() => navigate("/register")}
        >
          <span className="font-bold text-lg">P</span>
          Continue with phone
        </button>
        {/* SIGN IN LINK */}
        <div className="flex justify-center items-center gap-2 mt-2">
          <span className="text-gray-400 text-sm">Already have an account?</span>
          <button
            className="text-white font-bold underline text-sm"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}