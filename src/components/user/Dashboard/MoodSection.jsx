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
        <section className="px-5 pt-2 pb-4 flex flex-col items-center max-w-md mx-auto">
            {/* Mood Question */}
            <div className="text-center mb-4">
                <h1 className="text-white mb-0.5 tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '20px' }}>
                    How are you feeling today? {selectedMood.icon}
                </h1>
                <p className="text-white/30 text-[10px] font-medium tracking-tight">
                    Your mood helps us personalize Izhaar.
                </p>
            </div>

            {/* Mood Selector Slider */}
            <div className="w-full flex justify-between items-center gap-2 mb-4 px-1 overflow-x-auto no-scrollbar py-1">
                {moods.map((mood) => {
                    const isActive = selectedMood.id === mood.id;
                    return (
                        <motion.button
                            key={mood.id}
                            onClick={() => setSelectedMood(mood)}
                            initial={false}
                            animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                            className={`relative flex-shrink-0 flex flex-col items-center justify-center transition-all duration-300 ${isActive
                                ? 'w-[64px] h-[72px] border border-pink-500/40'
                                : 'w-[50px] h-[54px] border border-white/5 bg-white/5'
                                } rounded-2xl overflow-hidden group`}
                            style={isActive ? {
                                background: 'rgba(255, 255, 255, 0.03)',
                                boxShadow: '0 0 15px rgba(236, 72, 145, 0.12)'
                            } : {}}
                        >
                            <span className={`text-lg mb-0 filter transition-transform duration-500 ${isActive ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>
                                {mood.icon}
                            </span>
                            <AnimatePresence>
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 3 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 2 }}
                                        className="text-[7px] font-bold text-white uppercase tracking-wider"
                                    >
                                        {mood.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            {/* Insight Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedMood.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 relative overflow-hidden"
                    style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    <div className={`w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br ${selectedMood.color} flex items-center justify-center text-base shadow-lg ${selectedMood.glow}`}>
                        {selectedMood.icon}
                    </div>
                    <div className="flex-1 pr-1">
                        <p className="text-white/70 text-[10px] font-medium leading-tight tracking-tight">
                            {selectedMood.quote}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </section>
    );
};

export default MoodSection;
