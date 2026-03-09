import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
const bg1 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/temp/letter_01?_a=BAMAOGeA0";
const bg2 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/temp/letter_02?_a=BAMAOGeA0";
const bg3 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/temp/letter_03?_a=BAMAOGeA0";
const bg4 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/temp/letter_04?_a=BAMAOGeA0";
const bg5 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/temp/letter_05?_a=BAMAOGeA0";
const bg6 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/temp/letter_06?_a=BAMAOGeA0";
const bg7 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/temp/letter_07?_a=BAMAOGeA0";
const bg8 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/temp/letter_08?_a=BAMAOGeA0";
const bg9 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/temp/letter_09?_a=BAMAOGeA0";
const bg10 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/temp/letter_10?_a=BAMAOGeA0";


const templateImages = {
  '1': bg1,
  '2': bg2,
  '3': bg3,
  '4': bg4,
  '5': bg5,
  '6': bg6,
  '7': bg7,
  '8': bg8,
  '9': bg9,
  '10': bg10,
};

export default function LetterNotificationCard({ izhaarObj, senderName, rejected, handleAccept, handleReject, hideActions }) {
  const navigate = useNavigate();
  const templateId = izhaarObj.template_id || '2';
  const templateImage = templateImages[templateId] || templateImages['1'];
  const izhaarCode = izhaarObj.izhaar_code || izhaarObj.code || 'N/A';
  const displaySender = (senderName === 'Unknown' || senderName === 'Izhaar User') ? `${izhaarCode}` : senderName;

  // Get styling from backend data
  const fontFamily = izhaarObj.font_family || "'Playfair Display', serif";
  const fontSize = izhaarObj.font_size || 18;
  const textColor = izhaarObj.text_color || '#000000';
  const message = izhaarObj.text || izhaarObj.message || 'No message.';


  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [showFullLetter, setShowFullLetter] = useState(false);

  const [responsiveFontSize, setResponsiveFontSize] = useState(fontSize);

  // Handle responsive font sizing
  useEffect(() => {
    const updateFontSize = () => {
      // On mobile (width < 640px), reduce font size by 20% or minimum 14px
      if (window.innerWidth < 640) {
        setResponsiveFontSize(Math.max(14, fontSize * 0.8));
      } else {
        setResponsiveFontSize(fontSize);
      }
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    return () => window.removeEventListener('resize', updateFontSize);
  }, [fontSize]);

  const handleOpenEnvelope = () => {
    // Trigger CSS animation first by adding 'open' class
    const envelope = document.getElementById('interactive-envelope');
    if (envelope) envelope.classList.add('open');

    // Wait for animation then set state
    setTimeout(() => {
      setIsEnvelopeOpened(true);
      setShowFullLetter(true);
    }, 1500);
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center ${showFullLetter ? 'justify-start pt-24' : 'justify-center'} overflow-hidden p-0 sm:p-4 transition-all duration-500`}>
      {/* Add Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&family=Caveat:wght@400;700&family=Sacramento&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        
        .paper-texture {
            background-image: url("https://www.transparenttextures.com/patterns/natural-paper.webp");
            background-size: contain;
        }

        .envelope-wrapper {
            perspective: 2000px;
            cursor: pointer;
            width: 100%;
            display: flex;
            justify-content: center;
            padding: 20px;
        }

        .envelope {
            position: relative;
            width: 320px;
            height: 220px;
            background: #fff;
            box-shadow: 0 30px 60px rgba(0,0,0,0.4);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border-radius: 4px;
            transform-style: preserve-3d;
        }
        @media (max-width: 640px) {
            .envelope {
                width: 280px;
                height: 190px;
            }
        }

        .envelope:hover {
            transform: translateY(-10px) rotateX(5deg);
        }

        /* Flap Animation */
        .envelope-flap {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 110px;
            clip-path: polygon(0 0, 50% 100%, 100% 0);
            transform-origin: top;
            transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), z-index 0.8s step-end;
            z-index: 40;
            filter: brightness(1.1);
            backface-visibility: hidden;
        }
        @media (max-width: 640px) {
            .envelope-flap { height: 95px; }
        }

        .envelope.open .envelope-flap {
            transform: rotateX(180deg);
            z-index: 1;
        }

        /* Letter Sliding Animation */
        .letter-preview-card {
            position: absolute;
            bottom: 10px;
            left: 5%;
            width: 90%;
            height: 85%;
            background: white;
            border-radius: 4px;
            overflow: hidden;
            transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s, bottom 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
            z-index: 5;
            box-shadow: 0 -5px 15px rgba(0,0,0,0.1);
        }

        .envelope.open .letter-preview-card {
            transform: translateY(-120px) scale(1.05);
            z-index: 50;
        }

        /* Pocket Layers */
        .pocket-side-left {
            position: absolute;
            inset: 0;
            background: inherit;
            clip-path: polygon(0 0, 48% 50%, 0 100%);
            z-index: 20;
            filter: brightness(1.05);
        }

        .pocket-side-right {
            position: absolute;
            inset: 0;
            background: inherit;
            clip-path: polygon(100% 0, 52% 50%, 100% 100%);
            z-index: 20;
            filter: brightness(1.05);
        }

        .envelope-pocket-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 130px;
            background: inherit;
            clip-path: polygon(0 100%, 100% 100%, 50% 45%);
            z-index: 30;
            filter: brightness(0.95);
            border-top: 1px solid rgba(255,255,255,0.1);
        }

        /* Wax Seal */
        .wax-seal {
            position: absolute;
            top: 100px;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 45;
            transition: transform 0.5s ease-in-out, opacity 0.4s ease;
        }
        @media (max-width: 640px) {
            .wax-seal { top: 85px; }
        }

        .envelope.open .wax-seal {
            transform: translate(-50%, -180%) scale(0.5);
            opacity: 0;
        }

        .wax-seal-inner {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #8B0000;
            border: 3px solid #5C0000;
            box-shadow: 0 10px 20px rgba(0,0,0,0.4), inset 0 0 10px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .wax-seal-inner::before {
            content: '❤️';
            font-size: 18px;
            filter: drop-shadow(0 2px 2px rgba(0,0,0,0.4));
        }
      `}</style>

      {/* Back Button */}
      <button
        onClick={() => navigate("/user/dashboard")}
        className="fixed top-6 left-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all hover:bg-white/20 active:scale-90 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5 text-white/80 group-hover:text-white transition-colors"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* 1. CLOSED ENVELOPE STATE */}
      {!showFullLetter && (
        <div className="flex flex-col items-center justify-center animate-fadeIn w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-purple-300 drop-shadow-lg font-['Playfair_Display'] px-4 italic">
            You've received a Letter!
          </h2>

          <div className="envelope-wrapper py-10" onClick={handleOpenEnvelope}>
            <div id="interactive-envelope" className="envelope mx-auto" style={{ backgroundColor: '#ff9a9e' }}>
              <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none" />

              {/* The Card Inside */}
              <div className="letter-preview-card shadow-inner">
                <div
                  className="w-full h-full p-2 opacity-90"
                  style={{
                    backgroundImage: `url(${templateImage})`,
                    backgroundSize: 'cover',
                    fontFamily: fontFamily,
                    fontSize: '6px',
                    color: textColor,
                    overflow: 'hidden'
                  }}
                >
                  <div className="paper-texture absolute inset-0 opacity-10" />
                  {message}
                </div>
              </div>

              {/* Back Face Effect */}
              <div className="absolute inset-0 bg-black/10 z-0" />

              {/* Side Folds */}
              <div className="pocket-side-left" style={{ backgroundColor: '#ff9a9e' }}>
                <div className="absolute inset-0 paper-texture opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </div>
              <div className="pocket-side-right" style={{ backgroundColor: '#ff9a9e' }}>
                <div className="absolute inset-0 paper-texture opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />
              </div>

              {/* Bottom Fold */}
              <div className="envelope-pocket-bottom" style={{ backgroundColor: '#ff9a9e' }}>
                <div className="absolute inset-0 paper-texture opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* Top Flap */}
              <div className="envelope-flap" style={{ backgroundColor: '#ff9a9e' }}>
                <div className="absolute inset-0 paper-texture opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10" />
              </div>

              {/* Wax Seal */}
              <div className="wax-seal">
                <div className="wax-seal-inner">
                  <div className="absolute inset-0 bg-white/5 blur-[1px] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center animate-pulse px-4">
            <p className="text-gray-200 font-medium text-base sm:text-lg drop-shadow-md">Tap envelope to open</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">From: <span className="text-white font-bold">{displaySender}</span></p>
          </div>
        </div>
      )}

      {/* 2. OPENED LETTER STATE */}
      {showFullLetter && (
        <div className="w-full flex flex-col items-center gap-6 sm:gap-8 animate-fadeIn pb-20">
          {/* Action Buttons - TOP */}
          {rejected ? (
            <div className="text-center p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mx-4 max-w-sm w-full shadow-2xl animate-fadeIn">
              <p className="text-red-400 font-bold text-lg tracking-tight">Choice: Letter Rejected</p>
            </div>
          ) : hideActions ? (
            <div className="text-center p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mx-4 max-w-sm w-full shadow-2xl animate-fadeIn">
              <p className="text-white/40 text-sm font-medium tracking-widest uppercase">Archived Izhaar</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 sm:gap-6 px-4 w-full max-w-md animate-fadeIn">
              <div className="flex flex-col items-center gap-1">
                <p className="text-white font-black text-[8px] sm:text-[10px] uppercase tracking-[3px] sm:tracking-[4px] opacity-40">Decision Required</p>
                <h3 className="text-white text-lg sm:text-xl font-['Playfair_Display'] font-bold tracking-tight">Do you accept this letter?</h3>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 w-full">
                <button
                  className="flex-1 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-bold bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2 group text-xs sm:text-sm"
                  onClick={handleReject}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Reject</span>
                </button>

                <button
                  className="flex-[1.5] h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-[0_20px_40px_-10px_rgba(225,29,72,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(225,29,72,0.6)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 relative overflow-hidden group text-xs sm:text-sm"
                  onClick={handleAccept}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 uppercase tracking-widest">Curious to Know</span>
                </button>
              </div>
            </div>
          )}

          {/* Letter Content - BELOW */}
          <div className="w-[calc(100%-2rem)] max-w-[400px] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative mx-4 transition-all duration-500 border border-white/10 rounded-sm">
            <div
              className="relative min-h-[650px] px-8 sm:px-12 py-12 flex flex-col"
              style={{
                backgroundImage: `url(${templateImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/5" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="text-right text-xs text-gray-700 mb-4 opacity-70 italic">
                  {new Date().toLocaleDateString()}
                </div>

                <div
                  className="flex-1 leading-relaxed whitespace-pre-line"
                  style={{
                    fontFamily: fontFamily,
                    fontSize: `${responsiveFontSize}px`,
                    color: textColor,
                    textShadow: textColor === '#ffffff' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  {message}
                </div>


              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}