import React from 'react';

const ValentineMarquee = () => {
    const messages = [
        "Valentine's Special Offer: Izhaar Letter only at ₹99! 💝",
        "Happy Valentine's Day ❤️",
        "Join the Valentine's Party with your Partner ✨",
        "Add your Secret Crush to know if she likes you, then confess with an Izhaar Letter 💌",
        "Valentine's Special Offer: Izhaar Letter only at ₹99! 💝",
        "Join the Valentine's Party with your Partner ✨"
    ];

    return (
        <div className="w-full bg-gradient-to-r from-pink-500/10 via-purple-600/10 to-pink-500/10 backdrop-blur-md py-4 border-y border-white/10 overflow-hidden my-4 relative group">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-transparent to-[#0a0a0c] z-10 pointer-events-none"></div>

            <div className="flex whitespace-nowrap animate-marquee">
                <div className="flex gap-16 items-center px-4">
                    {messages.map((text, idx) => (
                        <span
                            key={idx}
                            className="text-white font-['Playfair_Display'] text-sm md:text-lg font-semibold flex items-center gap-6 italic tracking-wide"
                        >
                            <span className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_15px_#ec4899] animate-pulse"></span>
                            {text}
                        </span>
                    ))}
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex gap-16 items-center px-4" aria-hidden="true">
                    {messages.map((text, idx) => (
                        <span
                            key={`dup-${idx}`}
                            className="text-white font-['Playfair_Display'] text-sm md:text-lg font-semibold flex items-center gap-6 italic tracking-wide"
                        >
                            <span className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_15px_#ec4899] animate-pulse"></span>
                            {text}
                        </span>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default ValentineMarquee;
