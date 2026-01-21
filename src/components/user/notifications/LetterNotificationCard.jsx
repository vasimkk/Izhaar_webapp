import React, { useRef, useEffect, useState } from "react";
import bg from "../../../assets/video/Stars_1.mp4";
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



export default function LetterNotificationCard({ izhaarObj, senderName, rejected, handleAccept, handleReject, hideActions }) {
  const templateId = izhaarObj.template_id || '1';
  const templateImage = templateImages[templateId] || templateImages['1'];
  const displaySender = senderName === 'Unknown' ? 'Izhaar User' : senderName;
  
  // Get styling from backend data
  const fontFamily = izhaarObj.font_family ;
  const fontSize = izhaarObj.font_size ;
  const textColor = izhaarObj.text_color;
  
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [responsiveFontSize, setResponsiveFontSize] = useState(fontSize);
  const scratchedPixelsRef = useRef(new Set());
  const izhaarCode = izhaarObj.izhaar_code || izhaarObj.code || 'N/A';

  // Check if already revealed (persisted in localStorage)
  useEffect(() => {
    const revealedKey = `letter_revealed_${izhaarCode}`;
    const alreadyRevealed = localStorage.getItem(revealedKey) === 'true';
    if (alreadyRevealed) {
      setIsFullyRevealed(true);
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      // Draw scratch overlay
      ctx.fillStyle = 'rgba(200, 200, 200, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text
      ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Scratch to reveal ✨', canvas.width / 2, canvas.height / 2);
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
  }, [isScratching, isFullyRevealed, izhaarCode]);

  return (
    <div className="relative min-h-screen w-full flex flex-col sm:items-center justify-center overflow-hidden sm:px-4 sm:py-6">
      
      {/* Add Google Fonts for custom fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&family=Caveat:wght@400;700&family=Sacramento&display=swap" rel="stylesheet" />

      {/* Floating Hearts Animation */}
      {showHearts && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl md:text-5xl animate-float-heart"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
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
          50% {
            transform: translateY(-100px) scale(1.2) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(0.5) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-heart {
          animation: float-heart 3s ease-out forwards;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="w-full sm:max-w-2xl">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center mb-3 sm:mb-4 text-white drop-shadow-lg px-4 sm:px-0">
          You've received a Letter Izhaar!
        </h2>
        
        {!isFullyRevealed && (
          <div className="text-center mb-3 sm:mb-4">
            <button
              onClick={revealAll}
              className="px-4 sm:px-6 py-2 text-xs sm:text-sm md:text-base rounded-lg font-semibold text-white bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200 drop-shadow-lg"
            >
              Reveal All ✨
            </button>
          </div>
        )}

        {/* Scratch card letter */}
        <div className={`relative w-full rounded-none sm:rounded-2xl md:rounded-3xl shadow-2xl border-0 sm:border-2 overflow-hidden mb-0 sm:mb-6 md:mb-8 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] ${
          isFullyRevealed ? 'animate-pulse-once' : ''
        }`}>
          <img 
            src={templateImage} 
            alt="Letter template"
            className="absolute inset-0 w-full h-full object-cover brightness-110"
          />
          <div className="absolute inset-0 " />
          <div className="relative p-3 sm:p-5 md:p-8 lg:p-10 h-full flex flex-col">
            <div className="text-right text-xs sm:text-sm text-gray-700 mb-2">
              From: <span className="font-bold text-[#e75480]">{displaySender}</span>
            </div>
            <div className="text-xs text-gray-500 mb-3 sm:mb-4 text-right">
              Code: {izhaarCode}
            </div>
            <div 
              className="leading-relaxed whitespace-pre-line flex-1 overflow-y-auto hide-scrollbar"
              style={{
                fontFamily: fontFamily || "'Playfair Display', serif",
                fontSize: `${responsiveFontSize}px`,
                color: textColor || '#000000',
                textShadow: (textColor === '#ffffff' || textColor === '#FFFFFF') ? '0 1px 3px rgba(0,0,0,0.5)' : 'none'
              }}
            >
              {izhaarObj.text || izhaarObj.message || 'No message.'}
            </div>
            <div 
              className="mt-3 sm:mt-4 md:mt-6 italic"
              style={{
                fontFamily: fontFamily || "'Playfair Display', serif",
                fontSize: `${Math.max(12, responsiveFontSize - 2)}px`,
                color: textColor || '#000000'
              }}
            >
              With love,
            </div>
          </div>
          
          {/* Scratch overlay canvas - only show if not revealed */}
          {!isFullyRevealed && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-pointer touch-none"
              style={{ touchAction: 'none' }}
            />
          )}
        </div>

        <style jsx>{`
          @keyframes pulse-once {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          .animate-pulse-once {
            animation: pulse-once 0.5s ease-out;
          }
        `}</style>

        {/* Action buttons */}
        {rejected ? (
          <div className="text-center">
            <p className="text-red-300 font-bold text-lg drop-shadow-lg">Rejected successfully</p>
          </div>
        ) : hideActions ? (
          <div className="text-center">
            <p className="text-xs sm:text-sm md:text-base text-gray-200 drop-shadow-lg">This is your sent Izhaar</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-4">
            <p className="text-xs sm:text-sm md:text-base text-gray-200 text-center drop-shadow-lg">Do you accept this heartfelt letter?</p>
            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:justify-center">
              <button
                className="px-6 sm:px-10 md:px-12 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-bold text-white transition-all duration-200 shadow-lg hover:opacity-90 bg-gradient-to-r from-pink-500 to-purple-600"
                onClick={handleAccept}
              >
                Accept
              </button>
              <button
                className="px-6 sm:px-10 md:px-12 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-bold text-white transition-all duration-200 shadow-lg bg-gray-500 hover:bg-gray-600"
                onClick={handleReject}
              >
                Not Interested
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
