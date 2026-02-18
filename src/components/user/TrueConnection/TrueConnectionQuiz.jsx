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
        setExitDir(0); // Reset at start

        // Phase 1: Scale up the selected card and fade others (Focus state)
        // Handled by selectedOption in the render logic

        // Phase 1: Quick Focus state
        setTimeout(() => {
            setExitDir(optionKey === 0 ? -1 : 1);
        }, 300);

        // Phase 2: Slide away and Next
        setTimeout(() => {
            if (currentStep < questions.length - 1) {
                setCurrentStep(prev => prev + 1);
                setIsAnimating(false);
                setExitDir(0);
            } else {
                setIsAnimating(false);
            }
        }, 800);
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
                    <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-[#EC4899] to-[#A855F7] bg-clip-text text-transparent mb-12 tracking-tight">
                        True Connect
                    </h1>

                    {/* Central Logo with Rings */}
                    <div className="relative mb-16">
                        {/* Static Rings */}
                        <div className="absolute inset-[-40px] rounded-full border border-white/5 opacity-30"></div>
                        <div className="absolute inset-[-30px] rounded-full border border-white/5 opacity-50"></div>
                        <div className="absolute inset-[-20px] rounded-full border border-white/5 opacity-80"></div>

                        {/* Pulsing Animated Rings */}
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="absolute inset-0 rounded-full border border-white/10 animate-ping"
                                style={{
                                    animationDelay: `${i * 0.5}s`,
                                    animationDuration: '3s',
                                    transform: `scale(${1 + i * 0.2})`
                                }}
                            ></div>
                        ))}

                        <div className="relative w-36 h-36 md:w-44 md:h-44  flex items-center justify-center z-10 overflow-hidden">
                            <img
                                src={TCLogo}
                                alt="True Connect Icon"
                                className="w-[70%] h-[70%] object-contain animate-pulse"
                            />
                        </div>
                    </div>



                    {/* Tagline */}
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight max-w-xs mx-auto">
                        Find someone who truly<br />understands you..
                    </h2>

                    {/* Description Box */}
                    <div className="bg-[#1A0B2E]/60 backdrop-blur-xl border border-[#B72099]/40 rounded-[1.5rem] p-5 mb-10 shadow-[0_0_40px_rgba(183,32,153,0.15)] max-w-xs md:max-w-sm">
                        <p className="text-white/80 text-sm md:text-base leading-relaxed">
                            Answer <span className="text-white font-bold">20 quick questions</span> about your personality, feelings, and relationship style. If your vibes match, we'll connect you.
                        </p>
                    </div>

                    {/* Features Row */}
                    <div className="grid grid-cols-3 gap-2 mb-12 w-full max-w-md">
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

    const currentQ = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    const activeOptions = currentQ.options_json
        ? (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : currentQ.options_json)
        : (currentQ.options || ["Option A", "Option B"]);

    const selectedOption = answers[currentQ.id];

    const img1 = new URL(`../../../assets/TrueConnect/L${(currentStep + 1) === 11 ? 10 : (currentStep + 1)}.png`, import.meta.url).href;
    const img2 = new URL(`../../../assets/TrueConnect/R${currentStep + 1}.png`, import.meta.url).href;

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
            const direction = dragX > 0 ? 1 : 0;
            handleOptionSelect(currentQ.id, direction);
            setTimeout(() => setDragX(0), 100);
        } else {
            setDragX(0);
        }
    };

    return (
        <div className="flex flex-col min-h-screen w-full relative z-10 text-white overflow-hidden bg-transparent">
            <header className="flex-none px-6 py-6 md:px-10 w-full max-w-7xl mx-auto flex justify-between items-start z-50">
                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex flex-col items-end pt-1">
                    <span className="text-[15px] font-bold text-[#FF00BF] mb-2 tracking-tight">
                        {currentStep + 1}<span className="text-white/30 text-sm font-medium">/{questions.length}</span>
                    </span>
                    <div className="w-24 md:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#FF00BF] to-[#8000FF] rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            {/* Interface */}
            <main className="flex-1 flex flex-col items-center justify-center w-full px-4 overflow-hidden relative select-none pt-2">
                <div
                    key={`q-text-${currentStep}`}
                    className="flex-none px-6 py-0 text-center max-w-lg mx-auto w-full z-20 mb-8 animate-slide-up-fade"
                >
                    <h2 className="text-2xl md:text-3xl font-bold leading-snug tracking-tight text-[#FF00BF] px-4">
                        {currentQ.question}
                    </h2>
                </div>

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

                <div
                    key={`cards-mobile-${currentStep}`}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                    className={`md:hidden relative w-full h-[42vh] flex items-center justify-center gap-4 px-3 perspective-[1000px] animate-slide-up-fade
                    ${exitDir === -1 ? '-translate-x-[150%] opacity-0 rotate-[-20deg]' : exitDir === 1 ? 'translate-x-[150%] opacity-0 rotate-[20deg]' : 'translate-x-0 opacity-100 rotate-0'}
                    ${!isDragging ? 'transition-all duration-700 cubic-bezier(0.25, 1, 0.5, 1)' : 'transition-none'}
                    `}
                    style={{
                        transform: (exitDir === 0 && isDragging) ? `translateX(${dragX}px) rotate(${dragX * 0.05}deg)` : undefined
                    }}
                >
                    {[img1, img2].map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative w-[48%] h-full flex items-center justify-center
                                ${!isDragging ? 'transition-all duration-600 cubic-bezier(0.25, 1, 0.5, 1)' : 'transition-none'}
                                ${selectedOption !== undefined && selectedOption !== idx ? 'opacity-0 scale-75 blur-md pointer-events-none' : 'opacity-100'}
                                ${selectedOption === idx ? 'z-50 scale-[1.08]' : 'z-10'}
                            `}
                            style={{
                                transform: selectedOption === idx ? (
                                    idx === 0 ? 'translateX(52%) scale(1.1)' : 'translateX(-52%) scale(1.1)'
                                ) : undefined
                            }}
                        >
                            {/* Deck Stack Visual (Behind - crisp white outlines) */}
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`absolute inset-0 rounded-[1.8rem] border-[2px] border-white/60 pointer-events-none transition-opacity duration-300
                                        ${selectedOption !== undefined ? 'opacity-0' : 'opacity-100'}
                                    `}
                                    style={{
                                        transform: `
                                            translateX(${(idx === 0 ? -1 : 1) * (i + 1) * 3}px) 
                                            translateY(${(i + 1) * 2}px)
                                            rotate(${(idx === 0 ? -1 : 1) * (i + 1) * 1.5}deg)
                                        `,
                                        zIndex: 0 - i,
                                        opacity: 0.9 - (i * 0.15)
                                    }}
                                />
                            ))}

                            <button
                                onClick={() => handleOptionSelect(currentQ.id, idx)}
                                className={`relative w-full h-full rounded-[1.8rem] overflow-hidden transition-all duration-500 border-[2.5px] shadow-2xl
                                    ${selectedOption === idx
                                        ? 'border-[#FF00BF] shadow-[0_0_50px_rgba(255,0,191,0.4)]'
                                        : 'border-white'
                                    }
                                `}
                            >
                                <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

                                <div className={`absolute inset-x-2 bottom-3 py-2.5 bg-black rounded-xl flex flex-col items-center border border-white/20 shadow-2xl transition-transform duration-500
                                    ${selectedOption === idx ? 'scale-105' : ''}
                                `}>
                                    <span className="text-[12px] font-bold text-white tracking-wide">
                                        {activeOptions[idx]}
                                    </span>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer Buttons */}
            <footer className="flex-none px-6 pb-12 pt-8 w-full max-w-2xl mx-auto z-40 relative flex gap-4">
                <button
                    onClick={() => {
                        if (currentStep > 0) setCurrentStep(prev => prev - 1);
                    }}
                    disabled={currentStep === 0}
                    className="flex-1 py-4 rounded-full border border-[#FF00BF]/40 text-[#FF00BF] font-bold text-[15px] transition-all active:scale-95 disabled:opacity-20"
                >
                    Previous
                </button>

                <button
                    onClick={() => {
                        if (currentStep < questions.length - 1) {
                            setCurrentStep(prev => prev + 1);
                        } else {
                            handleSubmit();
                        }
                    }}
                    disabled={selectedOption === undefined || submitting}
                    className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#FF00BF] to-[#8000FF] text-white font-bold text-[15px] shadow-xl shadow-[#B72099]/20 active:scale-95 disabled:opacity-40"
                >
                    {submitting ? '...' : (currentStep === questions.length - 1 ? 'Finish' : 'Next')}
                </button>
            </footer>
        </div>
    );
};

export default TrueConnectionQuiz;
