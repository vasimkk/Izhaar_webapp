import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaHeart, FaUser, FaPhoneAlt, FaLightbulb } from 'react-icons/fa';

const FormView = ({
    setView,
    crushName,
    setCrushName,
    crushMobile,
    setCrushMobile,
    clues,
    setClues,
    handleAddCrush,
    loading
}) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col min-h-screen relative z-10"
    >
        {/* Mobile Back Button with Header Container */}
        <div className="relative z-50 px-3 py-4 sm:py-6 sm:px-7 w-full max-w-xl mx-auto flex justify-between items-center">
            <button
                onClick={() => setView('intro')}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-md"
            >
                <FaChevronLeft size={16} />
            </button>
        </div>

        <div className="flex-1 flex flex-col items-center pt-2 pb-20 w-full px-6">
            <div className="w-full max-w-md">
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Add Crush</h2>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-12 relative px-4">
                    <div className="absolute left-0 top-[7px] w-full h-[2px] bg-white/5 z-0" />
                    <div className="absolute left-0 top-[7px] h-[2px] bg-gradient-to-r from-[#EC4891] to-[#A928ED] z-0" style={{ width: '50%' }} />

                    {[
                        { label: 'add crush', active: true },
                        { label: 'Drop Clues', active: true },
                        { label: 'Get revealed', active: false }
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                            <div className={`w-3.5 h-3.5 rounded-full ${step.active ? 'bg-[#EC4891] ring-4 ring-[#EC4891]/20' : 'bg-[#2A1B3D]'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${step.active ? 'text-white/80' : 'text-white/20'}`}>{step.label}</span>
                        </div>
                    ))}
                </div>

                {/* Targets Area */}
                <div className="border border-white/5 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-7 h-7 rounded-lg bg-[#EC4891]/20 flex items-center justify-center">
                            <FaHeart className="text-[12px] text-[#EC4891]" />
                        </div>
                        <h3 className="font-bold text-white tracking-tight">Who is your secret crush?</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <label className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2 block ml-1">Their name <span className="text-[#EC4891]">*</span></label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"><FaUser size={14} /></span>
                                <input
                                    value={crushName}
                                    onChange={(e) => setCrushName(e.target.value)}
                                    className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[14px] focus:outline-none focus:border-[#EC4891]/50 placeholder:text-white/10 transition-all"
                                    placeholder="Name"
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2 block ml-1">Mobile number <span className="text-[#EC4891]">*</span></label>
                            <div className="relative font-mono">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 flex items-center gap-2">
                                    <FaPhoneAlt size={12} /> <span className="text-[13px] opacity-40">+91 |</span>
                                </span>
                                <input
                                    value={crushMobile}
                                    onChange={(e) => setCrushMobile(e.target.value)}
                                    className="w-full py-4 pl-20 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[15px] focus:outline-none focus:border-[#EC4891]/50 placeholder:text-white/10 tracking-widest transition-all"
                                    placeholder="123456789"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clues Area */}
                <div className=" border border-white/5 rounded-2xl p-6 mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-7 h-7 rounded-lg bg-[#A928ED]/20 flex items-center justify-center">
                            <FaLightbulb className="text-[12px] text-[#A928ED]" />
                        </div>
                        <h3 className="font-bold text-white tracking-tight">Leave some clues about yourself (optional)</h3>
                    </div>

                    <div className="space-y-3">
                        {clues.map((clue, i) => (
                            <div key={i} className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-bold text-[#EC4891]">{i + 1}</span>
                                <input
                                    value={clue}
                                    onChange={(e) => {
                                        const newClues = [...clues];
                                        newClues[i] = e.target.value;
                                        setClues(newClues);
                                    }}
                                    className="w-full py-4 pl-14 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[13px] focus:outline-none focus:border-[#EC4891]/50 placeholder:text-white/10 italic font-medium transition-all"
                                    placeholder={i === 0 ? "Eg: First meet" : i === 1 ? "Eg: Where do we usually see each other?" : "Eg: Something I always do around you..."}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleAddCrush}
                        disabled={loading}
                        className="px-10 py-3 rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] font-bold text-[13px] shadow-[0_10px_20px_rgba(236,72,145,0.3)] hover:brightness-110 active:scale-95 transition-all mb-4 uppercase tracking-widest"
                    >
                        {loading ? "Processing..." : "Add Secret Crush"}
                    </button>
                </div>
                <p className="text-center text-[11px] text-white/20 font-medium">Fill in all fields to continue</p>
            </div>
        </div>
    </motion.div>
);

export default FormView;
