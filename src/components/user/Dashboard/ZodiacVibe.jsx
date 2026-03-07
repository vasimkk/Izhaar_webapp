import React from 'react';
import { motion } from 'framer-motion';
import { TbZodiacAries, TbZodiacTaurus, TbZodiacGemini, TbZodiacCancer, TbZodiacLeo, TbZodiacVirgo, TbZodiacLibra, TbZodiacScorpio, TbZodiacSagittarius, TbZodiacCapricorn, TbZodiacAquarius, TbZodiacPisces } from 'react-icons/tb';
import { FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { getZodiacVibe } from '../../../utils/aiSuggestionService';

const signsList = [
    { name: 'Aries', symbol: <TbZodiacAries size={20} />, vibe: '93%', emoji: '❤️‍🔥', color: '#ff4d4d', glow: 'rgba(255, 77, 77, 0.6)', isUser: false, yOff: 0 },
    { name: 'Taurus', symbol: <TbZodiacTaurus size={20} />, vibe: '72%', emoji: '🌿', color: '#10b981', glow: 'rgba(16, 185, 129, 0.6)', isUser: false, yOff: 40 },
    { name: 'Gemini', symbol: <TbZodiacGemini size={20} />, vibe: '60%', emoji: '❤️‍🩹', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', isUser: false, yOff: -10 },
    { name: 'Cancer', symbol: <TbZodiacCancer size={20} />, vibe: '85%', emoji: '🌙', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.6)', isUser: false, yOff: 30 },
    { name: 'Leo', symbol: <TbZodiacLeo size={20} />, vibe: '88%', emoji: '✨', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.6)', isUser: false, yOff: -20 },
    { name: 'Virgo', symbol: <TbZodiacVirgo size={20} />, vibe: '78%', emoji: '🍃', color: '#059669', glow: 'rgba(5, 150, 105, 0.6)', isUser: false, yOff: 25 },
    { name: 'Libra', symbol: <TbZodiacLibra size={20} />, vibe: '75%', emoji: '🦋', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)', isUser: false, yOff: 5 },
    { name: 'Scorpio', symbol: <TbZodiacScorpio size={20} />, vibe: '91%', emoji: '🥀', color: '#7c3aed', glow: 'rgba(124, 58, 237, 0.6)', isUser: false, yOff: 35 },
    { name: 'Sagittarius', symbol: <TbZodiacSagittarius size={20} />, vibe: '82%', emoji: '🏹', color: '#6366f1', glow: 'rgba(99, 102, 241, 0.6)', isUser: false, yOff: -15 },
    { name: 'Capricorn', symbol: <TbZodiacCapricorn size={20} />, vibe: '70%', emoji: '⚓', color: '#64748b', glow: 'rgba(100, 116, 139, 0.6)', isUser: false, yOff: 45 },
    { name: 'Aquarius', symbol: <TbZodiacAquarius size={20} />, vibe: '68%', emoji: '🫧', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.6)', isUser: false, yOff: -5 },
    { name: 'Pisces', symbol: <TbZodiacPisces size={20} />, vibe: '89%', emoji: '🐚', color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.6)', isUser: false, yOff: 15 },
];

const ZodiacVibe = () => {
    const { user } = useAuth();
    const [userVibe, setUserVibe] = React.useState({ vibe: '...', emoji: '💫', userSign: null });
    const [orderedSigns, setOrderedSigns] = React.useState(signsList);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchVibe = async () => {
            const displayName = user?.name || user?.fullname;
            if (!displayName) return;

            const today = new Date().toDateString();
            const cacheKey = `zodiac_vibe_${user.id}_${today}`;
            const cachedData = sessionStorage.getItem(cacheKey);

            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData);
                    applyVibeData(parsed);
                    return;
                } catch (e) {
                    sessionStorage.removeItem(cacheKey);
                }
            }

            setIsLoading(true);
            const data = await getZodiacVibe(displayName, user.id, user.date_of_birth);
            if (data) {
                sessionStorage.setItem(cacheKey, JSON.stringify(data));
                applyVibeData(data);
            }
            setIsLoading(false);
        };

        const applyVibeData = (data) => {
            setUserVibe(data);
            if (data.userSign) {
                const userSignName = data.userSign.trim().toLowerCase();
                const matchedSign = signsList.find(s => s.name.toLowerCase() === userSignName);

                if (matchedSign) {
                    const otherSigns = signsList.filter(s => s.name.toLowerCase() !== userSignName);
                    const newOrdered = [
                        { ...matchedSign, isUser: true },
                        ...otherSigns.map(s => ({ ...s, isUser: false }))
                    ];
                    setOrderedSigns(newOrdered);
                }
            }
        };

        fetchVibe();
    }, [user?.name, user?.fullname, user?.date_of_birth, user?.id]);

    return (
        <section className="w-full mb-10 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center text-3xl">✨</div>
                    <div>
                        <h3 className="text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px' }}>
                            Today's Love Vibe
                        </h3>
                        <p className="text-white/40 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '12px' }}>
                            Discover today's love vibe.
                        </p>
                    </div>
                </div>
                <button className="text-[10px] font-bold text-pink-400/80 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border-white/5 hover:bg-white/10 transition-all">
                    Show All <FaArrowRight size={8} />
                </button>
            </div>

            {/* Vibe Container - Completely Transparent & Floating */}
            <div className="relative w-full overflow-hidden">
                <div className="relative w-full h-[160px] flex items-center gap-6 px-4 pt-0 pb-4 overflow-x-auto no-scrollbar scroll-smooth">

                    {/* Dashed Wave Line - More Premium High-Def */}
                    <svg className="absolute inset-y-0 left-0 h-full pointer-events-none opacity-20" style={{ width: '250%' }} preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#EC4899" />
                                <stop offset="50%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M -50 100 Q 100 40 250 110 T 550 90 T 850 120 T 1150 100 T 1450 130 T 1750 90 T 2050 110"
                            fill="none"
                            stroke="url(#waveGradient)"
                            strokeWidth="3"
                            strokeDasharray="12 8"
                            strokeLinecap="round"
                            className="animate-marquee-path"
                        />
                    </svg>

                    {orderedSigns.map((sign, i) => (
                        <div
                            key={sign.name}
                            className="flex-shrink-0 flex flex-col items-center gap-2 relative z-10"
                            style={{ transform: `translateY(${sign.yOff * 0.6}px)` }} // Reduced y-offset for cleaner look
                        >
                            {/* User Badge - Premium Pin */}
                            {sign.isUser && (
                                <motion.div
                                    initial={{ y: 5, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="absolute top-[-30px] z-20"
                                >
                                    <div className="px-2.5 py-1 bg-pink-500 rounded-lg text-[7px] font-black uppercase tracking-wider text-white shadow-[0_5px_15px_rgba(236,72,145,0.4)] flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                        MINE
                                    </div>
                                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-pink-500 mx-auto" />
                                </motion.div>
                            )}

                            {/* Sign Circle - Elevated Aesthetic */}
                            <motion.div
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-[3rem] h-[3rem] rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 relative group"
                                style={{
                                    background: `radial-gradient(120% 120% at 30% 20%, ${sign.color}30 0%, #0A0A0A 70%)`,
                                    boxShadow: sign.isUser ? `0 10px 30px ${sign.glow}` : `0 5px 15px rgba(0,0,0,0.5)`
                                }}
                            >
                                {/* Active Inner Glow */}
                                <div
                                    className="absolute inset-[2px] rounded-full opacity-30 blur-[1px]"
                                    style={{ border: `1px solid ${sign.color}` }}
                                />

                                <div className="z-10 transition-transform duration-500 group-hover:scale-110" style={{ color: sign.color, filter: `drop-shadow(0 0 8px ${sign.color})` }}>
                                    {sign.symbol}
                                </div>
                            </motion.div>

                            <div className="text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                <span className={`text-[10px] tracking-wide block font-bold transition-colors ${sign.isUser ? 'text-white' : 'text-white/40'}`}>
                                    {sign.name}
                                </span>
                                {sign.isUser ? (
                                    <div className="flex items-center justify-center gap-1 bg-black/40 px-2 py-0.5 rounded-full border border-white/5 mt-0.5">
                                        <span className="text-[10px] leading-none mb-0.5">{userVibe.emoji}</span>
                                        <span className="text-[9px] font-bold tracking-tight text-pink-400">
                                            {userVibe.vibe}
                                        </span>
                                    </div>
                                ) : sign.vibe && (
                                    <span className="text-[9px] font-medium tracking-tight opacity-60" style={{ color: sign.color }}>
                                        {sign.emoji} {sign.vibe}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading State Overlay - Premium Blur */}
                    {isLoading && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl transition-all duration-300">
                            <motion.div
                                animate={{
                                    scale: [1, 1.25, 1],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="text-5xl mb-6 drop-shadow-[0_0_20px_rgba(236,72,145,0.5)]"
                            >
                                🔮
                            </motion.div>
                            <div className="text-center">
                                <p className="text-white tracking-[0.15em] uppercase mb-1.5" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '14px' }}>
                                    Syncing Stars
                                </p>
                                <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden mx-auto">
                                    <motion.div
                                        animate={{ x: [-100, 100] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="h-full w-1/2 bg-gradient-to-r from-pink-500 to-purple-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Aesthetic Background Accents Removed for Seamless Look */}
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes marquee-path {
                    0% { stroke-dashoffset: 40; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-marquee-path {
                    animation: marquee-path 3s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default ZodiacVibe;
