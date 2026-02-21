import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import secretImg from '../../assets/secret.png';

// Custom inline SVG Components for premium look
const Star = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const CheckCircle2 = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" stroke="currentColor" />
    </svg>
);

const ShieldCheck = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" stroke="currentColor" />
    </svg>
);

const LockIcon = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);


const CoupleSVG = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} fill="currentColor">
        <defs>
            <linearGradient id="coupleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
        </defs>
        <path d="M60 180c0-30 20-40 40-40s40 10 40 40M100 130c15 0 25-10 25-25s-10-25-25-25-25 10-25 25 10 25 25 25z" opacity="0.4" />
        <path d="M45 180c0-25 15-35 35-35s35 10 35 35M80 140c12 0 20-8 20-20s-8-20-20-20-20 8-20 20 8 20 20 20z" fill="url(#coupleGradient)" />
        <path d="M115 180c0-25 15-35 35-35s35 10 35 35M150 140c12 0 20-8 20-20s-8-20-20-20-20 8-20 20 8 20 20 20z" fill="url(#coupleGradient)" />
        <path d="M100 80c-5-5-15-5-20 0s-5 15 0 20l20 20 20-20c5-5 5-15 0-20s-15-5-20 0z" fill="#ec4899">
            <animate attributeName="scale" values="1;1.1;1" dur="2s" repeatCount="indefinite" />
        </path>
    </svg>
);

const RomanticMark = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const IzhaarMoment = () => {
    const navigate = useNavigate();
    const [currentActivity, setCurrentActivity] = React.useState(0);

    const activities = [
        { text: "A new Secret Crush match was found! 💘", img: "ad" },
        { text: "Don't wait! Your special someone is here 🤫", img: "be" },
        { text: "Someone just revealed their secret admirer! ✨", img: "cf" },
        { text: "Unlock the secret before it's gone... 😍", img: "dg" },
        { text: "Your admirer is waiting for your signal 💖", img: "eh" },
        { text: "3 people just found their perfect match! 💍", img: "fi" },
        { text: "Someone special is viewing your category... 👁️", img: "gj" },
        { text: "A beautiful match just started chatting! 🌹", img: "hk" }
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentActivity((prev) => (prev + 1) % activities.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[#1A0536] text-white font-sans overflow-x-hidden relative selection:bg-pink-500/30">
            {/* Top Marquee - Boutique Discovery Bar */}
            <div className="fixed top-0 left-0 right-0 z-[60] bg-[#1A0536]/80 backdrop-blur-xl border-b border-white/5 h-11 flex items-center overflow-hidden">
                <div className="animate-marquee whitespace-nowrap flex gap-12 items-center px-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex gap-12 items-center">
                            {[
                                "SOMEONE IS WAITING FOR YOU",
                                "DON'T KEEP YOUR HEART WAITING",
                                "UNLOCK YOUR SECRET ADMIRER",
                                "TRUE LOVE STARTS WITH A STEP"
                            ].map((text, idx) => (
                                <div key={idx} className="flex items-center gap-5">
                                    <RomanticMark />
                                    <span className="text-[10px] font-serif italic font-medium tracking-[0.2em] text-pink-50 uppercase">
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#4A0E8F_0%,#1A0536_70%)] opacity-80" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />

                {/* Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 flex flex-col items-center px-4 pt-24 pb-40 max-w-lg mx-auto text-center"
            >
                {/* Responsive Premium Live Discovery Hub */}
                <motion.div variants={itemVariants} className="mb-10 w-full max-w-[340px] mx-auto">
                    <div className="relative overflow-hidden p-[1px] rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/40 to-pink-500/20 shadow-2xl">
                        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#1A0536]/90 backdrop-blur-3xl">
                            {/* Live Badge */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 shrink-0">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pink-500"></span>
                                </span>
                                <span className="text-[8px] font-black uppercase tracking-tighter text-pink-300">LIVE</span>
                            </div>

                            {/* Content Slider */}
                            <div className="flex-1 h-6 relative overflow-hidden flex items-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentActivity}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="flex items-center gap-2.5 w-full"
                                    >
                                        <div className="relative shrink-0">
                                            <img
                                                src={`https://i.pravatar.cc/100?u=${activities[currentActivity].img}`}
                                                className="w-5 h-5 rounded-full border border-pink-500/30 object-cover shadow-lg shadow-pink-500/20"
                                                alt="User"
                                            />
                                            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-[#1A0536] scale-75 shadow-sm" />
                                        </div>
                                        <p className="text-[9.5px] font-bold uppercase tracking-widest text-white/80 leading-tight line-clamp-1">
                                            {activities[currentActivity].text}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Header */}
                <motion.div variants={itemVariants} className="space-y-6 mb-10 w-full">
                    <div className="overflow-hidden flex flex-col items-center">
                        <motion.h1
                            className="text-[2.5rem] leading-[1.1] md:text-5xl font-serif font-black tracking-tight drop-shadow-2xl px-2"
                        >
                            <motion.span
                                initial={{ y: 80, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="block text-white"
                            >
                                Your Secret
                            </motion.span>
                            <motion.span
                                initial={{ y: 80, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-purple-300 bg-[length:200%_auto] animate-text-shimmer"
                            >
                                Crush Moment
                            </motion.span>
                        </motion.h1>
                    </div>

                    {/* Hero Icon - Now a Beautiful Couple SVG */}
                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center py-4"
                    >
                        <div className="relative p-6   transition-all ">
                            <img
                                src={secretImg}
                                className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-transform group-hover:scale-105 duration-700"
                                alt="Secret Reveal"
                            />

                        </div>
                    </motion.div>

                    <motion.p
                        variants={itemVariants}
                        className="text-pink-100/60 text-[15px] md:text-lg font-medium max-w-[320px] mx-auto leading-relaxed px-4"
                    >
                        The secret is out! Someone has been admiring you from afar. Are you ready to see <span className="text-pink-300 italic font-serif">who liked you?</span>
                    </motion.p>
                </motion.div>

                {/* How it Works - The Secret Mechanism */}
                <motion.div variants={itemVariants} className="w-full mb-16 px-4 relative">
                    {/* Floating Status Badge */}


                    <h2 className="text-xl md:text-2xl font-serif font-black text-white text-center mb-12 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-400 opacity-60">The Discovery Process</span>
                        Reveal the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">Secret Silence</span>
                    </h2>

                    <div className="relative max-w-[340px] mx-auto space-y-4">
                        {/* Connecting Line */}
                        <div className="absolute left-[34px] top-10 bottom-24 w-px bg-gradient-to-b from-pink-500/50 via-purple-500/50 to-transparent" />

                        {/* Step 1 */}
                        <div className="flex items-start gap-4 relative z-10 p-5 rounded-[1.8rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl transition-colors hover:bg-white/[0.05]">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-[#1A0536] border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                                <span className="text-[9px] font-black italic">01</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black text-pink-100 uppercase tracking-widest text-[9px] mb-1">Your Number was Logged</h3>
                                <p className="text-[12px] text-pink-50/60 leading-tight">Someone has safely stored their silent feelings for you on Izhaar.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-4 relative z-10 p-5 rounded-[1.8rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl transition-colors hover:bg-white/[0.05]">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-[#1A0536] border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                                <span className="text-[9px] font-black italic">02</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black text-purple-100 uppercase tracking-widest text-[9px] mb-1">Make Your Choice</h3>
                                <p className="text-[12px] text-pink-50/60 leading-tight">Add who <span className="text-pink-300 italic">you</span> secretly admire. Everything remains totally private.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-4 relative z-10 p-6 rounded-[2rem] bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/30 backdrop-blur-xl group">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-transform group-hover:scale-110">
                                <RomanticMark />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black text-white uppercase tracking-widest text-[9px] mb-1">The Reveal</h3>
                                <p className="text-[12px] text-white leading-tight font-bold underline decoration-pink-500/50 underline-offset-4">If the choice is mutual, the silence breaks and <span className="text-pink-200">the Secret is Unlocked!</span> ✨</p>
                            </div>
                        </div>

                        {/* PRIMARY FOCUSED ACTION */}
                        <div className="pt-8 flex flex-col items-center gap-5">
                            {/* Eye-leading Indicator */}
                            <motion.div
                                animate={{ y: [0, 8, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="text-pink-400/60"
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m7 13 5 5 5-5M7 6l5 5 5-5" />
                                </svg>
                            </motion.div>

                            <button
                                onClick={() => navigate('/entry')}
                                className="group relative w-full h-15 flex items-center justify-center gap-4 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-[length:200%_auto] animate-gradient-shift rounded-full shadow-[0_25px_50px_rgba(219,39,119,0.5)] overflow-hidden active:scale-[0.97] transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-shimmer pointer-events-none" />
                                <div className="flex flex-col items-center">
                                    <span className="text-[13px] font-black uppercase tracking-[0.3em] text-white">Find Who Liked You</span>
                                    <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/50">Reveal The Secret Connection</span>
                                </div>
                                <div className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/20 group-hover:translate-x-1 transition-transform">
                                    <span className="text-xl leading-none">➔</span>
                                </div>
                            </button>

                            <p className="text-[10px] text-pink-100/30 uppercase tracking-[0.2em] font-bold">100% Privacy Guaranteed</p>
                        </div>
                    </div>
                </motion.div>


                {/* Trust & Logic Section - "Why Choose This" */}
                <motion.div variants={itemVariants} className="w-full space-y-8 mt-10 mb-20 px-2">
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="h-px w-12 bg-pink-500/30" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Why Trust Izhaar?</span>
                    </div>

                    <div className="grid gap-4">
                        {[
                            {
                                icon: <CheckCircle2 className="text-green-400" size={20} />,
                                label: "100% Private",
                                desc: "Your crush is never notified. Secrets are only revealed when the feelings are mutual.",
                                color: "bg-green-500/10",
                                border: "border-green-500/20"
                            },
                            {
                                icon: <ShieldCheck className="text-purple-400" size={20} />,
                                label: "Verified Match",
                                desc: "We use phone numbers to ensure every match is a real person you already know.",
                                color: "bg-purple-500/10",
                                border: "border-purple-500/20"
                            },
                            {
                                icon: <LockIcon className="text-orange-400" size={20} />,
                                label: "Safe & Secure",
                                desc: "Your data is encrypted. No social media tracking, no public profiles. Just you two.",
                                color: "bg-orange-500/10",
                                border: "border-orange-500/20"
                            }
                        ].map((badge, idx) => (
                            <div key={idx} className={`p-5 rounded-[2rem] bg-white/[0.02] border ${badge.border} backdrop-blur-xl flex items-center gap-5 transition-all hover:bg-white/[0.04]`}>
                                <div className={`p-3 rounded-2xl ${badge.color} border border-white/5 shrink-0 shadow-inner`}>
                                    {badge.icon}
                                </div>
                                <div className="text-left space-y-1">
                                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{badge.label}</h4>
                                    <p className="text-[11px] text-white/50 leading-tight font-medium">{badge.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Info Box - Deep Glassmorphism */}
                <motion.div variants={itemVariants} className="w-full space-y-6 mb-16">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-pink-200/50 flex items-center justify-center gap-3">
                        <div className="h-px w-8 bg-pink-500/20" />
                        The Magic of Izhaar
                        <div className="h-px w-8 bg-pink-500/20" />
                    </h2>
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[50px] group-hover:bg-pink-500/20 transition-all duration-700" />
                        <p className="text-pink-50 text-[15px] leading-relaxed font-medium">
                            <span className="text-2xl block mb-2">✦</span>
                            Taking this simple step can turn a quiet hope into a beautiful reality.
                            Someone took the courage to find you now it's your turn to <span className="text-pink-300 underline decoration-pink-500/50 underline-offset-4">find the magic.</span> 💗
                        </p>
                    </div>
                </motion.div>

                {/* Testimonials - Fanned Cards look */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 w-full mb-20 relative">
                    {[
                        { name: "Priya A.", img: "priya", text: "It felt safe and exciting to see who liked me." },
                        { name: "Rahul K.", img: "rahul", text: "A fun and respectful way to connect with people." }
                    ].map((user, i) => (
                        <div key={i} className="group p-5 rounded-[2rem] bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col items-start text-left hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-1 shadow-xl">
                            <div className="flex items-center gap-4 w-full mb-4">
                                <div className="relative">
                                    <img src={`https://i.pravatar.cc/100?u=${user.img}`} className="w-12 h-12 rounded-full border-2 border-pink-500/40 object-cover" alt="" />
                                    <div className="absolute inset-0 rounded-full border border-white/20" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-pink-100 tracking-wider mb-1">{user.name}</p>
                                    <div className="flex gap-0.5 text-yellow-500/80">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="fill-current" />)}
                                    </div>
                                </div>
                            </div>
                            <p className="text-[11px] text-white/60 font-medium leading-relaxed italic">
                                "{user.text}"
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Bottom Pagination Dots */}
                <div className="flex gap-3 justify-center mb-10">
                    <div className="w-10 h-1 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]" />
                    <div className="w-2 h-1 rounded-full bg-white/20" />
                    <div className="w-2 h-1 rounded-full bg-white/20" />
                </div>
            </motion.main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-shift {
                    animation: gradient-shift 6s ease infinite;
                }

                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default IzhaarMoment;
