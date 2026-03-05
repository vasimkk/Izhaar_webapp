import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { FaHeart, FaPhone, FaMapMarkerAlt, FaClock, FaMagic } from 'react-icons/fa';

const PlanDateModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(7);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        time: '06:30 PM',
        place: '',
        vibe: 'Coffee Date'
    });

    const timeSlots = ['12:00 PM', '06:30 PM', '07:00 PM', '08:30 PM'];
    const vibes = [
        { name: 'Coffee Date', icon: '☕' },
        { name: 'Movie Night', icon: '🎬' },
        { name: 'Sunset', icon: '🌅' }
    ];

    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-[380px] bg-[#1a1625] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-6 md:p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40"><IoChevronBack /></button>
                                <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>March 2027</h2>
                                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40"><IoChevronForward /></button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center mb-3">
                                {weekdays.map((d, i) => (
                                    <span key={`${d}-${i}`} className="text-[10px] font-bold text-white/20">{d}</span>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 md:gap-2">
                                {daysInMonth.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDate(day)}
                                        className={`h-9 w-9 md:h-10 md:w-10 rounded-xl flex items-center justify-center text-xs font-medium transition-all ${selectedDate === day
                                            ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,145,0.4)]'
                                            : 'text-white/40 hover:bg-white/5'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3 mt-6 justify-center opacity-40">
                                <div className="flex items-center gap-1.5 text-[8px] text-white"><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" /> Coffee</div>
                                <div className="flex items-center gap-1.5 text-[8px] text-white"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Movie</div>
                                <div className="flex items-center gap-1.5 text-[8px] text-white"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Sunset</div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full mt-6 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white text-sm font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
                            >
                                Plan on Mar {selectedDate}
                            </button>
                            <div className="h-10 md:hidden" /> {/* Height buffer for mobile nav */}
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            className="p-6 md:p-8 max-h-[75vh] md:max-h-[85vh] overflow-y-auto no-scrollbar"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    <IoChevronBack size={12} /> Back
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-white/20 hover:text-white transition-colors"
                                >
                                    <IoClose size={24} />
                                </button>
                            </div>

                            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Mar {selectedDate} • Plan the moment 🌹
                            </h2>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest leading-none">
                                        <FaHeart className="text-pink-500 text-[9px]" /> Partner's Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Partner name..."
                                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-all placeholder:text-white/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest leading-none">
                                        <FaPhone className="text-pink-500 text-[9px]" /> Mobile number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+91  "
                                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-all placeholder:text-white/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest leading-none">
                                        <FaClock className="text-pink-500 text-[9px]" /> Pick a time
                                    </label>
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                        {timeSlots.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setFormData({ ...formData, time: t })}
                                                className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${formData.time === t
                                                    ? 'bg-pink-500 text-white shadow-[0_4px_12px_rgba(236,72,145,0.4)]'
                                                    : 'bg-white/5 text-white/40 border border-white/10'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest leading-none">
                                        <FaMapMarkerAlt className="text-pink-500 text-[9px]" /> Meeting Point?
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Add a place..."
                                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-all placeholder:text-white/10"
                                    />
                                </div>

                                <div className="space-y-2 pb-2">
                                    <label className="text-[10px] font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest leading-none">
                                        <FaMagic className="text-pink-500 text-[9px]" /> Vibe
                                    </label>
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                        {vibes.map(v => (
                                            <button
                                                key={v.name}
                                                onClick={() => setFormData({ ...formData, vibe: v.name })}
                                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 ${formData.vibe === v.name
                                                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-pink-500/50 text-pink-500'
                                                    : 'bg-white/5 border-white/10 text-white/40'
                                                    }`}
                                            >
                                                <span className="text-sm">{v.icon}</span>
                                                <span className="text-[9px] font-bold whitespace-nowrap">{v.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-8 pb-14">
                                <button
                                    onClick={handleNext}
                                    className="flex-1 h-11 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white text-xs font-bold shadow-lg active:scale-95 transition-all"
                                >
                                    Confirm
                                </button>
                                <button className="flex-1 h-11 bg-white/5 border border-white/10 rounded-xl text-white/60 text-[10px] font-bold flex items-center justify-center gap-2">
                                    Plan With Izhaar 🔒
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-10 flex flex-col items-center text-center justify-center min-h-[350px]"
                        >
                            <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mb-6 relative">
                                <span className="text-4xl">⏰</span>
                                <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20 rounded-full" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Success!
                            </h2>
                            <p className="text-white/40 text-xs font-medium max-w-[200px]">
                                We'll remind you before your date on Mar {selectedDate} at {formData.time}. ✨
                            </p>

                            <button
                                onClick={onClose}
                                className="mt-10 w-full h-11 bg-white/5 border border-white/10 rounded-xl text-white/60 text-xs font-bold hover:text-white transition-all shadow-xl"
                            >
                                Done
                            </button>
                            <div className="h-4" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
                >
                    <IoClose size={24} />
                </button>
            </motion.div>
        </div>
    );
};

export default PlanDateModal;
