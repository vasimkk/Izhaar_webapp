import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgimg from "../../../assets/images/bg.png";
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
    target: '/user/offline-izhaar',
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
    { label: 'Video Izhaar', icon: videoIcon, onClick: () => {}, comingSoon: true },
    { label: 'Safe Date Izhaar', icon: safeDateIcon, onClick: () => {}, comingSoon: true },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background handled by UserLayout video - removed static image */}

      {/* Header */}
      <div className="relative z-10 pt-6 md:pt-10 px-4 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-white hover:text-pink-400 transition mb-8 text-sm md:text-base font-medium md:hidden"
        >
          <span className="text-xl">←</span>
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Confession
          </h1>
          <p className="text-lg md:text-xl text-orange-300 font-semibold">
            How do you want to express?
          </p>
        </div>

        {/* Cards Container - 2 Column Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mx-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className="rounded-2xl p-6 md:p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}
              onClick={() => handleSelect(option)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(option)}
            >
              <h3 className="text-lg md:text-2xl font-bold text-white mb-3">
                {option.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-300 mb-6 leading-relaxed">
                {option.description}
              </p>
              <button 
                className="w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base transition-all shadow-lg text-white hover:opacity-90"
                style={{
                  background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
                }}
              >
                Get started
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - Online IZHAAR Menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative px-6 md:px-8 py-8 md:py-10">
              <button
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-pink-500/30 text-white text-2xl transition-all hover:rotate-90"
                onClick={() => setShowMenu(false)}
                aria-label="Close"
              >
                ✕
              </button>

              <div className="mb-8 text-center pr-8">
                <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-white mb-2">
                  Online Izhaar
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">Choose your confession type</p>
              </div>

              <div className="flex flex-col gap-3">
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    disabled={item.comingSoon}
                    className={`group relative overflow-hidden rounded-2xl px-4 sm:px-5 md:px-6 py-3 sm:py-4 transition-all duration-300 ${
                      item.comingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-xl'
                    }`}
                    style={{
                      background: item.comingSoon ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                    onClick={!item.comingSoon ? item.onClick : null}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-orange-500/0 to-yellow-500/0 group-hover:from-pink-500/20 group-hover:via-orange-500/20 group-hover:to-yellow-500/20 transition-all duration-300" />
                    
                    <div className="relative flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/20 transition-all">
                        <img src={item.icon} alt={item.label} className="w-6 h-6 sm:w-7 sm:h-7 object-contain group-hover:scale-125 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm sm:text-base md:text-base font-semibold text-white">{item.label}</div>
                      </div>
                      {item.comingSoon && (
                        <span className="text-xs font-bold bg-gradient-to-r from-orange-400 to-pink-400 px-2 py-1 rounded-full text-white">
                          Soon
                        </span>
                      )}
                      {!item.comingSoon && (
                        <span className="text-lg sm:text-xl md:text-2xl text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">→</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


