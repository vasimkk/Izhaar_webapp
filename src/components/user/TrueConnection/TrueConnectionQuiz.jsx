import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";
import TCLogo from "../../../assets/TrueConnect/TC.png";
import V1Icon from "../../../assets/TrueConnect/V1.png";
import V2Icon from "../../../assets/TrueConnect/V2.png";
import V3Icon from "../../../assets/TrueConnect/V3.png";

const TrueConnectionQuiz = ({ onComplete }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionId: optionKey }
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [exitDir, setExitDir] = useState(0); // -1 for left, 1 for right

    const [showInfo, setShowInfo] = useState(false);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const cardRef = React.useRef(null);
    const startXRef = React.useRef(0);
    const timerRef1 = React.useRef(null);
    const timerRef2 = React.useRef(null);

    const QUIZ_QUESTIONS = [
        { id: 1, question: "After a long day, you prefer to?", options: ["Chill alone", "Hang out"] },
        { id: 2, question: "You usually make decisions by.", options: ["Think Carefully", "Follow your heart"] },
        { id: 3, question: "In a group, you are mostly?", options: ["The Listener", "The talker"] },
        { id: 4, question: "Your vibe is more?", options: ["Calm", "Expressive"] },
        { id: 5, question: "If something is bothering you, you will..", options: ["Talk about it", "I’ll keep quiet"] },
        { id: 6, question: "During a small argument, you?", options: ["Solve quickly", "Take time"] },
        { id: 7, question: "You like your partner to?", options: ["Reassure you often", "Trust naturally"] },
        { id: 8, question: "When you care about someone, you?", options: ["Show it clearly", "Hide my feelings"] },
        { id: 9, question: "You prefer conversations that are..", options: ["Deep & meaningful", "Fun & light"] },
        { id: 10, question: "How often do you text someone you love?", options: ["Regular chats", "Only when needed"] },
        { id: 11, question: "When upset, you prefer?", options: ["Talking face to face", "Messaging first"] },
        { id: 12, question: "You show love more by.", options: ["Saying it", "Doing things"] },
        { id: 13, question: "How do you like to spend your perfect weekend?", options: ["Relax at home", "Go out & explore"] },
        { id: 14, question: "Your focus right now.", options: ["Career & goals", "Relationship"] },
        { id: 15, question: "How do you usually handle money.", options: ["Save for future", "Enjoy in present"] },
        { id: 16, question: "Do you plan everything or go with the flow?", options: ["Plan everything", "Go with the flow"] },
        { id: 17, question: "In a relationship, you value more?", options: ["Stability", "Passion"] },
        { id: 18, question: "Personal space is?", options: ["Important", "Not that important"] },
        { id: 19, question: "Jealousy level....", options: ["Low", "Slightly protective"] },
        { id: 20, question: "You fall in love?", options: ["Slowly", "Quickly"] },
    ];

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        // Reset state and clear timers whenever step changes (Prev/Next)
        setIsAnimating(false);
        setExitDir(0);
        if (timerRef1.current) clearTimeout(timerRef1.current);
        if (timerRef2.current) clearTimeout(timerRef2.current);
    }, [currentStep]);

    const fetchQuestions = async () => {
        try {
            const res = await api.get("/tc/questions");
            if (res.data && res.data.length > 0) {
                setQuestions(res.data);
            } else {
                setQuestions(QUIZ_QUESTIONS);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setQuestions(QUIZ_QUESTIONS);
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionKey) => {
        if (isAnimating) return;

        setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
        setIsAnimating(true);
        setExitDir(0);

        // Phase 1: Focus state duration - give user time to see the selection
        timerRef1.current = setTimeout(() => {
            setExitDir(optionKey === 0 ? -1 : 1);

            // Phase 2: Slide away and Next - wait for the animation to complete
            timerRef2.current = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                // States reset by useEffect automatically
            }, 800);
        }, 600);
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
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-transparent">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B72099] mb-4"></div>
            <p className="text-[#B72099]/60 font-medium tracking-widest uppercase text-xs">Preparing your experience...</p>
        </div>
    );

    if (questions.length === 0) return (
        <div className="flex flex-col items-center justify-center p-10 h-full bg-transparent">
            <div className="text-xl font-bold text-gray-400 mb-2">Initializing quiz...</div>
            <p className="text-gray-500">Setting up your connection experience.</p>
        </div>
    );

    if (!isStarted) {
        return (
            <div className="flex flex-col items-center justify-between min-h-screen text-center px-6 py-8 animate-fade-in relative z-10 bg-transparent">
                {/* Header */}
                <header className="w-full flex justify-between items-center mb-2">
                    <button
                        onClick={() => navigate('/user/dashboard')}
                        className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setShowInfo(true)}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF00BF] via-[#B72099] to-[#8000FF] flex items-center justify-center text-white font-serif italic font-bold text-lg shadow-lg hover:scale-110 active:scale-95 transition-all"
                    >
                        i
                    </button>
                </header>

                {/* Info Modal */}
                {showInfo && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-0 sm:pb-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div
                            className="bg-zinc-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 overflow-hidden animate-slide-up-fade relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Drag handle for mobile feel */}
                            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-4 mb-2 sm:hidden"></div>

                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-white tracking-tight">How it works</h3>
                                    <button
                                        onClick={() => setShowInfo(false)}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#FF00BF]/10 flex-none flex items-center justify-center text-[#FF00BF] font-bold">1</div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-1">Answer Honestly</h4>
                                            <p className="text-white/60 text-sm leading-relaxed">Respond to 20 deep personality questions that reveal your true relationship style and vibration.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#B72099]/10 flex-none flex items-center justify-center text-[#B72099] font-bold">2</div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-1">AI Matching</h4>
                                            <p className="text-white/60 text-sm leading-relaxed">Our advanced compatibility algorithm analyzes your patterns to find people whose energy complements yours.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#8000FF]/10 flex-none flex items-center justify-center text-[#8000FF] font-bold">3</div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-1">True Connections</h4>
                                            <p className="text-white/60 text-sm leading-relaxed">We reveal your top matches. Chat with people who truly understand you, knowing you're already on the same wavelength.</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowInfo(false)}
                                    className="w-full py-4 mt-8 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                                >
                                    Got it!
                                </button>
                            </div>
                        </div>

                        {/* Area to close on desktop click outside */}
                        <div className="absolute inset-0 -z-10" onClick={() => setShowInfo(false)}></div>
                    </div>
                )}

                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
                    {/* Main Heading Text */}
                    <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-[#EC4899] to-[#A855F7] bg-clip-text text-transparent mb-4 tracking-tight">
                        True Connect
                    </h1>

                    {/* Central Logo with Rings */}
                    <div className="relative mb-8">


                        <div className="relative w-36 h-36 md:w-44 md:h-44  flex items-center justify-center z-10 overflow-hidden">
                            <img
                                src={TCLogo}
                                alt="True Connect Icon"
                                className="w-[100%] h-[100%] object-contain "
                            />
                        </div>
                    </div>



                    {/* Tagline */}
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight max-w-xs mx-auto">
                        Find someone who truly<br />understands you..
                    </h2>

                    {/* Description Box */}
                    <div className="bg-[#1A0B2E]/60 backdrop-blur-xl border border-[#B72099]/40 rounded-[1.5rem] p-5 mb-4 shadow-[0_0_40px_rgba(183,32,153,0.15)] max-w-xs md:max-w-sm">
                        <p className="text-white/80 text-sm md:text-base leading-relaxed">
                            Answer <span className="text-white font-bold">20 quick questions</span> about your personality, feelings, and relationship style. If your vibes match, we'll connect you.
                        </p>
                    </div>

                    {/* Features Row */}
                    <div className="grid grid-cols-3 gap-2 mb-6 w-full max-w-md">
                        {[
                            { icon: V1Icon, label: "Personality Matching" },
                            { icon: V2Icon, label: "Emotional Compatibility" },
                            { icon: V3Icon, label: "Meaningful Connections" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-3 shadow-inner">
                                    <img src={item.icon} alt={item.label} className="w-full h-full object-contain" />
                                </div>
                                <span className="text-[10px] md:text-[11px] font-medium text-white/70 leading-tight">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Action */}
                    <div className="w-full max-w-xs">
                        <button
                            onClick={() => setIsStarted(true)}
                            className="w-full py-4 bg-gradient-to-r from-[#FF00BF] via-[#B72099] to-[#8000FF] text-white rounded-xl font-bold text-lg shadow-[0_10px_30px_rgba(183,32,153,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300 mb-3"
                        >
                            Begin your Journey
                        </button>
                        <p className="text-white/40 text-[10px] md:text-xs">
                            takes ~ 2 minutes • 100% private
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const isReviewing = currentStep === questions.length;
    const currentQ = !isReviewing ? questions[currentStep] : null;
    const progress = Math.min(((currentStep + (isReviewing ? 0 : 1)) / questions.length) * 100, 100);

    const activeOptions = currentQ?.options_json
        ? (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : currentQ.options_json)
        : (currentQ?.options || ["Option A", "Option B"]);

    const selectedOption = currentQ ? answers[currentQ.id] : undefined;

    const img1 = !isReviewing ? new URL(`../../../assets/TrueConnect/L${(currentStep + 1) === 11 ? 10 : (currentStep + 1)}.png`, import.meta.url).href : null;
    const img2 = !isReviewing ? new URL(`../../../assets/TrueConnect/R${currentStep + 1}.png`, import.meta.url).href : null;


    const handleDragStart = (e) => {
        setIsDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        startXRef.current = clientX;
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const walk = clientX - startXRef.current;
        setDragX(walk);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const distance = dragX;
        setDragX(0);

        if (Math.abs(distance) > 80) {
            const direction = distance > 0 ? 1 : 0;
            handleOptionSelect(currentQ.id, direction);
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full relative z-10 text-white overflow-hidden bg-transparent">
            {/* Header */}
            <header className="flex-none px-6 py-3 md:px-10 w-full max-w-7xl mx-auto flex justify-between items-center z-50">
                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex flex-col items-end pt-1">
                    <span className="text-[13px] font-bold text-[#FF00BF] mb-1 tracking-tight">
                        {isReviewing ? 'Done' : (currentStep + 1)}<span className="text-white/30 text-[10px] font-medium">/{questions.length}</span>
                    </span>
                    <div className="w-20 md:w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#FF00BF] to-[#8000FF] rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            {/* Interface */}
            <main className="flex-1 flex flex-col items-center justify-center w-full px-4 overflow-hidden relative select-none">
                {!isReviewing ? (
                    <>
                        <div
                            key={`q-text-${currentStep}`}
                            className="flex-none px-6 text-center max-w-lg mx-auto w-full z-20 mb-4 animate-slide-up-fade"
                        >
                            <h2 className="text-lg md:text-3xl font-bold leading-snug tracking-tight text-[#FF00BF] px-4">
                                {currentQ.question}
                            </h2>
                        </div>

                        {/* Mobile Side-by-Side Card Stacks */}
                        <div
                            key={`cards-mobile-${currentStep}`}
                            onTouchStart={handleDragStart}
                            onTouchMove={handleDragMove}
                            onTouchEnd={handleDragEnd}
                            className={`md:hidden relative w-full h-[40vh] max-h-[400px] flex items-center justify-center gap-5 px-4 perspective-[1200px] touch-none
                    ${exitDir === -1 ? '-translate-x-[120%] opacity-0 rotate-[-15deg] scale-90' : exitDir === 1 ? 'translate-x-[120%] opacity-0 rotate-[15deg] scale-90' : 'translate-x-0 opacity-100 rotate-0 scale-100'}
                    ${!isDragging ? 'transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transition-none'}
                    `}
                            style={{
                                transform: (exitDir === 0 && isDragging) ? `translateX(${dragX}px) rotate(${dragX * 0.08}deg) scale(${1 - Math.abs(dragX) * 0.0005})` : undefined
                            }}
                        >
                            {[img1, img2].map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`relative w-[46%] h-full flex items-center justify-center
                                ${!isDragging ? 'transition-all duration-800 cubic-bezier(0.23, 1, 0.32, 1)' : 'transition-none'}
                                ${isAnimating && selectedOption !== undefined && selectedOption !== idx ? 'opacity-0 scale-75 blur-md' : 'opacity-100'}
                                ${selectedOption === idx ? 'z-50 scale-[1.08]' : 'z-10'}
                                ${idx === 0 ? 'animate-stack-shuffle-1' : 'animate-stack-shuffle-2'}
                            `}
                                    style={{
                                        transform: (isAnimating && selectedOption === idx) ? (
                                            idx === 0 ? 'translateX(55%) scale(1.15) rotate(5deg)' : 'translateX(-55%) scale(1.15) rotate(-5deg)'
                                        ) : undefined,
                                        transitionDelay: isAnimating ? '0ms' : `${idx * 150}ms`
                                    }}
                                >
                                    {/* Premium Deck Stack Visual (Behind) */}
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`absolute inset-0 rounded-[1.5rem] bg-white/5 border border-white/20 pointer-events-none transition-all duration-500
                                        ${selectedOption !== undefined ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100'}
                                    `}
                                            style={{
                                                transform: `
                                            translateX(${(idx === 0 ? -1 : 1) * (i + 1) * 4}px) 
                                            translateY(${(i + 1) * 3}px)
                                            rotate(${(idx === 0 ? -1 : 1) * (i + 1) * 2}deg)
                                            scale(${1 - (i + 1) * 0.02})
                                        `,
                                                zIndex: -i - 1,
                                                opacity: 0.6 - (i * 0.12),
                                                backdropFilter: 'blur(4px)'
                                            }}
                                        />
                                    ))}

                                    <button
                                        onClick={() => handleOptionSelect(currentQ.id, idx)}
                                        className={`relative w-full h-[90%] rounded-[1.5rem] overflow-hidden transition-all duration-500 border-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                                    ${selectedOption === idx
                                                ? 'border-[#FF00BF] shadow-[0_0_60px_rgba(255,0,191,0.5)] ring-4 ring-[#FF00BF]/20'
                                                : 'border-white/80 hover:border-white shadow-xl'
                                            }
                                `}
                                    >
                                        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

                                        {/* Overlay Gradient for better text readability */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>

                                        <div className={`absolute inset-x-3 bottom-3 py-2 bg-zinc-900/90 backdrop-blur-md rounded-xl flex flex-col items-center border border-white/20 shadow-2xl transition-all duration-500
                                    ${selectedOption === idx ? 'scale-105 bg-[#FF00BF]/10 border-[#FF00BF]/50' : ''}
                                `}>
                                            <span className={`text-[10px] sm:text-xs font-black tracking-widest uppercase text-center px-1
                                        ${selectedOption === idx ? 'text-white' : 'text-white/90'}
                                    `}>
                                                {activeOptions[idx]}
                                            </span>
                                        </div>

                                        {/* Selection Pulse Effect */}
                                        {selectedOption === idx && (
                                            <div className="absolute inset-0 bg-[#FF00BF]/10 animate-pulse pointer-events-none"></div>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Grid */}
                        <div className="hidden md:grid grid-cols-2 gap-8 w-full max-w-5xl h-[50vh] items-center">
                            {[img1, img2].map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(currentQ.id, idx)}
                                    className={`relative h-full rounded-[2rem] overflow-hidden transition-all duration-500 border-2 group
                                ${selectedOption === idx
                                            ? 'border-pink-500 scale-[1.02] shadow-[0_0_30px_rgba(236,72,153,0.3)]'
                                            : 'border-white/10 hover:border-white/30'
                                        }
                            `}
                                >
                                    <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 py-4 bg-black/80 backdrop-blur-md border-t border-white/5 flex justify-center">
                                        <span className="text-lg font-bold text-white uppercase tracking-widest">{activeOptions[idx]}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto animate-bounce-in p-6">
                        <div className="w-24 h-24 mb-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF00BF] to-[#8000FF] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                            <img src={TCLogo} alt="TC Logo" className="w-full h-full object-contain relative z-10 animate-logo-float" />
                        </div>

                        <h2 className="text-3xl font-serif font-bold bg-gradient-to-r from-[#FF00BF] to-[#8000FF] bg-clip-text text-transparent mb-4">
                            Vibe Check Complete!
                        </h2>

                        <div className="bg-[#1A0B2E]/60 backdrop-blur-xl border border-[#B72099]/40 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(183,32,153,0.2)] mb-8">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <svg className="w-6 h-6 text-[#FF00BF]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.9L10 1.55l7.834 3.35a1 1 0 01.666.936V11c0 5.234-3.55 10.158-8.5 11.5a14.73 14.73 0 01-8.5-11.5V5.836a1 1 0 01.666-.936zM10 3.102L3.5 5.888V11a12.723 12.723 0 007.49 10.435A12.723 12.723 0 0016.5 11V5.888L10 3.102zM10 7a1 1 0 011 1v2h1a1 1 0 110 2h-2a1 1 0 01-1-1V8a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[#FF00BF] font-bold text-sm uppercase tracking-widest">Privacy Guaranteed</span>
                            </div>
                            <p className="text-white/80 leading-relaxed text-sm md:text-base">
                                Submit your answers to find your true matches. Your responses are <span className="text-white font-bold">100% private</span> and never shared publicly.
                            </p>
                            <p className="text-white/50 text-xs mt-4 italic">
                                Ready to see who's on your wavelength?
                            </p>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer Buttons */}
            <footer className="flex-none px-6 pb-6 pt-2 w-full max-w-2xl mx-auto z-40 relative flex gap-4">
                <button
                    onClick={() => {
                        if (currentStep > 0) setCurrentStep(prev => prev - 1);
                    }}
                    disabled={currentStep === 0 || submitting}
                    className="flex-1 py-3 rounded-full border border-[#FF00BF]/40 text-[#FF00BF] font-bold text-sm transition-all active:scale-95 disabled:opacity-20"
                >
                    Previous
                </button>

                <button
                    onClick={() => {
                        if (isReviewing) {
                            handleSubmit();
                        } else if (currentStep < questions.length - 1) {
                            // Manual Next button if needed, but handleOptionSelect usually handles it
                            setCurrentStep(prev => prev + 1);
                        } else {
                            // We are on the last question but maybe haven't answered it via click?
                            // Actually handleOptionSelect will trigger the transition to isReviewing
                            if (selectedOption !== undefined) {
                                setCurrentStep(questions.length);
                            }
                        }
                    }}
                    disabled={(selectedOption === undefined && !isReviewing) || submitting}
                    className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#FF00BF] to-[#8000FF] text-white font-bold text-sm shadow-xl shadow-[#B72099]/20 active:scale-95 disabled:opacity-40"
                >
                    {submitting ? 'Submitting...' : (isReviewing ? 'Submit Vibe' : 'Next')}
                </button>
            </footer>
        </div>
    );
};

export default TrueConnectionQuiz;