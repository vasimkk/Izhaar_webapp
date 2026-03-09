import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { HiHeart } from 'react-icons/hi';
import { FaArrowRight } from 'react-icons/fa';
import { getCloudUrl } from '../../../cloudinaryUrls';

const Babitha = getCloudUrl("Add/babitha.webp", "w_100");
const Basha = getCloudUrl("Add/basha.webp", "w_100");
const Divya = getCloudUrl("Add/divya.webp", "w_100");
const Srikanth = getCloudUrl("Add/srikanth.webp", "w_100");
const Imanuel = getCloudUrl("Add/Imanuel.webp", "w_100");
const Preethi = getCloudUrl("Add/Preethi.webp", "w_100");
const Rachel = getCloudUrl("Add/Rachel.webp", "w_100");
const RohanImg = getCloudUrl("Add/Rohan.webp", "w_100");
const Saniya = getCloudUrl("Add/Saniya.webp", "w_100");
const Venkat = getCloudUrl("Add/Venkat.webp", "w_100");

const TrueConnectSection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userPhoto = user?.profile_photo || user?.google_picture || 'https://via.placeholder.com/150';

    // State for the matching sequence
    const [step, setStep] = useState('searching'); // 'searching', 'revealed'
    const [matchIndex, setMatchIndex] = useState(0);

    // Sample Discovery Profiles
    const matches = useMemo(() => [
        { id: 1, name: "Babitha", img: Babitha, score: "89%" },
        { id: 2, name: "Basha", img: Basha, score: "92%" },
        { id: 3, name: "Divya", img: Divya, score: "85%" },
        { id: 4, name: "Srikanth", img: Srikanth, score: "78%" },
        { id: 5, name: "Imanuel", img: Imanuel, score: "94%" },
        { id: 6, name: "Preethi", img: Preethi, score: "88%" },
        { id: 7, name: "Rachel", img: Rachel, score: "91%" },
        { id: 8, name: "Rohan", img: RohanImg, score: "87%" },
        { id: 9, name: "Saniya", img: Saniya, score: "93%" },
        { id: 10, name: "Venkat", img: Venkat, score: "86%" },
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
        <section className="mx-4 mb-10 rounded-2xl border border-white/5 overflow-hidden flex flex-col items-center relative pt-8 pb-4">
            {/* Header Section */}
            <div className="w-full flex items-center mb-6 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">💜</span>
                    </div>
                    <div>
                        <h3 className="text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px' }}>
                            True Connect
                        </h3>
                        <p className="text-white/40 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '12px' }}>
                            Find people who match your vibe.
                        </p>

                    </div>


                </div>
            </div>

            <div className="text-center z-40 w-full max-w-[320px] flex flex-col items-center">
                <p className="text-white/50 mb-6 leading-relaxed px-4" style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                    fontSize: '12px'
                }}>
                    Unlock your connection orbit and discover profiles that resonate with your energy.
                </p>

                <button
                    onClick={() => navigate('/user/true-connection')}
                    className="flex items-center justify-center gap-2 text-[#FF4AB3] font-bold text-[12px] tracking-widest uppercase group transition-all"
                >
                    Take Quiz
                    <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1.5" />
                </button>
            </div>

            {/* Main Visual Container */}
            <div className="relative w-full h-[320px] flex items-center justify-center mb-6">

                {/* 1. Dynamic Network Background (SVG) */}
                <div className="absolute inset-0 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>

                            {/* Clip Paths for Circular Images */}
                            {[12, 18, 14, 22, 16, 10, 14, 12, 16, 20, 11, 13, 15].map((size, i) => (
                                <clipPath key={`clip-${i}`} id={`clip-${i}`}>
                                    <circle cx="0" cy="0" r={size} />
                                </clipPath>
                            ))}
                        </defs>

                        {/* Network Edges (Background Lines) */}
                        <AnimatePresence>
                            {step === 'searching' && (
                                <motion.g
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {[
                                        [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5],
                                        [0, 6], [1, 7], [3, 8], [5, 9], [6, 7], [7, 8], [8, 9],
                                        [10, 6], [11, 8], [4, 10]
                                    ].map(([from, to], i) => {
                                        const nodeStyles = [
                                            { x: 120, y: 80 }, { x: 280, y: 70 }, { x: 100, y: 180 },
                                            { x: 300, y: 190 }, { x: 180, y: 250 }, { x: 320, y: 280 },
                                            { x: 60, y: 120 }, { x: 220, y: 40 }, { x: 350, y: 130 }, { x: 250, y: 240 },
                                            { x: 50, y: 280 }, { x: 370, y: 40 }, { x: 150, y: 150 }
                                        ];
                                        return (
                                            <g key={`edge-group-${i}`}>
                                                <line
                                                    x1={nodeStyles[from].x}
                                                    y1={nodeStyles[from].y}
                                                    x2={nodeStyles[to].x}
                                                    y2={nodeStyles[to].y}
                                                    stroke="rgba(255,255,255,0.08)"
                                                    strokeWidth="0.5"
                                                />
                                                <motion.line
                                                    x1={nodeStyles[from].x}
                                                    y1={nodeStyles[from].y}
                                                    x2={nodeStyles[to].x}
                                                    y2={nodeStyles[to].y}
                                                    stroke="white"
                                                    strokeWidth="1.2"
                                                    strokeDasharray="15 60"
                                                    animate={{
                                                        strokeDashoffset: [75, -75],
                                                        opacity: [0, 0.4, 0]
                                                    }}
                                                    transition={{
                                                        duration: 2.5 + (i % 3),
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                        delay: i * 0.2
                                                    }}
                                                    style={{ filter: 'blur(0.5px)' }}
                                                />
                                            </g>
                                        );
                                    })}
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Network Nodes (Circles with Photos) */}
                        <AnimatePresence>
                            {step === 'searching' && (
                                <motion.g
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {[
                                        { x: 120, y: 80, s: 12, c: '#FFB7D5', url: Babitha },
                                        { x: 280, y: 70, s: 18, c: '#D4B3FF', url: Basha },
                                        { x: 100, y: 180, s: 14, c: '#A7C7FF', url: Divya },
                                        { x: 300, y: 190, s: 22, c: '#FFE082', url: Srikanth },
                                        { x: 180, y: 250, s: 16, c: '#A3EBB1', url: Imanuel },
                                        { x: 320, y: 280, s: 10, c: '#FFB2B2', url: Preethi },
                                        { x: 60, y: 120, s: 14, c: '#D1C4E9', url: Rachel },
                                        { x: 220, y: 40, s: 12, c: '#B2EBF2', url: RohanImg },
                                        { x: 350, y: 130, s: 16, c: '#FFCDD2', url: Saniya },
                                        { x: 250, y: 240, s: 20, c: '#C5CAE9', url: Venkat },
                                        { x: 50, y: 280, s: 11, c: '#FFF9C4', url: Babitha },
                                        { x: 370, y: 40, s: 13, c: '#DCEDC8', url: Basha }
                                    ].map((node, i) => (
                                        <motion.g
                                            key={`node-${i}`}
                                            initial={{ scale: 0 }}
                                            animate={{
                                                scale: 1,
                                                x: [node.x, node.x + (i % 3 === 0 ? 8 : -8), node.x],
                                                y: [node.y, node.y + (i % 2 === 0 ? -8 : 8), node.y]
                                            }}
                                            transition={{
                                                scale: { duration: 0.5, delay: i * 0.05 },
                                                x: { duration: i % 2 === 0 ? 5 : 7, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                                                y: { duration: i % 2 === 0 ? 6 : 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                                            }}
                                        >
                                            <circle
                                                cx={0} cy={0} r={node.s + 2}
                                                fill={node.c}
                                                fillOpacity="0.3"
                                                filter="url(#softGlow)"
                                            />
                                            <g clipPath={`url(#clip-${i})`}>
                                                <image
                                                    href={node.url}
                                                    x={-node.s}
                                                    y={-node.s}
                                                    width={node.s * 2}
                                                    height={node.s * 2}
                                                    preserveAspectRatio="xMidYMid slice"
                                                />
                                            </g>
                                            <circle
                                                cx={0} cy={0} r={node.s}
                                                fill="none"
                                                stroke="white"
                                                strokeWidth="1"
                                                opacity="0.8"
                                            />
                                            {/* Green dot for active status */}
                                            <circle
                                                cx={node.s * 0.6}
                                                cy={node.s * 0.6}
                                                r={node.s * 0.25}
                                                fill="#22c55e"
                                                stroke="#0A0A0A"
                                                strokeWidth="1"
                                            />
                                        </motion.g>
                                    ))}
                                </motion.g>
                            )}
                        </AnimatePresence>
                    </svg>
                </div>

                {/* 2. Pulsing Glow */}
                {step === 'searching' && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
                    />
                )}

                {/* 3. Reveal Ceremony */}
                <div className="relative z-30 flex flex-col items-center gap-6">
                    {/* Top Row: Profiles & Score */}
                    <div className="flex items-center justify-center gap-4 h-32">
                        {/* Left: You */}
                        <div className="flex flex-col items-center relative">
                            {/* Finding Waves */}
                            <AnimatePresence>
                                {step === 'searching' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {[1, 2, 3].map((i) => (
                                            <motion.div
                                                key={`finding-wave-${i}`}
                                                initial={{ scale: 1, opacity: 0.5 }}
                                                animate={{
                                                    scale: [1, 2.8],
                                                    opacity: [0.5, 0],
                                                    rotate: [0, 5 * i]
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    delay: i * 0.8,
                                                    ease: "easeOut"
                                                }}
                                                className="absolute w-20 h-20 rounded-[1.2rem] border-[1.5px] border-white/20"
                                                style={{ filter: 'blur(1.5px)' }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                animate={{
                                    scale: step === 'revealed' ? 1.05 : 1
                                }}
                                className="relative p-[1.5px] bg-gradient-to-tr from-purple-600 to-pink-500 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.3)] border border-white/10"
                            >
                                <div className="w-20 h-20 rounded-[1.2rem] overflow-hidden border-2 border-black/80 bg-[#0A0A0A] relative">
                                    <img src={userPhoto} alt="You" className="w-full h-full object-cover" />
                                    {/* Green Active Dot */}
                                    <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-[#22C55E] rounded-full border-2 border-[#0A0A0A] shadow-[0_0_8px_rgba(34,197,94,0.6)] z-20" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Middle: Score */}
                        <AnimatePresence>
                            {step === 'revealed' && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="px-3 py-1 bg-[#121212] border border-white/10 rounded-full shadow-[0_0_20px_rgba(236,72,145,0.4)]">
                                        <span className="text-pink-500 text-[11px] font-black tracking-tight">
                                            {matches[matchIndex].score}
                                        </span>
                                    </div>
                                    <div className="h-4 w-[1.5px] bg-gradient-to-b from-pink-500/50 to-transparent my-1" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Right: Match */}
                        <AnimatePresence mode="wait">
                            {step !== 'searching' && (
                                <motion.div
                                    key={matchIndex}
                                    initial={{ opacity: 0, scale: 0.5, x: 50 }}
                                    animate={{ opacity: 1, scale: 1.05, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="relative p-[1.5px] bg-gradient-to-tr from-[#3B82F6] via-purple-500 to-[#EC4891] rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.3)] border border-white/10"
                                >
                                    <div className="w-20 h-20 rounded-[1.2rem] overflow-hidden border-2 border-black/80 bg-[#0A0A0A] relative">
                                        <img src={matches[matchIndex].img} alt="Match" className="w-full h-full object-cover" />
                                        {/* Green Active Dot */}
                                        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-[#22C55E] rounded-full border-2 border-[#0A0A0A] shadow-[0_0_8px_rgba(34,197,94,0.6)] z-20" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Row: Names */}
                    <AnimatePresence>
                        {step === 'revealed' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-between w-[280px] px-2"
                            >
                                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">You</span>
                                <span className="text-pink-500/60 text-[10px] font-black uppercase tracking-widest">{matches[matchIndex].name}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default TrueConnectSection;
