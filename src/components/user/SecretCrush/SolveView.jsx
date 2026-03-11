import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaHeart, FaCheckCircle, FaLock, FaLightbulb } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { useUserId } from '../../../hooks/useUserId';

const SolveView = ({ crush, setView, onSolved }) => {
    const rawHints = typeof crush.hints === 'string' ? JSON.parse(crush.hints) : (crush.hints || []);
    // Filter out any invalid hints
    const hints = Array.isArray(rawHints) ? rawHints.filter(h => h && h.question) : [];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [revealLoading, setRevealLoading] = useState(false);
    const [revealedInfo, setRevealedInfo] = useState(null);
    const [customMessage, setCustomMessage] = useState("");
    const userId = useUserId();

    // If no valid hints, we can't solve it
    if (hints.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                    <FaLock className="text-red-500 text-3xl" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Hints Missing</h2>
                <p className="text-white/40 text-sm mb-8">This secret crush doesn't have any clues to solve. It might be a legacy record.</p>
                <button onClick={() => setView('list')} className="px-8 py-2 bg-white/10 rounded-full text-white text-xs">Go Back</button>
            </div>
        );
    }

    const handleAnswer = (optionIndex) => {
        if (isChecking) return;
        setSelectedOption(optionIndex);
    };

    const handleNext = () => {
        if (selectedOption === null) return;

        const newAnswers = [...answers, selectedOption];
        setAnswers(newAnswers);

        if (currentQuestion < hints.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
        } else {
            submitAnswers(newAnswers);
        }
    };

    const submitAnswers = async (finalAnswers) => {
        setIsChecking(true);
        try {
            const res = await api.post('/secret-crush/solve', {
                crushId: crush.id,
                answers: finalAnswers
            });

            if (res.data.status === 'success' && res.data.correct !== false) {
                setIsCorrect(true);
                setCustomMessage(res.data.message);
                toast.success("Correct! Identity Revealed 💘");
                onSolved();
            } else {
                setIsCorrect(false);
                setCustomMessage(res.data.message || "They don't know about your feeling and clues. 🤫");
                toast.error(res.data.message || "Wrong answers! 🤫");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsChecking(false);
            setIsFinished(true);
        }
    };

    const handleRevealPayment = async () => {
        // Removed payment from receiver side as per user request
        toast.info("Waiting for feelings analysis... identity will be revealed soon.");
        setView('list');
    };

    if (isFinished) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-6"
            >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${isCorrect ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
                    {isCorrect ? <FaCheckCircle className="text-white text-3xl" /> : <FaLock className="text-white text-3xl" />}
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-white">
                        {isCorrect ? "Test Passed! 🎉" : "Access Denied"}
                    </h2>
                    <p className="text-white/60 text-[13px] max-w-[280px] leading-relaxed">
                        {isCorrect
                            ? (customMessage || "wait for the the your feeling anayilsy")
                            : (customMessage || "They don't know about your feeling and clues correctly. 🤫")
                        }
                    </p>
                </div>

                {isCorrect ? (
                    <div className="w-full max-w-xs space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <p className="text-[11px] text-white/40 uppercase font-black tracking-widest mb-1">Status</p>
                            <p className="text-[14px] text-white font-bold italic">"wait for the the your feeling anayilsy"</p>
                        </div>
                        <button
                            onClick={() => setView('list')}
                            className="px-12 py-3 rounded-full bg-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
                        >
                            Back to List
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setView('list')}
                        className="px-12 py-3 rounded-full bg-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
                    >
                        Back to List
                    </button>
                )}
            </motion.div>
        );
    }

    const currentHint = hints[currentQuestion];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col min-h-screen relative z-10"
        >
            <div className="relative z-50 px-3 py-4 sm:py-6 sm:px-7 w-full max-w-xl mx-auto flex items-center justify-start gap-4">
                <button
                    onClick={() => setView('list')}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-md"
                >
                    <FaChevronLeft size={16} />
                </button>
                <span className="text-[18px] font-bold text-white tracking-tight">Solve Clues</span>
            </div>

            <div className="flex-1 flex flex-col items-center pt-2 pb-20 w-full px-6">
                <div className="w-full max-w-md space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-[10px] font-black text-[#EC4891] uppercase tracking-[0.2em]">Step {currentQuestion + 1} of {hints.length}</span>
                            <span className="text-[12px] font-bold text-white/40">{Math.round(((currentQuestion + 1) / hints.length) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#EC4891] to-[#A928ED]"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestion + 1) / hints.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <FaLightbulb size={80} />
                            </div>

                            <div className="relative z-10">
                                <div className="w-9 h-9 rounded-xl bg-[#EC4891]/20 flex items-center justify-center mb-4">
                                    <HiSparkles className="text-[#EC4891] text-xl" />
                                </div>
                                <h3 className="text-lg font-bold text-white leading-relaxed mb-6">
                                    {currentHint.question}
                                </h3>

                                <div className="space-y-2">
                                    {currentHint.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            className={`w-full p-3 rounded-2xl text-left text-[13px] font-medium transition-all border flex items-center justify-between group ${selectedOption === idx
                                                ? 'bg-[#EC4891]/10 border-[#EC4891]/50 text-white shadow-[0_0_20px_rgba(236,72,145,0.1)]'
                                                : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/[0.08]'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${selectedOption === idx ? 'bg-[#EC4891] text-white' : 'bg-white/5 text-white/40'}`}>
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                {option}
                                            </div>
                                            {selectedOption === idx && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <FaHeart className="text-[#EC4891]" size={14} />
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center pt-4">
                        <button
                            onClick={handleNext}
                            disabled={selectedOption === null || isChecking}
                            className="px-16 py-3.5 rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] text-white font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(236,72,145,0.3)] hover:brightness-110 active:scale-95 transition-all text-[12px] disabled:opacity-30 flex items-center gap-3"
                        >
                            {isChecking ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                currentQuestion === hints.length - 1 ? "Submit Solution" : "Next Clue"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SolveView;
