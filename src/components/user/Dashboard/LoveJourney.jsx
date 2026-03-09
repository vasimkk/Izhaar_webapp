import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
const IzhaarLogo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/logo?_a=BAMAOGeA0";

const LoveJourney = ({ user }) => {
    const age = user?.age || 21; // Default to 21 if no user is found

    return (
        <section className="w-full mb-16 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                    <span className="text-2xl animate-pulse">💕</span>
                    <h2 className="text-white tracking-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '18px' }}>
                        Love Journey
                    </h2>
                </div>
                <button className="w-7 h-7 rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] flex items-center justify-center text-white shadow-[0_0_15px_rgba(236,72,145,0.4)]">
                    <FaPlus size={9} />
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
                        <img src={IzhaarLogo} alt="Joined" className="w-10 h-10 object-contain" />
                        <div>
                            <h3 className="text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px' }}>
                                Joined IZHAAR
                            </h3>
                            <p className="text-white/40 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '12px' }}>
                                Feb 14, 2026
                            </p>
                        </div>
                    </div>
                </div>

                {/* Milestone 2: Add Memory (Dashed Box) */}
                <div className="relative">
                    {/* Glowing Dot */}
                    <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-pink-500/40 shadow-[0_0_10px_rgba(236,72,145,0.4)] border-4 border-[#0F0F0F]" />

                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="w-full border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-white/[0.02]"
                    >
                        {/* Camera Icon in Glassmorphic Box */}
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 backdrop-blur-md">
                            <span className="text-3xl">📷</span>
                        </div>

                        <h3 className="text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '16px' }}>
                            Add Memory
                        </h3>
                        <p className="text-white/40 max-w-[240px] leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '12px' }}>
                            Seal a memory from a recent date, trip or event together.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LoveJourney;
