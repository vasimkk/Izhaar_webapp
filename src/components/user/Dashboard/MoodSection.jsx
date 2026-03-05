import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const moods = [
    { id: 'energetic', icon: '⚡', label: 'Energetic', color: 'from-amber-400 to-orange-600', glow: 'shadow-orange-500/20', quote: "The world is yours today — let's make it legendary! ⚡" },
    { id: 'thoughtful', icon: '💭', label: 'Thoughtful', color: 'from-blue-400 to-indigo-600', glow: 'shadow-blue-500/20', quote: "Deep thoughts lead to beautiful destinations. 🌌" },
    { id: 'in-love', icon: '💖', label: 'In Love', color: 'from-pink-500 to-rose-600', glow: 'shadow-pink-500/40', quote: "Love is in the air — and it looks good on you 💖" },
    { id: 'celebrating', icon: '🎉', label: 'Party', color: 'from-purple-500 to-indigo-600', glow: 'shadow-purple-500/20', quote: "Every moment is a reason to celebrate! 🎊" },
    { id: 'romantic', icon: '🌹', label: 'Romantic', color: 'from-red-500 to-rose-700', glow: 'shadow-red-500/20', quote: "A little romance makes everything better. ✨" },
];

const MoodSection = ({ user }) => {
    const [selectedMood, setSelectedMood] = useState(moods[2]); // Default to 'In Love'

    return (
        <section className="px-5 pt-2 pb-4 flex flex-col items-center max-w-md mx-auto overflow-hidden">
            {/* Mood Question */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-5"
            >
                <h1 className="text-white mb-0.5 tracking-tight flex items-center justify-center gap-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '20px' }}>
                    How are you feeling today?
                    <motion.span
                        key={selectedMood.icon}
                        initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                        {selectedMood.icon}
                    </motion.span>
                </h1>
                <p className="text-white/30 text-[10px] font-medium tracking-tight">
                    Your mood helps us personalize Izhaar.
                </p>
            </motion.div>

            {/* Mood Selector Slider */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex justify-between items-center gap-2 mb-6 px-1 overflow-x-auto no-scrollbar py-2"
            >
                {moods.map((mood, index) => {
                    const isActive = selectedMood.id === mood.id;
                    return (
                        <motion.button
                            key={mood.id}
                            onClick={() => setSelectedMood(mood)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative flex-shrink-0 flex flex-col items-center justify-center transition-all duration-500 ${isActive
                                ? 'w-[68px] h-[76px] border border-pink-500/50'
                                : 'w-[54px] h-[58px] border border-white/5 bg-white/5 shadow-inner'
                                } rounded-2xl overflow-hidden group`}
                            style={isActive ? {
                                background: 'rgba(255, 255, 255, 0.05)',
                                boxShadow: '0 12px 24px -8px rgba(236, 72, 145, 0.3)'
                            } : {}}
                        >
                            {/* Animated Background Glow for Active */}
                            {isActive && (
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-10`}
                                    animate={{
                                        opacity: [0.05, 0.15, 0.05],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                            )}

                            <motion.span
                                className={`text-2xl mb-1 filter transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100'}`}
                                animate={isActive ? {
                                    y: [0, -4, 0],
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {mood.icon}
                            </motion.span>

                            <AnimatePresence>
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.8 }}
                                        className="text-[8px] font-black text-white uppercase tracking-[0.1em]"
                                    >
                                        {mood.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Insight Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedMood.id}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    className="w-full p-4 rounded-2xl border border-white/10 flex items-center gap-4 relative overflow-hidden group/card"
                    style={{
                        background: 'rgba(26, 22, 37, 0.6)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5)'
                    }}
                >
                    {/* Interior Background Magic */}
                    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${selectedMood.color} opacity-[0.03] blur-2xl group-hover/card:opacity-[0.08] transition-opacity duration-700`} />

                    <motion.div
                        initial={{ rotate: -20, scale: 0.5 }}
                        animate={{ rotate: 0, scale: 1 }}
                        className={`w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br ${selectedMood.color} flex items-center justify-center text-xl shadow-xl ${selectedMood.glow} relative z-10`}
                    >
                        {selectedMood.icon}
                        <div className="absolute inset-0 bg-white opacity-20 rounded-xl animate-pulse" />
                    </motion.div>

                    <div className="flex-1 relative z-10">
                        <motion.p
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-white/80 text-[11px] font-semibold leading-relaxed tracking-tight italic"
                        >
                            "{selectedMood.quote}"
                        </motion.p>
                    </div>

                    {/* Interactive Sparkle */}
                    <motion.div
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 0.5],
                            rotate: 45
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] opacity-20"
                    >
                        ✨
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </section>
    );
};

export default MoodSection;
