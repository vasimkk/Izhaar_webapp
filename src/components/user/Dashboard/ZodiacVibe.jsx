import React from 'react';
import { motion } from 'framer-motion';
import { TbZodiacAries, TbZodiacTaurus, TbZodiacGemini, TbZodiacCancer, TbZodiacLeo, TbZodiacVirgo, TbZodiacLibra, TbZodiacScorpio, TbZodiacSagittarius, TbZodiacCapricorn, TbZodiacAquarius, TbZodiacPisces } from 'react-icons/tb';
import { FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { getZodiacVibe } from '../../../utils/aiSuggestionService';

const signsList = [
    { name: 'Aries', symbol: <TbZodiacAries size={24} />, vibe: '93%', emoji: '❤️‍🔥', color: '#ff4d4d', glow: 'rgba(255, 77, 77, 0.6)', isUser: false, yOff: 0 },
    { name: 'Taurus', symbol: <TbZodiacTaurus size={24} />, vibe: '72%', emoji: '🌿', color: '#10b981', glow: 'rgba(16, 185, 129, 0.6)', isUser: false, yOff: 40 },
    { name: 'Gemini', symbol: <TbZodiacGemini size={24} />, vibe: '60%', emoji: '❤️‍🩹', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', isUser: false, yOff: -10 },
    { name: 'Cancer', symbol: <TbZodiacCancer size={24} />, vibe: '85%', emoji: '🌙', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.6)', isUser: false, yOff: 30 },
    { name: 'Leo', symbol: <TbZodiacLeo size={24} />, vibe: '88%', emoji: '✨', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.6)', isUser: false, yOff: -20 },
    { name: 'Virgo', symbol: <TbZodiacVirgo size={24} />, vibe: '78%', emoji: '🍃', color: '#059669', glow: 'rgba(5, 150, 105, 0.6)', isUser: false, yOff: 25 },
    { name: 'Libra', symbol: <TbZodiacLibra size={24} />, vibe: '75%', emoji: '🦋', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)', isUser: false, yOff: 5 },
    { name: 'Scorpio', symbol: <TbZodiacScorpio size={24} />, vibe: '91%', emoji: '🥀', color: '#7c3aed', glow: 'rgba(124, 58, 237, 0.6)', isUser: false, yOff: 35 },
    { name: 'Sagittarius', symbol: <TbZodiacSagittarius size={24} />, vibe: '82%', emoji: '🏹', color: '#6366f1', glow: 'rgba(99, 102, 241, 0.6)', isUser: false, yOff: -15 },
    { name: 'Capricorn', symbol: <TbZodiacCapricorn size={24} />, vibe: '70%', emoji: '⚓', color: '#64748b', glow: 'rgba(100, 116, 139, 0.6)', isUser: false, yOff: 45 },
    { name: 'Aquarius', symbol: <TbZodiacAquarius size={24} />, vibe: '68%', emoji: '🫧', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.6)', isUser: false, yOff: -5 },
    { name: 'Pisces', symbol: <TbZodiacPisces size={24} />, vibe: '89%', emoji: '🐚', color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.6)', isUser: false, yOff: 15 },
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
        <section className="px-6 mb-12 max-w-lg mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-1">
                <div className="flex items-center gap-2">
                    <span className="text-xl">💫</span>
                    <h2 className="text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '20px' }}>
                        Today's Love Vibe
                    </h2>
                </div>
                <button className="text-purple-400 text-sm font-bold flex items-center gap-1.5 hover:text-purple-300 transition-colors">
                    All Signs <FaArrowRight size={10} />
                </button>
            </div>

            {/* Vibe Card */}
            <div className="relative w-full h-64 flex items-center gap-12 px-6 pt-16 pb-6 overflow-x-auto no-scrollbar scroll-smooth">

                {/* Dashed Wave Line */}
                <svg className="absolute inset-y-0 left-0 h-full pointer-events-none opacity-40" style={{ width: '200%' }} preserveAspectRatio="none">
                    <path
                        d="M -20 100 Q 80 50 180 110 T 380 90 T 580 120 T 780 100 T 980 130 T 1180 90 T 1380 110"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="8 6"
                        className="animate-marquee-path"
                    />
                </svg>

                {orderedSigns.map((sign, i) => (
                    <div
                        key={sign.name}
                        className="flex-shrink-0 flex flex-col items-center gap-3 relative z-10"
                        style={{ transform: `translateY(${sign.yOff}px)` }}
                    >
                        {/* User Badge */}
                        {sign.isUser && (
                            <div className="absolute top-[-35px] whitespace-nowrap px-3 py-1 bg-pink-500 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-lg">
                                Your Sign
                            </div>
                        )}

                        {/* Sign Circle */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500"
                            style={{
                                borderColor: sign.color,
                                color: sign.color,
                                boxShadow: `0 0 25px ${sign.glow}`,
                                background: `radial-gradient(circle at center, ${sign.color}10 0%, transparent 70%)`
                            }}
                        >
                            {sign.symbol}
                        </motion.div>

                        {/* Sign Label */}
                        <div className="text-center">
                            <span className="text-xs font-bold text-white/80 tracking-wide block mb-0.5">
                                {sign.name}
                            </span>
                            {sign.isUser ? (
                                <span className="text-[10px] font-black tracking-tight" style={{ color: sign.color }}>
                                    {userVibe.emoji} {userVibe.vibe}
                                </span>
                            ) : sign.vibe && (
                                <span className="text-[10px] font-black tracking-tight" style={{ color: sign.color }}>
                                    {sign.emoji} {sign.vibe}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Loading State Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-4xl mb-4"
                        >
                            🔮
                        </motion.div>
                        <div className="text-center">
                            <p className="text-white font-bold text-sm tracking-widest uppercase mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Aligning Stars
                            </p>
                            <div className="flex items-center justify-center gap-1">
                                <span className="text-pink-400 text-[10px] font-medium animate-pulse">Checking your vibe</span>
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 1] }}
                                    className="text-pink-400 text-[10px]"
                                >
                                    ...
                                </motion.span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subtle Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-600/10 blur-[60px] rounded-full" />
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes marquee-path {
                    0% { stroke-dashoffset: 28; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-marquee-path {
                    animation: marquee-path 2s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default ZodiacVibe;
