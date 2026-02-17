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
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-transparent">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B72099] mb-4"></div>
            <p className="text-[#B72099]/60 font-medium tracking-widest uppercase text-xs">Preparing your experience...</p>
        </div>
    );

    if (questions.length === 0) return (
        <div className="flex flex-col items-center justify-center p-10 h-full">
            <div className="text-xl font-bold text-gray-400 mb-2">Initializing quiz...</div>
            <p className="text-gray-500">Setting up your connection experience.</p>
        </div>
    );

    if (!isStarted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 animate-fade-in relative z-10 bg-transparent">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-[#B72099]/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#312E81]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl max-w-2xl w-full relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-5xl md:text-6xl mb-4 animate-bounce-slow">💝</div>
                        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-[#B72099] via-[#FF45BB] to-[#312E81] bg-clip-text text-transparent mb-4 tracking-tighter leading-tight">
                            True Connection
                        </h1>
                        <h2 className="text-lg md:text-2xl font-bold text-white/90 mb-4 px-4 leading-relaxed">
                            Discover meaningful relationships based on <span className="text-[#FF45BB]">compatibility</span>.
                        </h2>

                        <div className="text-left bg-white/5 rounded-2xl p-5 mb-6 border border-white/10 backdrop-blur-sm">
                            <h3 className="font-black text-[#FF45BB] mb-3 flex items-center gap-2 uppercase tracking-[0.2em] text-[9px]">
                                <span className="bg-[#B72099]/20 p-2 rounded-full flex items-center justify-center">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                </span>
                                The Experience
                            </h3>
                            <ul className="space-y-3 text-white/70 text-xs md:text-base font-medium">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B72099] font-black">01</span>
                                    <span>Answer <strong>{questions.length} questions</strong> about your true self and vibe.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#FF45BB] font-black">02</span>
                                    <span>Match with souls who <strong>truly resonate</strong> with your personality.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#312E81] font-black">03</span>
                                    <span>Experience a <strong>80%+ compatibility</strong> connection.</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setIsStarted(true)}
                            className="w-full py-4 bg-gradient-to-r from-[#B72099] to-[#801369] text-white rounded-2xl font-black text-lg shadow-[0_12px_35px_rgba(183,32,153,0.3)] hover:shadow-[#B72099]/50 hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center justify-center gap-3 uppercase tracking-widest"
                        >
                            Begin Journey ✨
                        </button>
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
        <div className="flex flex-col min-h-screen w-full relative z-10 text-white bg-transparent overflow-hidden">
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

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[#B72099]/10 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-[#312E81]/15 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }}></div>
                <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute romantic-float text-[#B72099]/15 select-none pointer-events-none"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${12 + Math.random() * 10}s`,
                                animationDelay: `${-Math.random() * 20}s`,
                                fontSize: `${10 + Math.random() * 30}px`,
                                filter: 'blur(1px)'
                            }}
                        >
                            ❤️
                        </div>
                    ))}
                </div>
            </div>

            <header className="flex-none px-6 py-0 md:px-10 md:py-2 w-full max-w-7xl mx-auto flex justify-between items-center z-50">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all invisible"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>


            </header>

            {/* Interface */}
            <main className="flex-1 flex flex-col items-center justify-center w-full px-4 overflow-hidden relative select-none">
                <div className="flex-none px-6 py-0 text-center max-w-2xl mx-auto w-full z-20 mb-1">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-tight drop-shadow-2xl bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
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

                {/* Mobile Side-by-Side 3D Stack & Progress Grid */}
                <div className="md:hidden relative w-full h-[45vh] flex flex-col items-center justify-center gap-4 px-2 perspective-[1500px]">
                    <div className="relative w-full flex items-center justify-center gap-3 h-full touch-none"
                        onPointerDown={handleDragStart}
                        onPointerMove={handleDragMove}
                        onPointerUp={handleDragEnd}
                        onPointerLeave={handleDragEnd}
                    >
                        {[img1, img2].map((img, idx) => (
                            <div key={idx} className="relative w-[48%] aspect-[3/5] h-full">
                                {/* Deck Stack Visual (Behind) */}
                                {[...Array(Math.min(3, questions.length - currentStep))].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute inset-0 bg-white/5 rounded-xl border border-white/10 shadow-lg"
                                        style={{
                                            transform: `translateY(${i * 3}px) scale(${1 - i * 0.02})`,
                                            zIndex: 0 - i
                                        }}
                                    />
                                ))}

                                <button
                                    onClick={() => handleOptionSelect(currentQ.id, idx)}
                                    className={`relative w-full h-full rounded-xl shadow-2xl overflow-hidden transition-all duration-300 border
                                        ${selectedOption === idx
                                            ? 'border-pink-500 ring-2 ring-pink-500/30 z-20 scale-[1.03]'
                                            : 'border-white/10 z-10 opacity-90'
                                        }
                                    `}
                                    style={{
                                        transform: `
                                            rotateY(${idx === 0 ? 12 + (dragX * 0.1) : -12 + (dragX * 0.1)}deg)
                                            translateZ(${selectedOption === idx ? '20px' : '0px'})
                                            ${idx === 0 ? 'origin-right' : 'origin-left'}
                                        `,
                                        filter: selectedOption !== undefined && selectedOption !== idx ? 'grayscale(0.5) brightness(0.7)' : 'none'
                                    }}
                                >
                                    <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

                                    {/* Subtle Choice Indicator */}
                                    {selectedOption === idx && (
                                        <div className="absolute inset-0 bg-pink-500/10 backdrop-blur-[1px] flex items-center justify-center">
                                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/50">
                                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute inset-x-0 bottom-0 py-2.5 bg-black/90 backdrop-blur-md flex flex-col items-center border-t border-white/10">
                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.15em] leading-none">
                                            {activeOptions[idx]}
                                        </span>
                                    </div>

                                    {/* Swipe Hint Arrow */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 ${idx === 0 ? 'right-2' : 'left-2'} opacity-30 animate-pulse`}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={idx === 0 ? 'rotate-180' : ''}>
                                            <path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Progress Mini-Grid (All 20 Cards Highlight) */}
                    <div className="w-full flex flex-col items-center gap-1.5 mb-1 px-4">
                        <div className="flex gap-1 items-center justify-center w-full max-w-[280px]">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 h-3 rounded-full transition-all duration-500 ${i === currentStep
                                        ? 'bg-pink-500 h-5 shadow-[0_0_10px_rgba(236,72,153,0.6)] z-10'
                                        : i < currentStep
                                            ? 'bg-pink-500/30'
                                            : 'bg-white/10'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-white/40 text-[7px] font-black uppercase tracking-[0.5em] flex items-center gap-2">
                            <span className="w-4 h-[1px] bg-white/20"></span>
                            Question {currentStep + 1} of 20
                            <span className="w-4 h-[1px] bg-white/20"></span>
                        </p>
                    </div>
                </div>
            </main>

            <footer className="flex-none px-6 pb-2 pt-0 w-full max-w-2xl mx-auto z-40 relative flex gap-5">
                <button
                    onClick={() => {
                        if (currentStep > 0) setCurrentStep(prev => prev - 1);
                    }}
                    disabled={currentStep === 0}
                    className={`flex-1 py-4 rounded-full border-2 border-transparent relative transition-all active:scale-95 disabled:opacity-0
                        ${currentStep > 0 ? 'bg-clip-padding' : ''}
                    `}
                    style={currentStep > 0 ? {
                        background: 'linear-gradient(#0F0F17, #0F0F17) padding-box, linear-gradient(to right, #B72099, #6366F1) border-box',
                        border: '2px solid transparent'
                    } : {}}
                >
                    <span className="text-pink-400 font-bold text-sm uppercase tracking-[0.15em]">Previous</span>
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
                    className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white font-bold text-sm uppercase tracking-[0.15em] shadow-lg shadow-pink-500/20 disabled:opacity-30 disabled:grayscale transition-all active:scale-95"
                >
                    {submitting ? '...' : (currentStep === questions.length - 1 ? 'Finish' : 'Next')}
                </button>
            </footer>
        </div>
    );
};

export default TrueConnectionQuiz;
