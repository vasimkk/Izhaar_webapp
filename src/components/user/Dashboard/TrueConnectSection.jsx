import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { HiHeart } from 'react-icons/hi';
import { FaArrowRight } from 'react-icons/fa';

const TrueConnectSection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userPhoto = user?.profile_photo || user?.google_picture || 'https://via.placeholder.com/150';

    // State for the matching sequence
    const [step, setStep] = useState('searching'); // 'searching', 'matching', 'revealed'
    const [matchIndex, setMatchIndex] = useState(0);

    // Sample Discovery Profiles for the Grid
    const matches = useMemo(() => [
        { id: 1, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", score: "89%" },
        { id: 2, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", score: "92%" },
        { id: 3, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", score: "85%" },
        { id: 4, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", score: "78%" },
        { id: 5, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop", score: "94%" },
        { id: 6, img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop", score: "88%" },
    ], []);

    // Control the animation loop
    useEffect(() => {
        let timer;
        if (step === 'searching') {
            timer = setTimeout(() => setStep('revealed'), 6000);
        } else if (step === 'revealed') {
            timer = setTimeout(() => {
                setStep('searching');
                setMatchIndex((prev) => (prev + 1) % matches.length);
            }, 6000);
        }
        return () => clearTimeout(timer);
    }, [step, matches.length]);

    return (
        <section className="w-full mb-12 px-6 overflow-hidden flex flex-col items-center relative">
            {/* Header Section */}
            <div className="w-full flex flex-col items-start mb-6 z-20">
                <div className="flex items-center gap-2 mb-1">
                    <HiHeart className="text-purple-500 text-2xl filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                    <h2 className="text-white tracking-tight" style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: '18px'
                    }}>
                        True connect
                    </h2>
                </div>
                <p className="text-white/50" style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px'
                }}>
                    People who match your vibe
                </p>
            </div>

            {/* "Neural Grid Scan" Animation Visual (Non-circular) */}
            <div className="relative w-full h-[320px] flex items-center justify-center mb-6">

                {/* 1. Underlying Square Network Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: `linear-gradient(to right, rgba(168,85,247,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,85,247,0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />

                {/* 2. DISCOVERY PHASE: Square Grid Nodes */}
                <AnimatePresence>
                    {step === 'searching' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-4 p-8 pointer-events-none"
                        >
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{
                                        opacity: [0.1, 0.4, 0.1],
                                        scale: [0.9, 1, 0.9],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.4,
                                        ease: "easeInOut"
                                    }}
                                    className="relative flex items-center justify-center"
                                >
                                    {/* Glassmorphic Square Node */}
                                    <div className="w-16 h-16 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden flex items-center justify-center">
                                        <div className="w-full h-full opacity-30 grayscale blur-[1px]">
                                            <img
                                                src={matches[(i + matchIndex) % matches.length].img}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Corner Accents */}
                                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-purple-500/50 rounded-tl-sm" />
                                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-purple-500/50 rounded-br-sm" />
                                    </div>

                                    {/* Scanning Beam (Single Line passing through) */}
                                    <motion.div
                                        animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                                        className="absolute left-0 right-0 h-[1px] bg-purple-500/40 blur-[1px]"
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. REVEAL CEREMONY Area */}
                <div className="relative z-30 flex items-center justify-center">

                    {/* LEFT: USER PROFILE (Square Aesthetic) */}
                    <motion.div
                        animate={{
                            x: step === 'revealed' ? -80 : 0,
                            scale: step === 'revealed' ? 1.05 : 1
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="relative p-[1.5px] bg-gradient-to-tr from-purple-600 to-pink-500 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.3)] border border-white/10"
                    >
                        <div className="w-24 h-24 rounded-[1.4rem] overflow-hidden border-2 border-black/80 bg-[#0A0A0A]">
                            <img src={userPhoto} alt="You" className="w-full h-full object-cover" />
                        </div>
                    </motion.div>

                    {/* COMPATIBILITY SCORE (Center) */}
                    <AnimatePresence>
                        {step === 'revealed' && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="absolute z-20 flex flex-col items-center"
                            >
                                <div className="px-3 py-1 bg-[#121212] border border-white/10 rounded-full shadow-[0_0_20px_rgba(236,72,145,0.4)]">
                                    <span className="text-pink-500 text-[11px] font-black tracking-tight leading-none">
                                        {matches[matchIndex].score}
                                    </span>
                                </div>
                                <div className="h-8 w-[1.5px] bg-gradient-to-b from-pink-500/50 to-transparent my-1" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* RIGHT: MATCH PROFILE (Reveal) */}
                    <AnimatePresence mode="wait">
                        {step !== 'searching' && (
                            <motion.div
                                key={matchIndex}
                                initial={{ opacity: 0, scale: 0.5, x: 100, rotate: -10 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1.05,
                                    x: 80,
                                    rotate: 0
                                }}
                                exit={{ opacity: 0, scale: 0.5, x: 20 }}
                                transition={{ type: "spring", stiffness: 80, damping: 12 }}
                                className="absolute p-[1.5px] bg-gradient-to-tr from-[#3B82F6] via-purple-500 to-[#EC4891] rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.3)] border border-white/10"
                            >
                                <div className="w-24 h-24 rounded-[1.4rem] overflow-hidden border-2 border-black/80 bg-[#0A0A0A]">
                                    <img
                                        src={matches[matchIndex].img}
                                        alt="Match"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Content Area */}
            <div className="text-center z-40 w-full max-w-[320px]">
                <h3 className="text-white mb-2 leading-tight" style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: '18px'
                }}>
                    Find people who match your vibe.
                </h3>
                <p className="text-white/50 mb-8 leading-relaxed px-4" style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px'
                }}>
                    Answer a few questions to discover your matches and light up your orbit.
                </p>

                <button
                    onClick={() => navigate('/user/true-connection')}
                    className="flex items-center justify-center gap-2 mx-auto text-[#FF4AB3] font-black text-[13px] tracking-widest uppercase group transition-all"
                >
                    Take Quiz
                    <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1.5" />
                </button>
            </div>
        </section>
    );
};

export default TrueConnectSection;
