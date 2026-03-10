import React from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaHeart, FaUser, FaPhoneAlt, FaLightbulb, FaQuestionCircle, FaPlus, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const FormView = ({
    setView,
    crushName,
    setCrushName,
    crushMobile,
    setCrushMobile,
    hints,
    setHints,
    handleAddCrush,
    loading
}) => {
    const [currentStep, setCurrentStep] = React.useState(1);

    const handleAddHint = () => {
        if (hints.length < 5) {
            setHints([...hints, { question: '', options: ['', ''], correctOptionIndex: null }]);
        } else {
            toast.info("Maximum 5 hint questions allowed");
        }
    };

    const handleRemoveHint = (index) => {
        if (hints.length > 1) {
            setHints(hints.filter((_, i) => i !== index));
        }
    };

    const handleHintChange = (index, field, value) => {
        const newHints = [...hints];
        newHints[index][field] = value;
        setHints(newHints);
    };

    const handleOptionChange = (hintIndex, optionIndex, value) => {
        const newHints = [...hints];
        newHints[hintIndex].options[optionIndex] = value;
        setHints(newHints);
    };

    const handleSelectCorrect = (hintIndex, optionIndex) => {
        const newHints = [...hints];
        newHints[hintIndex].correctOptionIndex = optionIndex;
        setHints(newHints);
    };

    const handleAddOption = (hintIndex) => {
        const newHints = [...hints];
        if (newHints[hintIndex].options.length < 5) {
            newHints[hintIndex].options.push('');
            setHints(newHints);
        }
    };

    const handleRemoveOption = (hintIndex, optionIndex) => {
        const newHints = [...hints];
        if (newHints[hintIndex].options.length > 2) {
            if (newHints[hintIndex].correctOptionIndex === optionIndex) {
                newHints[hintIndex].correctOptionIndex = null;
            } else if (newHints[hintIndex].correctOptionIndex > optionIndex) {
                newHints[hintIndex].correctOptionIndex--;
            }
            newHints[hintIndex].options = newHints[hintIndex].options.filter((_, i) => i !== optionIndex);
            setHints(newHints);
        }
    };

    const validateStep1 = () => {
        if (!crushName.trim()) {
            toast.error("Please enter their name");
            return false;
        }
        if (crushMobile.length !== 10) {
            toast.error("Enter valid 10-digit mobile number");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const validHints = hints.filter(h => h.question.trim() !== '');
        if (validHints.length === 0) {
            toast.error("Add at least one question");
            return false;
        }
        for (const hint of validHints) {
            if (hint.options.filter(o => o.trim() !== '').length < 2) {
                toast.error("Each question needs at least 2 options");
                return false;
            }
            if (hint.correctOptionIndex === null) {
                toast.error("Select a correct answer for each question");
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (currentStep === 1 && validateStep1()) setCurrentStep(2);
        else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        else setView('intro');
    };

    const steps = [
        { id: 1, label: 'Their Info' },
        { id: 2, label: 'Clues' },
        { id: 3, label: 'Finish' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col min-h-screen relative z-10"
        >
            <div className="relative z-50 px-3 py-4 sm:py-6 sm:px-7 w-full max-w-xl mx-auto flex items-center justify-start gap-4">
                <button
                    onClick={prevStep}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-md"
                >
                    <FaChevronLeft size={16} />
                </button>
                <span className="text-[18px] font-bold text-white tracking-tight">
                    {currentStep === 1 ? "Add Crush" : currentStep === 2 ? "Add Clues" : "Almost There..."}
                </span>
            </div>

            {/* Sending Animation Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#0F0715]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="relative mb-12">
                            {/* Main Pulsing Heart */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.15, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#EC4891] to-[#A928ED] flex items-center justify-center shadow-[0_0_80px_rgba(236,72,145,0.4)] relative z-10"
                            >
                                <FaHeart className="text-white text-5xl" />
                            </motion.div>

                            {/* Outer Rings */}
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: [0, 0.2, 0], scale: [0.8, 2] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                                    className="absolute inset-0 border-2 border-[#EC4891] rounded-full"
                                />
                            ))}

                            {/* Flying Mini Hearts */}
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        y: -120 - (Math.random() * 100),
                                        x: (Math.random() - 0.5) * 200,
                                        scale: [0, 1, 0.4],
                                        rotate: (Math.random() - 0.5) * 45
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        delay: i * 0.4
                                    }}
                                    className="absolute top-1/2 left-1/2 text-[#EC4891]/60"
                                >
                                    <FaHeart size={14 + (Math.random() * 12)} />
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <h3 className="text-2xl font-black text-white tracking-[0.2em] uppercase">Sending Clues</h3>
                            <p className="text-pink-300/60 text-[13px] tracking-widest uppercase font-bold animate-pulse">Silence is Golden 🤫</p>

                            {/* Loading progress indicator */}
                            <div className="w-56 h-1.5 bg-white/5 rounded-full mx-auto relative overflow-hidden mt-8 border border-white/5">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#EC4891] to-[#A928ED]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3.5, ease: "easeInOut" }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col items-center pt-2 pb-20 w-full px-6 overflow-y-auto no-scrollbar">
                <div className="w-full max-w-md space-y-6">

                    {/* Steps Breadcrumbs */}
                    <div className="flex items-center justify-between mb-8 relative px-4">
                        <div className="absolute left-0 top-[7px] w-full h-[1px] bg-white/5 z-0" />
                        <div
                            className="absolute left-0 top-[7px] h-[1px] bg-gradient-to-r from-[#EC4891] to-[#A928ED] transition-all duration-500 z-0"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        />

                        {steps.map((st) => (
                            <div key={st.id} className="flex flex-col items-center gap-3 relative z-10">
                                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-500 ${currentStep >= st.id ? 'bg-[#EC4891] ring-4 ring-[#EC4891]/20' : 'bg-[#2A1B3D]'}`} />
                                <span className={`text-[9px] font-bold uppercase tracking-wider transition-all duration-500 ${currentStep >= st.id ? 'text-white/80' : 'text-white/20'}`}>{st.label}</span>
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-6"
                            >
                                <div className="border border-white/5 rounded-2xl p-6 bg-white/[0.02] shadow-xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-[#EC4891]/20 flex items-center justify-center">
                                            <FaHeart className="text-[14px] text-[#EC4891]" />
                                        </div>
                                        <h3 className="font-bold text-white text-[16px] tracking-tight">Who is your secret crush?</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="group">
                                            <label className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2 block ml-1">Their name <span className="text-[#EC4891]">*</span></label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                                                    <FaUser size={13} className="text-[#EC4891]" />
                                                </span>
                                                <input
                                                    value={crushName}
                                                    onChange={(e) => setCrushName(e.target.value)}
                                                    className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white text-[14px] focus:outline-none focus:border-[#EC4891]/50 placeholder:text-white/10 transition-all font-medium"
                                                    placeholder="Enter name"
                                                />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2 block ml-1">Mobile number <span className="text-[#EC4891]">*</span></label>
                                            <div className="relative font-mono">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 flex items-center gap-2 pointer-events-none">
                                                    <FaPhoneAlt size={12} className="text-[#EC4891]" />
                                                    <span className="text-[13px] font-bold">+91 |</span>
                                                </span>
                                                <input
                                                    type="tel"
                                                    maxLength={10}
                                                    value={crushMobile}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        if (value.length <= 10) setCrushMobile(value);
                                                    }}
                                                    className="w-full py-4 pl-[71px] pr-4 bg-white/5 border border-white/10 rounded-xl text-white text-[15px] focus:outline-none focus:border-[#EC4891]/50 placeholder:text-white/10 tracking-[0.1em] transition-all"
                                                    placeholder="9876543210"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        onClick={nextStep}
                                        className="px-12 py-3 rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] font-bold text-white text-[13px] uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all"
                                    >
                                        Continue ➜
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-1.5 px-1">
                                    <label className="text-[10px] font-black tracking-widest text-[#EC4891] uppercase">Clues Section</label>
                                    <p className="text-[12px] text-white/40 leading-relaxed">Add questions about yourself to help them guess who you are 🤫</p>
                                </div>

                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-[#A928ED]/20 flex items-center justify-center shadow-lg">
                                            <FaQuestionCircle className="text-[#A928ED]" size={14} />
                                        </div>
                                        <h3 className="font-bold text-white text-[16px] tracking-tight">Add Clues</h3>
                                    </div>
                                    {hints && hints.length < 5 && (
                                        <button
                                            onClick={handleAddHint}
                                            className="text-[10px] font-bold text-[#EC4891] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EC4891]/10 border border-[#EC4891]/20 hover:bg-[#EC4891]/20 transition-all"
                                        >
                                            <FaPlus size={8} /> New Add
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {hints && hints.map((hint, hIdx) => (
                                            <motion.div
                                                key={hIdx}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="border border-white/5 rounded-2xl p-4 bg-white/[0.01] relative group"
                                            >
                                                {hints.length > 1 && (
                                                    <button
                                                        onClick={() => handleRemoveHint(hIdx)}
                                                        className="absolute top-3 right-3 text-white/10 hover:text-red-500 transition-all p-1"
                                                    >
                                                        <FaTrash size={10} />
                                                    </button>
                                                )}

                                                <div className="space-y-3.5">
                                                    <div className="group">
                                                        <label className="text-[8px] font-black tracking-[0.15em] text-[#A928ED] uppercase mb-1.5 block ml-1">clue {hIdx + 1} <span className="text-[#EC4891]">*</span></label>
                                                        <input
                                                            value={hint.question}
                                                            onChange={(e) => handleHintChange(hIdx, 'question', e.target.value)}
                                                            className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-[12px] focus:outline-none focus:border-[#EC4891]/50 placeholder:text-white/20 transition-all font-medium"
                                                            placeholder="Ask something about you..."
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between ml-1">
                                                            <label className="text-[8px] font-black tracking-widest text-white/30 uppercase">Options (Select Correct)</label>
                                                            {hint.options.length < 5 && (
                                                                <button
                                                                    onClick={() => handleAddOption(hIdx)}
                                                                    className="text-[8px] font-black text-[#EC4891] flex items-center gap-1 hover:opacity-80 transition-all"
                                                                >
                                                                    <FaPlus size={6} /> Option
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-1.5">
                                                            {hint.options.map((opt, oIdx) => (
                                                                <div key={oIdx} className="flex items-center gap-2 group/opt">
                                                                    <div className="relative flex-1">
                                                                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white/30">
                                                                            {String.fromCharCode(65 + oIdx)}
                                                                        </div>
                                                                        <input
                                                                            value={opt}
                                                                            onChange={(e) => handleOptionChange(hIdx, oIdx, e.target.value)}
                                                                            className={`w-full py-2 pl-9 pr-3 bg-white/5 border rounded-lg text-white text-[11px] focus:outline-none transition-all font-medium ${hint.correctOptionIndex === oIdx ? 'border-[#EC4891]/50 bg-[#EC4891]/5 shadow-[0_0_8px_rgba(236,72,145,0.1)]' : 'border-white/5 focus:border-[#EC4891]/30'}`}
                                                                            placeholder={`Option ${oIdx + 1}`}
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <button
                                                                            onClick={() => handleSelectCorrect(hIdx, oIdx)}
                                                                            className={`w-7 h-7 flex items-center justify-center transition-all rounded-md ${hint.correctOptionIndex === oIdx ? 'text-[#EC4891] bg-[#EC4891]/10' : 'text-white/10 hover:text-white/30 bg-white/5'}`}
                                                                            title="Mark Correct"
                                                                        >
                                                                            <FaCheckCircle size={12} />
                                                                        </button>
                                                                        {hint.options.length > 2 && (
                                                                            <button
                                                                                onClick={() => handleRemoveOption(hIdx, oIdx)}
                                                                                className="w-7 h-7 flex items-center justify-center text-white/5 hover:text-red-500/60 transition-all rounded-md bg-white/5"
                                                                            >
                                                                                <FaTrash size={9} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={prevStep}
                                        className="py-3 rounded-full bg-white/5 border border-white/10 text-white/70 font-bold uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        className="py-3 rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] text-white font-bold uppercase text-[11px] tracking-widest shadow-lg hover:brightness-110 transition-all"
                                    >
                                        Continue ➜
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center justify-center py-10 space-y-8 text-center"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#EC4891] to-[#A928ED] flex items-center justify-center shadow-[0_0_50px_rgba(236,72,145,0.3)] animate-pulse">
                                        <FaHeart className="text-white text-4xl" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                                        <span className="text-pink-500 text-lg">🤫</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h2 className="text-3xl font-black text-white tracking-tight">Almost there!</h2>
                                    <p className="text-white/60 text-[14px] leading-relaxed max-w-[280px]">
                                        We'll let <span className="text-white font-bold">{crushName}</span> know that someone has a secret crush on them. They'll have to solve your clues to find out who it is!
                                    </p>
                                </div>

                                <div className="w-full flex flex-col items-center gap-5">
                                    <button
                                        onClick={handleAddCrush}
                                        disabled={loading}
                                        className="px-14 py-3.5 rounded-full bg-gradient-to-r from-[#EC4891] via-[#D41B65] to-[#A928ED] font-black text-white uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(236,72,145,0.4)] hover:brightness-110 active:scale-95 transition-all text-[14px] disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            "Send Silently"
                                        )}
                                    </button>
                                    <button
                                        onClick={prevStep}
                                        disabled={loading}
                                        className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em] hover:text-[#EC4891] transition-all disabled:opacity-0"
                                    >
                                        Edit Info
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default FormView;
