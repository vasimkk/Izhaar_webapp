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



export default function LetterNotificationCard({ izhaarObj, senderName, rejected, handleAccept, handleReject }) {
  const templateId = izhaarObj.template_id || '1';
  const templateImage = templateImages[templateId] || templateImages['1'];
  const displaySender = senderName === 'Unknown' ? 'Izhaar User' : senderName;
  
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);

  const revealAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsFullyRevealed(true);
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

    // Scratch functionality
    const scratch = (x, y) => {
      const rect = canvas.getBoundingClientRect();
      const canvasX = x - rect.left;
      const canvasY = y - rect.top;
      
      // Clear circular area
      ctx.clearRect(canvasX - 30, canvasY - 30, 60, 60);
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
  }, [isScratching]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">

      <div className="">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4 text-white drop-shadow-lg">
          You've received a Letter Izhaar!
        </h2>
        
        {!isFullyRevealed && (
          <div className="text-center mb-4">
            <button
              onClick={revealAll}
              className="px-6 py-2 text-sm sm:text-base rounded-lg font-semibold text-white bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200 drop-shadow-lg"
            >
              Reveal All ✨
            </button>
          </div>
        )}

        {/* Scratch card letter */}
        <div className={`relative w-full mx-auto rounded-tl-2xl rounded-br-2xl shadow-2xl border-2 overflow-hidden mb-6 sm:mb-8 min-h-[500px] sm:min-h-[600px] `}>
          <img 
            src={templateImage} 
            alt="Letter template"
            className="absolute inset-0 w-full h-full object-cover brightness-110"
          />
          <div className="absolute inset-0 " />
          <div className="relative p-4 sm:p-6 md:p-8 h-full flex flex-col">
            <div className="text-right text-xs text-gray-700 mb-3 sm:mb-4">From: <span className="font-bold text-[#e75480]">{displaySender}</span></div>
            <div className="text-xs text-gray-500 mb-4 text-right">Code: {izhaarObj.izhaar_code || izhaarObj.code || 'N/A'}</div>
            <div className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 font-serif whitespace-pre-line flex-1">
              {izhaarObj.text || izhaarObj.message || 'No message.'}
            </div>
            <div className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg italic text-gray-700">With love,</div>
          </div>
          
          {/* Scratch overlay canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-pointer"
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Action buttons */}
        {rejected ? (
          <div className="text-center">
            <p className="text-red-300 font-bold text-lg drop-shadow-lg">Rejected successfully</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-4">
            <p className="text-sm sm:text-base text-gray-200 text-center drop-shadow-lg">Do you accept this heartfelt letter?</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <button
                className="px-8 sm:px-12 py-3 rounded-lg text-base sm:text-lg font-bold text-white transition-all duration-200 shadow-lg hover:opacity-90"
                style={{
                }}
                onClick={handleAccept}
              >
                Accept
              </button>
              <button
                className="px-8 sm:px-12 py-3 rounded-lg text-base sm:text-lg font-bold text-white transition-all duration-200 shadow-lg "
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
