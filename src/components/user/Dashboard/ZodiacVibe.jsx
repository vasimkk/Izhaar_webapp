import React from 'react';
import { motion } from 'framer-motion';
import { TbZodiacAries, TbZodiacTaurus, TbZodiacGemini, TbZodiacCancer, TbZodiacLeo, TbZodiacVirgo, TbZodiacLibra, TbZodiacScorpio, TbZodiacSagittarius, TbZodiacCapricorn, TbZodiacAquarius, TbZodiacPisces } from 'react-icons/tb';
import { FaArrowRight } from 'react-icons/fa';

const signs = [
    { name: 'Aries', symbol: <TbZodiacAries size={24} />, vibe: '93%', emoji: '❤️‍🔥', color: '#ff4d4d', glow: 'rgba(255, 77, 77, 0.6)', isUser: true, yOff: 0 },
    { name: 'Taurus', symbol: <TbZodiacTaurus size={24} />, vibe: null, emoji: null, color: '#10b981', glow: 'rgba(16, 185, 129, 0.2)', isUser: false, yOff: 40 },
    { name: 'Gemini', symbol: <TbZodiacGemini size={24} />, vibe: '60%', emoji: '❤️‍🩹', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', isUser: false, yOff: -10 },
    { name: 'Cancer', symbol: <TbZodiacCancer size={24} />, vibe: null, emoji: null, color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.2)', isUser: false, yOff: 30 },
];

const ZodiacVibe = () => {
    return (
        <section className="px-6 mb-12 max-w-lg mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-1">
                <div className="flex items-center gap-2">
                    <span className="text-xl">💫</span>
                    <h2 className="text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '20px' }}>
                        Today's Love Vibe
                    </h2>
                </div>
                <button className="text-purple-400 text-sm font-bold flex items-center gap-1.5 hover:text-purple-300 transition-colors">
                    All Signs <FaArrowRight size={10} />
                </button>
            </div>

            {/* Vibe Card */}
            <div className="relative w-full h-56 flex items-center justify-between px-6 pt-12 pb-6 overflow-hidden ">

                {/* Dashed Wave Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none">
                    <path
                        d="M -20 100 Q 80 50 180 110 T 380 90 T 580 120"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="8 6"
                        className="animate-marquee-path"
                    />
                </svg>

                {signs.map((sign, i) => (
                    <div
                        key={sign.name}
                        className="flex flex-col items-center gap-3 relative z-10"
                        style={{ transform: `translateY(${sign.yOff}px)` }}
                    >
                        {/* User Badge */}
                        {sign.isUser && (
                            <div className="absolute top-[-35px] whitespace-nowrap px-3 py-1 bg-pink-500 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-lg">
                                Your Sign
                            </div>
                        )}

                        {/* Sign Circle */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500"
                            style={{
                                borderColor: sign.color,
                                color: sign.color,
                                boxShadow: `0 0 25px ${sign.glow}`,
                                background: `radial-gradient(circle at center, ${sign.color}10 0%, transparent 70%)`
                            }}
                        >
                            {sign.symbol}
                        </motion.div>

                        {/* Sign Label */}
                        <div className="text-center">
                            <span className="text-xs font-bold text-white/80 tracking-wide block mb-0.5">
                                {sign.name}
                            </span>
                            {sign.vibe && (
                                <span className="text-[10px] font-black tracking-tight" style={{ color: sign.color }}>
                                    {sign.emoji} {sign.vibe}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Subtle Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-600/10 blur-[60px] rounded-full" />
            </div>

            <style>{`
                @keyframes marquee-path {
                    0% { stroke-dashoffset: 28; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-marquee-path {
                    animation: marquee-path 2s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default ZodiacVibe;
