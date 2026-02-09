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
    <div className="min-h-screen w-full flex items-center justify-center px-2 relative" style={{
      background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Animation Styles */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(110vh) translateX(0) scale(0.8); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translateY(50vh) translateX(20px) scale(1.1); }
          100% { transform: translateY(-10vh) translateX(-20px) scale(0.8); opacity: 0; }
        }
        @keyframes heart-beat {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes sparkle-blink {
          0%, 100% { opacity: 0.3; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .love-icon {
          position: absolute;
          z-index: 1;
          filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.5));
        }
      `}</style>

      {/* Animated Background Icons (Hearts, Letters, Rings) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden fixed h-full w-full">
        {/* Floating Icons */}
        {[...Array(20)].map((_, i) => {
          const iconType = i % 4; // 0: Heart, 1: Letter, 2: Ring, 3: Star
          return (
            <div
              key={`icon-${i}`}
              className="love-icon"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 30 + 20}px`,
                animation: `float-up ${Math.random() * 15 + 10}s linear infinite -${Math.random() * 15}s`,
                opacity: Math.random() * 0.5 + 0.3,
                color: ['#fb7185', '#e879f9', '#60a5fa', '#fcd34d'][Math.floor(Math.random() * 4)] // Pink, Purple, Blue, Gold
              }}
            >
              {iconType === 0 && (
                // Heart
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
              {iconType === 1 && (
                // Envelope/Letter
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              )}
              {iconType === 2 && (
                // Ring/Circle
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              )}
              {iconType === 3 && (
                // Star/Sparkle
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                </svg>
              )}
            </div>
          );
        })}

        {/* Twinkling Stars Background */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white rounded-full z-0"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2}px`,
              height: `${Math.random() * 2}px`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `sparkle-blink ${Math.random() * 4 + 3}s ease-in-out infinite -${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

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

      {/* Content centered and responsive */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12 relative z-10">
        <div className="flex-1 flex items-center justify-center w-full">
          <div
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border rounded-3xl backdrop-blur-md"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >

            {/* TITLE */}
            <h2 className="text-3xl font-bold text-white mb-2 text-center drop-shadow-md">Welcome to Izhaar 💕 Love</h2>
            <p className="text-base text-purple-200 mb-6 text-center">Where every heartbeat finds its voice.</p>

            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-pink-300">Be true.</h3>
                <p className="text-sm text-gray-200">This isn’t a dating app. It’s a place for honest emotions — say what your heart feels.</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-pink-300">Stay safe.</h3>
                <p className="text-sm text-gray-200">Every confession is protected with care. Your feelings stay private.</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-pink-300">Respect love.</h3>
                <p className="text-sm text-gray-200">Behind every message is a story, a hope, a heartbeat. Treat every confession with kindness.</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-pink-300">Be human.</h3>
                <p className="text-sm text-gray-200">No filters. No games. Just courage, honesty, and a little magic.</p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              className="w-full py-3 sm:py-3.5 px-3 sm:px-4 md:px-5 mt-8 rounded-xl font-bold text-base sm:text-lg text-white transition-all transform hover:scale-[1.02] active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
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