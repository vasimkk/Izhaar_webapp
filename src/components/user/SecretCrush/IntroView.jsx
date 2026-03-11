import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaHeart, FaPlus, FaLightbulb, FaSearch } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const IntroView = ({ setView, navigate, crushes = [] }) => {
    const receivedCount = crushes.filter(c => c.is_received && !c.is_match).length;
    const hasHistory = crushes.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen relative z-10"
        >
            {/* Mobile Back Button with Header Container */}
            <div className="relative z-50 px-3 py-4 sm:py-6 sm:px-7 w-full max-w-xl mx-auto flex justify-between items-center">
                <button
                    onClick={() => navigate("/user/dashboard")}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-md"
                >
                    <FaChevronLeft size={16} />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-8">
                <div className="w-full max-w-sm flex flex-col items-center text-center">
                    <h1 className="w-full text-center text-[28px] font-bold text-white mb-6 leading-none mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Secret Crush💗
                    </h1>

                    {receivedCount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setView('list')}
                            className="mb-8 p-3 rounded-2xl bg-[#EC4891]/10 border border-[#EC4891]/30 flex items-center justify-center gap-3 cursor-pointer hover:bg-[#EC4891]/20 transition-all shadow-lg"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#EC4891] flex items-center justify-center text-white animate-bounce">
                                <FaHeart size={12} />
                            </div>
                            <div className="text-left">
                                <p className="text-[13px] font-bold text-white leading-none">New Crush Alert! 🤫</p>
                                <p className="text-[10px] text-pink-300 font-medium">Someone added you! Solve Clues.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Phones Illustration - Compacted */}
                    <div className="relative flex items-center justify-center gap-12 mb-4 h-48 w-full px-4 overflow-visible">
                        {/* Background Unique Particles - Enhanced for a premium look */}
                        {[...Array(24)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={`absolute rounded-full ${i % 3 === 0 ? 'bg-pink-400/40' : i % 3 === 1 ? 'bg-purple-400/40' : 'bg-white/40'}`}
                                animate={{
                                    y: [0, -60, 0],
                                    x: [0, i % 2 === 0 ? 30 : -30, 0],
                                    opacity: [0, 0.7, 0],
                                    scale: [0, Math.random() * 2 + 1, 0],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 4 + Math.random() * 6,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    filter: 'blur(1px)',
                                    width: i % 4 === 0 ? '3px' : '1px',
                                    height: i % 4 === 0 ? '3px' : '1px'
                                }}
                            />
                        ))}

                        {/* Left Phone (Sender) */}
                        <motion.div
                            initial={{ opacity: 0, x: -30, rotate: -10 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                rotate: 0,
                                y: [0, -8, 0],
                            }}
                            whileHover={{ scale: 1.05, rotate: -3 }}
                            transition={{
                                x: { duration: 0.8, delay: 0.2 },
                                opacity: { duration: 0.8, delay: 0.2 },
                                rotate: { duration: 0.8, delay: 0.2 },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="w-24 h-32 rounded-xl bg-[#0F081A] border border-white/10 flex flex-col items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group cursor-pointer"
                        >
                            {/* Moving Surface Shine */}
                            <motion.div
                                animate={{ left: ['-100%', '200%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] pointer-events-none"
                            />

                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-8 h-12 rounded-lg bg-[#EC4891]/10 border border-[#EC4891]/20 flex items-center justify-center mt-2 group-hover:bg-[#EC4891]/20 transition-all shadow-[0_0_15px_rgba(236,72,145,0.2)]"
                            >
                                <FaPlus className="text-[#EC4891] text-[10px]" />
                            </motion.div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 absolute top-3.5 left-1/2 -translate-x-1/2" />

                            {/* Internal Screen Glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#EC4891]/10 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                        </motion.div>

                        {/* Center Question Circle - CLEANED DESIGN */}
                        <div className="relative z-10 flex items-center justify-center">
                            <div className="absolute w-32 h-32 bg-[#EC4891]/5 blur-3xl rounded-full" />

                            <div className="w-16 h-16 rounded-full bg-[#1A0B2E] border border-white/10 flex items-center justify-center relative shadow-2xl z-20">



                                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#EC4891] to-[#A928ED] shadow-[0_0_30px_rgba(236,72,145,0.4)]">
                                    <span className="text-white text-xl font-black relative">?</span>
                                </div>
                            </div>

                            {/* Orbiting Icons */}
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-28 h-28 pointer-events-none"
                                >
                                    <div
                                        className="absolute -top-1 left-1/2 -translate-x-1/2"
                                        style={{ transform: `rotate(${i * 123}deg)` }}
                                    >
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.3, 0.9, 0.3],
                                                y: [0, -5, 0]
                                            }}
                                            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7 }}
                                        >
                                            {i === 0 ? <FaHeart className="text-[#EC4891] text-[9px]" /> :
                                                i === 1 ? <HiSparkles className="text-yellow-400 text-[11px]" /> :
                                                    <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60A5FA]" />}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right Phone (Receiver) */}
                        <motion.div
                            initial={{ opacity: 0, x: 30, rotate: 10 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                rotate: 0,
                                y: [0, 8, 0],
                            }}
                            whileHover={{ scale: 1.05, rotate: 3 }}
                            transition={{
                                x: { duration: 0.8, delay: 0.4 },
                                opacity: { duration: 0.8, delay: 0.4 },
                                rotate: { duration: 0.8, delay: 0.4 },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                            }}
                            className="w-24 h-32 rounded-xl bg-[#0F081A] border border-white/10 flex flex-col items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group cursor-pointer"
                        >
                            {/* Moving Surface Shine */}
                            <motion.div
                                animate={{ left: ['-100%', '200%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                                className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] pointer-events-none"
                            />

                            <motion.div
                                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-8 h-12 rounded-lg bg-[#A928ED]/10 border border-[#A928ED]/20 flex items-center justify-center mt-2 group-hover:bg-[#A928ED]/20 transition-all shadow-[0_0_15px_rgba(169,40,237,0.2)]"
                            >
                                <FaHeart className="text-[#A928ED] text-[10px] animate-pulse" />
                            </motion.div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 absolute top-3.5 left-1/2 -translate-x-1/2" />

                            {/* Internal Screen Glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#A928ED]/10 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-[18px] font-bold text-[#EC4891] mb-2 tracking-wide">Got a Crush?</h2>
                        <p className="text-white/60 text-[13px] leading-relaxed max-w-[280px] mx-auto font-medium">
                            Send a mysterious message and drop clues about yourself.
                            If they guess who you are… your secret will be revealed. ✨                        </p>
                    </div>

                    {/* Info Tiles Row */}
                    <div className="flex justify-center gap-8 mb-4">
                        {[
                            { icon: <FaPlus className="text-[14px]" />, label: "Add Your\nCrush", color: "#EC4891" },
                            { icon: <FaLightbulb className="text-[14px]" />, label: "Leave\nClues", color: "#A928ED" },
                            { icon: <FaSearch className="text-[14px]" />, label: "They\nGuess You", color: "#EC4891" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3">
                                <div className="w-13 h-13 rounded-2xl bg-[#1A0B2E] border border-white/5 flex items-center justify-center shadow-lg relative overflow-hidden" style={{ color: item.color }}>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        {item.icon}
                                    </div>
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-white/30 whitespace-pre-line leading-tight">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="w-full flex flex-col items-center mt-2">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[14px] text-[#FFD78A] mb-5 flex items-center justify-center gap-2 italic font-medium opacity-90 w-full"
                        >
                            ✨ Someone near you might already have a crush on you...
                        </motion.p>

                        <button
                            onClick={() => setView('form')}
                            className="w-full max-w-[240px] py-2.5 rounded-full bg-gradient-to-r from-[#FD2A93] to-[#9B2BFF] font-bold text-[14px] shadow-[0_0_15px_rgba(253,42,147,0.3)] hover:brightness-110 active:scale-95 transition-all text-white flex items-center justify-center gap-2"
                            style={{
                                boxShadow: '0 0 25px rgba(253, 42, 147, 0.3), inset 0 0 8px rgba(255, 255, 255, 0.2)',
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                            }}
                        >
                            Send Secret Crush <span className="text-[18px]">💌</span>
                        </button>

                        {hasHistory && (
                            <button
                                onClick={() => setView('list')}
                                className="mt-4 text-[11px] font-bold text-white/30 hover:text-white transition-all uppercase tracking-[0.2em] border-b border-transparent hover:border-white/10 pb-1"
                            >
                                View My History
                            </button>
                        )}
                    </div>
                    <p className="text-[12px] text-white/20 font-medium px-4 text-center mt-2">
                        Your identity stays hidden until they guess correctly 🤫
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default IntroView;
