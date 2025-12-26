import React from "react";
import { useNavigate } from "react-router-dom";

export default function Entry() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-2">
      {/* HERO IMAGE */}
      <div className="w-full h-[60vw] max-h-[500px] overflow-hidden flex items-center justify-center mb-4">
        <img
          src={"/src/assets/images/entry.png"}
          alt="Hero"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      {/* CONTENT */}
      <div className="w-full max-w-md bg-black px-6 py-12 rounded-xl flex flex-col items-center justify-center shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Hello there</h2>
        <p className="text-sm text-gray-400 mb-8 text-center leading-6">
          Sign up or log in to<br />your account
        </p>
        {/* GOOGLE BUTTON */}
        <button
          className="flex items-center justify-center bg-white py-4 rounded-full w-full mb-4 gap-2 font-semibold text-black text-base"
          onClick={() => alert("Google login coming soon")}
        >
          <span className="font-bold text-lg">G</span>
          Continue with Google
        </button>
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
