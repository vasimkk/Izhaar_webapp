import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoCheckmark, IoClose, IoHeart } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const ENVELOPES = [
    {
        id: 1,
        name: 'Passion Bow',
        type: 'ribbon',
        color: '#880808',
        accent: '#ff007f',
        tag: 'Passion',
        style: 'modern',
        decoration: 'bow_hearts'
    },
    {
        id: 2,
        name: 'Love Notes',
        type: 'kraft',
        color: '#ffffff',
        accent: '#ff007f',
        tag: 'Sweet',
        style: 'minimal',
        decoration: 'kisses_stars'
    },
    {
        id: 3,
        name: 'Romantic Blush',
        type: 'classic',
        color: '#ffc0cb',
        accent: '#ff0000',
        tag: 'Romantic',
        style: 'elegant',
        decoration: 'wax_seal'
    },
    {
        id: 4,
        name: 'Vintage Soul',
        type: 'parchment',
        color: '#e4d5b7',
        accent: '#7b3f00',
        tag: 'Antique',
        style: 'textured',
        decoration: 'string_heart'
    }
];

const EnvelopeCustomizer = () => {
    const navigate = useNavigate();
    const [selectedEnvelope, setSelectedEnvelope] = useState(ENVELOPES[0]);
    const [showAllEnvelopes, setShowAllEnvelopes] = useState(false);
    const [isOpened, setIsOpened] = useState(false);

    // Physics for a heavy, realistic feel
    const flapSpring = { type: "spring", damping: 30, stiffness: 100, mass: 1.2, bounce: 0 };
    const letterSpring = { type: "spring", damping: 25, stiffness: 120, mass: 1, bounce: 0 };

    return (
        <div className="min-h-screen text-white flex flex-col font-sans overflow-hidden select-none relative" style={{ background: 'var(--letter, linear-gradient(349deg, #01095E 0%, #000 103.43%))' }}>

            <div
                className="absolute inset-0 opacity-10 transition-colors duration-1000 z-0"
                style={{ backgroundColor: selectedEnvelope.color, filter: 'blur(120px)' }}
            />

            <header className="px-4 py-6 flex items-center justify-between z-[100] relative">
                <button
                    onClick={() => navigate("/user/letter-izhaar/samples")}
                    className="w-9 h-9 flex-shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-3xl hover:bg-white/10 transition-all active:scale-90"
                >
                    <IoChevronBack size={16} />
                </button>
                <div className="text-center px-2 min-w-0">
                    <h1 className="text-lg sm:text-2xl font-['Playfair_Display'] font-bold tracking-wider text-white/90 truncate">Izhaar Collection</h1>
                    <p className="text-[7px] sm:text-[9px] text-pink-500/60 uppercase tracking-[3px] sm:tracking-[5px] mt-0.5 font-black whitespace-nowrap">Handcrafted Designs</p>
                </div>
                <button
                    className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-700 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-2xl active:scale-95 hover:brightness-110 transition-all"
                >
                    Finalize
                </button>
            </header>

            {/* Main Cinema Area */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-visible perspective-2000">

                {/* 3D THE REPLICATED ENVELOPE */}
                <motion.div
                    className="relative w-full max-w-[320px] sm:max-w-[380px] aspect-[1.5/1] cursor-pointer"
                    initial={false}
                    animate={isOpened ? { rotateX: 20, y: 150, scale: 0.75, opacity: 0 } : { rotateX: 0, y: 0, scale: 1, opacity: 1 }}
                    transition={flapSpring}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Atmospheric Shadow */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[95%] h-16 bg-black/70 blur-[50px] rounded-full" />

                    <div className="relative w-full h-full" onClick={() => setIsOpened(true)} style={{ transformStyle: 'preserve-3d' }}>

                        {/* BASE (BACK FACE) */}
                        <div className="absolute inset-0 rounded-sm shadow-2xl overflow-hidden"
                            style={{ backgroundColor: selectedEnvelope.color }}>
                            {/* Paper Feel */}
                            <div className="absolute inset-0 paper-texture opacity-30 mix-blend-multiply" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />

                            {/* Pattern Overlay (for Passion Bow style) */}
                            {selectedEnvelope.decoration === 'bow_hearts' && (
                                <div className="absolute inset-0 flex items-center justify-end p-8 opacity-40">
                                    <div className="grid grid-cols-2 gap-4">
                                        <IoHeart className="text-pink-400 text-6xl" />
                                        <div className="w-12 h-12 border-4 border-pink-400 rounded-full" />
                                        <div className="w-12 h-12 border-4 border-pink-400 rounded-full" />
                                        <IoHeart className="text-pink-400 text-3xl" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* INTERNAL POCKET */}
                        <div className="absolute inset-0 z-[1] overflow-hidden">
                            <div className="absolute inset-0 bg-black/10" />
                        </div>

                        {/* THE POCKET CONSTRUCTION */}
                        <div className="absolute inset-0 z-10" style={{ transformStyle: 'preserve-3d' }}>
                            <div className="absolute inset-0" style={{
                                backgroundColor: selectedEnvelope.color,
                                clipPath: 'polygon(0 0, 48% 50%, 0 100%)',
                                filter: 'brightness(1.08)'
                            }}>
                                <div className="absolute inset-0 paper-texture opacity-20" />
                            </div>
                            <div className="absolute inset-0" style={{
                                backgroundColor: selectedEnvelope.color,
                                clipPath: 'polygon(100% 0, 52% 50%, 100% 100%)',
                                filter: 'brightness(1.08)'
                            }}>
                                <div className="absolute inset-0 paper-texture opacity-20" />
                            </div>

                            <div className="absolute inset-0" style={{
                                backgroundColor: selectedEnvelope.color,
                                clipPath: 'polygon(0 100%, 100% 100%, 50% 48%)',
                                filter: 'brightness(0.95)'
                            }}>
                                <div className="absolute inset-0 paper-texture opacity-40" />
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        </div>

                        {/* THE DECORATIVE ELEMENTS */}
                        {!isOpened && (
                            <div className="absolute inset-0 z-20 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>

                                {selectedEnvelope.decoration === 'bow_hearts' && (
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-14 h-full bg-[#ff007f] ml-16 shadow-lg relative flex items-center justify-center overflow-hidden">
                                            <div className="absolute inset-0 bg-white/10" />
                                        </div>
                                        <div className="absolute left-[88px] top-1/2 -translate-y-1/2 w-24 h-16 flex items-center justify-center">
                                            <div className="absolute -left-2 w-12 h-10 bg-red-600 rounded-full border-b-4 border-red-900 shadow-xl -rotate-12" />
                                            <div className="absolute -right-2 w-12 h-10 bg-red-600 rounded-full border-b-4 border-red-900 shadow-xl rotate-12" />
                                            <div className="w-8 h-8 bg-red-700 rounded-md z-10 shadow-inner border border-white/5" />
                                        </div>
                                    </div>
                                )}

                                {selectedEnvelope.decoration === 'kisses_stars' && (
                                    <div className="absolute inset-0">
                                        <div className="absolute top-12 left-16 text-4xl opacity-80 rotate-12 filter saturate-200">💋</div>
                                        <div className="absolute bottom-16 right-20 text-5xl opacity-80 -rotate-12 filter saturate-200">💋</div>
                                        <div className="absolute top-1/2 right-12 text-2xl text-yellow-400 drop-shadow-lg">⭐</div>
                                        <div className="absolute bottom-24 left-1/4 text-xl text-yellow-400 drop-shadow-lg">⭐</div>
                                    </div>
                                )}

                                {selectedEnvelope.decoration === 'wax_seal' && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center">
                                        <div className="w-full h-full rounded-full bg-red-800 border-4 border-red-950 shadow-2xl flex items-center justify-center relative scale-110">
                                            <IoHeart className="text-white text-4xl drop-shadow-lg" />
                                            <div className="absolute inset-2 rounded-full border border-white/10" />
                                        </div>
                                    </div>
                                )}

                                {selectedEnvelope.decoration === 'string_heart' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-1 bg-[#4a3728] shadow-lg relative">
                                            <div className="absolute inset-0 bg-white/5 blur-[0.5px]" />
                                        </div>
                                        <div className="absolute w-24 h-24  flex items-center justify-center">
                                            <div className="w-20 h-20 bg-red-800 rounded-full border-8 border-red-950 shadow-2xl flex items-center justify-center text-4xl transform -rotate-3">
                                                ❤️
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* THE TOP FLAP (HINGED) */}
                        <motion.div
                            className="absolute inset-x-0 top-0 h-1/2 origin-top z-40"
                            style={{ transformStyle: 'preserve-3d' }}
                            initial={false}
                            animate={isOpened ? { rotateX: -170 } : { rotateX: 0 }}
                            transition={flapSpring}
                        >
                            <div className="absolute inset-0 backface-hidden shadow-lg"
                                style={{
                                    backgroundColor: selectedEnvelope.color,
                                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                                    filter: 'brightness(1.15)',
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden'
                                }}>
                                <div className="absolute inset-0 paper-texture opacity-30" />
                                <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent opacity-50" />
                            </div>
                            <div className="absolute inset-0 backface-visible rotate-x-180"
                                style={{
                                    backgroundColor: selectedEnvelope.color,
                                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                                    filter: 'brightness(0.8)',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden'
                                }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* THE VIVID LETTER (MODAL CONTENT) */}
                <AnimatePresence>
                    {isOpened && (
                        <motion.div
                            initial={{ y: 200, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 200, opacity: 0, scale: 0.8 }}
                            transition={letterSpring}
                            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6"
                            onClick={() => setIsOpened(false)}
                        >
                            <motion.div
                                className="relative w-full max-w-[280px] sm:max-w-[360px] max-h-[85vh] bg-[#fff5f7] rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden border border-pink-100 flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-0 parchment-texture opacity-[0.2] pointer-events-none" />
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-200/30 to-transparent pointer-events-none" />

                                <div className="p-6 sm:p-8 h-full flex flex-col items-center justify-between space-y-4 overflow-y-auto custom-scrollbar relative z-10">
                                    <div className="w-10 h-1 bg-pink-300/30 rounded-full flex-shrink-0" />

                                    <div className="space-y-6 w-full text-center py-4">
                                        <div className="w-full h-3 bg-pink-900/10 rounded-full animate-pulse" />
                                        <div className="w-5/6 h-3 bg-pink-900/10 rounded-full mx-auto" />
                                        <div className="w-full h-3 bg-pink-900/10 rounded-full" />
                                        <div className="w-4/5 h-3 bg-pink-900/10 rounded-full mx-auto" />
                                        <div className="w-3/4 h-3 bg-pink-900/10 rounded-full mx-auto" />
                                    </div>

                                    <div className="relative w-44 h-44 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-pink-500/20 blur-[60px] rounded-full animate-pulse" />
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-24 h-24 rounded-full bg-white border-[8px] border-pink-50 shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex items-center justify-center text-6xl relative z-10"
                                        >
                                            ❤️
                                        </motion.div>
                                    </div>

                                    <div className="space-y-4 w-full text-center">
                                        <div className="w-2/3 h-3 bg-pink-900/10 rounded-full mx-auto" />
                                        <div className="w-1/2 h-3 bg-pink-900/10 rounded-full mx-auto" />
                                    </div>

                                    <button
                                        onClick={() => setIsOpened(false)}
                                        className="mt-2 w-full py-3.5 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-[10px] sm:text-[12px] font-black uppercase tracking-[3px] transition-all active:scale-95 shadow-lg shadow-pink-500/20 flex-shrink-0"
                                    >
                                        Return to Designs
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isOpened && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0.5, y: 0 }}
                        className="absolute bottom-12 text-[10px] uppercase tracking-[10px] text-white/40 font-black animate-pulse"
                    >
                        Tap to reveal
                    </motion.p>
                )}
            </div>

            {/* Premium Selector Slider */}
            <div className={`p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-40 transition-all duration-1000 ${isOpened ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                <div className="flex items-center justify-between mb-6 px-4">
                    <h2 className="text-lg sm:text-2xl font-['Playfair_Display'] font-bold text-white/90 tracking-tight">The Boutique</h2>
                    <button
                        onClick={() => setShowAllEnvelopes(true)}
                        className="text-pink-500 font-bold text-[8px] sm:text-[10px] uppercase tracking-[2px] sm:tracking-[5px] border-b-2 border-pink-500/10 pb-1 hover:border-pink-500 transition-all whitespace-nowrap"
                    >
                        Master Gallery
                    </button>
                </div>

                <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar px-4">
                    {ENVELOPES.map((env) => (
                        <div key={env.id} className="flex flex-col items-center">
                            <motion.div
                                whileHover={{ y: -8, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setSelectedEnvelope(env); setIsOpened(false); }}
                                className={`flex-shrink-0 w-32 h-24 rounded-2xl cursor-pointer transition-all border-2 relative overflow-hidden ${selectedEnvelope.id === env.id
                                    ? 'border-pink-500 shadow-[0_20px_40px_-10px_rgba(225,29,72,0.4)]'
                                    : 'border-white/5 hover:border-white/10'
                                    }`}
                                style={{ backgroundColor: env.color }}
                            >
                                <div className="absolute inset-0 paper-texture opacity-20 mix-blend-multiply" />

                                {/* Mini Construction for Thumbnail */}
                                <div className="absolute inset-0 scale-[0.8] origin-center opacity-90 overflow-hidden rounded-lg">
                                    <div className="absolute inset-0" style={{ backgroundColor: env.color, clipPath: 'polygon(0 0, 48% 50%, 0 100%)', filter: 'brightness(1.08)' }} />
                                    <div className="absolute inset-0" style={{ backgroundColor: env.color, clipPath: 'polygon(100% 0, 52% 50%, 100% 100%)', filter: 'brightness(1.08)' }} />
                                    <div className="absolute inset-0" style={{ backgroundColor: env.color, clipPath: 'polygon(0 100%, 100% 100%, 50% 48%)', filter: 'brightness(0.92)' }} />
                                    <div className="absolute inset-x-0 top-0 h-1/2" style={{ backgroundColor: env.color, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', filter: 'brightness(1.15)' }} />

                                    {/* Mini Decorator (Simplified) */}
                                    {env.decoration === 'wax_seal' && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-800 border-[1px] border-red-950 flex items-center justify-center">
                                            <IoHeart className="text-white text-[6px]" />
                                        </div>
                                    )}
                                    {env.decoration === 'ribbon' && (
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-2 h-full bg-pink-500 ml-4 opacity-70" />
                                        </div>
                                    )}
                                </div>

                                {selectedEnvelope.id === env.id && (
                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center shadow-lg z-50">
                                        <IoCheckmark size={14} className="text-white" />
                                    </div>
                                )}
                            </motion.div>
                            <span className={`mt-3 text-[8px] font-black uppercase tracking-[3px] transition-colors ${selectedEnvelope.id === env.id ? 'text-pink-400' : 'text-white/20'}`}>
                                {env.name.split(' ')[0]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gallery Full View */}
            <AnimatePresence>
                {showAllEnvelopes && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[1000] flex flex-col p-8 overflow-y-auto no-scrollbar"
                        style={{ background: 'var(--letter, linear-gradient(349deg, #01095E 0%, #000 103.43%))' }}
                    >
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h1 className="text-4xl font-['Playfair_Display'] font-bold text-white tracking-tight italic">Collection</h1>
                                <p className="text-pink-600 uppercase tracking-[6px] text-[9px] mt-2 font-black">Choose your soul archetype</p>
                            </div>
                            <button
                                onClick={() => setShowAllEnvelopes(false)}
                                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-12 pb-20">
                            {ENVELOPES.map((env) => (
                                <motion.div
                                    key={env.id}
                                    layout
                                    onClick={() => {
                                        setSelectedEnvelope(env);
                                        setIsOpened(false);
                                        setShowAllEnvelopes(false);
                                    }}
                                    className={`relative p-2 rounded-[40px] cursor-pointer transition-all border-2 ${selectedEnvelope.id === env.id ? 'border-pink-500 shadow-3xl scale-[1.02]' : 'border-white/10 hover:border-white/30'}`}
                                >
                                    <div className="aspect-[1.5/1] w-full relative overflow-hidden rounded-[34px] " style={{ backgroundColor: env.color }}>
                                        <div className="absolute inset-0 paper-texture opacity-20 mix-blend-multiply" />

                                        {/* Mini 3D Construction */}
                                        <div className="absolute inset-0 z-10" style={{ transformStyle: 'preserve-3d' }}>
                                            <div className="absolute inset-0" style={{ backgroundColor: env.color, clipPath: 'polygon(0 0, 48% 50%, 0 100%)', filter: 'brightness(1.08)' }} />
                                            <div className="absolute inset-0" style={{ backgroundColor: env.color, clipPath: 'polygon(100% 0, 52% 50%, 100% 100%)', filter: 'brightness(1.08)' }} />
                                            <div className="absolute inset-0" style={{ backgroundColor: env.color, clipPath: 'polygon(0 100%, 100% 100%, 50% 48%)', filter: 'brightness(0.95)' }} />
                                        </div>

                                        {/* Mini Decorations */}
                                        <div className="absolute inset-0 z-20 scale-75 origin-center">
                                            {env.decoration === 'bow_hearts' && (
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-10 h-full bg-[#ff007f] ml-12 shadow-lg relative" />
                                                    <div className="absolute left-[70px] top-1/2 -translate-y-1/2 w-16 h-12 flex items-center justify-center">
                                                        <div className="absolute -left-1 w-8 h-6 bg-red-600 rounded-full border-b-2 border-red-900 shadow-xl -rotate-12" />
                                                        <div className="absolute -right-1 w-8 h-6 bg-red-600 rounded-full border-b-2 border-red-900 shadow-xl rotate-12" />
                                                        <div className="w-5 h-5 bg-red-700 rounded-sm z-10 border border-white/5" />
                                                    </div>
                                                </div>
                                            )}
                                            {env.decoration === 'wax_seal' && (
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-red-800 border-2 border-red-950 shadow-2xl flex items-center justify-center flex items-center justify-center">
                                                    <IoHeart className="text-white text-xl" />
                                                </div>
                                            )}
                                            {env.decoration === 'string_heart' && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-full h-0.5 bg-[#4a3728]" />
                                                    <div className="absolute w-14 h-14 bg-red-800 rounded-full border-4 border-red-950 shadow-2xl flex items-center justify-center text-xl">❤️</div>
                                                </div>
                                            )}
                                            {env.decoration === 'kisses_stars' && (
                                                <div className="absolute inset-0 flex items-center justify-center gap-4 text-3xl opacity-60">💋⭐💋</div>
                                            )}
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-30" />
                                        <div className="absolute bottom-6 left-8 text-left z-40">
                                            <div className="text-[9px] text-pink-400 uppercase tracking-[4px] mb-1 font-bold">{env.tag}</div>
                                            <div className="text-2xl font-['Playfair_Display'] font-bold text-white tracking-tight">{env.name}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(236, 72, 153, 0.2); border-radius: 10px; }
                
                .backface-hidden { backface-visibility: hidden; }
                .backface-visible { backface-visibility: visible; }
                .rotate-x-180 { transform: rotateX(180deg); }
                
                .paper-texture {
                   background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
                   background-size: contain;
                }
                .parchment-texture {
                   background-image: url("https://www.transparenttextures.com/patterns/rough-paper.png");
                   background-size: contain;
                }
            `}</style>
        </div>
    );
};

export default EnvelopeCustomizer;
