import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";

const TrueConnectionQuiz = ({ onComplete }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionId: optionKey }
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    // Swipe State (Moved to top level)
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const cardRef = React.useRef(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await api.get("/tc/questions");
            setQuestions(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Could not load quiz");
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionKey) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionKey }));

        // Auto advance after short delay
        if (currentStep < questions.length - 1) {
            setTimeout(() => setCurrentStep(prev => prev + 1), 300);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = Object.entries(answers).map(([qId, optKey]) => ({
                questionId: parseInt(qId),
                optionKey: optKey
            }));

            await api.post("/tc/answers", { answers: payload });

            toast.success("Quiz completed! Finding your matches...");
            if (onComplete) onComplete();

        } catch (err) {
            console.error(err);
            toast.error("Failed to submit answers");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Preparing your experience...</p>
        </div>
    );

    if (questions.length === 0) return (
        <div className="flex flex-col items-center justify-center p-10 h-full">
            <div className="text-xl font-bold text-gray-400 mb-2">No questions found</div>
            <p className="text-gray-500">Please contact support or check back later.</p>
            <button onClick={fetchQuestions} className="mt-4 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition">
                Retry
            </button>
        </div>
    );

    // ==========================================
    // START SCREEN
    // ==========================================
    if (!isStarted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in relative z-10">
                <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl max-w-2xl w-full relative overflow-hidden">
                    {/* Background blob */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="text-7xl mb-6 animate-bounce-slow">💖</div>
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-6">
                            True Connection
                        </h1>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                            Discover meaningful relationships based on <span className="text-pink-500">compatibility</span>, not just looks.
                        </h2>

                        <div className="text-left bg-white/50 dark:bg-black/20 rounded-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <span className="bg-pink-100 text-pink-600 rounded-full p-1 text-xs">✨</span>
                                How it works:
                            </h3>
                            <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                <li className="flex items-start gap-3">
                                    <span className="text-pink-500 mt-1">✓</span>
                                    <span>Answer <strong>{questions.length} deep questions</strong> about your values, lifestyle, and personality.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-500 mt-1">✓</span>
                                    <span>Our algorithm analyzes your responses to find users who <strong>truly resonate</strong> with you.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-indigo-500 mt-1">✓</span>
                                    <span>Get matched with people who share a <strong>80%+ compatibility score</strong>.</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setIsStarted(true)}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-xl shadow-xl hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Start Your Journey ✨
                        </button>
                        <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest font-medium">
                            🔒 Private • Secure • AI-Powered
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // HYBRID QUIZ INTERFACE (Single Card Mobile / Grid Desktop)
    // ==========================================
    const currentQ = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    // Force binary choice
    const activeOptions = currentQ.options_json ? currentQ.options_json.slice(0, 2) : ["Yes", "No"];
    const selectedOption = answers[currentQ.id];

    // Reliable image IDs from Unsplash
    const imageLib = [
        "1516589174184-c68566f3e200", "1511707171634-5f897ff02aa9",
        "1517486808906-6ca8b3f04846", "1529333166437-7750a6dd5a70",
        "1523240795612-9a054b0db644", "1516062423079-7ca13cdc7f5a",
        "1484712401471-05c7215830eb", "1534330207526-8e81f10ec6fe"
    ];

    const getImageUrl = (index, isSecond) => {
        const id = imageLib[(index * 2 + (isSecond ? 1 : 0)) % imageLib.length];
        return `https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`;
    };

    const img1 = getImageUrl(currentStep, false);
    const img2 = getImageUrl(currentStep, true);

    // SWIPE LOGIC (Mobile Only)
    // (State moved to top level)

    const handleDragStart = (e) => {
        setIsDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        cardRef.current = { startX: clientX };
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const walk = (clientX - cardRef.current.startX);
        setDragX(walk);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (Math.abs(dragX) > 80) {
            const direction = dragX > 0 ? 1 : 0; // Right (Option 1) or Left (Option 0)
            handleOptionSelect(currentQ.id, direction);
            // We don't Reset dragX here because it will snap back after the step change
            setTimeout(() => setDragX(0), 100);
        } else {
            setDragX(0); // Snap back
        }
    };

    // Determine active card image for Swipe Mode
    const swipeCardImg = currentStep % 2 === 0 ? img1 : img2;

    return (
        <div className="flex flex-col h-full w-full relative z-10 text-white">

            {/* Header: Progress & Back */}
            <div className="flex-none px-4 py-4 md:px-10 md:py-8 w-full max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => { if (currentStep > 0) setCurrentStep(c => c - 1); else setIsStarted(false); }}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md border border-white/20 shadow-lg active:scale-90"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>

                    <div className="flex flex-col items-end">
                        <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-white/60 mb-2">
                            QUESTION {currentStep + 1} / {questions.length}
                        </span>
                        <div className="md:w-64 w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="flex-none px-6 pb-6 md:pb-10 text-center max-w-4xl mx-auto w-full z-20">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-2xl bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                    {currentQ.question}
                </h2>
            </div>

            {/* ======================= */}
            {/* MOBILE: TILTED CARDS INTERFACE (Ref: Step 973) */}
            {/* ======================= */}
            <div
                className="md:hidden flex-1 flex flex-col items-center justify-center w-full px-4 pb-20 relative select-none touch-none"
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
                onPointerLeave={handleDragEnd}
            >

                {/* Cards Container with Swipe Effects */}
                <div className="flex w-full justify-center items-center gap-4 px-2 mb-10 relative">
                    {/* Left Card */}
                    <button
                        onClick={() => handleOptionSelect(currentQ.id, 0)}
                        className={`relative w-[48%] aspect-[3/4.5] rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 border-2 
                            ${selectedOption === 0
                                ? 'scale-105 border-pink-500 ring-4 ring-pink-500/30 z-20 grayscale-0'
                                : 'border-white/10 grayscale-[30%] opacity-80 z-10'
                            }
                        `}
                        style={{
                            transform: `rotate(${-5 + (dragX / 20)}deg) translateX(${dragX < 0 ? dragX / 2 : 0}px)`,
                        }}
                    >
                        <img src={img1} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent transition-opacity ${dragX < -30 ? 'bg-pink-500/20' : ''}`}></div>

                        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-center">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-white text-center leading-tight drop-shadow-lg">
                                {activeOptions[0]}
                            </span>
                        </div>

                        {/* Selected Indicator */}
                        {selectedOption === 0 && (
                            <div className="absolute top-3 right-3 bg-pink-500 p-1.5 rounded-full shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        )}

                        {/* Swipe Prompt */}
                        {dragX < -40 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-pink-500/40 backdrop-blur-sm transition-all">
                                <div className="text-white text-4xl font-black">YES</div>
                            </div>
                        )}
                    </button>

                    {/* Right Card */}
                    <button
                        onClick={() => handleOptionSelect(currentQ.id, 1)}
                        className={`relative w-[48%] aspect-[3/4.5] rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 border-2
                            ${selectedOption === 1
                                ? 'scale-105 border-purple-500 ring-4 ring-purple-500/30 z-20 grayscale-0'
                                : 'border-white/10 grayscale-[30%] opacity-80 z-10'
                            }
                        `}
                        style={{
                            transform: `rotate(${5 + (dragX / 20)}deg) translateX(${dragX > 0 ? dragX / 2 : 0}px)`,
                        }}
                    >
                        <img src={img2} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent transition-opacity ${dragX > 30 ? 'bg-purple-500/20' : ''}`}></div>

                        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-center">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-white text-center leading-tight drop-shadow-lg">
                                {activeOptions[1]}
                            </span>
                        </div>

                        {/* Selected Indicator */}
                        {selectedOption === 1 && (
                            <div className="absolute top-3 right-3 bg-purple-500 p-1.5 rounded-full shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        )}

                        {/* Swipe Prompt */}
                        {dragX > 40 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-purple-500/40 backdrop-blur-sm transition-all">
                                <div className="text-white text-4xl font-black">YES</div>
                            </div>
                        )}
                    </button>

                </div>

                <p className="mt-4 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
                    Swipe or tap to select
                </p>
            </div>

            {/* ======================= */}
            {/* DESKTOP: GRID INTERFACE */}
            {/* ======================= */}
            <div className="hidden md:flex flex-1 w-full max-w-7xl mx-auto px-10 items-center justify-center">
                <div className="grid grid-cols-2 gap-12 w-full h-[60vh] items-center">

                    {/* Left Card */}
                    <button
                        onClick={() => handleOptionSelect(currentQ.id, 0)}
                        className={`relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 ease-out group border-4
                            ${selectedOption === 0
                                ? 'border-pink-500 shadow-pink-500/50 scale-105 z-20 grayscale-0 ring-4 ring-pink-500/30'
                                : `border-white/10 opacity-90 hover:opacity-100 hover:border-white/30 hover:scale-[1.02] grayscale-[20%] hover:grayscale-0 ${selectedOption === 1 ? 'opacity-40 blur-sm scale-95' : ''}`
                            }
                        `}
                    >
                        <img
                            src={img1}
                            alt={activeOptions[0]}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        <div className="absolute bottom-0 w-full p-10 flex flex-col items-center">
                            <div className={`px-6 py-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 transform group-hover:-translate-y-2
                                ${selectedOption === 0 ? 'bg-pink-500 text-white border-pink-500 shadow-lg' : 'bg-black/40 text-white border-white/20 group-hover:bg-black/60'}
                            `}>
                                <span className="text-2xl font-black uppercase tracking-widest">{activeOptions[0]}</span>
                            </div>
                        </div>

                        {/* Selection Checkmark */}
                        {selectedOption === 0 && (
                            <div className="absolute top-6 right-6 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        )}
                    </button>

                    {/* Right Card */}
                    <button
                        onClick={() => handleOptionSelect(currentQ.id, 1)}
                        className={`relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 ease-out group border-4
                            ${selectedOption === 1
                                ? 'border-purple-500 shadow-purple-500/50 scale-105 z-20 grayscale-0 ring-4 ring-purple-500/30'
                                : `border-white/10 opacity-90 hover:opacity-100 hover:border-white/30 hover:scale-[1.02] grayscale-[20%] hover:grayscale-0 ${selectedOption === 0 ? 'opacity-40 blur-sm scale-95' : ''}`
                            }
                        `}
                    >
                        <img
                            src={img2}
                            alt={activeOptions[1]}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        <div className="absolute bottom-0 w-full p-10 flex flex-col items-center">
                            <div className={`px-6 py-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 transform group-hover:-translate-y-2
                                ${selectedOption === 1 ? 'bg-purple-500 text-white border-purple-500 shadow-lg' : 'bg-black/40 text-white border-white/20 group-hover:bg-black/60'}
                            `}>
                                <span className="text-2xl font-black uppercase tracking-widest">{activeOptions[1]}</span>
                            </div>
                        </div>

                        {/* Selection Checkmark */}
                        {selectedOption === 1 && (
                            <div className="absolute top-6 right-6 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Footer / Next Button */}
            <div className="flex-none px-6 md:px-10 pb-10 pt-4 w-full max-w-7xl mx-auto z-30">
                <button
                    onClick={() => {
                        if (currentStep < questions.length - 1) {
                            setCurrentStep(prev => prev + 1);
                        } else {
                            handleSubmit();
                        }
                    }}
                    disabled={selectedOption === undefined || submitting}
                    className="w-full py-5 md:py-6 rounded-[2rem] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xl md:text-2xl uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(236,72,153,0.3)] hover:shadow-[0_15px_50px_rgba(236,72,153,0.4)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 disabled:shadow-none border border-white/20"
                >
                    {submitting ? 'Soulmate Finding...' : (currentStep === questions.length - 1 ? 'Find My Connection ✨' : 'Proceed to Next →')}
                </button>
            </div>
        </div>
    );
};

export default TrueConnectionQuiz;
