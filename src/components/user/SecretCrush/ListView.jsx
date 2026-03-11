import React from 'react';
import { motion } from 'framer-motion';
import {
    FaChevronLeft, FaHeart, FaPlus, FaSearch, FaCheckCircle,
    FaClock, FaLock, FaBan, FaStar, FaEye, FaArrowRight, FaComment, FaCheck
} from 'react-icons/fa';
import { HiSparkles, HiHeart } from 'react-icons/hi2';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const ListView = ({
    navigate,
    setView,
    searchQuery,
    setSearchQuery,
    filters,
    activeFilter,
    setActiveFilter,
    filteredCrushes,
    handleUnlock,
    refreshCrushes // Added this to refresh the list after payment
}) => {
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage or passed down

    const handleRevealPayment = async (crushId) => {
        try {
            // 1. Create Razorpay order
            const orderPayload = {
                amount: 4900, // ₹49 in paise
                currency: 'INR',
                userId,
                service: 'SECRET_CRUSH_REVEAL',
            };

            const { data: order } = await api.post('/razorpay/order', orderPayload);

            // 2. Open Razorpay checkout
            const options = {
                key: "rzp_live_SFfOOVzkkwjQYg",
                amount: order.amount,
                currency: order.currency,
                name: 'Izhaar',
                description: 'Secret Crush Identity Reveal',
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await api.post('/razorpay/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            userId,
                            service: 'SECRET_CRUSH_REVEAL',
                        });

                        await api.post('/secret-crush/unlock', { crushId });
                        toast.success('🎉 Identity Revealed!');
                        if (refreshCrushes) refreshCrushes();
                    } catch (err) {
                        toast.error('Payment verification failed');
                    }
                },
                theme: { color: '#EC4891' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            toast.error('Failed to initiate payment');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col min-h-screen relative z-10"
        >
            {/* Mobile Back Button with Header Container */}
            <div className="relative z-50 px-3 py-4 sm:py-6 sm:px-7 w-full max-w-xl mx-auto flex items-center justify-start gap-4">
                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-md"
                >
                    <FaChevronLeft size={16} />
                </button>
                <h2 className="text-[18px] font-bold text-white tracking-tight">Your crush list</h2>
            </div>

            <div className="flex-1 flex flex-col items-center pt-2 pb-24 w-full px-6">
                <div className="w-full max-w-md">


                    {/* Add Crush Card */}
                    <div className="border border-[#EC4891]/20 rounded-[16px] bg-[linear-gradient(0deg,rgba(236,72,153,0.2)_0%,rgba(236,72,153,0.2)_100%)] p-[12px] flex items-center justify-between mb-3 shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#EC4891]/10 blur-2xl rounded-full -mr-10 -mt-10" />

                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EC4891] to-[#A928ED] flex items-center justify-center shadow-[0_4px_15px_rgba(236,72,145,0.4)]">
                                <HiSparkles className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="text-[14px] font-bold text-white mb-0.5">Add another Crush?</h3>
                                <p className="text-[10px] text-white/40">Someone else on your mind? 💭</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setView('form')}
                            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-md hover:bg-white/20 transition-all active:scale-90 relative z-10"
                        >
                            <FaPlus size={14} />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2 pl-14 pr-6 bg-[#1A0B2E]/40 border border-white/5 rounded-3xl text-white text-[13px] focus:outline-none focus:border-[#EC4891]/50 placeholder:text-white/10 font-medium transition-all"
                            placeholder="Search name or number"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-2.5 overflow-x-auto pb-5 no-scrollbar -mx-1 px-1">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap tracking-tight ${activeFilter === f
                                    ? 'bg-[#EC4899] text-white shadow-[0_8px_16px_rgba(236,73,153,0.3)]'
                                    : 'bg-white/5 text-white/60 border border-white/5 hover:bg-white/10'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Crush Cards List */}
                    <div className="space-y-2.5">
                        {filteredCrushes.length === 0 ? (
                            <div className="text-center py-24 opacity-20">
                                <FaHeart className="text-5xl mx-auto mb-4" />
                                <p className="text-lg font-medium">No crushes found</p>
                            </div>
                        ) : (
                            filteredCrushes.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white/[0.03] border border-white/10 rounded-[20px] p-[14px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500"
                                >
                                    {/* Background Decorative Glow */}
                                    <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[40px] opacity-20 transition-all duration-700 ${item.is_revealed ? 'bg-emerald-500' :
                                        item.is_solved ? 'bg-purple-500' :
                                            item.is_seen ? 'bg-sky-500' :
                                                'bg-amber-500'}`} />

                                    <div className="flex items-start justify-between mb-3 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-500 group-hover:scale-110 ${item.is_revealed ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' :
                                                item.is_solved ? 'bg-purple-500/10 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]' :
                                                    item.is_seen ? 'bg-sky-500/10 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]' :
                                                        'bg-amber-100/10 text-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                                                }`}>
                                                {item.is_revealed ? <FaHeart size={18} className="animate-pulse" /> : <HiHeart size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="text-[14px] font-black text-white tracking-tight leading-tight mb-0.5">
                                                    {item.is_revealed || (item.is_match && !item.is_received)
                                                        ? (item.is_received ? item.sender_name : item.crush_name)
                                                        : item.is_received
                                                            ? item.solve_attempts >= 1 ? "Revealed Failed 🔒" : "Secret Admirer 🤫"
                                                            : (item.crush_name.split(' ')[0][0] || '?') + '***' + (item.crush_name.split(' ')[0].slice(-1) || '')
                                                    }
                                                </h4>
                                                <p className="text-[11px] text-white/40 font-medium tracking-tight flex items-center gap-1.5">

                                                    {item.is_revealed
                                                        ? (item.is_received ? item.sender_mobile : item.crush_mobile)
                                                        : item.is_received
                                                            ? item.solve_attempts >= 1 && !item.is_solved ? "They don't know you" : "Solve to see mobile"
                                                            : item.crush_mobile.slice(0, 5) + '****' + item.crush_mobile.slice(-2)
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.is_revealed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                item.is_solved ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                    item.is_seen ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                                                        'bg-amber-500/10 text-amber-500 border-amber-500/10'
                                                }`}>
                                                {item.is_revealed ? 'Matched' :
                                                    item.is_solved ? 'Solved' :
                                                        item.is_seen ? 'Seen' :
                                                            item.is_received ? 'Received' : 'Sent'}
                                            </div>
                                            <span className="text-[9px] text-white/40 font-medium tracking-tight uppercase flex items-center gap-1.5">
                                                {new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 relative z-10">
                                        <div className="flex justify-between items-end px-1">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">
                                                    {item.is_solved ? "Quiz Passed" : "Clue Progress"}
                                                </span>
                                                <span className={`text-[12px] font-black leading-none ${item.is_solved ? 'text-green-500' : (item.solve_attempts >= 1 ? 'text-red-500' : 'text-white/80')}`}>
                                                    {(() => {
                                                        try {
                                                            const h = typeof item.hints === 'string' ? JSON.parse(item.hints) : (item.hints || []);
                                                            if (item.is_solved) return "Test Passed! 🎉";
                                                            if (item.solve_attempts >= 1) return "Test Failed";
                                                            return h.length === 0 ? "No clues set" : `0 of ${h.length} clues solved`;
                                                        } catch (e) { return "No clues set"; }
                                                    })()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-[6px] w-full bg-white/[0.05] border border-white/5 rounded-full overflow-hidden p-[1px]">
                                            <div
                                                style={{ width: (item.is_match || item.is_solved) ? '100%' : '5%' }}
                                                className={`h-full rounded-full transition-all duration-1000 ${(item.is_match || item.is_solved)
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                                                    : item.is_received
                                                        ? 'bg-gradient-to-r from-[#EC4891] to-[#FF2B93] shadow-[0_0_12px_rgba(236,72,145,0.2)]'
                                                        : 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                                                    }`}
                                            />
                                        </div>

                                        <div className="pt-1.5">
                                            {item.is_revealed ? (
                                                <button
                                                    onClick={() => navigate('/user/chat-interface')}
                                                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-black text-[13px] flex items-center justify-center gap-3 shadow-[0_8px_24px_rgba(16,185,129,0.3)] hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-[0.1em]"
                                                >
                                                    <FaComment size={14} /> Start Chatting
                                                </button>
                                            ) : item.is_solved ? (
                                                item.is_received ? (
                                                    <div className="w-full py-3 border border-pink-500/20 rounded-2xl bg-pink-500/5 flex flex-col items-center justify-center gap-1">
                                                        <span className="text-[11px] font-black text-pink-500 uppercase tracking-widest">Wait for feeling analysis</span>
                                                        <span className="text-[9px] text-white/30 lowercase">Sender must reveal their identity</span>
                                                    </div>
                                                ) : (
                                                    // This is the SENDER side
                                                    <button
                                                        onClick={() => handleRevealPayment(item.id)}
                                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF2B93] to-[#A928ED] text-white font-black text-[13px] flex items-center justify-center gap-3 shadow-[0_8px_24_rgba(255,43,147,0.3)] hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-[0.1em]"
                                                    >
                                                        <HiSparkles size={16} /> REVEAL IT
                                                    </button>
                                                )
                                            ) : item.is_received ? (
                                                item.solve_attempts >= 1 ? (
                                                    <div className="w-full py-3 border border-white/5 rounded-2xl bg-white/[0.02] flex items-center justify-center gap-2 opacity-50">
                                                        <FaBan size={12} className="text-red-500" />
                                                        <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Attempt Failed</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setView('solve', item)}
                                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF2B93] to-[#A928ED] text-white font-black text-[13px] flex items-center justify-center gap-3 shadow-[0_8px_24px_rgba(255,43,147,0.3)] hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-[0.1em]"
                                                    >
                                                        <FaLock size={11} /> Unlock Identity
                                                    </button>
                                                )
                                            ) : (
                                                <div className="w-full py-3   flex flex-col items-center justify-center gap-1.5 relative overflow-hidden group/wait">
                                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-amber-500/20 group-hover/wait:bg-amber-500/40 transition-colors" />
                                                    <div className="flex items-center gap-2">
                                                        <HiSparkles className="text-amber-500 text-xs animate-pulse" />
                                                        <span className="text-[11px] font-black text-amber-500/60 uppercase tracking-widest">
                                                            Waiting for them to solve
                                                        </span>
                                                    </div>
                                                    <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">
                                                        Identity remains secret
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ListView;
