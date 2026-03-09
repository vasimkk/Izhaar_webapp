import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { HiHeart, HiBell, HiSparkles, HiPlus, HiEnvelope, HiBolt, HiArrowUpRight } from 'react-icons/hi2';
import { FaArrowRight } from 'react-icons/fa';

const SecretCrushSection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userPhoto = user?.profile_photo || user?.google_picture || 'https://via.placeholder.com/150';

    // Choose crush photo based on user gender
    const isUserMale = user?.gender?.toLowerCase() === 'male';
    const crushPhoto = isUserMale
        ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" // Beautiful Female
        : "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"; // Beautiful Male

    // Sequence: 'idle', 'sending', 'notified', 'responding', 'matched'
    const [step, setStep] = useState('idle');

    useEffect(() => {
        const sequence = async () => {
            while (true) {
                setStep('idle');
                await new Promise(r => setTimeout(r, 4500));
                setStep('sending');
                await new Promise(r => setTimeout(r, 4000));
                setStep('notified');
                await new Promise(r => setTimeout(r, 3000));
                setStep('responding');
                await new Promise(r => setTimeout(r, 4000));
                setStep('matched');
                await new Promise(r => setTimeout(r, 8000));
            }
        };
        sequence();
    }, []);

    return (
        <section className="mx-4 mb-10 rounded-2xl border border-white/5 overflow-hidden pt-8 pb-4 px-6 md:px-8">
            <div className="w-full flex items-center mb-6 z-20">
                <div className="flex items-center gap-4">
                    <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-10 h-10 flex items-center justify-center"
                    >
                        <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">💘</span>
                    </motion.div>
                    <div>
                        <h3 className="text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px' }}>
                            Secret Crush
                        </h3>
                        <p className="text-white/40 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '12px' }}>
                            Anonymously reach out to your crush?
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-center z-40 w-full max-w-[320px] mx-auto flex flex-col items-center mb-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center mb-6"
                    >
                        <p className="text-white/50 mb-4 leading-relaxed px-4" style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 500,
                            fontSize: '12px'
                        }}>
                            {step === 'idle' && "Add your secret crush to start the anonymous matching signal."}
                            {step === 'sending' && "Your anonymous interest is traveling through the network."}
                            {step === 'notified' && "They just received an anonymous notification."}
                            {step === 'responding' && "Hold on... it looks like they are adding you back!"}
                            {step === 'matched' && "You've both matched! The secret is out and magic is alive."}
                        </p>

                        <button
                            onClick={() => navigate('/user/secret-crush')}
                            className="flex items-center justify-center gap-2 text-[#FF4AB3] font-bold text-[12px] tracking-widest uppercase group transition-all"
                        >
                            <span>{step === 'matched' ? "Unlock Match" : "Add Secret Crush"}</span>
                            <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1.5" />
                        </button>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Animation Arena - HORIZONTAL */}
            <div className="relative w-full h-[280px] flex items-center justify-center">

                {/* 1. HORIZONTAL GUIDING ENERGY (SVG) */}
                <div className="absolute inset-0 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="none">
                        {/* Static Connection Line Base */}
                        <path
                            d="M 120 140 L 280 140"
                            stroke="rgba(236,72,153,0.1)"
                            strokeWidth="1"
                            fill="transparent"
                        />

                        {/* Dynamic Pulsing Connection Line */}
                        <motion.path
                            d="M 120 140 L 280 140"
                            stroke={step === 'matched' ? "#A855F7" : "#EC4899"}
                            strokeWidth={step === 'matched' ? "2" : "1"}
                            fill="transparent"
                            strokeDasharray="4,6"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: (step === 'sending' || step === 'responding' || step === 'matched') ? 1 : 0,
                                opacity: (step === 'sending' || step === 'responding' || step === 'matched') ? 0.6 : 0,
                                strokeDashoffset: [-100, 0]
                            }}
                            transition={{
                                pathLength: { duration: 1.5, ease: "easeInOut" },
                                opacity: { duration: 0.5 },
                                strokeDashoffset: { duration: 10, repeat: Infinity, ease: "linear" }
                            }}
                        />

                        {/* Central Glow Point */}
                        <motion.circle
                            cx="200" cy="140"
                            r="4"
                            fill={step === 'matched' ? "#A855F7" : "#EC4899"}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: step !== 'idle' ? [1, 1.5, 1] : 0,
                                opacity: step !== 'idle' ? [0.4, 0.8, 0.4] : 0
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ filter: "blur(2px)" }}
                        />

                        <defs>
                            <linearGradient id="horizGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#EC4899" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* 2. YOU (LEFT Profile) */}
                <motion.div
                    animate={{
                        x: step === 'matched' ? 12 : -75,
                        scale: step === 'matched' ? 1.1 : 1,
                        filter: step === 'matched' ? 'drop-shadow(0px 0px 30px rgba(168,85,247,0.4))' : 'drop-shadow(0px 0px 0px rgba(0,0,0,0))'
                    }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    className="relative z-30 flex flex-col items-center gap-3"
                >
                    <div className="p-[1.5px] bg-gradient-to-tr from-purple-600 via-pink-500 to-purple-400 rounded-full shadow-2xl">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-[1px] border-black/80 relative bg-zinc-900">
                            <motion.img
                                src={userPhoto}
                                alt="Me"
                                animate={{
                                    filter: (step === 'idle' || step === 'sending' || step === 'matched') ? 'blur(0px) brightness(1)' : 'blur(10px) brightness(0.3)',
                                }}
                                className="w-full h-full object-cover"
                            />
                            {(step === 'notified' || step === 'responding') && (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <span className="text-white/40 text-4xl font-black italic">?</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <span className="text-white/30 text-[9px] font-black uppercase tracking-widest">You</span>
                </motion.div>

                {/* 3. CENTER: ACTION FEEDBACK (Replaced with Line Logic) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <AnimatePresence>
                        {step === 'matched' && (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="z-50 bg-pink-500 p-4 rounded-full shadow-[0_0_60px #EC4899] border-2 border-white/40"
                            >
                                <HiSparkles className="text-white text-4xl" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Horizontal Traveling Orbs */}
                    <AnimatePresence>
                        {(step === 'sending' || step === 'responding') && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute"
                            >
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ offsetDistance: step === 'sending' ? "0%" : "100%", opacity: 0 }}
                                        animate={{ offsetDistance: step === 'sending' ? "100%" : "0%", opacity: [0, 1, 0] }}
                                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }}
                                        style={{
                                            offsetPath: "path('M 120 140 L 280 140')",
                                            position: 'absolute',
                                            width: 8, height: 8, borderRadius: '50%',
                                            backgroundColor: step === 'sending' ? '#EC4899' : '#A855F7',
                                            boxShadow: step === 'sending' ? '0 0 15px #FF4AB3' : '0 0 15px #A855F7'
                                        }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 4. THE CRUSH (RIGHT Profile) */}
                <motion.div
                    animate={{
                        x: step === 'matched' ? -12 : 75,
                        scale: step === 'matched' ? 1.1 : 1,
                        filter: step === 'matched' ? 'drop-shadow(0px 0px 30px rgba(236,72,153,0.4))' : 'drop-shadow(0px 0px 0px rgba(0,0,0,0))'
                    }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    className="relative z-30 flex flex-col items-center gap-3"
                >
                    <div className="p-[1.5px] bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full shadow-2xl border border-white/10 group">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-[1px] border-black/80 bg-zinc-900 flex items-center justify-center relative">
                            <AnimatePresence mode="wait">
                                {step === 'idle' ? (
                                    <div className="flex flex-col items-center gap-1 opacity-20">
                                        <HiPlus className="text-white text-3xl animate-pulse" />
                                        <span className="text-[7px] font-black uppercase text-center">Add Crush</span>
                                    </div>
                                ) : (
                                    <motion.div key="crush" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                                        <motion.img
                                            src={crushPhoto}
                                            alt="Crush"
                                            animate={{
                                                filter: (step === 'responding' || step === 'matched') ? 'blur(0px) brightness(1.2)' : 'blur(10px) brightness(0.3)',
                                            }}
                                            className="w-full h-full object-cover"
                                        />
                                        {(step === 'sending' || step === 'notified') && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-white/40 text-4xl font-black italic">?</span>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Notification Wave Overlay */}
                            <AnimatePresence>
                                {step === 'notified' && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute inset-0 bg-pink-500/90 flex flex-col items-center justify-center z-50 p-2 border-2 border-white/20 rounded-full"
                                    >
                                        <motion.div
                                            animate={{ rotate: [-20, 20, -20], scale: [1, 1.2, 1] }}
                                            transition={{ duration: 0.4, repeat: 4 }}
                                        >
                                            <HiBell className="text-white text-4xl" />
                                        </motion.div>
                                        <span className="text-white font-black text-[9px] uppercase mt-1 tracking-widest text-center">Notified!</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <span className="text-white/30 text-[9px] font-black uppercase tracking-widest">Secret Crush</span>
                </motion.div>
            </div>

            {/* Narrative Area removed from here */}
        </section>
    );
};

export default SecretCrushSection;
