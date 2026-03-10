import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { FaHeart, FaPhone, FaMapMarkerAlt, FaClock, FaMagic, FaBell } from 'react-icons/fa';
import api from '../../../utils/api';

const PlanDateModal = ({ isOpen, onClose, editDate }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [customReminder, setCustomReminder] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        time: '06:30 PM',
        place: '',
        vibe: 'Coffee Date'
    });

    useEffect(() => {
        if (editDate) {
            const dt = new Date(editDate.date_time);
            setFormData({
                name: editDate.partner_name,
                phone: editDate.partner_mobile,
                time: editDate.time || dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                place: editDate.place,
                vibe: editDate.vibe
            });
            setSelectedDate(dt.getDate());
            setViewDate(dt);
        } else {
            // Reset to defaults
            setFormData({
                name: '',
                phone: '',
                time: '06:30 PM',
                place: '',
                vibe: 'Coffee Date'
            });
            setSelectedDate(new Date().getDate());
            setViewDate(new Date());
        }
    }, [editDate, isOpen]);

    const timeSlots = ['12:00 PM', '06:30 PM', '07:00 PM', '08:30 PM'];
    const vibes = [
        { name: 'Coffee Date', icon: '☕' },
        { name: 'Movie Night', icon: '🎬' },
        { name: 'Sunset', icon: '🌅' }
    ];

    const [viewDate, setViewDate] = useState(new Date());

    // Calendar Logic
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const daysInMonthCount = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const days = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));
    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));

    const currentMonthName = viewDate.toLocaleString('default', { month: 'long' });
    const currentMonthShort = viewDate.toLocaleString('default', { month: 'short' });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Combine date and time
            const dateStr = `${currentYear}-${currentMonth + 1}-${selectedDate}`;
            // Convert "06:30 PM" to 24h format for Date constructor
            const [timePart, modifier] = formData.time.split(' ');
            let [hours, minutes] = timePart.split(':');
            if (hours === '12' && modifier === 'AM') hours = '00';
            else if (modifier === 'PM' && hours !== '12') hours = (parseInt(hours, 10) + 12).toString().padStart(2, '0');
            else hours = hours.padStart(2, '0');

            const dateTime = new Date(`${dateStr} ${hours}:${minutes}:00`);

            const reminders = [];
            if (customReminder) {
                reminders.push({ time: customReminder });
            }

            const payload = {
                partner_name: formData.name,
                partner_mobile: formData.phone,
                date_time: dateTime.toISOString().slice(0, 19).replace('T', ' '),
                place: formData.place,
                vibe: formData.vibe,
                reminders
            };

            if (editDate) {
                await api.put(`/planned-dates/${editDate.id}`, payload);
            } else {
                await api.post('/plan-date', payload);
            }

            setStep(3);
        } catch (err) {
            console.error('Error planning date:', err);
            setError('Failed to plan date. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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
                className="relative w-full max-w-[380px] bg-[#1a1625] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
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
                                <button
                                    onClick={prevMonth}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-colors"
                                >
                                    <IoChevronBack />
                                </button>
                                <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {currentMonthName} {currentYear}
                                </h2>
                                <button
                                    onClick={nextMonth}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-colors"
                                >
                                    <IoChevronForward />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center mb-3">
                                {weekdays.map((d, i) => (
                                    <span key={`${d}-${i}`} className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">{d}</span>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 md:gap-2">
                                {blanks.map(blank => (
                                    <div key={`blank-${blank}`} className="h-9 w-9 md:h-10 md:w-10" />
                                ))}
                                {days.map(day => {
                                    const isSelected = selectedDate === day;
                                    const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;

                                    return (
                                        <button
                                            key={day}
                                            onClick={() => setSelectedDate(day)}
                                            className={`h-9 w-9 md:h-10 md:w-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all relative overflow-hidden group ${isSelected
                                                ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,145,0.4)]'
                                                : 'text-white/40 hover:bg-white/5'
                                                }`}
                                        >
                                            <span className="relative z-10">{day}</span>
                                            {isToday && !isSelected && (
                                                <div className="absolute bottom-1 w-1 h-1 bg-pink-500 rounded-full" />
                                            )}
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="highlight"
                                                    className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 opacity-20"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex flex-wrap gap-4 mt-8 justify-center opacity-40">
                                <div className="flex items-center gap-1.5 text-[10px] text-white font-medium">
                                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,145,1)]" /> Selected
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-white font-medium">
                                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full" /> Today
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full mt-8 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white text-sm font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                            >
                                Plan on {currentMonthShort} {selectedDate}
                                <IoChevronForward className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            className="p-6 md:p-8 max-h-[75vh] md:max-h-[85vh] overflow-y-auto scrollbar-hide"
                        >
                            <div className="mb-6">
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    <IoChevronBack size={12} /> Back
                                </button>
                            </div>

                            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {currentMonthShort} {selectedDate} • Plan the moment 🌹
                            </h2>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest leading-none">
                                        <FaHeart className="text-pink-500 text-[9px]" /> Partner's Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91  "
                                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-all placeholder:text-white/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest leading-none">
                                            <FaClock className="text-pink-500 text-[9px]" /> Pick a time
                                        </label>
                                        <button
                                            onClick={() => {
                                                if (formData.time === 'Custom' || formData.time.includes(':')) {
                                                    // Toggle logic: if already showing custom, go back to standard
                                                    if (timeSlots.includes(formData.time)) {
                                                        setFormData({ ...formData, time: 'Custom' });
                                                    } else {
                                                        setFormData({ ...formData, time: timeSlots[1] });
                                                    }
                                                } else {
                                                    setFormData({ ...formData, time: 'Custom' });
                                                }
                                            }}
                                            className="text-[9px] font-bold text-pink-500 uppercase tracking-widest hover:text-pink-400 transition-colors"
                                        >
                                            {(!timeSlots.includes(formData.time) && formData.time !== 'Custom') ? 'Standard Slots' : 'Custom Time'}
                                        </button>
                                    </div>

                                    {formData.time !== 'Custom' ? (
                                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
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
                                    ) : (
                                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 h-14">
                                            <div className="flex-1 flex items-center justify-center gap-1">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="12"
                                                    placeholder="HH"
                                                    onChange={(e) => {
                                                        const val = e.target.value.padStart(2, '0');
                                                        const parts = formData.time.includes(':') ? formData.time.split(' ') : ['06:30', 'PM'];
                                                        const [h, m] = parts[0].split(':');
                                                        setFormData({ ...formData, time: `${val}:${m || '00'} ${parts[1]}` });
                                                    }}
                                                    className="w-10 bg-transparent text-center text-white text-sm font-bold focus:outline-none placeholder:text-white/10"
                                                />
                                                <span className="text-white/20">:</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="59"
                                                    placeholder="MM"
                                                    onChange={(e) => {
                                                        const val = e.target.value.padStart(2, '0');
                                                        const parts = formData.time.includes(':') ? formData.time.split(' ') : ['06:30', 'PM'];
                                                        const [h, m] = parts[0].split(':');
                                                        setFormData({ ...formData, time: `${h || '12'}:${val} ${parts[1]}` });
                                                    }}
                                                    className="w-10 bg-transparent text-center text-white text-sm font-bold focus:outline-none placeholder:text-white/10"
                                                />
                                            </div>

                                            <div className="flex bg-white/5 rounded-xl p-1 gap-1">
                                                {['AM', 'PM'].map(period => (
                                                    <button
                                                        key={period}
                                                        onClick={() => {
                                                            const parts = formData.time.includes(':') ? formData.time.split(' ') : ['06:30', 'PM'];
                                                            setFormData({ ...formData, time: `${parts[0]} ${period}` });
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${formData.time.endsWith(period)
                                                            ? 'bg-pink-500 text-white shadow-lg'
                                                            : 'text-white/40 hover:text-white/60'
                                                            }`}
                                                    >
                                                        {period}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest leading-none">
                                        <FaMapMarkerAlt className="text-pink-500 text-[9px]" /> Meeting Point?
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.place}
                                        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                                        placeholder="Add a place..."
                                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-all placeholder:text-white/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest leading-none">
                                        <FaBell className="text-pink-500 text-[9px]" /> Custom Reminder?
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={customReminder}
                                        onChange={(e) => setCustomReminder(e.target.value)}
                                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-all [color-scheme:dark]"
                                    />
                                </div>

                                <div className="space-y-2 pb-2">
                                    <label className="text-[10px] font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest leading-none">
                                        <FaMagic className="text-pink-500 text-[9px]" /> Vibe
                                    </label>
                                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
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
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex-1 h-11 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white text-xs font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : 'Confirm'}
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
                                We'll remind you before your date on {currentMonthShort} {selectedDate} at {formData.time}. ✨
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
