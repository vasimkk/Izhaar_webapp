import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import PlanDateModal from './PlanDateModal';
import api from '../../../utils/api';

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
    },
    {
        id: 5,
        title: 'Candle Dinner',
        icon: '🕯️',
        image: 'https://images.unsplash.com/photo-1555507036-ab1e4006aaeb?w=500&auto=format&fit=crop&q=60',
        color: 'from-yellow-400 to-orange-600',
        glow: 'shadow-yellow-500/20'
    }
];

const PlanADate = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editDate, setEditDate] = useState(null);
    const [plannedDates, setPlannedDates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPlannedDates = async () => {
        try {
            const res = await api.get('/planned-dates');
            setPlannedDates(res.data);
        } catch (err) {
            console.error('Error fetching planned dates:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to cancel this plan?')) return;
        try {
            await api.delete(`/planned-dates/${id}`);
            fetchPlannedDates();
        } catch (err) {
            console.error('Error deleting date:', err);
            alert('Failed to delete plan');
        }
    };

    const handleEdit = (date, e) => {
        e.stopPropagation();
        setEditDate(date);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchPlannedDates();
    }, []);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditDate(null);
        fetchPlannedDates(); // Refresh after planning
    };
    return (
        <section className="mx-4 mb-10 rounded-2xl  border border-white/5 overflow-hidden pt-8 pb-4">
            {/* Header */}
            <div className="w-full flex items-center mb-6 z-20 px-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center text-3xl filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">💖</div>
                    <div>
                        <h3 className="text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px' }}>
                            Plan a Date
                        </h3>
                        <p className="text-white/40 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '12px' }}>
                            Add a date or event to look forward to this month.
                        </p>
                    </div>
                </div>
            </div>

            {plannedDates.length > 0 && (
                <div className="px-4 mb-8">
                    <h4 className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
                        <FaCalendarAlt className="text-pink-500" /> Next Big Date
                    </h4>

                    {/* Featured Date Card */}
                    <div className="relative w-full p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-white/10 overflow-hidden mb-6 group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-pink-500/20 blur-3xl rounded-full" />
                        <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-purple-600/20 blur-3xl rounded-full" />

                        {/* Quick actions for featured card */}
                        <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <button
                                onClick={(e) => handleEdit(plannedDates[0], e)}
                                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white"
                            >
                                <span className="text-[10px]">✏️</span>
                            </button>
                            <button
                                onClick={(e) => handleDelete(plannedDates[0].id, e)}
                                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-red-400 hover:text-red-500"
                            >
                                <span className="text-[10px]">🗑️</span>
                            </button>
                        </div>

                        <div className="relative z-10 flex flex-col">
                            <div>
                                <div className="mb-1.5">
                                    <div className="mb-1 flex items-center gap-2">
                                        <motion.div
                                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                                        />
                                        <motion.span
                                            animate={{ opacity: [0.7, 1, 0.7] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black tracking-widest text-pink-500 uppercase"
                                        >
                                            UPCOMING
                                        </motion.span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/40 font-bold">
                                        <span className="text-[10px]">
                                            {new Date(plannedDates[0].date_time).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="opacity-30">•</span>
                                        <span className="text-[10px] uppercase tracking-wider">
                                            {plannedDates[0].time || new Date(plannedDates[0].date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {plannedDates[0].vibe}
                                    </h2>
                                    <div className="text-3xl flex items-center justify-center">
                                        {dateIdeas.find(idea => idea.title === plannedDates[0].vibe)?.icon || '✨'}
                                    </div>
                                </div>
                                <p className="text-white/60 text-xs font-medium flex items-center gap-2">
                                    with <span className="text-pink-400 font-bold">{plannedDates[0].partner_name}</span>
                                </p>

                            </div>


                        </div>
                    </div>


                </div>
            )}

            <div className="text-center z-40 w-full max-w-[320px] mx-auto flex flex-col items-center mb-8">
                <p className="text-white/50 mb-6 leading-relaxed px-4" style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                    fontSize: '12px'
                }}>
                    Create unforgettable memories. Add a special date or event to your calendar and keep the spark alive.
                </p>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 text-[#FF4AB3] font-bold text-[12px] tracking-widest uppercase group transition-all"
                >
                    Plan Now
                    <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1.5" />
                </button>
            </div>

            {/* Interactive Items Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-4 items-start">
                {dateIdeas.map((date) => (
                    <motion.div
                        key={date.id}
                        onClick={() => setIsModalOpen(true)}

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
                                {date.title === 'Candle Dinner' && (
                                    <div className="relative text-2xl">
                                        <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-400 blur-[2px]" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
                                        <motion.div animate={{ rotate: [-1, 1, -1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>{date.icon}</motion.div>
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
                onClose={handleModalClose}
                editDate={editDate}
            />
        </section>
    );
};

export default PlanADate;
