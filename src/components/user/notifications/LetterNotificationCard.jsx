import React, { useState, useEffect } from "react";
import bg1 from '../../../assets/temp/letter_01.jpeg';
import bg2 from '../../../assets/temp/letter_02.png';
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
    }, 1200);
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
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        
        .envelope-wrapper {
            perspective: 1000px;
            cursor: pointer;
            width: 100%;
            display: flex;
            justify-content: center;
        }
        .envelope {
            position: relative;
            width: 300px;
            height: 200px;
            background: #fdfbf7;
            box-shadow: 0 10px 30px -5px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
        }
        .envelope:hover {
            transform: translateY(-5px) rotate(1deg);
        }
        
        /* Flap Animation */
        .envelope-flap {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100px;
            background: #f2efe9;
            clip-path: polygon(0 0, 50% 100%, 100% 0);
            transform-origin: top;
            transition: transform 0.6s ease-in-out, z-index 0.6s step-end;
            z-index: 20;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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
            height: 120px;
            background: #fff;
            clip-path: polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%);
            z-index: 10;
            background: linear-gradient(180deg, #faf9f6 0%, #f0eeea 100%);
        }
        
        /* Wax Seal */
        .wax-seal {
            position: absolute;
            top: 90px; /* positioned on the flap tip */
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 25;
            transition: transform 0.4s ease, opacity 0.4s ease;
        }
        .envelope.open .wax-seal {
            transform: translate(-50%, -150%) scale(0.5);
            opacity: 0;
        }

        /* Floating Hearts */
        @keyframes float-heart {
          0% { transform: translateY(0) scale(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-200px) scale(0.5) rotate(360deg); opacity: 0; }
        }
        .animate-float-heart { animation: float-heart 3s ease-out forwards; }
      `}</style>

      {/* Floating Hearts Animation */}
      {showHearts && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-float-heart"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      )}

      {/* 1. CLOSED ENVELOPE STATE */}
      {!showFullLetter && (
        <div className="flex flex-col items-center justify-center animate-fadeIn w-full">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-8 text-pink-600 drop-shadow-sm font-['Playfair_Display']">
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

              <div className="absolute inset-0 bg-[#e6e2d8] z-0" />
              <div className="envelope-pocket"></div>
              <div className="envelope-flap">
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
              </div>
              <div className="wax-seal">
                <div className="w-12 h-12 rounded-full bg-red-700 shadow-md border-2 border-red-800 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border border-red-600/50 flex items-center justify-center bg-red-700">
                    <span className="text-xl">❤️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center animate-pulse">
            <p className="text-gray-700 font-medium text-lg">Tap envelope to open</p>
            <p className="text-xs text-gray-500 mt-2">From: {displaySender}</p>
          </div>
        </div>
      )}

      {/* 2. OPENED LETTER STATE */}
      {showFullLetter && (
        <div className="w-full sm:max-w-2xl animate-fadeIn">
          {/* Letter Content */}
          <div className="bg-white w-full rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl overflow-hidden border-0 sm:border-4 border-amber-200 mb-0 sm:mb-6">
            <div
              className="relative min-h-screen sm:min-h-[500px] p-8 sm:p-10 flex flex-col"
              style={{
                backgroundImage: `url(${templateImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/10" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="text-right text-sm text-gray-700 mb-4 opacity-70">
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

                <div className="mt-8 text-right opacity-80" style={{ fontFamily: fontFamily, color: textColor }}>
                  <p className="text-sm">With love,</p>
                  <p className="text-lg font-bold">{displaySender}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {rejected ? (
            <div className="text-center p-4 bg-white/50 backdrop-blur rounded-lg shadow-sm">
              <p className="text-red-500 font-bold text-lg">Rejected</p>
            </div>
          ) : hideActions ? (
            <div className="text-center p-4 bg-white/50 backdrop-blur rounded-lg shadow-sm">
              <p className="text-gray-600">This letter has been sent.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-gray-700 text-center text-sm font-medium">Do you accept this letter?</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg hover:scale-105 transition-transform"
                  onClick={handleAccept}
                >
                 Curious to Know
                </button>
                <button
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-md transition-all"
                  onClick={handleReject}
                >
                 "Not interested"
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}