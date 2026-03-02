import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

export default function WelcomeIzhaar() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Intercept Browser Back Button
  useEffect(() => {
    // 1. Push a state into history so that clicking "Back" triggers a popstate event
    //    We do this immediately on mount.
    window.history.pushState({ page: 'welcome' }, "", window.location.href);

    const handlePopState = (event) => {
      // 2. When the user clicks back, this event fires.
      //    We want to prevent leaving, so we push the state AGAIN to keep them here.
      window.history.pushState({ page: 'welcome' }, "", window.location.href);

      // 3. Show the confirmation modal
      setShowExitConfirm(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const confirmExit = (e) => {
    e.preventDefault();
    setAccessToken(null);
    navigate("/entry");
  };

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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background Gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: '#000'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
      </div>



      <style>{`
        @keyframes float-up {
          0% { transform: translateY(110vh) translateX(0) scale(0.8); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translateY(50vh) translateX(20px) scale(1.1); }
          100% { transform: translateY(-10vh) translateX(-20px) scale(0.8); opacity: 0; }
        }
        @keyframes continuousFloat {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            transform: translateY(-50vh) translateX(30px) rotate(180deg) scale(1);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-120vh) translateX(-20px) rotate(360deg) scale(0.7);
            opacity: 0;
          }
        }
        @keyframes heart-beat {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .love-icon {
          position: absolute;
          z-index: 1;
          filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.5));
        }
      `}</style>



      {/* Back Button (Mobile Only) */}
      <button
        onClick={() => setShowExitConfirm(true)}
        className="absolute left-4 top-4 md:hidden w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 z-50"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5 text-white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Main Layout - Centered for both Mobile & Desktop */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 md:px-8 py-8 lg:py-0 relative" style={{ zIndex: 1 }}>
        {/* Welcome Content Container */}
        <div className="flex items-center justify-center w-full">
          <div
            className="w-full max-w-[380px] sm:max-w-md p-6 sm:p-8 md:p-10 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.3)] relative overflow-hidden transition-all duration-500"
          >
            {/* Soft Romantic Gradients */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full"></div>

            {/* TITLE */}
            <h2
              className="text-[24px] sm:text-[32px] md:text-[38px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EC4891] to-[#A928ED] mb-2 text-center drop-shadow-md leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Welcome to Izhaar 💕 Love
            </h2>
            <p
              className="text-[12px] sm:text-[14px] md:text-[15px] text-[#D1D5DC] font-semibold mb-6 text-center"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Where every heartbeat finds its voice.
            </p>

            <div className="space-y-3 sm:space-y-4">
              <div className="text-center group">
                <h3 className="text-[14px] sm:text-[16px] font-bold text-pink-300 transition-colors group-hover:text-pink-400">Be true.</h3>
                <p className="text-[11px] sm:text-[13px] text-gray-200 leading-relaxed">This isn’t a dating app. It’s a place for honest emotions — say what your heart feels.</p>
              </div>
              <div className="text-center group">
                <h3 className="text-[14px] sm:text-[16px] font-bold text-pink-300 transition-colors group-hover:text-pink-400">Stay safe.</h3>
                <p className="text-[11px] sm:text-[13px] text-gray-200 leading-relaxed">Every confession is protected with care. Your feelings stay private.</p>
              </div>
              <div className="text-center group">
                <h3 className="text-[14px] sm:text-[16px] font-bold text-pink-300 transition-colors group-hover:text-pink-400">Respect love.</h3>
                <p className="text-[11px] sm:text-[13px] text-gray-200 leading-relaxed">Behind every message is a story, a hope, a heartbeat. Treat every confession with kindness.</p>
              </div>
              <div className="text-center group">
                <h3 className="text-[14px] sm:text-[16px] font-bold text-pink-300 transition-colors group-hover:text-pink-400">Be human.</h3>
                <p className="text-[11px] sm:text-[13px] text-gray-200 leading-relaxed">No filters. No games. Just courage, honesty, and a little magic.</p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              className="w-full h-[40px] sm:h-[48px] mt-8 rounded-xl sm:rounded-2xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center"
              style={{
                background: 'linear-gradient(90deg, #EC4891 -12.18%, #A928ED 76.79%)',
                boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              onClick={agreeTerms}
            >
              I Agree & Continue
            </button>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center transform transition-all scale-100 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>

            <h3 className="text-xl font-bold text-white mb-2">Change Account?</h3>
            <p className="text-gray-300 text-sm mb-6">
              Do you want to discard changes and go back to the entry page?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
              >
                No, Stay
              </button>
              <button
                onClick={confirmExit}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-500/20 transition-transform active:scale-95"
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}