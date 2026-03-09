import React from 'react';
import { motion } from 'framer-motion';
import { TbZodiacAries, TbZodiacTaurus, TbZodiacGemini, TbZodiacCancer, TbZodiacLeo, TbZodiacVirgo, TbZodiacLibra, TbZodiacScorpio, TbZodiacSagittarius, TbZodiacCapricorn, TbZodiacAquarius, TbZodiacPisces } from 'react-icons/tb';
import { FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { getZodiacVibe } from '../../../utils/aiSuggestionService';

const signsList = [
    { name: 'Aries', symbol: <TbZodiacAries size={22} />, vibe: '93%', emoji: '❤️‍F', color: '#ff4d4d', glow: 'rgba(255, 77, 77, 0.6)', isUser: false, yOff: 40 },
    { name: 'Taurus', symbol: <TbZodiacTaurus size={22} />, vibe: '72%', emoji: '🌿', color: '#10b981', glow: 'rgba(16, 185, 129, 0.6)', isUser: false, yOff: -40 },
    { name: 'Gemini', symbol: <TbZodiacGemini size={22} />, vibe: '60%', emoji: '❤️‍🩹', color: '#facc15', glow: 'rgba(250, 204, 21, 0.6)', isUser: false, yOff: 40 },
    { name: 'Cancer', symbol: <TbZodiacCancer size={22} />, vibe: '85%', emoji: '🌙', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.6)', isUser: false, yOff: -40 },
    { name: 'Leo', symbol: <TbZodiacLeo size={22} />, vibe: '88%', emoji: '✨', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.6)', isUser: false, yOff: 40 },
    { name: 'Virgo', symbol: <TbZodiacVirgo size={22} />, vibe: '78%', emoji: '🍃', color: '#059669', glow: 'rgba(5, 150, 105, 0.6)', isUser: false, yOff: -40 },
    { name: 'Libra', symbol: <TbZodiacLibra size={22} />, vibe: '75%', emoji: '🦋', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)', isUser: false, yOff: 40 },
    { name: 'Scorpio', symbol: <TbZodiacScorpio size={22} />, vibe: '91%', emoji: '🥀', color: '#7c3aed', glow: 'rgba(124, 58, 237, 0.6)', isUser: false, yOff: -40 },
    { name: 'Sagittarius', symbol: <TbZodiacSagittarius size={22} />, vibe: '82%', emoji: '🏹', color: '#6366f1', glow: 'rgba(99, 102, 241, 0.6)', isUser: false, yOff: 40 },
    { name: 'Capricorn', symbol: <TbZodiacCapricorn size={22} />, vibe: '70%', emoji: '⚓', color: '#64748b', glow: 'rgba(100, 116, 139, 0.6)', isUser: false, yOff: -40 },
    { name: 'Aquarius', symbol: <TbZodiacAquarius size={22} />, vibe: '68%', emoji: '🫧', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.6)', isUser: false, yOff: 40 },
    { name: 'Pisces', symbol: <TbZodiacPisces size={22} />, vibe: '89%', emoji: '🐚', color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.6)', isUser: false, yOff: -40 },
];

const SignCircle = ({ sign }) => (
    <motion.div
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 relative group mx-auto"
        style={{
            background: `radial-gradient(120% 120% at 30% 20%, ${sign.color}30 0%, #0A0A0A 70%)`,
            boxShadow: sign.isUser ? `0 0 25px ${sign.glow}` : `0 5px 15px rgba(0,0,0,0.5)`
        }}
    >
        <div
            className="absolute inset-[2px] rounded-full opacity-30 blur-[1px]"
            style={{ border: `1px solid ${sign.color}` }}
        />
        <div className="z-10 transition-transform duration-500 group-hover:scale-110" style={{ color: sign.color, filter: `drop-shadow(0 0 8px ${sign.color})` }}>
            {sign.symbol}
        </div>
    </motion.div>
);

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

                    // We need to keep the alternating yOff pattern
                    const newOrdered = [
                        { ...matchedSign, isUser: true, yOff: signsList[0].yOff },
                        ...otherSigns.map((s, idx) => ({
                            ...s,
                            isUser: false,
                            yOff: signsList[idx + 1].yOff
                        }))
                    ];
                    setOrderedSigns(newOrdered);
                }
            }
        };

        fetchVibe();
    }, [user?.name, user?.fullname, user?.date_of_birth, user?.id]);

    const wavePath = React.useMemo(() => {
        if (!orderedSigns.length) return "";
        const horizontalSpacing = 100;
        const startX = 60;
        const centerY = 110;

        let pathData = `M ${startX - 150} ${centerY}`;

        orderedSigns.forEach((sign, i) => {
            const x = startX + i * horizontalSpacing;
            const y = centerY + sign.yOff;

            if (i === 0) {
                pathData += ` Q ${x - horizontalSpacing / 2} ${centerY} ${x} ${y}`;
            } else {
                const prevX = startX + (i - 1) * horizontalSpacing;
                const prevY = centerY + orderedSigns[i - 1].yOff;
                const cp1x = prevX + horizontalSpacing / 2;
                const cp2x = prevX + horizontalSpacing / 2;
                pathData += ` C ${cp1x} ${prevY} ${cp2x} ${y} ${x} ${y}`;
            }
        });

        const lastX = startX + (orderedSigns.length - 1) * horizontalSpacing;
        const lastY = centerY + orderedSigns[orderedSigns.length - 1].yOff;
        pathData += ` L ${lastX + 300} ${lastY}`;

        return pathData;
    }, [orderedSigns]);

    return (
        <section className="mx-4 mb-10 rounded-2xl border border-white/5 overflow-hidden pt-8 pb-4">
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

            {/* Vibe Container */}
            <div className="relative w-full overflow-hidden">
                <div className="relative w-full h-[240px] flex items-center gap-0 px-0 pt-0 pb-4 overflow-x-auto no-scrollbar scroll-smooth">

                    {/* Dashed Wave Line */}
                    <svg className="absolute inset-y-0 left-0 h-full pointer-events-none opacity-40 z-0" style={{ width: '400%' }}>
                        <path
                            d={wavePath}
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeDasharray="10 10"
                            strokeLinecap="round"
                            className="animate-marquee-path"
                        />
                    </svg>

                    {orderedSigns.map((sign, i) => {
                        const isEven = i % 2 === 0;
                        return (
                            <div
                                key={sign.name}
                                className="flex-shrink-0 flex flex-col items-center justify-center relative z-10 w-[100px] h-full"
                            >
                                {/* Alternating Layout based on index */}
                                {isEven ? (
                                    // Index 0, 2, 4... Name Below
                                    <>
                                        <div className="flex flex-col items-center" style={{ transform: `translateY(${sign.yOff}px)` }}>
                                            {sign.isUser && (
                                                <motion.div
                                                    initial={{ y: 5, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    className="absolute top-[-35px] left-1/2 -translate-x-1/2 z-20"
                                                >
                                                    <div className="px-2.5 py-1 bg-[#FF4AB3] rounded-md text-[8px] font-black uppercase tracking-wider text-white shadow-[0_5px_15px_rgba(236,72,145,0.4)] whitespace-nowrap">
                                                        Your Sign
                                                    </div>
                                                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#FF4AB3] mx-auto" />
                                                </motion.div>
                                            )}
                                            <SignCircle sign={sign} />
                                            <div className="mt-3 text-center">
                                                <h4 className={`text-[11px] font-bold ${sign.isUser ? 'text-white' : 'text-white/60'}`}>
                                                    {sign.name}
                                                </h4>
                                                <div className="flex items-center justify-center gap-1 mt-0.5">
                                                    <span className="text-[10px]">{sign.isUser ? userVibe.emoji : sign.emoji}</span>
                                                    <span className="text-[10px] font-black" style={{ color: sign.isUser ? '#FF4AB3' : sign.color }}>
                                                        {sign.isUser ? userVibe.vibe : sign.vibe}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Index 1, 3, 5... Name Above
                                    <>
                                        <div className="mb-3 text-center" style={{ transform: `translateY(${sign.yOff}px)` }}>
                                            <h4 className="text-[11px] font-bold text-white/60">
                                                {sign.name}
                                            </h4>
                                        </div>
                                        <div className="flex flex-col items-center" style={{ transform: `translateY(${sign.yOff}px)` }}>
                                            <SignCircle sign={sign} />
                                            <div className="mt-2 text-center">
                                                <span className="text-[10px] font-bold opacity-60" style={{ color: sign.color }}>
                                                    {sign.emoji} {sign.vibe}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    {/* Loading State Overlay */}
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
