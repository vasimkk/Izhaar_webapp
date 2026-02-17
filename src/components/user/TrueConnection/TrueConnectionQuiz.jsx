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
            <div className="text-xl font-bold text-gray-400 mb-2">Initializing quiz...</div>
            <p className="text-gray-500">Setting up your connection experience.</p>
        </div>
    );

    // ==========================================
    // START SCREEN
    // ==========================================
    if (!isStarted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 animate-fade-in relative z-10 bg-[#030014]">
                {/* Romantic Glows */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-700/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="bg-white/5 dark:bg-black/40 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl max-w-2xl w-full relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-7xl mb-6 animate-bounce-slow">�</div>
                        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6 tracking-tighter">
                            True Connection
                        </h1>
                        <h2 className="text-xl md:text-2xl font-bold text-white/90 mb-6 px-4">
                            Discover meaningful relationships based on <span className="text-pink-400">compatibility</span>.
                        </h2>

                        <div className="text-left bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
                            <h3 className="font-black text-pink-400 mb-3 flex items-center gap-2 uppercase tracking-widest text-xs">
                                <span className="bg-pink-500/20 p-2 rounded-full">✨</span>
                                The Experience
                            </h3>
                            <ul className="space-y-4 text-white/70 text-sm md:text-base">
                                <li className="flex items-start gap-4">
                                    <span className="text-pink-500 font-bold">01</span>
                                    <span>Answer <strong>{questions.length} questions</strong> about your true self and vibe.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-purple-500 font-bold">02</span>
                                    <span>Match with souls who <strong>truly resonate</strong> with your personality.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-indigo-500 font-bold">03</span>
                                    <span>Experience a <strong>80%+ compatibility</strong> connection.</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setIsStarted(true)}
                            className="w-full py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-black text-xl shadow-[0_10px_40px_rgba(236,72,153,0.3)] hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            Begin Journey ✨
                        </button>
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
    const activeOptions = currentQ.options_json
        ? (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : currentQ.options_json)
        : (currentQ.options || ["Option A", "Option B"]);

    const selectedOption = answers[currentQ.id];

    // Get Local Images (L1 to L20, R1 to R20)
    // L11 is missing, so we fallback to L10 for question 11
    const img1 = new URL(`../../../assets/TrueConnect/L${(currentStep + 1) === 11 ? 10 : (currentStep + 1)}.png`, import.meta.url).href;
    const img2 = new URL(`../../../assets/TrueConnect/R${currentStep + 1}.png`, import.meta.url).href;

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
        <div className="flex flex-col min-h-screen w-full relative z-10 text-white bg-[#030014] overflow-hidden">
            <style>
                {`
                    @keyframes floatUp {
                        0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
                        10% { opacity: 0.6; }
                        90% { opacity: 0.6; }
                        100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
                    }
                    .romantic-float {
                        animation: floatUp 15s linear infinite;
                    }
                `}
            </style>

            {/* Consistently Romantic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-pink-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-700/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>

                {/* Floating Hearts */}
                <div className="absolute inset-0">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute romantic-float text-pink-500/20"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${10 + Math.random() * 10}s`,
                                animationDelay: `${-Math.random() * 20}s`,
                                fontSize: `${12 + Math.random() * 28}px`
                            }}
                        >
                            ❤️
                        </div>
                    ))}
                </div>
            </div>

            {/* Header: Progress & Back */}
            <header className="flex-none px-6 py-4 md:px-10 md:py-8 w-full max-w-7xl mx-auto flex justify-between items-center z-50">
                <button
                    onClick={() => { if (currentStep > 0) setCurrentStep(c => c - 1); else setIsStarted(false); }}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all backdrop-blur-md border border-white/10 shadow-lg active:scale-90"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] md:text-xs font-black tracking-[0.3em] text-pink-400 mb-2 uppercase drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]">
                        Question {currentStep + 1} / {questions.length}
                    </span>
                    <div className="w-24 md:w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </header>

            {/* Question */}
            <div className="flex-none px-6 py-4 text-center max-w-4xl mx-auto w-full z-20">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-2xl bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                    {currentQ.question}
                </h2>
            </div>

            {/* Interface */}
            <main className="flex-1 flex flex-col items-center justify-center w-full px-4 overflow-hidden relative select-none">

                {/* Desktop/Tablet Grid */}
                <div className="hidden md:grid grid-cols-2 gap-10 w-full max-w-6xl h-[55vh] items-center">
                    {[img1, img2].map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(currentQ.id, idx)}
                            className={`relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 border-4 group
                                ${selectedOption === idx
                                    ? 'border-pink-500 scale-105 z-20 ring-8 ring-pink-500/20'
                                    : 'border-white/5 opacity-80 hover:opacity-100 hover:border-white/20'
                                }
                            `}
                        >
                            <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 w-full p-8 flex flex-col items-center">
                                <div className={`px-6 py-3 rounded-2xl backdrop-blur-xl border font-black uppercase tracking-widest text-lg transition-all
                                    ${selectedOption === idx ? 'bg-pink-500 text-white border-pink-400' : 'bg-black/40 text-white/90 border-white/10'}
                                `}>
                                    {activeOptions[idx]}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden flex w-full justify-between items-center gap-4 py-6 touch-none"
                    onPointerDown={handleDragStart}
                    onPointerMove={handleDragMove}
                    onPointerUp={handleDragEnd}
                    onPointerLeave={handleDragEnd}
                >
                    {[img1, img2].map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(currentQ.id, idx)}
                            className={`relative w-[48%] aspect-[4/6] rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-300 border-2 active:scale-95
                                ${selectedOption === idx
                                    ? 'scale-[1.05] border-pink-500 ring-4 ring-pink-500/30 z-20 opacity-100'
                                    : 'border-white/10 opacity-70 grayscale-[30%]'
                                }
                            `}
                            style={{
                                transform: idx === 0
                                    ? `rotate(${-4 + (dragX / 25)}deg) translateX(${dragX < 0 ? dragX / 3 : 0}px)`
                                    : `rotate(${4 + (dragX / 25)}deg) translateX(${dragX > 0 ? dragX / 3 : 0}px)`
                            }}
                        >
                            <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                            <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col items-center">
                                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white text-center leading-tight drop-shadow-lg">
                                    {activeOptions[idx]}
                                </span>
                            </div>

                            {selectedOption === idx && (
                                <div className="absolute top-3 right-3 bg-pink-500 p-1.5 rounded-full shadow-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}

                            {/* Swipe Prompts */}
                            {((idx === 0 && dragX < -40) || (idx === 1 && dragX > 40)) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-pink-500/40 backdrop-blur-sm transition-all">
                                    <div className="text-white text-3xl font-black">YES</div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <p className="mt-4 md:hidden text-white/30 text-[9px] font-black uppercase tracking-[0.4em] animate-pulse">
                    Swipe or tap to select
                </p>
            </main>

            {/* Footer */}
            <footer className="flex-none px-6 pb-10 pt-4 w-full max-w-7xl mx-auto z-40">
                <button
                    onClick={() => {
                        if (currentStep < questions.length - 1) {
                            setCurrentStep(prev => prev + 1);
                        } else {
                            handleSubmit();
                        }
                    }}
                    disabled={selectedOption === undefined || submitting}
                    className="w-full py-5 md:py-6 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-black text-lg md:text-2xl uppercase tracking-[0.2em] shadow-[0_15px_45px_rgba(236,72,153,0.3)] hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale disabled:scale-100 disabled:shadow-none border border-white/20"
                >
                    {submitting ? 'Soulmate Finding...' : (currentStep === questions.length - 1 ? 'Unlock Connection ✨' : 'Proceed to Next →')}
                </button>
            </footer>
        </div>
    );
};

export default TrueConnectionQuiz;
