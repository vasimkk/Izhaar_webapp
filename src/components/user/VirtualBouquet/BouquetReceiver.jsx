import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../utils/api";
import { toast, ToastContainer } from "react-toastify";

const FlowerSVG = ({ type, color, isGreenery, showStem = true }) => {
    const filterId = "artisan-ink-receiver";
    const washFilterId = "artisan-wash-receiver";

    const washColor = color === '#FFFFFF' ? 'rgba(210,210,210,0.4)' : `${color}66`;

    return (
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible drop-shadow-sm">
            <defs>
                <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="4" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" />
                </filter>

                <filter id={washFilterId} x="-50%" y="-50%" width="200%" height="200%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="3" result="grain" />
                    <feDisplacementMap in="SourceGraphic" in2="grain" scale="12" />
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {!isGreenery && (
                <g filter={`url(#${washFilterId})`} opacity="0.8">
                    <circle cx="60" cy="55" r="42" fill={washColor} />
                    <circle cx="50" cy="45" r="30" fill={washColor} opacity="0.4" />
                </g>
            )}

            <g filter={`url(#${filterId})`} strokeLinecap="round" strokeLinejoin="round">
                {isGreenery ? (
                    <g>
                        <path d="M60 110 C30 80 20 40 60 10 C100 40 90 80 60 110" fill="#166534" stroke="black" strokeWidth="2.5" />
                        <path d="M60 110 Q50 60 60 20" fill="none" stroke="black" strokeWidth="1" opacity="0.3" />
                    </g>
                ) : (
                    <g>
                        {type === 'anemone' && (
                            <g>
                                {[0, 72, 144, 216, 288].map(d => (
                                    <path key={d} d="M60 60 C115 0 150 80 85 110 Q60 125 60 60" fill={color} stroke="black" strokeWidth="3" transform={`rotate(${d} 60 60)`} />
                                ))}
                                <circle cx="60" cy="62" r="18" fill="#111827" stroke="black" strokeWidth="2.5" />
                                <circle cx="60" cy="62" r="8" fill="#000" />
                            </g>
                        )}
                        {type === 'ranunculus' && (
                            <g>
                                <circle cx="60" cy="60" r="48" fill={color} stroke="black" strokeWidth="3.5" />
                                <circle cx="60" cy="60" r="32" fill="none" stroke="black" strokeWidth="1.5" opacity="0.5" />
                                <circle cx="60" cy="60" r="18" fill="none" stroke="black" strokeWidth="1.2" opacity="0.5" />
                            </g>
                        )}
                        {type === 'zinnia' && (
                            <g>
                                {[...Array(16)].map((_, i) => (
                                    <path key={i} d="M60 60 Q95 5 115 60 Q95 115 60 60" fill={color} stroke="black" strokeWidth="1.8" transform={`rotate(${i * 22.5} 60 60)`} />
                                ))}
                                <circle cx="60" cy="60" r="14" fill="#FACC15" stroke="black" strokeWidth="2.2" />
                            </g>
                        )}
                        {type === 'peony' && (
                            <g>
                                {[0, 60, 120, 180, 240, 300].map(d => (
                                    <path key={d} d="M60 60 C110 0 150 60 110 105 C75 125 50 115 60 60" fill={color} stroke="black" strokeWidth="3" transform={`rotate(${d} 60 60)`} />
                                ))}
                                <circle cx="60" cy="65" r="20" fill={color} stroke="black" strokeWidth="3" />
                            </g>
                        )}
                        {type === 'rose' && (
                            <g>
                                <path d="M60 60 C130 -20 160 80 85 120 C15 150 0 50 60 60" fill={color} stroke="black" strokeWidth="4" />
                                <circle cx="60" cy="60" r="15" fill={color} stroke="black" strokeWidth="3.5" />
                                <path d="M48 55 Q60 42 72 55" fill="none" stroke="black" strokeWidth="2.5" />
                            </g>
                        )}
                        {type === 'tulip' && (
                            <g>
                                <path d="M60 105 C10 80 15 5 60 10 C105 5 110 80 60 105" fill={color} stroke="black" strokeWidth="3.5" />
                                <path d="M60 105 Q45 50 60 20 Q75 50 60 105" fill={color} stroke="black" strokeWidth="2" opacity="0.7" />
                            </g>
                        )}
                        {(!['anemone', 'ranunculus', 'zinnia', 'peony', 'rose', 'tulip', 'orchid'].includes(type) && !isGreenery) && (
                            <g>
                                {[0, 120, 240].map(d => (
                                    <path key={d} d="M60 60 Q115 -10 105 60" fill={color} stroke="black" strokeWidth="3" transform={`rotate(${d} 60 60)`} />
                                ))}
                                <circle cx="60" cy="60" r="15" fill={color} stroke="black" strokeWidth="2.5" />
                            </g>
                        )}
                    </g>
                )}
                {(showStem && !isGreenery) && <path d="M60 110 L60 175" stroke="#166534" strokeWidth="7" strokeLinecap="round" opacity="0.9" />}
            </g>
        </svg>
    );
};

const BouquetWrap = () => (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[340px] h-[340px] pointer-events-none z-[100]">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.18)] overflow-visible">
            <path d="M20 195 L180 195 L220 -10 L100 35 L-20 -10 Z" fill="#F3E5D8" stroke="#8b4513" strokeWidth="0.8" />
            <path d="M100 180 Q80 155 60 180 Q80 205 100 185 Q120 205 140 180 Q120 155 100 180" fill="#B72099" stroke="black" strokeWidth="1.5" />
        </svg>
    </div>
);

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
        } catch (err) { toast.error("fail"); }
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
        <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] selection:bg-[#B72099]/10">
            <ToastContainer theme="light" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Martian+Mono:wght@400;700;800&family=Dancing+Script:wght@700&display=swap');
                .font-martian { font-family: 'Martian Mono', monospace; }
                .font-script { font-family: 'Dancing Script', cursive; }
                body { font-family: 'Martian Mono', monospace; background-color: #FDFBF7; }
            `}</style>

            <header className="fixed top-0 left-0 right-0 p-8 flex items-center justify-between z-50">
                <button onClick={() => step === 3 ? navigate('/user/dashboard') : setStep(prev => Math.max(1, prev - 1))} className="p-3 bg-white border border-black/10 hover:bg-black/5 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
            </header>

            <main className="w-full max-w-2xl mx-auto pt-24 pb-20 px-6 font-martian text-center lg:px-24">
                <header className="mb-16 cursor-pointer" onClick={() => navigate('/user/dashboard')}>
                    <h1 className="text-6xl font-script tracking-tight text-black lowercase">Digibouquet</h1>
                </header>

                {step < 3 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-left">
                        <header className="mb-16 text-center">
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-2">Delivery Details</h2>
                            <p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-30">step {step} of 2</p>
                        </header>

                        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit} className="space-y-12">
                            {step === 1 ? (
                                <div className="space-y-10">
                                    <div>
                                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-4 block">Receiver Name</label>
                                        <input value={receiverName} onChange={e => setReceiverName(e.target.value)} required className="w-full bg-transparent border-b-2 border-black/10 py-4 text-lg font-bold placeholder:text-black/5 focus:border-[#B72099] transition-colors outline-none" placeholder="who's it for?" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-4 block">Mobile Number</label>
                                        <input value={receiverMobile} onChange={e => setReceiverMobile(e.target.value.replace(/\D/g, ""))} required maxLength={10} className="w-full bg-transparent border-b-2 border-black/10 py-4 text-lg font-bold placeholder:text-black/5 focus:border-[#B72099] transition-colors outline-none" placeholder="10-digit number" />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    <div className="p-8 bg-black/5 border border-black/5">
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-2 text-center">verify as</p>
                                        <p className="text-xl font-bold text-center">{senderMobile}</p>
                                    </div>

                                    {!isVerified ? (
                                        <div className="space-y-10">
                                            {!otpSent ? (
                                                <button type="button" onClick={sendOtp} className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#B72099] transition-all">Send OTP</button>
                                            ) : (
                                                <div className="space-y-8">
                                                    <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} maxLength={6} required className="w-full text-center text-4xl font-mono outline-none border-b-2 border-black/10 pb-4 bg-transparent focus:border-black transition-colors" placeholder="••••••" />
                                                    <button type="button" onClick={verifyOtp} className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#B72099] transition-all">Verify OTP</button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-[#B72099] flex items-center justify-center gap-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            <span className="text-[10px] font-black uppercase tracking-widest">verified</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-8">
                                <button type="submit" disabled={loading} className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#B72099] transition-all shadow-2xl disabled:bg-black/10">
                                    {loading ? 'processing...' : step === 1 ? 'continue to verification' : 'send my bouquet 💐'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                        <div className="mb-20">
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter opacity-80 mb-4">hi, i made this for you!</h2>
                            <div className="h-1 w-10 bg-black/10 mx-auto"></div>
                        </div>

                        <div className="relative w-full aspect-square max-w-md flex items-end justify-center mb-24">
                            <div className="relative w-full h-[500px] flex items-end justify-center">
                                <AnimatePresence>
                                    {bouquetData.map((bloom, i) => (
                                        <motion.div
                                            key={bloom.instanceId}
                                            initial={{ opacity: 0, scale: 0, y: 100 }}
                                            animate={{ opacity: 1, scale: bloom.scale, x: `calc(-50% + ${bloom.x}px)`, y: `${bloom.y}px`, rotate: bloom.rotation }}
                                            transition={{ delay: i * 0.05 }}
                                            className="absolute left-1/2 bottom-[140px] pointer-events-none w-48 h-48"
                                            style={{ zIndex: bloom.zIndex }}
                                        >
                                            <FlowerSVG type={bloom.type} color={bloom.color} isGreenery={bloom.isGreenery} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <BouquetWrap />
                            </div>
                        </div>

                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="w-full max-w-lg bg-[#FAF9F6] p-12 border border-black/5 text-left transform -rotate-1 shadow-sm">
                            <div className="space-y-6">
                                <p className="text-[10px] font-black uppercase tracking-tighter opacity-30">dear {cardData.to || 'beloved'},</p>
                                <p className="text-lg font-bold leading-relaxed">{cardData.message || 'no message provided.'}</p>
                                <p className="text-right text-xs font-black opacity-30 italic">sincerely, {cardData.from || 'secret admirer'}</p>
                            </div>
                        </motion.div>

                        <div className="mt-20 flex gap-4 w-full justify-center">
                            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("copied! 🔗"); }} className="px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-[#B72099] transition-all">Copy Link</button>
                            <button onClick={() => toast.info("coming soon!")} className="px-10 py-5 bg-white border border-black text-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Share</button>
                        </div>

                        <p className="mt-20 text-[8px] font-black uppercase tracking-widest text-black/10">
                            made with digibouquet
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default BouquetReceiver;
