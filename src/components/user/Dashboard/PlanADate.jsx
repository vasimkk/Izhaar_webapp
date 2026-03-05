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
        <section className="px-5 mb-10 max-w-md mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-1">
                <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <h2 className="text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '20px' }}>
                        Plan a Date
                    </h2>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-9 h-9 rounded-full bg-[#1a1625]/60 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/10 transition-all"
                >
                    <FaPlus size={12} className="opacity-60" />
                </button>
            </div>

            {/* Categories Horizontal Scroll */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 px-1">
                {dateIdeas.map((date) => (
                    <motion.div
                        key={date.id}
                        onClick={() => setIsModalOpen(true)}
                        whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                        className="flex-shrink-0 w-[calc((100%/3)-12px)] min-w-[105px] h-[150px] bg-[#1a1625]/60 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-between text-center transition-all duration-500 backdrop-blur-sm cursor-pointer"
                    >
                        {/* Floating Icon Container */}
                        <div className="relative mt-2 mb-2 h-16 flex items-center justify-center group">
                            {/* Background Glow */}
                            <div className={`absolute inset-0 blur-3xl opacity-20 bg-gradient-to-br ${date.color}`} />

                            <div className="z-10 transition-transform duration-500 group-hover:scale-110">
                                {date.title === 'Coffee Date' && (
                                    <div className="relative text-3xl">
                                        {/* Steam Particles */}
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
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: i * 0.6,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="w-1 h-4 bg-white/40 rounded-full inline-block"
                                                />
                                            ))}
                                        </div>
                                        <span className="relative z-10">{date.icon}</span>
                                    </div>
                                )}

                                {date.title === 'Movie Night' && (
                                    <motion.div
                                        className="text-3xl"
                                        animate={{
                                            rotate: [0, -5, 0, 5, 0],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <div className="relative">
                                            <motion.div
                                                className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full blur-[2px]"
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            />
                                            {date.icon}
                                        </div>
                                    </motion.div>
                                )}

                                {date.title === 'Sunset View' && (
                                    <div className="relative text-3xl">
                                        <motion.div
                                            className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full"
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                        />
                                        <motion.div
                                            animate={{ y: [2, -2, 2] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            {date.icon}
                                        </motion.div>
                                    </div>
                                )}

                                {date.title === 'Dinner Date' && (
                                    <div className="relative text-3xl">
                                        <motion.div
                                            className="absolute -top-1 -left-1"
                                            animate={{
                                                scale: [0, 1, 0],
                                                rotate: 360,
                                                opacity: [0, 1, 0]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <span className="text-[10px]">✨</span>
                                        </motion.div>
                                        <motion.div
                                            animate={{ rotate: [-2, 2, -2] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            {date.icon}
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title & Action Area */}
                        <div className="mb-2 w-full flex flex-col items-center">
                            <h3 className="text-white text-[14px] font-bold tracking-tight mb-1.5 leading-tight truncate w-full px-1">
                                {date.title}
                            </h3>
                            <div className="text-pink-500/60 text-[10px] uppercase font-black flex items-center gap-1 group-hover:text-pink-400 transition-colors tracking-tighter">
                                Tap to Schedule
                            </div>
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
