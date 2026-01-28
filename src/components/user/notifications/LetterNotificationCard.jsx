import React, { useRef, useEffect, useState } from "react";
import bg1 from '../../../assets/temp/letter_01.jpeg';
import bg2 from '../../../assets/temp/letter_02.jpeg';
import bg3 from '../../../assets/temp/letter_03.jpeg';
import bg4 from '../../../assets/temp/letter_04.jpeg';

const templateImages = {
  '1': bg1,
  '2': bg2,
  '3': bg3,
  '4': bg4,
};

const ENVELOPE_TEMPLATES = [
  { id: "1", title: "Love Pink", color: "#ffb6b9", secondary: "#ff8b94" },
  { id: "2", title: "Royal Red", color: "#e75480", secondary: "#c1355e" },
  { id: "3", title: "Sky Blue", color: "#a3d8f4", secondary: "#7fb3d5" },
  { id: "4", title: "Classic Gold", color: "#deb887", secondary: "#bc9b6a" },
  { id: "5", title: "Midnight", color: "#2c3e50", secondary: "#1a252f" },
];

export default function LetterNotificationCard({ izhaarObj, senderName, rejected, handleAccept, handleReject, hideActions }) {
  const templateId = izhaarObj.template_id || '1';
  const envelopeId = izhaarObj.envelope_id || '1';
  const templateImage = templateImages[templateId] || templateImages['1'];
  const envelope = ENVELOPE_TEMPLATES.find(e => e.id === envelopeId) || ENVELOPE_TEMPLATES[0];
  const displaySender = senderName === 'Unknown' ? 'Izhaar User' : senderName;

  // Get styling from backend data
  const fontFamily = izhaarObj.font_family;
  const fontSize = izhaarObj.font_size;
  const textColor = izhaarObj.text_color;

  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [boxOpened, setBoxOpened] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [responsiveFontSize, setResponsiveFontSize] = useState(fontSize);
  const scratchedPixelsRef = useRef(new Set());
  const izhaarCode = izhaarObj.izhaar_code || izhaarObj.code || 'N/A';

  // Check if already revealed (persisted in localStorage)
  useEffect(() => {
    const revealedKey = `letter_revealed_${izhaarCode}`;
    const alreadyRevealed = localStorage.getItem(revealedKey) === 'true';
    if (alreadyRevealed) {
      setIsFullyRevealed(true);
      setEnvelopeOpened(true);
      setBoxOpened(true);
    }
  }, [izhaarCode]);

  // Handle responsive font sizing
  useEffect(() => {
    const updateFontSize = () => {
      if (window.innerWidth < 640) {
        setResponsiveFontSize(Math.max(14, fontSize - 2));
      } else {
        setResponsiveFontSize(fontSize);
      }
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    return () => window.removeEventListener('resize', updateFontSize);
  }, [fontSize]);

  const revealAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsFullyRevealed(true);
    // Save to localStorage so it stays revealed
    localStorage.setItem(`letter_revealed_${izhaarCode}`, 'true');
    // Show heart animation after reveal
    setTimeout(() => setShowHearts(true), 300);
  };

  useEffect(() => {
    if (!envelopeOpened) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      // Draw scratch overlay
      ctx.fillStyle = 'rgba(230, 230, 230, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add text
      ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Scratch to read ✨', canvas.width / 2, canvas.height / 2);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Scratch functionality with progress tracking
    const scratch = (x, y) => {
      if (isFullyRevealed) return;

      const rect = canvas.getBoundingClientRect();
      const canvasX = x - rect.left;
      const canvasY = y - rect.top;

      // Clear circular area (larger for better mobile experience)
      const radius = 40;
      ctx.clearRect(canvasX - radius, canvasY - radius, radius * 2, radius * 2);

      // Track scratched pixels for progress
      for (let i = -radius; i < radius; i += 5) {
        for (let j = -radius; j < radius; j += 5) {
          const pixelKey = `${Math.floor(canvasX + i)},${Math.floor(canvasY + j)}`;
          scratchedPixelsRef.current.add(pixelKey);
        }
      }

      // Check if enough is scratched (40% threshold like Google Pay)
      const totalPixels = (canvas.width * canvas.height) / 25; // Sample every 5px
      const scratchedCount = scratchedPixelsRef.current.size;
      const scratchPercentage = (scratchedCount / totalPixels) * 100;

      // Auto-reveal when 40% scratched (Google Pay style)
      if (scratchPercentage > 40 && !isFullyRevealed) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsFullyRevealed(true);
        // Save to localStorage
        localStorage.setItem(`letter_revealed_${izhaarCode}`, 'true');
        setShowHearts(true);
      }
    };

    const handleMouseDown = () => setIsScratching(true);
    const handleMouseUp = () => setIsScratching(false);
    const handleMouseMove = (e) => {
      if (!isScratching) return;
      scratch(e.clientX, e.clientY);
    };

    const handleTouchStart = () => setIsScratching(true);
    const handleTouchEnd = () => setIsScratching(false);
    const handleTouchMove = (e) => {
      if (!isScratching) return;
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchmove', handleTouchMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [envelopeOpened, isScratching, isFullyRevealed, izhaarCode]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-10 px-4">

      {/* Add Google Fonts for custom fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&family=Caveat:wght@400;700&family=Sacramento&display=swap" rel="stylesheet" />

      {/* Floating Hearts Animation */}
      {showHearts && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-5xl animate-float-heart"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                color: ['#FF1493', '#FF69B4', '#DA70D6'][Math.floor(Math.random() * 3)]
              }}
            >
              {['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes float-heart {
          0% {
            transform: translateY(0) scale(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) scale(1) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-heart {
          animation: float-heart 4s ease-out forwards;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="w-full max-w-lg relative">
        {!boxOpened ? (
          /* STAGE 1: CLOSED BOX */
          <div className="flex flex-col items-center space-y-12 animate-in fade-in zoom-in duration-700">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-black text-white drop-shadow-xl uppercase tracking-tighter">A Special Gift! 🎁</h2>
              <p className="text-pink-100 text-lg font-medium opacity-90 italic text-center">Tap to see what's hidden inside...</p>
            </div>

            {/* 3D Box UI */}
            <div className="relative w-72 h-72 group cursor-pointer" onClick={() => setBoxOpened(true)}>
              {/* Box Body */}
              <div className="absolute inset-0 bg-pink-600 rounded-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] border-b-8 border-pink-900">
                {/* Gold Ribbon Vertical */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-600 shadow-inner" />
                {/* Gold Ribbon Horizontal */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 bg-gradient-to-b from-yellow-500 via-yellow-200 to-yellow-600 shadow-inner" />
              </div>

              {/* Box Lid */}
              <div className="absolute -inset-2 bg-pink-500 rounded-3xl shadow-2xl z-10 flex items-center justify-center border-b-[10px] border-pink-700 transition-all duration-500 group-hover:-translate-y-4 group-hover:rotate-1">
                {/* Ribbon Bow */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-40 animate-pulse" />
                  <div className="text-8xl drop-shadow-2xl animate-bounce-slow">🎀</div>
                </div>
                {/* Gold Ribbon Pattern on Lid */}
                <div className="absolute top-1/2 left-0 right-0 h-16 bg-yellow-400/20 -translate-y-1/2" />
                <div className="absolute left-1/2 top-0 bottom-0 w-16 bg-yellow-400/20 -translate-x-1/2" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 w-full">
              <button
                onClick={() => setBoxOpened(true)}
                className="px-12 py-5 bg-white text-pink-600 rounded-[2rem] font-black text-2xl shadow-[0_20px_40px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all animate-pulse"
              >
                OPEN BOX ✨
              </button>
              <button onClick={() => window.history.back()} className="text-white/40 font-bold hover:text-white transition-colors text-sm uppercase tracking-widest">Maybe Later</button>
            </div>
          </div>
        ) : !envelopeOpened ? (
          /* STAGE 2: CLOSED ENVELOPE (Revealed from Box) */
          <div className="flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-20 duration-1000">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white drop-shadow-lg uppercase tracking-tight">Choice Found! ✨</h2>
              <p className="text-pink-100 font-medium opacity-80 italic">A letter was hidden inside the gift...</p>
            </div>

            {/* Envelope UI */}
            <div className="relative w-80 h-56 bg-white rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] perspective-1000 transform transition-transform hover:scale-105 duration-500">
              {/* Envelope Body */}
              <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ backgroundColor: envelope.color }}>
                <div className="absolute inset-0 opacity-20 bg-black/10" style={{ clipPath: 'polygon(0 0, 50% 45%, 100% 0, 100% 100%, 0 100%)' }} />
                {/* Flap */}
                <div className="absolute top-0 inset-x-0 h-28 z-20 origin-top transition-transform duration-700 ease-in-out shadow-lg"
                  style={{ backgroundColor: envelope.secondary, clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }} />
              </div>

              {/* Heart Seal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 drop-shadow-xl animate-bounce">
                <div className="text-6xl">💌</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-full px-6">
              <button
                onClick={() => setEnvelopeOpened(true)}
                className="w-full py-5 rounded-2xl bg-white text-[#E91E63] font-black text-2xl shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:shadow-white/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span>READ LETTER</span>
                <span className="text-3xl">✨</span>
              </button>
            </div>
          </div>
        ) : (
          /* STAGE 3: THE HEARTFELT LETTER */
          <div className="animate-in slide-in-from-bottom-20 duration-1000 fill-mode-forwards">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-white drop-shadow-md px-4">
              {isFullyRevealed ? "A Heartfelt Letter from Someone Special ❤️" : "Scratch to reveal the deep emotions ✨"}
            </h2>

            <div className={`relative w-full rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden bg-white min-h-[500px] md:min-h-[600px] border-8 border-white/20`}>
              <img src={templateImage} alt="template" className="absolute inset-0 w-full h-full object-cover brightness-105" />
              <div className="relative p-8 md:p-12 h-full flex flex-col">
                <div className="text-right text-xs text-gray-400 mb-8 font-black uppercase tracking-[0.3em] opacity-50">
                  Private Correspondence
                </div>
                <div
                  className="leading-relaxed whitespace-pre-line flex-1 overflow-y-auto hide-scrollbar"
                  style={{
                    fontFamily: fontFamily || "'Playfair Display', serif",
                    fontSize: `${responsiveFontSize}px`,
                    color: textColor || '#000000',
                    textShadow: (textColor === '#ffffff' || textColor === '#FFFFFF') ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  {izhaarObj.text || izhaarObj.message || 'No message.'}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100/10 italic opacity-80" style={{ fontFamily: fontFamily || "'Playfair Display', serif" }}>
                  — {displaySender}
                </div>
              </div>

              {!isFullyRevealed && (
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10" />
              )}
            </div>

            {isFullyRevealed && !hideActions && (
              <div className="mt-10 space-y-4 animate-in fade-in duration-1000">
                {rejected ? (
                  <p className="text-center text-red-300 font-bold text-xl drop-shadow-md">Not interested. Letter closed.</p>
                ) : (
                  <div className="flex flex-col gap-6">
                    <p className="text-white/80 text-center font-medium italic text-lg">Will you honor this heartfelt gesture?</p>
                    <div className="flex flex-col gap-4">
                      <button className="w-full py-5 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-black text-2xl shadow-[0_20px_50px_rgba(233,30,99,0.3)] hover:scale-[1.02] active:scale-95 transition-all" onClick={handleAccept}>
                        YES, I ACCEPT ❤️
                      </button>
                      <button className="w-full py-4 text-white/30 font-bold hover:text-white transition-colors uppercase tracking-[0.2em] text-xs" onClick={handleReject}>
                        Maybe another time
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {hideActions && isFullyRevealed && (
              <p className="text-center mt-10 text-white/20 font-black uppercase tracking-[0.5em] text-[10px]">E-Delivery Guaranteed by Izhaar</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
