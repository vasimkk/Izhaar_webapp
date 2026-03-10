import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaHeart, FaPlus, FaLightbulb, FaSearch } from 'react-icons/fa';

const IntroView = ({ setView, navigate }) => (
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

        <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-10">
            <div className="w-full max-w-sm flex flex-col items-center text-center">
                <h1 className="text-[32px] font-bold text-white mb-6 text-center leading-none" style={{ fontFamily: "'Poppins', sans-serif", fontStyle: 'normal' }}>Secret Crush</h1>

                {/* Phones Illustration - Compacted */}
                <div className="relative flex items-center justify-center gap-8 mb-10 h-40">
                    <div className="w-20 h-40 rounded-2xl bg-gradient-to-b from-[#1F1135] to-[#0A0510] border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 absolute top-3.5 left-1/2 -translate-x-1/2" />
                        <div className="w-4 h-6 rounded-md border border-white/10 opacity-30 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-white" />
                        </div>
                    </div>

                    {/* Center Heart Reveal */}
                    <div className="relative z-10 flex items-center justify-center">
                        <div className="absolute w-24 h-24 bg-[#EC4891]/20 blur-3xl rounded-full" />
                        <div className="w-16 h-16 rounded-full bg-[#1A0B2E] border-2 border-white/10 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#EC4891]/20 to-[#A928ED]/20" />
                            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#EC4891] to-[#D946EF] shadow-[0_0_20px_rgba(236,72,145,0.4)]">
                                <FaHeart className="text-white/20 text-3xl absolute" />
                                <span className="text-white text-xl font-bold relative">?</span>
                            </div>
                        </div>
                        {/* Tiny Glow Dot */}
                        <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-yellow-400 blur-[2px]" />
                        <motion.div
                            animate={{ x: [-2, 2, -2], y: [-2, 2, -2] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute bottom-2 -left-3 text-[#EC4891] text-[10px]"
                        >
                            <FaHeart />
                        </motion.div>
                    </div>

                    <div className="w-20 h-40 rounded-2xl bg-gradient-to-b from-[#1F1135] to-[#0A0510] border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 absolute top-3.5 left-1/2 -translate-x-1/2" />
                        <div className="w-4 h-6 rounded-md border border-white/10 opacity-30 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-white" />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-[18px] font-bold text-[#EC4891] mb-2 tracking-wide">Got a Crush?</h2>
                    <p className="text-white/60 text-[13px] leading-relaxed max-w-[280px] mx-auto font-medium">
                        Send a mysterious message and leave clues about yourself. If they guess you, the secret is revealed. ✨
                    </p>
                </div>

                {/* Info Tiles Row */}
                <div className="flex justify-center gap-8 mb-8">
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

                <div className="w-full flex justify-center">
                    <button
                        onClick={() => setView('form')}
                        style={{ padding: '12px 34px' }}
                        className="flex justify-center items-center rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] font-bold text-[13px] shadow-[0_10px_20px_rgba(236,72,145,0.3)] hover:brightness-110 active:scale-95 transition-all mb-5 uppercase tracking-[0.1em] text-white"
                    >
                        Add Secret Crush
                    </button>
                </div>
                <p className="text-[12px] text-white/20 font-medium px-4 text-center">
                    Your identity stays hidden until they guess correctly 🤫
                </p>
            </div>
        </div>
    </motion.div>
);

export default IntroView;
