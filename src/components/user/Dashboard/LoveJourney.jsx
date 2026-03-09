import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaArrowRight } from 'react-icons/fa';
const IzhaarLogo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/logo?_a=BAMAOGeA0";

const LoveJourney = ({ user }) => {
    return (
        <section className="mx-4 mb-10 rounded-2xl border border-white/5 overflow-hidden pt-8 pb-10 px-6">
            {/* Header */}
            <div className="w-full flex items-center mb-6 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center text-3xl">✨</div>
                    <div>
                        <h3 className="text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px' }}>
                            Izhaar Journey
                        </h3>
                        <p className="text-white/40 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '12px' }}>
                            Milestones of your digital love story.
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-center z-40 w-full max-w-[320px] mx-auto flex flex-col items-center mb-10">
                <p className="text-white/50 mb-6 leading-relaxed px-4" style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                    fontSize: '12px'
                }}>
                    Relive every moment from your first step on Izhaar to your deepest confessions.
                </p>

                <button
                    className="flex items-center justify-center gap-2 text-[#FF4AB3] font-bold text-[12px] tracking-widest uppercase group transition-all"
                >
                    View Timeline
                    <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1.5" />
                </button>
            </div>

            {/* Timeline Container */}
            <div className="relative pl-8">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-pink-500/50 via-purple-500/20 to-transparent" />

                {/* Milestone 1: Joined */}
                <div className="relative mb-12">
                    {/* Glowing Dot */}
                    <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,145,0.8)] border-4 border-[#0F0F0F]" />

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <img src={IzhaarLogo} alt="Joined" className="w-6 h-6 object-contain" />
                        </div>
                        <div>
                            <h3 className="text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '14px' }}>
                                Joined IZHAAR
                            </h3>
                            <p className="text-white/40 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '11px' }}>
                                Feb 14, 2026
                            </p>
                        </div>
                    </div>
                </div>

                {/* Milestone 2: First Confession */}
                <div className="relative mb-12">
                    {/* Glowing Dot */}
                    <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] border-4 border-[#0F0F0F]" />

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                            💌
                        </div>
                        <div>
                            <h3 className="text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '14px' }}>
                                First Confession
                            </h3>
                            <p className="text-white/40 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '11px' }}>
                                Mar 02, 2026
                            </p>
                        </div>
                    </div>
                </div>

                {/* Milestone 3: Add Memory (Dashed Box) */}
                <div className="relative">
                    {/* Glowing Dot */}
                    <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-pink-500/40 shadow-[0_0_10px_rgba(236,72,145,0.4)] border-4 border-[#0F0F0F]" />

                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="w-full border-2 border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-white/[0.02]"
                    >
                        {/* Camera Icon in Glassmorphic Box */}
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 backdrop-blur-md">
                            <span className="text-2xl">📷</span>
                        </div>

                        <h3 className="text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '14px' }}>
                            Add Memory
                        </h3>
                        <p className="text-white/40 max-w-[200px] leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '11px' }}>
                            Seal a memory from a recent date or event together.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LoveJourney;
