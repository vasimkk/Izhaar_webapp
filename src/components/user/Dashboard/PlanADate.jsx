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
                    <span className="text-xl">🌹</span>
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
                        {/* Circular Image/Icon Frame */}
                        <div className="relative mt-1">
                            <div
                                className="w-14 h-14 rounded-full border flex items-center justify-center relative overflow-hidden transition-transform duration-700 group-hover:scale-105"
                                style={{
                                    borderColor: date.id === 1 ? '#5d4037' : date.id === 2 ? '#c2185b' : '#ff7043',
                                    boxShadow: `0 0 15px ${date.id === 1 ? 'rgba(93, 64, 55, 0.15)' : date.id === 2 ? 'rgba(194, 24, 91, 0.15)' : 'rgba(255, 112, 67, 0.15)'}`
                                }}
                            >
                                {/* Internal Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30 pointer-events-none" />

                                {/* Icon or Image Simulation */}
                                <div className="z-10 text-xl transform transition-transform duration-500 group-hover:rotate-12">
                                    {date.icon}
                                </div>
                            </div>
                        </div>

                        {/* Title & Action Area */}
                        <div className="mb-1 w-full flex flex-col items-center">
                            <h3 className="text-white text-[13px] font-bold tracking-tight mb-1.5 leading-tight truncate w-full px-1">
                                {date.title}
                            </h3>
                            <button className="text-[#d81b60] text-[9px] font-bold flex items-center gap-1 hover:text-[#f06292] transition-colors tracking-wide">
                                Schedule <span className="text-xs">→</span>
                            </button>
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
