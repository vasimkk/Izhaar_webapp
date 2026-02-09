import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

// --- ANIMATED ICONS ---

const IntertwinedHeartsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes soft-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
      .heart-main { animation: soft-pulse 2s ease-in-out infinite; transform-origin: center; fill: white; opacity: 0.95; }
      .heart-bg { fill: rgba(255,255,255,0.3); transform: translate(2px, 2px); }
    `}</style>
    <path className="heart-bg" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    <path className="heart-main" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const HeartLockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes key-turn {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(15deg); }
      }
      .lock { fill: white; opacity: 0.95; }
      .keyhole { fill: rgba(0,0,0,0.2); animation: key-turn 3s ease-in-out infinite; transform-origin: 12px 14px; }
    `}</style>
    <path className="lock" d="M12 2C9.2 2 7 4.2 7 7V9H6C4.9 9 4 9.9 4 11V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V11C20 9.9 19.1 9 18 9H17V7C17 4.2 14.8 2 12 2ZM12 4C13.7 4 15 5.3 15 7V9H9V7C9 5.3 10.3 4 12 4Z" />
    <path className="keyhole" d="M12 11C10.9 11 10 11.9 10 13C10 13.7 10.4 14.3 11 14.7V17H13V14.7C13.6 14.3 14 13.7 14 13C14 11.9 13.1 11 12 11Z" />
  </svg>
);

const ComplimentBubbleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
    <style>{`
        @keyframes chat-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .bubble-bg { fill: white; opacity: 0.95; }
        .inner-heart { fill: #EC4899; animation: chat-beat 1.5s ease-in-out infinite; transform-origin: center; }
      `}</style>
    <path className="bubble-bg" fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 5.58 2 10C2 12.03 2.94 13.88 4.54 15.31C4.5 15.89 4.3 16.92 3.55 18.2C3.39 18.47 3.66 18.8 3.96 18.7C5.87 18.06 7.63 17.06 8.79 16.27C9.79 16.59 10.88 16.76 12 16.76C17.52 16.76 22 13.18 22 8.76C22 4.34 17.52 2 12 2Z" />
    <path className="inner-heart" d="M12 13.5C12 13.5 15.5 10.5 15.5 8.5C15.5 6.8 14.2 5.5 12.5 5.5C11.5 5.5 10.5 6 10 6.5C9.5 6 8.5 5.5 7.5 5.5C5.8 5.5 4.5 6.8 4.5 8.5C4.5 10.5 8 13.5 8 13.5H12Z" transform="translate(2 0.5)" />
  </svg>
);

const InfinityHeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
    <style>{`
       @keyframes infinity-dash {
         0% { stroke-dashoffset: 40; }
         50% { stroke-dashoffset: 0; }
         100% { stroke-dashoffset: -40; }
       }
       .inf-path { stroke: white; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 40; animation: infinity-dash 4s linear infinite; opacity: 0.9; }
     `}</style>
    <path className="inf-path" d="M8 8C5 8 3 10 3 12C3 14 5 16 8 16C11 16 12 14 12 12C12 10 13 8 16 8C19 8 21 10 21 12C21 14 19 16 16 16C13 16 12 14 12 12C12 10 11 8 8 8Z" />
  </svg>
);

// --- FLOATING HEARTS BACKGROUND ---
const FloatingHearts = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute text-white/5 text-4xl animate-float-heart"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${12 + Math.random() * 8}s`,
          animationDelay: `${Math.random() * 5}s`,
          fontSize: `${24 + Math.random() * 24}px`,
        }}
      >
        ♥
      </div>
    ))}
    <style>{`
      @keyframes float-heart {
        0% { transform: translateY(100vh) scale(0.8); opacity: 0; }
        50% { opacity: 0.2; }
        100% { transform: translateY(-20vh) scale(1.1) rotate(15deg); opacity: 0; }
      }
      .animate-float-heart { animation: float-heart linear infinite; }
    `}</style>
  </div>
);

export default function SelectTemplate() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Intercept Browser Back Button
  useEffect(() => {
    // 1. Push a state into history so that clicking "Back" triggers a popstate event
    //    We do this immediately on mount.
    window.history.pushState(null, document.title, window.location.href);

    const handlePopState = (event) => {
      // 2. When the user clicks back, this event fires.
      //    We want to prevent leaving, so we push the state AGAIN to keep them here.
      window.history.pushState(null, document.title, window.location.href);

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

  const templates = [
    {
      id: 1,
      title: "Confess Feelings",
      description: "Express your heartfelt emotions",
      icon: <IntertwinedHeartsIcon />,
      gradientClass: "bg-gradient-to-br from-[#EC4899] to-[#A855F7]", // Pink -> Purple
      shadowColor: "#EC4899"
    },
    {
      id: 2,
      title: "Got a Code?",
      description: "Open a confession sent to you",
      icon: <HeartLockIcon />,
      gradientClass: "bg-gradient-to-br from-[#7C3AED] via-[#4F46E5] to-[#2563EB]", // Purple -> Indigo -> Blue
      shadowColor: "#7C3AED"
    },
    {
      id: 3,
      title: "Compliment",
      description: "Appreciate someone special",
      icon: <ComplimentBubbleIcon />, // UPDATED ICON
      gradientClass: "bg-gradient-to-br from-[#EC4899] via-[#F43F5E] to-[#EF4444]", // Pink -> Rose -> Red
      shadowColor: "#EF4444"
    },
    {
      id: 4,
      title: "Explore",
      description: "Discover what Izhaar can do",
      icon: <InfinityHeartIcon />,
      gradientClass: "bg-gradient-to-br from-[#2563EB] to-[#4F46E5]", // Blue -> Indigo
      shadowColor: "#2563EB"
    },
  ];

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template.id);
    try {
      setLoading(true);
      const response = await api.post("/user/template-selection", {
        templateId: template.id,
        templateTitle: template.title,
      });
      setTimeout(() => navigate("/user/dashboard", { replace: true }), 800);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save selection");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-6"
      style={{
        // Theme Background Gradient: Purple-900 -> Indigo-900 -> Blue-900
        background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
      }}>

      <FloatingHearts />

      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#581C87] blur-[120px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#1E3A8A] blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">

        {/* Back Button */}
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

        {/* Header Section */}
        <div className="text-center mb-12 space-y-3 animate-fade-in-down">
          <h1 className="text-3xl md:text-5xl font-[900] tracking-tight text-white drop-shadow-md">
            What inspired your visit?
          </h1>
          <p className="text-pink-200/80 text-sm md:text-base font-medium">
            Select an option to personalize your experience
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full perspective-1000 px-4">
          {templates.map((template, index) => {
            const isSelected = selectedTemplate === template.id;
            const isOtherSelected = selectedTemplate !== null && !isSelected;

            return (
              <div
                key={template.id}
                onClick={() => !loading && handleTemplateSelect(template)}
                className={`
                  group relative h-80 rounded-[2rem] p-6 cursor-pointer transition-all duration-500 ease-out preserve-3d
                  ${isSelected ? 'scale-105 z-20 ring-2 ring-white/50 box-shadow-glow' : 'hover:-translate-y-2 hover:shadow-2xl hover:bg-white/10'}
                  ${isOtherSelected ? 'opacity-40 scale-95 blur-sm' : 'opacity-100'}
                  bg-white/5 border border-white/10 backdrop-blur-md
                `}
                style={{
                  animation: `slideUp 0.6s ease-out ${index * 0.1}s backwards`
                }}
              >
                {/* Content Layout */}
                <div className="relative h-full flex flex-col items-center justify-center text-center gap-6 z-10">

                  {/* Animated Icon Container */}
                  <div className={`
                    w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-500 relative
                    ${template.gradientClass} group-hover:scale-110
                    ${isSelected ? 'scale-125' : ''}
                  `} style={{ boxShadow: `0 8px 30px -5px ${template.shadowColor}66` }}>
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {template.icon}
                  </div>

                  {/* Text */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white transition-colors group-hover:text-pink-200">
                      {template.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors leading-relaxed px-2">
                      {template.description}
                    </p>
                  </div>

                  {/* Action Indicator (Arrow) */}
                  <div className={`
                    absolute top-5 right-5 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 transition-all duration-300
                    group-hover:bg-white/20 group-hover:text-white group-hover:border-white/40 group-hover:rotate-12
                    ${isSelected ? `bg-white/20 border-none text-white scale-110` : ''}
                  `}>
                    <span className="text-sm">➜</span>
                  </div>
                </div>

                {/* Loading / Selection Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center animate-in fade-in duration-300">
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <span className="text-5xl animate-bounce">💖</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>



      {/* Exit Confirmation Modal */}
      {/* Exit Confirmation Modal */}
      {
        showExitConfirm && (
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
        )
      }

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .box-shadow-glow {
          box-shadow: 0 0 40px -10px rgba(236, 72, 153, 0.5);
        }
      `}</style>
    </div >
  );
}