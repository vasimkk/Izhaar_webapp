import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import bg1 from '../../../assets/temp/letter_01.png';
import bg2 from '../../../assets/temp/letter_02.jpeg';
import bg3 from '../../../assets/temp/letter_03.png';
import bg4 from '../../../assets/temp/letter_04.png';
import bg5 from '../../../assets/temp/letter_05.png';
import bg6 from '../../../assets/temp/letter_06.jpeg';
import bg7 from '../../../assets/temp/letter_07.png';

const templateImages = {
  '1': bg1,
  '2': bg2,
  '3': bg3,
  '4': bg4,
  '5': bg5,
  '6': bg6,
  '7': bg7,
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
  const [showHearts, setShowHearts] = useState(false);

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
      setTimeout(() => setShowHearts(true), 500);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden p-0 sm:p-4">
      {/* Add Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&family=Caveat:wght@400;700&family=Sacramento&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.2); filter: drop-shadow(0 0 5px gold); }
        }
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.4); }
            50% { box-shadow: 0 0 60px rgba(236, 72, 153, 0.7); }
        }
        
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        
        .envelope-wrapper {
            perspective: 1000px;
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
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
            box-shadow: 0 0 40px rgba(236, 72, 153, 0.5);
            transition: transform 0.3s ease;
            border-radius: 4px;
            animation: pulse-glow 3s infinite;
        }
        @media (max-width: 640px) {
            .envelope {
                width: 280px;
                height: 190px;
            }
        }
        .envelope:hover {
            transform: translateY(-5px) scale(1.02);
        }
        
        /* Flap Animation */
        .envelope-flap {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 110px;
            background: linear-gradient(to bottom, #ffdde1, #ee9ca7);
            clip-path: polygon(0 0, 50% 100%, 100% 0);
            transform-origin: top;
            transition: transform 0.6s ease-in-out, z-index 0.6s step-end;
            z-index: 20;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        /* Sparkle on Flap */
        .envelope-flap::after {
            content: '';
            position: absolute;
            top: 25px;
            left: 50%;
            transform: translateX(-50%);
            width: 14px;
            height: 14px;
            background: #fff;
            clip-path: polygon(50% 0%, 65% 40%, 100% 50%, 65% 60%, 50% 100%, 35% 60%, 0% 50%, 35% 40%);
            animation: sparkle 2s infinite ease-in-out;
            pointer-events: none;
            box-shadow: 0 0 10px rgba(255,255,255,0.8);
        }

        .envelope.open .envelope-flap {
            transform: rotateX(180deg);
            z-index: 1;
        }
        
        /* Letter Sliding Animation */
        .letter-preview-card {
            position: absolute;
            bottom: 0px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            height: 90%;
            background: white;
            border-radius: 4px;
            overflow: hidden;
            transition: transform 0.8s ease-in-out 0.4s, bottom 0.8s ease-in-out 0.4s;
            z-index: 5;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        }
        .letter-preview-card.show-full {
             width: 100%;
             height: auto;
        }
        
        .envelope.open .letter-preview-card {
            transform: translateX(-50%) translateY(-120px) scale(1.05);
            z-index: 30;
        }

        /* Pocket (Front of Envelope) */
        .envelope-pocket {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 130px;
            background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%);
            clip-path: polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%);
            z-index: 10;
            border-top: 1px solid rgba(255,255,255,0.4);
        }
        
        /* Pocket Sparkles */
        .envelope-pocket::before {
            content: '';
            position: absolute;
            bottom: 25px;
            left: 35px;
            width: 10px;
            height: 10px;
            background: #fff;
            clip-path: polygon(50% 0%, 65% 40%, 100% 50%, 65% 60%, 50% 100%, 35% 60%, 0% 50%, 35% 40%);
            animation: sparkle 3s infinite ease-in-out 1s;
        }
        .envelope-pocket::after {
            content: '';
            position: absolute;
            bottom: 45px;
            right: 35px;
            width: 12px;
            height: 12px;
            background: #fff;
            clip-path: polygon(50% 0%, 65% 40%, 100% 50%, 65% 60%, 50% 100%, 35% 60%, 0% 50%, 35% 40%);
            animation: sparkle 2.5s infinite ease-in-out 0.5s;
        }

        /* Wax Seal */
        .wax-seal {
            position: absolute;
            top: 100px;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 25;
            transition: transform 0.4s ease, opacity 0.4s ease;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
        }
        .envelope.open .wax-seal {
            transform: translate(-50%, -150%) scale(0.5);
            opacity: 0;
        }
      `}</style>

      {/* Back Button */}
      <button
        onClick={() => navigate("/user/dashboard")}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(212, 197, 232, 0.3)',
          boxShadow: '0 4px 12px rgba(45, 27, 78, 0.15)'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5 text-[#2D1B4E]"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* 1. CLOSED ENVELOPE STATE */}
      {!showFullLetter && (
        <div className="flex flex-col items-center justify-center animate-fadeIn w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-6 sm:mb-8 text-white drop-shadow-[0_0_10px_rgba(233,30,99,0.8)] font-['Playfair_Display'] px-4">
            You've received a Letter!
          </h2>

          <div className="envelope-wrapper py-10" onClick={handleOpenEnvelope}>
            <div id="interactive-envelope" className="envelope mx-auto">
              {/* Tiny Letter Preview */}
              <div className="letter-preview-card">
                <div
                  className="w-full h-full p-2 opacity-80"
                  style={{
                    backgroundImage: `url(${templateImage})`,
                    backgroundSize: 'cover',
                    fontFamily: fontFamily,
                    fontSize: '6px',
                    color: textColor,
                    overflow: 'hidden'
                  }}
                >
                  {message}
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-b from-pink-200 to-pink-50 z-0" />
              <div className="envelope-pocket"></div>
              <div className="envelope-flap">
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
              </div>
              <div className="wax-seal">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-700 shadow-md border-2 border-red-800 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-red-600/50 flex items-center justify-center bg-red-700">
                    <span className="text-lg sm:text-xl">❤️</span>
                  </div>
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
        <div className="w-full flex flex-col items-center gap-4 sm:gap-6 animate-fadeIn pb-10">
          {/* Action Buttons - TOP */}
          {rejected ? (
            <div className="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 mx-4 max-w-sm w-full">
              <p className="text-red-400 font-bold text-base sm:text-lg drop-shadow-md">Rejected</p>
            </div>
          ) : hideActions ? (
            <div className="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 mx-4 max-w-sm w-full">
              <p className="text-gray-300 text-sm sm:text-base">This letter has been sent.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 px-4 w-full max-w-md">
              <p className="text-white/90 text-center text-sm font-medium tracking-wide drop-shadow-md uppercase opacity-80">Do you accept this letter?</p>
              <div className="flex flex-row justify-center gap-4">
                <button
                  className="flex-1 px-6 py-3 rounded-full font-bold text-white text-sm bg-white/10 hover:bg-red-500/20 border border-white/20 backdrop-blur-md shadow-lg transition-all active:scale-95 group"
                  onClick={handleReject}
                >
                  <span className="group-hover:text-red-300 transition-colors">Reject</span>
                </button>
                <button
                  className="flex-[1.5] px-6 py-3 rounded-full font-bold text-white text-sm bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:via-pink-500 hover:to-purple-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] border border-white/20 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  onClick={handleAccept}
                >
                  <span>Accept Letter</span>
                  <span className="animate-pulse">❤️</span>
                </button>
              </div>
            </div>
          )}

          {/* Letter Content - BELOW */}
          <div className="w-full max-w-[380px] bg-white shadow-2xl overflow-hidden relative mx-auto transition-transform duration-500">
            <div
              className="relative min-h-[600px] p-6 sm:p-8 flex flex-col"
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