import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../utils/api";
import { toast, ToastContainer } from "react-toastify";

// Import Assets
import v1 from "../../../assets/Vb/1.svg";
import v2 from "../../../assets/Vb/2.svg";
import v3 from "../../../assets/Vb/3.svg";
import v4 from "../../../assets/Vb/4.svg";
import v5 from "../../../assets/Vb/5.svg";
import v6 from "../../../assets/Vb/6.svg";
import v7 from "../../../assets/Vb/7.svg";
import v8 from "../../../assets/Vb/8.svg";
import v9 from "../../../assets/Vb/9.svg";
import v10 from "../../../assets/Vb/10.svg";
import v11 from "../../../assets/Vb/11.svg";
import v13 from "../../../assets/Vb/13.svg";
import v14 from "../../../assets/Vb/14.svg";
import v15 from "../../../assets/Vb/15.svg";
import v16 from "../../../assets/Vb/16.svg";
import v17 from "../../../assets/Vb/17.svg";
import v18 from "../../../assets/Vb/18.svg";
import v19 from "../../../assets/Vb/19.svg";
import v20 from "../../../assets/Vb/20.svg";

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
                className={`w-full h-full object-contain transition-all duration-1000 ${isGreenery ? 'opacity-90 saturate-[0.8] brightness-95' : ''}`}
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

// Realistic Funnel Bouquet System (Synchronized with Builder)
const BouquetScene = ({ blooms, scale = 1, showStems = true }) => {
    return (
        <div className="relative flex items-end justify-center perspective-2000" style={{ transform: `scale(${scale * 0.85})` }}>
            {/* 1. KRAFT PAPER WRAP BACK */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[620px] h-[450px] md:h-[820px] pointer-events-none z-0">
                <svg viewBox="0 0 400 600" className="w-full h-full overflow-visible opacity-95">
                    <defs>
                        <linearGradient id="kraft-deep-rec" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#C9A675" />
                            <stop offset="45%" stopColor="#AE8654" />
                            <stop offset="100%" stopColor="#7D5C32" />
                        </linearGradient>
                        <linearGradient id="tissue-grad-rec" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F5E6D3" />
                            <stop offset="100%" stopColor="#D2B48C" />
                        </linearGradient>
                        <filter id="crinkle-paper-rec">
                            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed="5" result="noise" />
                            <feDiffuseLighting in="noise" lightingColor="#D2B48C" surfaceScale="2.5">
                                <feDistantLight azimuth="45" elevation="55" />
                            </feDiffuseLighting>
                        </filter>
                    </defs>
                    <path d="M200 580 Q60 550 15 150 Q200 80 385 150 Q340 550 200 580" fill="url(#tissue-grad-rec)" opacity="0.8" />
                    <path d="M200 590 Q100 570 0 160 Q10 40 180 110 Q200 120 220 110 Q390 40 400 160 Q300 570 200 590" fill="url(#kraft-deep-rec)" filter="url(#crinkle-paper-rec)" stroke="#8B6B3F" strokeWidth="1" />
                </svg>
            </div>

            {/* 2. STEMS Bundled */}
            {showStems && (
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[120px] md:w-[220px] h-[180px] md:h-[300px] z-10 pointer-events-none">
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
            <div className="relative w-[280px] md:w-[500px] h-[380px] md:h-[700px] flex items-end justify-center mb-40 md:mb-80 translate-y-16 md:translate-y-32">
                <AnimatePresence>
                    {blooms.map((bloom, i) => {
                        const distToCenter = Math.abs(bloom.x || 0);
                        const depth = distToCenter / 200;
                        const zPosition = 50 + (bloom.zIndex || 0);
                        const resX = (bloom.x || 0) * (window.innerWidth < 768 ? 0.6 : 1);
                        const resY = (bloom.y || -320) * (window.innerWidth < 768 ? 0.6 : 1) + 40;

                        return (
                            <motion.div
                                key={bloom.instanceId || i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: (bloom.scale || 1) * (1.2 - depth * 0.1),
                                    x: resX,
                                    y: resY,
                                    rotate: (bloom.rotation || 0) + (bloom.x || 0) / 10,
                                    z: -depth * 50
                                }}
                                transition={{ delay: i * 0.05 }}
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
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[620px] h-[450px] md:h-[820px] pointer-events-none z-[200]">
                <svg viewBox="0 0 400 600" className="w-full h-full overflow-visible">
                    <path
                        d="M200 590 C120 570 -20 300 40 230 Q200 320 360 230 C420 300 280 570 200 590"
                        fill="url(#kraft-deep-rec)"
                        filter="url(#crinkle-paper-rec)"
                        stroke="#8B6B3F"
                        strokeWidth="1"
                        className="drop-shadow-[0_-5px_20px_rgba(0,0,0,0.3)]"
                    />
                    <g transform={`translate(200, 565) scale(${window.innerWidth < 768 ? 0.6 : 1})`}>
                        <path d="M-35 0 Q0 6 35 0" fill="none" stroke="#5D4037" strokeWidth="4" />
                        <ellipse cx="0" cy="0" rx="7" ry="6" fill="#5D4037" stroke="#3D2B1F" strokeWidth="1" />
                    </g>
                </svg>
            </div>
        </div>
    );
};

const BouquetReceiver = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [receiverName, setReceiverName] = useState("");
    const [receiverMobile, setReceiverMobile] = useState("");
    const [senderMobile, setSenderMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bouquetData, setBouquetData] = useState([]);
    const [cardData, setCardData] = useState({ to: '', message: '', from: '' });

    useEffect(() => {
        const tempBouquet = localStorage.getItem('temp_bouquet');
        const tempCard = localStorage.getItem('temp_card');
        if (tempBouquet) setBouquetData(JSON.parse(tempBouquet));
        if (tempCard) setCardData(JSON.parse(tempCard));

        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile/me');
                if (res.data?.mobile) setSenderMobile(res.data.mobile);
            } catch (err) { console.error(err); }
        };
        fetchProfile();
    }, []);

    const sendOtp = async () => {
        if (!senderMobile || senderMobile.length !== 10) return toast.error("Enter valid mobile");
        try {
            await api.post("/otp/send", { mobile: senderMobile });
            setOtpSent(true);
            toast.success("otp sent!");
        } catch (err) { toast.error("failed"); }
    };

    const verifyOtp = async () => {
        try {
            await api.post("/otp/verify", { mobile: senderMobile, otp });
            setIsVerified(true);
            toast.success("verified!");
        } catch (err) { toast.error("invalid"); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isVerified) return toast.warning("verify mobile first");

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStep(3);
            toast.success("sent successfully! 💐");
        } catch (err) {
            toast.error("failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#B72099]/30">
            <ToastContainer theme="dark" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Martian+Mono:wght@400;700;800&family=Dancing+Script:wght@700&display=swap');
                .font-martian { font-family: 'Martian Mono', monospace; }
                .font-script { font-family: 'Dancing Script', cursive; }
                body { font-family: 'Martian Mono', monospace; background-color: #0A0A0A; color: white; }
            `}</style>

            <header className="fixed top-0 left-0 right-0 p-4 md:p-8 flex items-center justify-between z-50">
                <button onClick={() => step === 3 ? navigate('/user/dashboard') : setStep(prev => Math.max(1, prev - 1))} className="p-2 md:p-3 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all rounded-full">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
            </header>

            <main className="w-full max-w-2xl mx-auto pt-16 md:pt-24 pb-20 px-4 md:px-6 font-martian text-center lg:px-24">
                <header className="mb-8 md:mb-16 cursor-pointer" onClick={() => navigate('/user/dashboard')}>
                    <h1 className="text-4xl md:text-6xl font-script tracking-tight text-[#B72099] lowercase">Digibouquet</h1>
                </header>

                {step < 3 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-left">
                        <header className="mb-8 md:mb-16 text-center">
                            <h2 className="text-xs md:text-sm font-black uppercase tracking-[0.4em] mb-2 text-white/80">Delivery Details</h2>
                            <p className="text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em] text-[#B72099]">step {step} of 2</p>
                        </header>

                        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit} className="space-y-8 md:space-y-12">
                            {step === 1 ? (
                                <div className="space-y-6 md:space-y-10">
                                    <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-white/10 backdrop-blur-xl">
                                        <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#B72099] mb-3 md:mb-4 block">Receiver Name</label>
                                        <input value={receiverName} onChange={e => setReceiverName(e.target.value)} required className="w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-lg md:text-xl font-bold placeholder:text-white/10 focus:border-[#B72099] transition-colors outline-none" placeholder="who's it for?" />
                                    </div>
                                    <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-white/10 backdrop-blur-xl">
                                        <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#B72099] mb-3 md:mb-4 block">Mobile Number</label>
                                        <input value={receiverMobile} onChange={e => setReceiverMobile(e.target.value.replace(/\D/g, ""))} required maxLength={10} className="w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-lg md:text-xl font-bold placeholder:text-white/10 focus:border-[#B72099] transition-colors outline-none" placeholder="10-digit number" />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 md:space-y-10">
                                    <div className="p-6 md:p-8 bg-white/5 rounded-[2rem] md:rounded-3xl border border-white/10 backdrop-blur-xl">
                                        <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-[#B72099] mb-2 text-center">verify as</p>
                                        <p className="text-xl md:text-2xl font-black text-center">{senderMobile}</p>
                                    </div>

                                    {!isVerified ? (
                                        <div className="space-y-6 md:space-y-10">
                                            {!otpSent ? (
                                                <button type="button" onClick={sendOtp} className="w-full py-5 md:py-6 bg-[#B72099] text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all rounded-full shadow-lg shadow-[#B72099]/20">Send OTP</button>
                                            ) : (
                                                <div className="space-y-6 md:space-y-8">
                                                    <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} maxLength={6} required className="w-full text-center text-3xl md:text-4xl font-mono outline-none border-b-2 border-[#B72099] pb-3 md:pb-4 bg-transparent focus:border-white transition-colors" placeholder="••••••" />
                                                    <button type="button" onClick={verifyOtp} className="w-full py-5 md:py-6 bg-[#B72099] text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all rounded-full">Verify OTP</button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-2 md:py-4 text-[#B72099] flex items-center justify-center gap-2 md:gap-3">
                                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Number Verified</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-4 md:pt-8">
                                <button type="submit" disabled={loading} className="w-full py-5 md:py-6 bg-white text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-[#B72099] hover:text-white transition-all shadow-2xl disabled:bg-white/10 rounded-full">
                                    {loading ? 'processing...' : step === 1 ? 'continue to verification' : 'send my bouquet 💐'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                        <div className="mb-10 md:mb-20">
                            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white/90 mb-3 md:mb-4">hi, i made this for you!</h2>
                            <div className="h-1 w-10 md:w-12 bg-[#B72099] mx-auto rounded-full"></div>
                        </div>

                        <div className="relative w-full aspect-square max-w-md flex items-end justify-center mb-16 md:mb-24 overflow-hidden">
                            <div className="relative w-full h-[300px] md:h-[500px] flex items-end justify-center scale-110 md:scale-125">
                                <BouquetScene blooms={bouquetData} showStems={true} />
                            </div>
                        </div>

                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="w-full max-w-lg bg-white/5 backdrop-blur-3xl p-8 md:p-12 border border-white/10 text-left transform -rotate-1 shadow-2xl rounded-[2rem] md:rounded-[3rem]">
                            <div className="space-y-6 md:space-y-8">
                                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#B72099]">dear {cardData.to || 'beloved'},</p>
                                <p className="text-lg md:text-xl font-bold leading-relaxed text-white/90 italic font-serif">"{cardData.message || 'no message provided.'}"</p>
                                <p className="text-right text-[10px] md:text-xs font-black text-white/30 tracking-widest">sincerely, {cardData.from || 'secret admirer'}</p>
                            </div>
                        </motion.div>

                        <div className="mt-12 md:mt-20 flex flex-col md:flex-row gap-4 md:gap-6 w-full justify-center px-4">
                            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("copied! 🔗"); }} className="flex-1 md:flex-none px-12 py-5 bg-[#B72099] text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl hover:scale-105 transition-all">Copy Link</button>
                            <button onClick={() => toast.info("coming soon!")} className="flex-1 md:flex-none px-12 py-5 bg-white/5 border border-white/10 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-all">Share</button>
                        </div>

                        <p className="mt-12 md:mt-20 text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#B72099]">made with izhaar digibouquet</p>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default BouquetReceiver;
