import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import letterIcon from "../../../assets/images/vectors/letter_icon.png";
import songIcon from "../../../assets/images/vectors/song_icon.png";
import videoIcon from "../../../assets/images/vectors/vidieo_icon.png";
import safeDateIcon from "../../../assets/images/vectors/date_icon.png";

const RECEIVER_FORM_TEXT = '/user/song';
const Letter_IZHAAR = '/user/letter-izhaar';

const options = [
  {
    id: "online",
    title: "Online Izhaar",
    description: "Generate and send a digital IZHAAR with an IZHAAR code, ready to share instantly.",
    target: '/user/online-izhaar',
  },
  {
    id: "offline",
    title: "Offline Izhaar",
    description: "Pick a template, personalize it, and download or print it to hand over in person.",
    target: '/user/coming-soon',
  },
];


export default function TypeOfIzhaar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleSelect = (option) => {
    if (option.id === "online") {
      setShowMenu(true);
    } else {
      navigate(option.target);
    }
  };

  const menuItems = [
    { label: 'Letter Izhaar', icon: letterIcon, onClick: () => { setShowMenu(false); navigate(Letter_IZHAAR); }, comingSoon: false },
    { label: 'Song Izhaar', icon: songIcon, onClick: () => { setShowMenu(false); navigate(RECEIVER_FORM_TEXT); }, comingSoon: false },
    { label: 'Video Izhaar', icon: videoIcon, onClick: () => { }, comingSoon: true },
    // { label: 'Safe Date Izhaar', icon: safeDateIcon, onClick: () => {}, comingSoon: true },
  ];

  return (
    <div className="flex flex-col min-h-screen text-white relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .card-animate { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .modal-animate { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header Back Button */}
      <div className="relative z-50 pt-6 md:pt-10 px-4 md:px-8">
        <button
          onClick={() => navigate("/user/dashboard")}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 bg-white/10 border border-white/20 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-8 relative z-10">
        {/* Title Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-serif">
            Confession
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light">
            How do you want to express?
          </p>
        </div>

        {/* Cards Container */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
          {options.map((option, idx) => (
            <div
              key={option.id}
              className="card-animate rounded-3xl p-6 md:p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/20 group relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                animationDelay: `${idx * 0.2}s`
              }}
              onClick={() => handleSelect(option)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 relative z-10 group-hover:text-pink-300 transition-colors">
                {option.title}
              </h3>
              <p className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed relative z-10 group-hover:text-gray-300 transition-colors">
                {option.description}
              </p>
              <button
                className="w-full rounded-2xl px-5 py-3 font-bold text-sm md:text-base transition-all shadow-lg text-white hover:shadow-pink-500/40 relative z-10 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-105 active:scale-95"
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - Online IZHAAR Menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl modal-animate relative"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 10, 50, 0.95), rgba(70, 20, 70, 0.95))',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              boxShadow: '0 0 40px rgba(236, 72, 153, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative px-6 pt-8 pb-2 text-center">
              <button
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
                onClick={() => setShowMenu(false)}
              >✕</button>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-1">
                Online Izhaar
              </h2>
              <p className="text-gray-400 text-sm">Choose your confession type</p>
            </div>

            <div className="p-6 flex flex-col gap-3">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  disabled={item.comingSoon}
                  className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 border border-white/5 flex items-center gap-4 text-left ${item.comingSoon ? 'opacity-50 grayscale cursor-not-allowed bg-white/5' : 'hover:bg-white/10 hover:border-pink-500/30 hover:scale-[1.02] bg-white/5'
                    }`}
                  onClick={!item.comingSoon ? item.onClick : null}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 ${item.comingSoon ? 'bg-gray-700' : 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30'}`}>
                    <img src={item.icon} alt={item.label} className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                  </div>

                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-200 group-hover:text-pink-300 transition-colors">{item.label}</div>
                    {item.comingSoon && <span className="text-[10px] uppercase font-bold text-pink-500 tracking-wider">Coming Soon</span>}
                  </div>

                  {!item.comingSoon && (
                    <span className="text-2xl text-gray-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all">→</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


