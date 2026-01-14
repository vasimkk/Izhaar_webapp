

import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";


export default function WelcomeIzhaar() {
  const navigate = useNavigate();

  const agreeTerms = async () => {
    try {
      await api.post("/user-agreement", {
        agreed: true,
      });
      navigate("/profile", { replace: true });
    } catch (err) {
      alert("Failed to save agreement. Try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-2 relative">
      {/* Background image */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
          animation: 'gradientShift 15s ease infinite'
        }}
      ></div>
      
      {/* Content centered and responsive */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12">
        <div className="flex-1 flex items-center justify-center w-full">
          <div 
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border rounded-3xl backdrop-blur-md"
             style={{
              borderColor: 'rgba(212, 197, 232, 0.3)',
              background: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px 0 rgba(45, 27, 78, 0.15), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
              animation: 'glow 4s ease-in-out infinite'
            }}
          >
       
        {/* TITLE */}
        <h2 className="text-3xl font-bold text-black mb-2 text-center">Welcome to Izhaar 💕 Love</h2>
        <p className="text-base text-black mb-4 text-center">Where every heartbeat finds its voice.</p>
        <h3 className="mt-4 text-lg font-bold text-black">Be true.</h3>
        <p className="text-sm text-black mb-2 text-center">This isn’t a dating app. It’s a place for honest emotions — say what your heart feels, not what others expect.</p>
        <h3 className="mt-4 text-lg font-bold text-black">Stay safe.</h3>
        <p className="text-sm text-black mb-2 text-center">Every confession is protected with care. Your feelings stay private.</p>
        <h3 className="mt-4 text-lg font-bold text-black">Respect love.</h3>
        <p className="text-sm text-black mb-2 text-center">Behind every message is a story, a hope, a heartbeat. Treat every confession with kindness.</p>
        <h3 className="mt-4 text-lg font-bold text-black">Be human.</h3>
        <p className="text-sm text-black mb-2 text-center">No filters. No games. Just courage, honesty, and a little magic — the Izhaar way.</p>
            {/* BUTTON */}
            <button
              className="w-full py-2 sm:py-2.5 md:py-2.5 px-3 sm:px-4 md:px-5 mt-8 rounded-lg font-semibold text-base sm:text-base md:text-lg text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)',
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
              onClick={agreeTerms}
            >
              I Agree
            </button>
          </div>
        </div>

        {/* Right Side Content End */}
      </div>

      {/* Container End */}
    </div>
  );
}