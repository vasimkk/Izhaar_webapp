import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaArrowRight } from 'react-icons/fa';
import PlanDateModal from './PlanDateModal';

const dateIdeas = [
    {
        id: 1,
        title: 'Coffee Date',
        icon: '☕',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60',
        color: 'from-orange-400 to-amber-700',
        glow: 'shadow-orange-500/20'
    },
    {
        id: 2,
        title: 'Movie Night',
        icon: '🎬',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60',
        color: 'from-purple-500 to-indigo-700',
        glow: 'shadow-purple-500/20'
    },
    {
        id: 3,
        title: 'Sunset View',
        icon: '🌅',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60',
        color: 'from-rose-400 to-orange-600',
        glow: 'shadow-rose-500/20'
    },
    {
        id: 4,
        title: 'Dinner Date',
        icon: '🍷',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60',
        color: 'from-red-500 to-rose-700',
        glow: 'shadow-red-500/20'
    }
];

const PlanADate = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="w-full mb-10 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 px-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <h2 className="dashboard-head-text">
                        Plan a Date
                    </h2>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-7 h-7 rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] flex items-center justify-center text-white shadow-[0_0_15px_rgba(236,72,145,0.4)] transition-all hover:scale-110 active:scale-95"
                >
                    <FaPlus size={9} />
                </button>
            </div>

            {/* Interactive Items Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-4 items-start">
                {dateIdeas.map((date) => (
                    <motion.div
                        key={date.id}
                        onClick={() => setIsModalOpen(true)}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0 flex flex-col items-center gap-2 text-center cursor-pointer min-w-[75px]"
                    >
                        {/* Floating Icon Base */}
                        <div className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group">
                            {/* Inner Circle - Glassmorphic Style */}
                            <div className="absolute inset-[2px] rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all group-hover:border-white/20 group-hover:bg-white/10" />

                            {/* Background Glow Overlay */}
                            <div className={`absolute inset-4 blur-2xl opacity-20 bg-gradient-to-br ${date.color} transition-opacity group-hover:opacity-40`} />

                            <div className="z-10 transition-transform duration-500 group-hover:scale-110">
                                {/* (Icons remain the same) */}
                                {date.title === 'Coffee Date' && (
                                    <div className="relative text-2xl">
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 blur-[1.5px]">
                                            {[0, 1, 2].map((i) => (
                                                <motion.span
                                                    key={i}
                                                    initial={{ y: 0, opacity: 0, scale: 0.5 }}
                                                    animate={{
                                                        y: -20,
                                                        opacity: [0, 0.6, 0],
                                                        scale: [0.5, 1.4, 0.8],
                                                        x: [0, i % 2 === 0 ? 4 : -4, 0]
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
                                                    className="w-0.5 h-3 bg-white/40 rounded-full inline-block"
                                                />
                                            ))}
                                        </div>
                                        <span className="relative z-10">{date.icon}</span>
                                    </div>
                                )}
                                {date.title === 'Movie Night' && (
                                    <motion.div className="text-2xl" animate={{ rotate: [0, -5, 0, 5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                                        {date.icon}
                                    </motion.div>
                                )}
                                {date.title === 'Sunset View' && (
                                    <div className="relative text-2xl">
                                        <motion.div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 4, repeat: Infinity }} />
                                        <motion.div animate={{ y: [1, -1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>{date.icon}</motion.div>
                                    </div>
                                )}
                                {date.title === 'Dinner Date' && (
                                    <div className="relative text-2xl">
                                        <motion.div className="absolute -top-1 -left-1" animate={{ scale: [0, 1, 0], rotate: 360, opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}><span className="text-[10px]">✨</span></motion.div>
                                        <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>{date.icon}</motion.div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Text Label */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-white/80 text-[11px] font-bold tracking-wide uppercase transition-colors group-hover:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                {date.title}
                            </h3>
                            <span className="text-[8px] font-black tracking-widest text-pink-500/50 uppercase scale-90">Plan</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Date Planning Modal Flow */}
            <PlanDateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
};

export default PlanADate;
