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
    // { label: 'Safe Date Izhaar', icon: safeDateIcon, onClick: () => {}, comingSoon: true },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .card-animate {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .modal-animate {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        .menu-item-animate {
          animation: slideInRight 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      {/* Background handled by UserLayout video - removed static image */}

      {/* Header */}
      <div className="relative z-10 pt-6 md:pt-10 px-4 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[#2D1B4E] hover:text-[#E91E63] transition mb-8 text-sm md:text-base font-medium md:hidden"
        >
          <span className="text-xl">←</span>
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
            Confession
          </h1>
          <p className="text-lg md:text-xl text-[#6B5B8E] font-semibold">
            How do you want to express?
          </p>
        </div>

        {/* Cards Container - 2 Column Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mx-auto">
          {options.map((option, idx) => (
            <div
              key={option.id}
              className="card-animate rounded-2xl p-6 md:p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid rgba(233, 30, 99, 0.3)',
                boxShadow: '0 8px 32px rgba(233, 30, 99, 0.15)',
                animationDelay: `${idx * 0.2}s`
              }}
              onClick={() => handleSelect(option)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(option)}
            >
              <h3 className="text-lg md:text-2xl font-bold text-[#2D1B4E] mb-3">
                {option.title}
              </h3>
              <p className="text-xs md:text-sm text-[#6B5B8E] mb-6 leading-relaxed">
                {option.description}
              </p>
              <button 
                className="w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base transition-all shadow-xl text-white hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                  boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)'
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
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4"
          style={{ background: 'rgba(255, 255, 255, 0.3)' }}
          onClick={() => setShowMenu(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl modal-animate"
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              border: '2px solid rgba(233, 30, 99, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative px-6 md:px-8 py-8 md:py-10">
              <button
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#E91E63]/10 hover:bg-[#E91E63]/30 text-[#E91E63] text-2xl transition-all hover:rotate-90"
                onClick={() => setShowMenu(false)}
                aria-label="Close"
              >
                ✕
              </button>

              <div className="mb-8 text-center pr-8">
                <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-[#2D1B4E] mb-2">
                  Online Izhaar
                </h2>
                <p className="text-[#6B5B8E] text-xs sm:text-sm">Choose your confession type</p>
              </div>

              <div className="flex flex-col gap-3">
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    disabled={item.comingSoon}
                    className={`menu-item-animate group relative overflow-hidden rounded-2xl px-4 sm:px-5 md:px-6 py-3 sm:py-4 transition-all duration-300 ${
                      item.comingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-xl'
                    }`}
                    style={{
                      background: item.comingSoon ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                      border: '2px solid rgba(233, 30, 99, 0.3)',
                      animationDelay: `${idx * 0.1}s`
                    }}
                    onClick={!item.comingSoon ? item.onClick : null}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-pink-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300" />
                    
                    <div className="relative flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-[#E91E63]/10 group-hover:bg-[#E91E63]/20 transition-all">
                        <img src={item.icon} alt={item.label} className="w-6 h-6 sm:w-7 sm:h-7 object-contain group-hover:scale-125 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm sm:text-base md:text-base font-semibold text-[#2D1B4E]">{item.label}</div>
                      </div>
                      {item.comingSoon && (
                        <span className="text-xs font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] px-2 py-1 rounded-full text-white">
                          Soon
                        </span>
                      )}
                      {!item.comingSoon && (
                        <span className="text-lg sm:text-xl md:text-2xl text-[#6B5B8E] group-hover:text-[#E91E63] group-hover:translate-x-1 transition-all duration-300">→</span>
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


