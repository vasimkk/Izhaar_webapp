import React from 'react';
import { motion } from 'framer-motion';
import {
    FaChevronLeft, FaHeart, FaPlus, FaSearch, FaCheckCircle,
    FaClock, FaLock, FaBan, FaStar, FaEye, FaArrowRight, FaComment
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const ListView = ({
    navigate,
    setView,
    searchQuery,
    setSearchQuery,
    filters,
    activeFilter,
    setActiveFilter,
    filteredCrushes,
    handleUnlock
}) => (
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
                <div className="border border-[#EC4891]/20 rounded-[16px] bg-[linear-gradient(0deg,rgba(236,72,153,0.2)_0%,rgba(236,72,153,0.2)_100%)] p-[14px] flex items-center justify-between mb-4 shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#EC4891]/10 blur-2xl rounded-full -mr-10 -mt-10" />

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#EC4891] to-[#A928ED] flex items-center justify-center shadow-[0_4px_15px_rgba(236,72,145,0.4)]">
                            <HiSparkles className="text-white text-lg" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold text-white mb-0.5">Add another Crush?</h3>
                            <p className="text-[11px] text-white/40">Someone else on your mind? 💭</p>
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
                        className="w-full py-2.5 pl-14 pr-6 bg-[#1A0B2E]/40 border border-white/5 rounded-3xl text-white text-[14px] focus:outline-none focus:border-[#EC4891]/50 placeholder:text-white/10 font-medium transition-all"
                        placeholder="Search name or number"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex gap-2.5 overflow-x-auto pb-5 no-scrollbar -mx-1 px-1">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap tracking-tight ${activeFilter === f
                                ? 'bg-[#EC4899] text-white shadow-[0_8px_16px_rgba(236,73,153,0.3)]'
                                : 'bg-white/5 text-white/60 border border-white/5 hover:bg-white/10'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Crush Cards List */}
                <div className="space-y-3">
                    {filteredCrushes.length === 0 ? (
                        <div className="text-center py-24 opacity-20">
                            <FaHeart className="text-5xl mx-auto mb-4" />
                            <p className="text-lg font-medium">No crushes found</p>
                        </div>
                    ) : (
                        filteredCrushes.map((item) => (
                            <div
                                key={item.id}
                                className="border border-white/5 rounded-[22px] p-[14px] shadow-2xl relative overflow-hidden group"
                                style={{
                                    contentVisibility: 'auto',
                                    containIntrinsicSize: '0 120px' // Approximate height of a card
                                }}
                            >
                                <div className="flex items-start justify-between mb-2.5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-xl transition-all group-hover:bg-[#EC4891]/10 ${item.is_match ? 'text-[#EC4891]' : 'text-white/40'}`}>
                                            <FaHeart size={16} className={item.is_match ? 'animate-pulse' : ''} />
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] font-bold text-white tracking-tight leading-tight">
                                                {item.is_match
                                                    ? (item.is_received ? item.sender_name : item.crush_name)
                                                    : item.is_received
                                                        ? "Someone likes you 🤫"
                                                        : (item.crush_name.split(' ')[0][0] || '?') + '***' + (item.crush_name.split(' ')[0].slice(-1) || '')
                                                }
                                            </h4>
                                            <p className="text-[11px] text-white/30 font-mono mt-0.5 tracking-tight font-medium italic opacity-80">
                                                {item.is_match
                                                    ? (item.is_received ? item.sender_mobile : item.crush_mobile)
                                                    : item.is_received
                                                        ? "Guess who it is!"
                                                        : item.crush_mobile.slice(0, 5) + '****' + item.crush_mobile.slice(-2)
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className={`px-3.5 py-1 rounded-[16px] text-[8.5px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-1.5 border ${(item.status === 'ignored' || item.is_ignored)
                                            ? 'bg-[rgba(201,204,210,0.05)] text-[rgb(201,204,210)] border-[rgba(201,204,210,0.1)]'
                                            : item.is_match
                                                ? 'bg-[rgba(0,201,80,0.05)] text-[rgb(0,201,80)] border-[rgba(0,201,80,0.1)]'
                                                : item.is_received
                                                    ? 'bg-[#EC4891]/5 text-[#EC4891] border-[#EC4891]/20'
                                                    : 'bg-[rgba(240,177,0,0.05)] text-[rgb(240,177,0)] border-[rgba(240,177,0,0.1)]'
                                            }`}>
                                            {(item.status === 'ignored' || item.is_ignored) ? <FaBan size={9} /> : item.is_match ? <FaCheckCircle size={9} /> : item.is_received ? <FaHeart size={9} className="animate-pulse" /> : <FaClock size={9} />}
                                            {(item.status === 'ignored' || item.is_ignored) ? 'Ignored' : item.is_match ? 'Matched' : item.is_received ? 'New Crush' : 'Waiting'}
                                        </div>
                                        <span className="text-[9px] text-white/20 font-bold uppercase tracking-wider">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3.5">
                                    <div className="flex justify-between items-center px-0.5">
                                        <span className="text-[9px] text-white/50 uppercase font-bold tracking-widest flex items-center gap-1.5 opacity-80">
                                            {item.is_match ? "Quiz Passed" : "Clues to solve"}
                                        </span>
                                        <span className={`text-[11px] font-black tracking-tighter ${item.is_match ? 'text-green-500' : 'text-white'}`}>
                                            {(() => {
                                                try {
                                                    const h = typeof item.hints === 'string' ? JSON.parse(item.hints) : (item.hints || []);
                                                    return h.length === 0
                                                        ? <span className="text-pink-500 font-bold underline decoration-pink-500/30">0 Clues!</span>
                                                        : `${h.length} Clues`;
                                                } catch (e) {
                                                    return <span className="text-pink-500">0 Clues</span>;
                                                }
                                            })()}
                                        </span>
                                    </div>

                                    <div className="h-[8px] w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden p-[1.5px]">
                                        <div
                                            style={{ width: item.is_match ? '100%' : '20%' }}
                                            className={`h-full rounded-full bg-gradient-to-r ${item.is_match ? 'from-green-500 to-emerald-400' : 'from-[#EC4891] to-[#A928ED]'} shadow-[0_0_12px_rgba(16,185,129,0.3)]`}
                                        />
                                    </div>

                                    {item.is_match && (
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-2.5 flex items-center justify-between relative overflow-hidden group/banner">
                                            <div className="flex items-center gap-2.5 relative z-10">
                                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                                    <FaHeart size={10} />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-green-400 tracking-tight">
                                                        {item.is_received ? "You matched with them!" : "They matched with you!"}
                                                    </p>
                                                    <p className="text-[9px] text-white/40 font-bold">Identity revealed</p>
                                                </div>
                                            </div>
                                            <HiSparkles className="text-green-400/30 text-lg absolute right-4 top-1/2 -translate-y-1/2" />
                                        </div>
                                    )}

                                    {!item.is_match && !item.is_received && (
                                        <div className="bg-[#1A0B2E]/80 border border-white/5 rounded-2xl p-2 flex items-center justify-center gap-2 relative shadow-inner">
                                            <div className="absolute inset-0 bg-blue-500/5 blur-xl pointer-events-none" />
                                            <HiSparkles className="text-blue-400/60 text-xs" />
                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Waiting for them to solve 🤐</span>
                                        </div>
                                    )}

                                    {!item.is_match && item.is_received && (
                                        <div className="bg-[#EC4891]/10 border border-[#EC4891]/20 rounded-2xl p-2 flex items-center justify-center gap-2 relative shadow-inner">
                                            <HiSparkles className="text-[#EC4891] text-xs animate-pulse" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Solve clues to reveal! 🔥</span>
                                        </div>
                                    )}
                                </div>

                                {item.is_match ? (
                                    <button
                                        onClick={() => navigate('/user/chat-interface')}
                                        className="w-full py-2.5 mt-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-black text-[12px] flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(16,185,129,0.3)] hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest"
                                    >
                                        <FaComment className="text-white" />
                                        Message Them
                                    </button>
                                ) : item.is_received ? (
                                    <button
                                        onClick={() => setView('solve', item)}
                                        className="w-full py-2.5 mt-5 rounded-2xl bg-gradient-to-r from-[#EC4891] to-[#A928ED] text-white font-black text-[12px] flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest shadow-[0_10px_20px_rgba(236,72,145,0.3)]"
                                    >
                                        <FaLock size={10} className="mr-1" />
                                        Solve Clues
                                    </button>
                                ) : (
                                    <div className="w-full py-2.5 mt-5 rounded-2xl border border-white/5 bg-white/[0.02] text-white/20 font-black text-[10px] flex items-center justify-center gap-2 uppercase tracking-[0.2em]">
                                        Pending Reveal
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    </motion.div>
);

export default ListView;
