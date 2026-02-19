import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../../utils/api';

// Import Assets
import v1 from '../../../assets/Vb/1.svg';
import v2 from '../../../assets/Vb/2.svg';
import v3 from '../../../assets/Vb/3.svg';
import v4 from '../../../assets/Vb/4.svg';
import v5 from '../../../assets/Vb/5.svg';
import v6 from '../../../assets/Vb/6.svg';
import v7 from '../../../assets/Vb/7.svg';
import v8 from '../../../assets/Vb/8.svg';
import v9 from '../../../assets/Vb/9.svg';
import v10 from '../../../assets/Vb/10.svg';
import v11 from '../../../assets/Vb/11.svg';
import v13 from '../../../assets/Vb/13.svg';
import v14 from '../../../assets/Vb/14.svg';
import v15 from '../../../assets/Vb/15.svg';
import v16 from '../../../assets/Vb/16.svg';
import v17 from '../../../assets/Vb/17.svg';
import v18 from '../../../assets/Vb/18.svg';
import v19 from '../../../assets/Vb/19.svg';
import v20 from '../../../assets/Vb/20.svg';

const ASSETS = {
    'v1': v1, 'v2': v2, 'v3': v3, 'v4': v4, 'v5': v5,
    'v6': v6, 'v7': v7, 'v8': v8, 'v9': v9, 'v10': v10,
    'v11': v11, 'v13': v13, 'v14': v14, 'v15': v15,
    'v16': v16, 'v17': v17, 'v18': v18, 'v19': v19, 'v20': v20
};

const FlowerSVG = ({ assetId, isGreenery, hueVar = 0 }) => {
    return (
        <div className="w-full h-full relative group perspective-1000">
            <img
                src={ASSETS[assetId]}
                alt="bloom"
                className={`w-full h-full object-contain transition-all duration-1000 ${isGreenery ? 'opacity-90 saturate-[0.8] brightness-95' : 'group-hover:scale-110 group-hover:rotate-3'}`}
                style={{
                    filter: `
                        drop-shadow(0 12px 10px rgba(0,0,0,0.3))
                        contrast(1.05)
                        brightness(${isGreenery ? 0.9 : 1.05})
                        hue-rotate(${hueVar}deg)
                    `
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/10 rounded-full opacity-40 pointer-events-none mix-blend-overlay" />
        </div>
    );
};

// Realistic Funnel Bouquet System (Highly Visual Wrapping)
const BouquetScene = ({ blooms, scale = 1, showStems = true, isDraft = false }) => {
    return (
        <div className="relative flex items-end justify-center perspective-2000" style={{ transform: `scale(${scale * 0.85})` }}>
            {/* 1. KRAFT PAPER WRAP BACK */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[320px] md:w-[620px] h-[480px] md:h-[820px] pointer-events-none z-0">
                <svg viewBox="0 0 400 600" className="w-full h-full overflow-visible opacity-95">
                    <defs>
                        <linearGradient id="kraft-deep" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#C9A675" />
                            <stop offset="45%" stopColor="#AE8654" />
                            <stop offset="100%" stopColor="#7D5C32" />
                        </linearGradient>
                        <linearGradient id="tissue-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F5E6D3" />
                            <stop offset="100%" stopColor="#D2B48C" />
                        </linearGradient>
                        <filter id="crinkle-paper">
                            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed="5" result="noise" />
                            <feDiffuseLighting in="noise" lightingColor="#D2B48C" surfaceScale="2.5">
                                <feDistantLight azimuth="45" elevation="55" />
                            </feDiffuseLighting>
                        </filter>
                    </defs>
                    <path d="M200 580 Q60 550 15 150 Q200 80 385 150 Q340 550 200 580" fill="url(#tissue-grad)" opacity="0.8" />
                    <path d="M200 590 Q100 570 0 160 Q10 40 180 110 Q200 120 220 110 Q390 40 400 160 Q300 570 200 590" fill="url(#kraft-deep)" filter="url(#crinkle-paper)" stroke="#8B6B3F" strokeWidth="1" />
                </svg>
            </div>

            {/* 2. STEMS Bundled */}
            {showStems && (
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[140px] md:w-[220px] h-[200px] md:h-[300px] z-10 pointer-events-none">
                    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                        <g opacity="0.9">
                            {[...Array(16)].map((_, i) => {
                                const angle = (i - 8) * 3.5;
                                const x1 = 100 + Math.sin(angle * Math.PI / 180) * 12;
                                const x2 = 100 + Math.sin(angle * Math.PI / 180) * 50;
                                return <path key={i} d={`M${x1} 0 L${x2} 180`} stroke={i % 2 === 0 ? "#166534" : "#0A2411"} strokeWidth={window.innerWidth < 768 ? 4 : 8} className="drop-shadow-md" />;
                            })}
                        </g>
                    </svg>
                </div>
            )}

            {/* 3. BLOOMS MOUND */}
            <div className="relative w-[280px] md:w-[500px] h-[400px] md:h-[700px] flex items-end justify-center mb-40 md:mb-80 translate-y-20 md:translate-y-32">
                <AnimatePresence mode="popLayout">
                    {blooms.map((bloom, i) => {
                        const distToCenter = Math.abs(bloom.x || 0);
                        const depth = distToCenter / 200;
                        const zPosition = 50 + (bloom.zIndex || 0);
                        const responsiveX = (bloom.x || 0) * (window.innerWidth < 768 ? 0.6 : 1);
                        const responsiveY = (bloom.y || -320) * (window.innerWidth < 768 ? 0.6 : 1) + 40;

                        return (
                            <motion.div
                                key={bloom.instanceId || i}
                                initial={isDraft ? { opacity: 0, scale: 0, y: 150, rotate: -45 } : false}
                                animate={{
                                    opacity: 1,
                                    scale: (bloom.scale || 1) * (1.2 - depth * 0.1),
                                    x: responsiveX,
                                    y: responsiveY,
                                    rotate: (bloom.rotation || 0) + (bloom.x || 0) / 10,
                                    z: -depth * 50
                                }}
                                className="absolute w-32 md:w-64 h-32 md:h-64 pointer-events-none"
                                style={{
                                    zIndex: zPosition,
                                    filter: `brightness(${1.1 - depth * 0.25}) contrast(${1.05 + depth * 0.1}) drop-shadow(0 12px 15px rgba(0,0,0,0.35))`,
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                <div className="relative w-full h-full">
                                    <FlowerSVG assetId={bloom.assetId} isGreenery={bloom.isGreenery} hueVar={(i % 5) * 4} />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* 4. FRONT PAPER WRAP */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[320px] md:w-[620px] h-[480px] md:h-[820px] pointer-events-none z-[200]">
                <svg viewBox="0 0 400 600" className="w-full h-full overflow-visible">
                    <path
                        d="M200 590 C120 570 -20 300 40 230 Q200 320 360 230 C420 300 280 570 200 590"
                        fill="url(#kraft-deep)"
                        filter="url(#crinkle-paper)"
                        stroke="#8B6B3F"
                        strokeWidth="1"
                        className="drop-shadow-[0_-5px_20px_rgba(0,0,0,0.3)]"
                    />
                    {/* Ribbon */}
                    <g transform={`translate(200, 565) scale(${window.innerWidth < 768 ? 0.6 : 1})`}>
                        <path d="M-35 0 Q0 6 35 0" fill="none" stroke="#5D4037" strokeWidth="4" />
                        <ellipse cx="0" cy="0" rx="7" ry="6" fill="#5D4037" stroke="#3D2B1F" strokeWidth="1" />
                    </g>
                </svg>
            </div>
        </div>
    );
};

const BLOOMS = [
    { id: 'b1', name: 'Royal Orchid', assetId: 'v1', gardenX: 15, gardenY: 65, desc: "A symbol of rare beauty and strength." },
    { id: 'b2', name: 'Persian Tulip', assetId: 'v2', gardenX: 35, gardenY: 45, desc: "An exotic declaration of unparalleled passion." },
    { id: 'b3', name: 'Velvet Peony', assetId: 'v3', gardenX: 55, gardenY: 68, desc: "Lush petals symbolizing romance and bashfulness." },
    { id: 'b4', name: 'Night Anemone', assetId: 'v4', gardenX: 75, gardenY: 52, desc: "Representing anticipation and protection." },
    { id: 'b5', name: 'Silk Petals', assetId: 'v5', gardenX: 20, gardenY: 78, desc: "Delicate like a whisper shared between hearts." },
    { id: 'b6', name: 'Magenta Glow', assetId: 'v6', gardenX: 45, gardenY: 82, desc: "A vibrant burst of energy that lights up paths." },
    { id: 'b7', name: 'Crimson Dahlia', assetId: 'v7', gardenX: 70, gardenY: 85, desc: "Emblem of commitment and a bond that lasts." },
    { id: 'b8', name: 'Golden Sun', assetId: 'v8', gardenX: 10, gardenY: 55, desc: "Bringing warmth and happiness into your life." },
    { id: 'b9', name: 'Midnight Lily', assetId: 'v9', gardenX: 85, gardenY: 72, desc: "Elegant, mysterious, blooming only for you." },
    { id: 'b10', name: 'Pure Daisy', assetId: 'v10', gardenX: 40, gardenY: 35, desc: "Innocence and new beginnings for every day." },
    { id: 'b11', name: 'Spark Rose', assetId: 'v11', gardenX: 65, gardenY: 38, desc: "The timeless messenger of what the heart feels." },
    { id: 'b12', name: 'Heart Bloom', assetId: 'v13', gardenX: 90, gardenY: 58, desc: "A floral expression of the rhythm souls share." },
    { id: 'g1', name: 'Meadow Fern', assetId: 'v14', isGreenery: true, gardenX: 5, gardenY: 85, desc: "Lush greenery for natural beauty." },
    { id: 'g2', name: 'Wild Ivy', assetId: 'v15', isGreenery: true, gardenX: 95, gardenY: 85, desc: "Symbolizing fidelity and entwined lives." },
];

const VirtualBouquet = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedBlooms, setSelectedBlooms] = useState([]);
    const [arrangedBlooms, setArrangedBlooms] = useState([]);
    const [cardData, setCardData] = useState({ to: '', message: '', from: '' });
    const [serverSvg, setServerSvg] = useState(null);
    const [isVisualizingServer, setIsVisualizingServer] = useState(false);
    const [hoveredBloom, setHoveredBloom] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleCompose = () => {
        if (selectedBlooms.length < 6) {
            toast.warning("Pick at least 6 stems!");
            return;
        }
        setStep(3);
    };

    const handleBloomSelect = (bloom) => {
        if (selectedBlooms.length >= 10) {
            toast.warning("Pick up to 10 blooms!");
            return;
        }
        setSelectedBlooms([...selectedBlooms, bloom]);

        const isGreenery = bloom.isGreenery;
        const newArrangement = {
            ...bloom,
            instanceId: Date.now() + Math.random(),
            x: (Math.random() - 0.5) * 220,
            y: -240 - (Math.random() * 120),
            scale: 0.85 + Math.random() * 0.4,
            rotation: (Math.random() - 0.5) * 60,
            zIndex: isGreenery ? 25 : 50 + selectedBlooms.length
        };
        setArrangedBlooms([...arrangedBlooms, newArrangement]);
    };

    const handleGenerateServerSVG = async () => {
        try {
            setIsVisualizingServer(true);
            const response = await api.post('/user/bouquet/generate-svg', { arrangedBlooms });
            if (response.data.success) setServerSvg(response.data.svg);
        } catch (err) {
            toast.error("Failed to generate pro preview");
        } finally {
            setIsVisualizingServer(false);
        }
    };

    const handleSend = () => {
        localStorage.setItem('temp_bouquet', JSON.stringify(arrangedBlooms));
        localStorage.setItem('temp_card', JSON.stringify(cardData));
        navigate('/user/bouquet/receiver');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#B72099]/30 overflow-x-hidden">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Martian+Mono:wght@400;700;800&family=Dancing+Script:wght@700&family=Outfit:wght@300;400;600;800&display=swap');
                
                :root {
                    --accent: #B72099;
                    --glass: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.08);
                }

                .font-martian { font-family: 'Martian Mono', monospace; }
                .font-script { font-family: 'Dancing Script', cursive; }
                .font-outfit { font-family: 'Outfit', sans-serif; }
                
                body { font-family: 'Outfit', sans-serif; background-color: #050505; color: white; }
                
                .premium-glass {
                    background: var(--glass);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                }

                @keyframes float-garden {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(1deg); }
                }

                .garden-flower { cursor: pointer; }
                
                @keyframes firefly-float {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
                    50% { transform: translate(20px, -20px) scale(1.5); opacity: 0.6; }
                }
                .firefly {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: #B72099;
                    border-radius: 50%;
                    filter: blur(2px) drop-shadow(0 0 5px #B72099);
                    animation: firefly-float 5s infinite ease-in-out;
                    pointer-events: none;
                }

                @keyframes bloom-pulse {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.2) drop-shadow(0 0 15px rgba(183,32,153,0.3)); }
                }
                .garden-bloom-active { animation: bloom-pulse 4s infinite ease-in-out; }
            `}</style>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative h-screen flex flex-col items-center overflow-hidden"
                    >
                        {/* THE LUSH MEADOW BACKDROP */}
                        <div className="absolute inset-0 bg-[#050505] z-0">
                            {/* Deep Background Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0F0A1F] via-[#1A0A1F] to-[#050505]" />

                            {/* Ambient Light Orbs */}
                            <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-[#B72099]/5 blur-[120px] rounded-full" />
                            <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-[#4B0082]/10 blur-[150px] rounded-full" />

                            {/* Fireflies */}
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="firefly"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 5}s`,
                                        animationDuration: `${3 + Math.random() * 4}s`
                                    }}
                                />
                            ))}

                            {/* Meadow Floor (Layered Grass Waves) */}
                            <div className="absolute bottom-0 left-0 w-full h-[50%] z-1">
                                <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full opacity-10">
                                    <path fill="#166534" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                                </svg>
                                <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-black via-black/40 to-transparent" />
                            </div>
                        </div>

                        <header className="relative z-10 pt-10 md:pt-16 mb-4 flex flex-col items-center px-4">
                            <motion.h1
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-4xl md:text-7xl font-script text-white lowercase relative text-center"
                            >
                                Izhaar <span className="text-[#B72099]">Meadow</span>
                                <div className="absolute -inset-4 bg-[#B72099]/10 blur-3xl -z-10" />
                            </motion.h1>
                            <p className="text-[7px] md:text-[10px] font-martian uppercase tracking-[0.4em] md:tracking-[0.8em] text-white/20 mt-4 px-4 text-center max-w-[280px] md:max-w-none">
                                Select 6 to 10 stems from our midnight sanctuary
                            </p>
                        </header>

                        {/* GARDEN INTERACTIVE AREA */}
                        <div className="relative flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 mb-40 md:mb-32 z-10 min-h-[500px] md:min-h-0">
                            <div className="relative w-full h-full">
                                {BLOOMS.map((bloom, i) => {
                                    const scale = (window.innerWidth < 768 ? 0.35 : 0.6) + (bloom.gardenY / 150) * 0.6;
                                    const isSelected = selectedBlooms.some(sb => sb.id === bloom.id);

                                    return (
                                        <motion.button
                                            key={bloom.id}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: scale }}
                                            transition={{ delay: i * 0.04 }}
                                            whileHover={{ scale: scale * 1.15, zIndex: 100 }}
                                            whileTap={{ scale: scale * 0.95 }}
                                            onMouseEnter={() => setHoveredBloom(bloom)}
                                            onMouseLeave={() => setHoveredBloom(null)}
                                            onClick={() => handleBloomSelect(bloom)}
                                            className={`absolute group origin-bottom ${isSelected ? 'brightness-125' : ''}`}
                                            style={{
                                                left: `${bloom.gardenX}%`,
                                                top: `${bloom.gardenY}%`,
                                                width: bloom.isGreenery ? '160px' : '130px',
                                                height: bloom.isGreenery ? '160px' : '130px',
                                                zIndex: Math.floor(bloom.gardenY)
                                            }}
                                        >
                                            <div className="relative w-full h-full flex flex-col items-center justify-end">
                                                {/* Ground Connection */}
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full h-4">
                                                    <div className="w-8 md:w-12 h-2 md:h-3 bg-black/60 blur-md rounded-full mx-auto" />
                                                </div>

                                                {/* The Bloom */}
                                                <div className="relative w-full h-full garden-bloom-active transition-transform duration-700">
                                                    <FlowerSVG assetId={bloom.assetId} isGreenery={bloom.isGreenery} hueVar={i * 6} />
                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-[#B72099]/10 rounded-full blur-xl animate-pulse" />
                                                    )}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* HOVER DETAIL CARD */}
                        <AnimatePresence>
                            {hoveredBloom && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                        left: window.innerWidth < 768 ? '50%' : mousePos.x + 25,
                                        top: window.innerWidth < 768 ? 'auto' : mousePos.y - 120,
                                        bottom: window.innerWidth < 768 ? '180px' : 'auto',
                                        x: window.innerWidth < 768 ? '-50%' : 0
                                    }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="fixed z-[500] pointer-events-none w-[280px] md:w-xs"
                                >
                                    <div className="premium-glass p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-[#B72099]/30 shadow-2xl backdrop-blur-3xl">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-white/5 p-1">
                                                    <img src={ASSETS[hoveredBloom.assetId]} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <h3 className="text-[10px] md:text-xs font-martian font-black uppercase tracking-widest text-white">
                                                    {hoveredBloom.name}
                                                </h3>
                                            </div>
                                            <p className="text-[9px] md:text-[10px] font-outfit text-white/60 leading-relaxed italic">
                                                "{hoveredBloom.desc}"
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* BOTTOM BAR */}
                        <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[95%] md:max-w-4xl px-4">
                            <motion.div
                                layout
                                className="premium-glass rounded-[2rem] md:rounded-full px-6 md:px-10 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between border border-[#B72099]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            >
                                <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-4 md:gap-10 mb-4 md:mb-0">
                                    <div className="flex flex-col">
                                        <span className="text-[7px] md:text-[8px] font-martian uppercase tracking-tighter text-[#B72099]">Picked Stems</span>
                                        <span className="text-xl md:text-2xl font-script text-white">{selectedBlooms.length} <span className="text-[9px] font-martian opacity-30">/ 10</span></span>
                                    </div>
                                    <div className="flex gap-1 md:gap-2">
                                        {selectedBlooms.slice(-4).map((b, i) => (
                                            <motion.div key={i} layoutId={b.instanceId} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 border border-white/10 p-1">
                                                <img src={ASSETS[b.assetId]} alt="" className="w-full h-full object-contain" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                                    <button onClick={() => { setSelectedBlooms([]); setArrangedBlooms([]); }} className="flex-1 md:flex-none text-[8px] md:text-[9px] font-martian uppercase tracking-widest text-white/40 hover:text-white transition-colors">Reset</button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCompose}
                                        disabled={selectedBlooms.length < 6}
                                        className="flex-[2] md:flex-none bg-[#B72099] text-white px-6 md:px-10 py-3 md:py-4 rounded-full text-[9px] md:text-[10px] font-martian font-black uppercase tracking-widest disabled:opacity-20 shadow-lg"
                                    >
                                        Compose
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="container max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-24 pb-48 w-full"
                    >
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
                            {/* THE BOUQUET PREVIEW */}
                            <div className="flex flex-col items-center w-full order-2 lg:order-1">
                                <div className="relative group p-4 md:p-12 w-full flex justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(183,32,153,0.1)_0%,transparent_70%)] animate-pulse" />
                                    <BouquetScene blooms={arrangedBlooms} scale={window.innerWidth < 768 ? 0.7 : 1.2} />
                                </div>
                            </div>

                            {/* PERSONALIZATION */}
                            <div className="flex flex-col gap-8 md:gap-10 w-full order-1 lg:order-2">
                                <div className="text-center lg:text-left">
                                    <h2 className="text-[10px] md:text-xs font-martian font-black text-[#B72099] tracking-[0.4em] md:tracking-[0.5em] uppercase mb-2 md:mb-4">Phase 02: Sentiment</h2>
                                    <p className="text-white/40 text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em]">Add a message to your bouquet</p>
                                </div>

                                <div className="premium-glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border-[#B72099]/10 shadow-2xl">
                                    <div className="space-y-8 md:space-y-12">
                                        <div>
                                            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#B72099] mb-3 md:mb-4 block">Recipient</label>
                                            <input
                                                type="text"
                                                placeholder="Who's it for?"
                                                className="w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-lg md:text-xl font-light focus:outline-none focus:border-[#B72099] transition-all"
                                                value={cardData.to}
                                                onChange={e => setCardData({ ...cardData, to: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#B72099] mb-3 md:mb-4 block">Message</label>
                                            <textarea
                                                rows={window.innerWidth < 768 ? 3 : 5}
                                                placeholder="Speak from the soul..."
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-base md:text-lg font-light focus:outline-none focus:border-[#B72099]/30"
                                                value={cardData.message}
                                                onChange={e => setCardData({ ...cardData, message: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#B72099] mb-3 md:mb-4 block">Signature</label>
                                            <input
                                                type="text"
                                                placeholder="Your name"
                                                className="w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-lg md:text-xl font-light focus:outline-none focus:border-[#B72099] transition-all"
                                                value={cardData.from}
                                                onChange={e => setCardData({ ...cardData, from: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-4 md:mt-10">
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <button onClick={() => setStep(1)} className="flex-1 bg-white/5 px-8 md:px-10 py-4 md:py-5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/30">Back</button>
                                        <button onClick={handleGenerateServerSVG} className="flex-1 md:flex-none premium-glass bg-white/5 px-8 md:px-10 py-4 md:py-5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/50 border-[#B72099]/20">
                                            {isVisualizingServer ? '...' : 'Pro Render'}
                                        </button>
                                    </div>
                                    <button onClick={handleSend} className="w-full md:flex-grow bg-[#B72099] text-white py-4 md:py-5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] shadow-xl">Deliver ➜</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Pro Preview Modal */}
                <AnimatePresence>
                    {serverSvg && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-8">
                            <div className="relative w-full max-w-2xl bg-[#0F0F0F] rounded-[3rem] p-12 border border-white/10 text-center">
                                <button onClick={() => setServerSvg(null)} className="absolute top-8 right-8 text-white/20 hover:text-white">✕</button>
                                <h3 className="text-2xl font-script text-[#B72099] mb-8 lowercase">Pro Preview</h3>
                                <div className="w-full aspect-[4/5] bg-black/20 rounded-2xl p-8 mb-10 overflow-hidden" dangerouslySetInnerHTML={{ __html: serverSvg }} />
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => {
                                            const blob = new Blob([serverSvg], { type: 'image/svg+xml' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url; a.download = 'izhaar-bouquet.svg'; a.click();
                                        }}
                                        className="bg-white/5 border border-white/5 px-10 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10"
                                    >
                                        Download SVG
                                    </button>
                                    <button onClick={() => setServerSvg(null)} className="bg-[#B72099] px-12 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest">Looks Perfect</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </AnimatePresence>
        </div>
    );
};

export default VirtualBouquet;
