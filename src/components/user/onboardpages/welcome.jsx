

import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import bgimg from "../../../assets/images/bg.png";
import couplePose from "../../../assets/images/couple_pose_1.png";

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
      <div className="fixed inset-0 -z-10">
        <img
          src={bgimg}
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>
      {/* Content centered and responsive */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12">
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
              className="w-full py-2 sm:py-2.5 md:py-2.5 px-3 sm:px-4 md:px-5 mt-8 rounded-lg font-semibold text-base sm:text-base md:text-lg text-white transition-all"
              style={{
                background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
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