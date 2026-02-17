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
    const [isAnimating, setIsAnimating] = useState(false);
    const [exitDir, setExitDir] = useState(0); // -1 for left, 1 for right

    // Swipe State
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

        // Phase 2: After the focus moment, slide it away
        setTimeout(() => {
            setExitDir(optionKey === 0 ? -1 : 1);
        }, 400);

        // Phase 3: Transition to next step
        setTimeout(() => {
            if (currentStep < questions.length - 1) {
                setCurrentStep(prev => prev + 1);
                setIsAnimating(false);
                setExitDir(0);
            } else {
                setIsAnimating(false);
            }
        }, 900);
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
            <div className="flex flex-col items-center justify-between min-h-screen text-center px-6 py-10 animate-fade-in relative z-10 bg-transparent">
                {/* Header */}
                <header className="w-full flex justify-between items-center mb-4">
                    <button
                        onClick={() => navigate('/user/dashboard')}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] flex items-center justify-center text-white font-serif italic font-bold text-lg shadow-lg">
                        i
                    </div>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-[#EC4899] to-[#A855F7] bg-clip-text text-transparent mb-12 tracking-tight">
                        True Connect
                    </h1>

                    {/* Central Pulse Icon */}
                    <div className="relative mb-16">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#3D1466] flex items-center justify-center z-10 border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                            <div className="text-white flex flex-col items-center">
                                <div className="flex items-center gap-1.5 animate-pulse">
                                    <div className="w-2 h-8 bg-white rounded-full opacity-40"></div>
                                    <div className="w-2 h-12 bg-white rounded-full opacity-60"></div>
                                    <div className="text-2xl">❤️</div>
                                    <div className="w-2 h-12 bg-white rounded-full opacity-60"></div>
                                    <div className="w-2 h-8 bg-white rounded-full opacity-40"></div>
                                </div>
                            </div>
                        </div>
                        {/* Pulse Rings */}
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
                    </div>

                    {/* Tagline */}
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                        Find someone who truly<br />understands you..
                    </h2>

                    {/* Description Box */}
                    <div className="bg-black/40 backdrop-blur-xl border border-[#EC4899]/30 rounded-[2rem] p-6 mb-10 shadow-[0_0_30px_rgba(236,72,153,0.15)]">
                        <p className="text-white/80 text-sm md:text-base leading-relaxed">
                            Answer <span className="text-white font-bold">20 quick questions</span> about your personality, feelings, and relationship style. If your vibes match, we'll connect you.
                        </p>
                    </div>

                    {/* Features Row */}
                    <div className="grid grid-cols-3 gap-4 mb-12 w-full">
                        {[
                            { icon: "🔘", label: "Personality Matching" },
                            { icon: "💜", label: "Emotional Compatibility" },
                            { icon: "🤝", label: "Meaningful Connections" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-inner shadow-white/5">
                                    {item.icon}
                                </div>
                                <span className="text-[10px] md:text-[11px] font-medium text-white/60 leading-tight">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Action */}
                    <button
                        onClick={() => setIsStarted(true)}
                        className="w-full py-5 bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300 mb-4"
                    >
                        Begin your Journey
                    </button>
                    <p className="text-white/40 text-[10px] md:text-xs">
                        takes ~ 2 minutes • 100% private
                    </p>
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
            <header className="flex-none px-6 py-6 md:px-10 w-full max-w-7xl mx-auto flex justify-between items-center z-50">
                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex flex-col items-end">
                    <span className="text-[14px] font-bold text-pink-400/80 mb-1 tracking-tight">
                        {currentStep + 1}<span className="text-white/40">/{questions.length}</span>
                    </span>
                    <div className="w-24 md:w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            {/* Interface */}
            <main className="flex-1 flex flex-col items-center justify-center w-full px-4 overflow-hidden relative select-none pt-2">
                <div
                    key={`q-text-${currentStep}`}
                    className="flex-none px-6 py-0 text-center max-w-2xl mx-auto w-full z-20 mb-12 animate-slide-up-fade"
                >
                    <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight bg-gradient-to-r from-[#EC4899] to-[#A855F7] bg-clip-text text-transparent px-4">
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

                {/* Mobile Side-by-Side 3D Stack */}
                <div
                    key={`cards-mobile-${currentStep}`}
                    className={`md:hidden relative w-full h-[40vh] flex items-center justify-center gap-4 px-4 perspective-[1000px] transition-all duration-700 animate-slide-up-fade
                    ${exitDir === -1 ? '-translate-x-[150%] opacity-0 rotate-[-15deg]' : exitDir === 1 ? 'translate-x-[150%] opacity-0 rotate-[15deg]' : 'translate-x-0 opacity-100 rotate-0'}`}>
                    {[img1, img2].map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative w-[48%] h-full flex items-center justify-center transition-all duration-500
                                ${selectedOption !== undefined && selectedOption !== idx ? 'opacity-0 scale-75 blur-sm' : 'opacity-100'}
                                ${selectedOption === idx ? 'z-50 scale-[1.15] translate-y-[-10px]' : 'z-10'}
                            `}
                        >
                            {/* Deck Stack Visual (Behind - crisp white outlines fanning out) */}
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`absolute inset-0 rounded-[1.2rem] border border-white/60 pointer-events-none transition-opacity duration-300
                                        ${selectedOption !== undefined ? 'opacity-0' : 'opacity-100'}
                                    `}
                                    style={{
                                        transform: `
                                            translateX(${(idx === 0 ? -1 : 1) * (i + 1) * 3}px) 
                                            rotate(${(idx === 0 ? -1 : 1) * (i + 1) * 1.5}deg)
                                        `,
                                        zIndex: 0 - i,
                                        opacity: 1 - (i * 0.15)
                                    }}
                                />
                            ))}

                            <button
                                onClick={() => handleOptionSelect(currentQ.id, idx)}
                                className={`relative w-full h-full rounded-[1.2rem] overflow-hidden transition-all duration-500 border-[1.5px] shadow-2xl
                                    ${selectedOption === idx
                                        ? 'border-pink-500 ring-4 ring-pink-500/40 shadow-[0_0_50px_rgba(236,72,153,0.4)]'
                                        : 'border-white/90'
                                    }
                                `}
                            >
                                <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

                                <div className={`absolute inset-x-4 bottom-3 py-2 bg-black rounded-lg flex flex-col items-center border border-white/10 shadow-lg transition-transform duration-500
                                    ${selectedOption === idx ? 'scale-110 translate-y-[-5px]' : ''}
                                `}>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.05em]">
                                        {activeOptions[idx]}
                                    </span>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer Buttons */}
            <footer className="flex-none px-6 pb-12 pt-8 w-full max-w-2xl mx-auto z-40 relative flex gap-6">
                <button
                    onClick={() => {
                        if (currentStep > 0) setCurrentStep(prev => prev - 1);
                    }}
                    disabled={currentStep === 0}
                    className="flex-1 py-4 rounded-full border border-pink-500/50 text-pink-500 font-bold text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20"
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
                    className="flex-1 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-pink-500/20 active:scale-95 disabled:opacity-40"
                >
                    {submitting ? '...' : (currentStep === questions.length - 1 ? 'Finish' : 'Next')}
                </button>
            </footer>
        </div>
    );
};

export default TrueConnectionQuiz;
