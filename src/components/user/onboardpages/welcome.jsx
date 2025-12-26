

import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import bgimg from "../../../assets/images/bgimg.png";

export default function WelcomeIzhaar() {
  const navigate = useNavigate();

  const agreeTerms = async () => {
    try {
      await api.post("/user-agreement", {
        agreed: true,
      });
      navigate("/profile"); // Update to your user profile route
    } catch (err) {
      alert("Failed to save agreement. Try again.");
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
      <div className="w-full max-w-lg bg-black/80 rounded-xl p-8 flex flex-col items-center shadow-lg backdrop-blur-md">
        {/* ICON */}
        <div className="flex justify-center mt-10 mb-4">
          <span className="text-6xl">💞</span>
        </div>
        {/* TITLE */}
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome to Izhaar 💕 Love</h2>
        <p className="text-base text-white mb-4 text-center">Where every heartbeat finds its voice.</p>
        <h3 className="mt-4 text-lg font-bold text-white">Be true.</h3>
        <p className="text-sm text-white mb-2 text-center">This isn’t a dating app. It’s a place for honest emotions — say what your heart feels, not what others expect.</p>
        <h3 className="mt-4 text-lg font-bold text-white">Stay safe.</h3>
        <p className="text-sm text-white mb-2 text-center">Every confession is protected with care. Your feelings stay private.</p>
        <h3 className="mt-4 text-lg font-bold text-white">Respect love.</h3>
        <p className="text-sm text-white mb-2 text-center">Behind every message is a story, a hope, a heartbeat. Treat every confession with kindness.</p>
        <h3 className="mt-4 text-lg font-bold text-white">Be human.</h3>
        <p className="text-sm text-white mb-2 text-center">No filters. No games. Just courage, honesty, and a little magic — the Izhaar way.</p>
        {/* BUTTON */}
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold text-base rounded-lg py-4 px-8 mt-8 w-full"
          onClick={agreeTerms}
        >
          I Agree
        </button>
      </div>
    </div>
  );
}
