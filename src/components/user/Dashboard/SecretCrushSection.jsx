import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { HiHeart, HiBell, HiSparkles, HiPlus, HiEnvelope, HiBolt, HiArrowUpRight } from 'react-icons/hi2';

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
        <section className="w-full mb-12 overflow-hidden px-6">
            {/* Header */}
            <div className="flex flex-col mb-6 items-start relative z-10 w-full text-left">
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

            {/* Animation Arena - DIAGONAL (Top-Left to Bottom-Right) */}
            <div className="relative w-full h-[360px] flex items-center justify-center">

                {/* 1. DIAGONAL GUIDING ENERGY (SVG) */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <svg width="100%" height="100%" viewBox="0 0 400 360" preserveAspectRatio="none">
                        <motion.path
                            d="M 135 115 Q 200 180 265 245"
                            stroke="url(#diagonalGradient)"
                            strokeWidth="1.5"
                            fill="transparent"
                            strokeDasharray="6,8"
                            animate={{ strokeDashoffset: [-100, 0] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />
                        <defs>
                            <linearGradient id="diagonalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#EC4899" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* 2. YOU (TOP LEFT Profile) */}
                <motion.div
                    animate={{
                        x: step === 'matched' ? 0 : -65,
                        y: step === 'matched' ? 0 : -65,
                        scale: step === 'matched' ? 1.2 : 1,
                        filter: step === 'matched' ? 'drop-shadow(0px 0px 30px rgba(168,85,247,0.6))' : 'drop-shadow(0px 0px 0px rgba(0,0,0,0))'
                    }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    className="relative z-30"
                >
                    <div className="p-1 bg-gradient-to-tr from-purple-600 via-pink-500 to-purple-400 rounded-full shadow-2xl">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black/80 relative bg-zinc-900">
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
                    <span className="absolute -top-8 left-0 text-white/30 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">You</span>
                </motion.div>

                {/* 3. CENTER: ACTION FEEDBACK (Diagonal Intersection) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <AnimatePresence>
                        {(step === 'sending' || step === 'responding') && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.2, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="z-40 bg-black/80 backdrop-blur-3xl border border-pink-500/20 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    {step === 'sending' ? (
                                        <HiEnvelope className="text-pink-500 text-2xl" />
                                    ) : (
                                        <HiBolt className="text-yellow-400 text-2xl" />
                                    )}
                                </motion.div>
                            </motion.div>
                        )}

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

                    {/* Diagonal Traveling Orbs */}
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
                                            offsetPath: "path('M 135 115 Q 200 180 265 245')",
                                            position: 'absolute',
                                            width: 8, height: 8, borderRadius: '50%',
                                            backgroundColor: '#EC4899',
                                            boxShadow: '0 0 15px #FF4AB3'
                                        }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 4. THE CRUSH (BOTTOM RIGHT Profile) */}
                <motion.div
                    animate={{
                        x: step === 'matched' ? 0 : 65,
                        y: step === 'matched' ? 0 : 65,
                        scale: step === 'matched' ? 1.2 : 1,
                        filter: step === 'matched' ? 'drop-shadow(0px 0px 30px rgba(236,72,153,0.6))' : 'drop-shadow(0px 0px 0px rgba(0,0,0,0))'
                    }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    className="relative z-30"
                >
                    <div className="p-1 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full shadow-2xl border border-white/10 group">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black/80 bg-zinc-900 flex items-center justify-center relative">
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
                    <span className="absolute -bottom-8 right-0 text-white/30 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Secret Crush</span>
                </motion.div>
            </div>

            {/* Narrative Area */}
            <div className="w-full flex flex-col items-center text-center -mt-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-[90px] flex flex-col items-center justify-center"
                    >
                        <h3 className="text-white mb-2 tracking-tight" style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600,
                            fontSize: '18px'
                        }}>
                            {step === 'idle' && "Find your special someone ✨"}
                            {step === 'sending' && "Launching Signal... 🚀"}
                            {step === 'notified' && "Crush is Checking... 🔔"}
                            {step === 'responding' && "Attraction Detected! ⚡"}
                            {step === 'matched' && "A Match is Born! 💖"}
                        </h3>
                        <p className="text-white/60 max-w-[320px] leading-tight" style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px'
                        }}>
                            {step === 'idle' && "Add your secret crush to start the diagonal anonymous match."}
                            {step === 'sending' && "Your anonymous interest is traveling through the network."}
                            {step === 'notified' && "They just received an anonymous notification."}
                            {step === 'responding' && "Hold on... it looks like they are adding you back!"}
                            {step === 'matched' && "You've both matched! The secret is out and magic is alive."}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(255,10,179,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/user/secret-crush')}
                    className="w-full max-w-[200px] h-[38px] bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl mt-6 border border-white/10 flex items-center justify-center gap-3 overflow-hidden"
                >
                    <span>{step === 'matched' ? "Unlock Match" : "Add Secret Crush"}</span>
                    <HiArrowUpRight className="text-xs animate-pulse" />
                </motion.button>
            </div>
        </section>
    );
};

export default SecretCrushSection;
