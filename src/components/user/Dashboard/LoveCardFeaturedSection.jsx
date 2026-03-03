import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import lovecardIcon from "../../../assets/services/lovecard_icon.png";

const LoveCardFeaturedSection = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full px-6 mb-32 relative py-24 overflow-hidden bg-[#050505] border-y border-white/[0.03]">
            {/* Architectural Grid Accents */}
            <div className="absolute inset-0 pointer-events-none -z-10 opacity-20">
                <div className="absolute left-1/2 top-0 w-px h-full bg-white/5" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/5" />
            </div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24">
                {/* DIRECT VECTOR - Massive & High Fidelity */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="relative order-2 md:order-1 flex-1 flex justify-center"
                >
                    <div className="relative w-64 h-64 md:w-[32rem] md:h-[32rem] group cursor-pointer" onClick={() => navigate('/user/love-card')}>
                        {/* Shadow Perspective */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 h-6 bg-black opacity-60 blur-2xl group-hover:bg-pink-500/20 transition-all duration-1000" />

                        <img
                            src={lovecardIcon}
                            alt="Love Card Designer"
                            className="w-full h-full object-contain filter drop-shadow-[0_45px_100px_rgba(0,0,0,0.9)] transform group-hover:scale-110 group-hover:-translate-y-8 transition-all duration-1000 ease-[0.16, 1, 0.3, 1]"
                            style={{ mixBlendMode: 'screen' }}
                        />

                        {/* Sharp Laser Accent */}
                        <div className="absolute top-0 right-0 w-[1px] h-full bg-pink-500 opacity-0 group-hover:opacity-60 group-hover:translate-x-[-100px] transition-all duration-1000" />
                    </div>
                </motion.div>

                {/* EDITORIAL CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="flex-1 text-center md:text-left order-1 md:order-2"
                >
                    <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
                        <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.8em]">New Signature</span>
                        <div className="h-[2px] w-12 bg-pink-500" />
                    </div>

                    <h3 className="dashboard-head-text text-4xl md:text-8xl leading-[0.85] tracking-tighter uppercase mb-8">
                        The Card <br />
                        <span className="italic">Designer</span>
                    </h3>

                    <p className="dashboard-subtext text-xs md:text-sm uppercase tracking-[0.3em] leading-relaxed mb-12 max-w-md">
                        Craft bespoke digital greetings with high-fidelity filigree and neural messaging.
                    </p>

                    <button
                        onClick={() => navigate('/user/love-card')}
                        className="dashboard-button"
                    >
                        Begin Crafting <span>→</span>
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default LoveCardFeaturedSection;
