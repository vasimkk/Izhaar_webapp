import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";
import { getCloudUrl } from "../../../cloudinaryUrls";
const TCLogo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/TrueConnect/TC?_a=BAMAOGeA0";
const V1Icon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/TrueConnect/V1?_a=BAMAOGeA0";
const V2Icon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/TrueConnect/V2?_a=BAMAOGeA0";
const V3Icon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/TrueConnect/V3?_a=BAMAOGeA0";

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

    // Derived states
    const isReviewing = currentStep === questions.length;

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

    // Predictive Preloading: Fetch next question images in background
    useEffect(() => {
        if (!isReviewing && currentStep < questions.length - 1) {
            const nextStep = currentStep + 1;
            const nextImg1 = getCloudUrl(`TrueConnect/L${(nextStep + 1) === 11 ? 10 : (nextStep + 1)}.webp`, 'w_400');
            const nextImg2 = getCloudUrl(`TrueConnect/R${nextStep + 1}.webp`, 'w_400');

            if (nextImg1) {
                const img = new Image();
                img.src = nextImg1;
            }
            if (nextImg2) {
                const img = new Image();
                img.src = nextImg2;
            }
        }
    }, [currentStep, isReviewing, questions.length]);

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

    const currentQ = !isReviewing ? questions[currentStep] : null;
    const progress = Math.min(((currentStep + (isReviewing ? 0 : 1)) / questions.length) * 100, 100);

    const activeOptions = currentQ?.options_json
        ? (typeof currentQ.options_json === 'string' ? JSON.parse(currentQ.options_json) : currentQ.options_json)
        : (currentQ?.options || ["Option A", "Option B"]);

    const selectedOption = currentQ ? answers[currentQ.id] : undefined;

    const img1 = !isReviewing ? getCloudUrl(`TrueConnect/L${(currentStep + 1) === 11 ? 10 : (currentStep + 1)}.webp`, 'w_400') : null;
    const img2 = !isReviewing ? getCloudUrl(`TrueConnect/R${currentStep + 1}.webp`, 'w_400') : null;


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

                <div className="flex flex-col items-end pt-5">
                    <div className="w-20 md:w-32 h-[5px] bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#EC4899] to-[#A855F7] rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            {/* Interface */}
            <main className="flex-1 flex flex-col items-center justify-start w-full px-4 pt-6 overflow-hidden relative select-none">
                {!isReviewing ? (
                    <>
                        <div
                            key={`q-text-${currentStep}`}
                            className="flex-none px-6 text-center max-w-[320px] sm:max-w-lg mx-auto w-full z-20 mb-8 sm:mb-12"
                        >
                            {/* Animated Question Counter above the question */}
                            <div className="mb-3 animate-slide-up-fade">
                                <span className="text-[13px] font-bold tracking-[0.3em] uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <span className="text-[#EC4899]">Question</span>
                                    <span className="text-white ml-2">{isReviewing ? 'Done' : (currentStep + 1)}</span>
                                    <span className="text-white/30 ml-1">/{questions.length}</span>
                                </span>
                            </div>

                            <h2 className="text-[22px] font-semibold text-center leading-[1.3] tracking-tight animate-fade-in" style={{
                                fontFamily: 'Poppins, sans-serif',
                                background: 'linear-gradient(90deg, #EC4899 0%, #A855F7 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                {currentQ.question}
                            </h2>
                        </div>

                        {/* Unified Card Stacks Container matching the design precisely */}
                        <div
                            key={`cards-container-${currentStep}`}
                            onTouchStart={handleDragStart}
                            onTouchMove={handleDragMove}
                            onTouchEnd={handleDragEnd}
                            className={`relative w-full flex items-center justify-center gap-6 px-2 touch-none transition-all duration-700
                                ${exitDir === -1 ? '-translate-x-[150%] opacity-0' : exitDir === 1 ? 'translate-x-[150%] opacity-0' : 'translate-x-0 opacity-100'}
                            `}
                            style={{
                                transform: (exitDir === 0 && isDragging) ? `translateX(${dragX}px) rotate(${dragX * 0.04}deg)` : undefined
                            }}
                        >
                            {[img1, img2].map((img, idx) => (
                                <div key={idx} className={`relative w-[48%] md:max-w-[280px] aspect-[1/1.6] flex items-center justify-center transition-all duration-500
                                    ${isAnimating && selectedOption !== undefined && selectedOption !== idx ? 'opacity-0 scale-90 blur-sm' : 'opacity-100'}
                                    ${selectedOption === idx ? 'z-50 scale-105' : 'z-10'}
                                `}>
                                    {/* Fanned Deck Visual - Crisp white-themed fanned outlines */}
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute inset-0 rounded-[1.5rem] bg-[#1A1A1A]/20 border border-white/40 pointer-events-none"
                                            style={{
                                                transform: `rotate(${(idx === 0 ? -1 : 1) * (i + 1) * 2}deg) translateX(${(idx === 0 ? -1 : 1) * (i + 1) * 3}px) translateY(${(i + 1) * 1.5}px)`,
                                                zIndex: -i - 1,
                                                opacity: 1 / (i + 1)
                                            }}
                                        />
                                    ))}

                                    <button
                                        onClick={() => handleOptionSelect(currentQ.id, idx)}
                                        className={`relative w-full h-full rounded-[1.5rem] overflow-hidden transition-all duration-500 border-2
                                            ${selectedOption === idx ? 'border-[#EC4899] shadow-[0_0_50px_rgba(236,72,153,0.3)]' : 'border-white/80 shadow-black/50'}
                                        `}
                                    >
                                        <img
                                            src={img}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            fetchpriority="high"
                                        />

                                        {/* Pure Black Label Bar at Bottom matching the design exactly */}
                                        <div className="absolute inset-x-0 bottom-0 py-2.5 bg-black flex items-center justify-center border-t border-white/20">
                                            <span className="text-[12px] font-bold text-white tracking-widest uppercase">{activeOptions[idx]}</span>
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Interactive Hint */}
                        <div className="flex items-center gap-2 mt-4 text-white/40 animate-pulse">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 013 0m-6 7h.01M9 20h6" />
                            </svg>
                            <span className="text-[9px] font-bold uppercase tracking-[0.25em]">Swipe or Tap to Choose</span>
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

                {/* Integrated Action Buttons - Tighter gap and smaller height */}
                <div className="w-full max-w-2xl px-2 mt-4 flex gap-5 z-40">
                    <button
                        onClick={() => {
                            if (currentStep > 0) setCurrentStep(prev => prev - 1);
                        }}
                        disabled={currentStep === 0 || submitting}
                        className="flex-1 border-2 border-[#EC4899] text-[#EC4899] font-bold text-sm transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-[10px] whitespace-nowrap"
                        style={{
                            height: '40px',
                            padding: '10px 16px',
                            borderRadius: '24px'
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </button>

                    <button
                        onClick={() => {
                            if (isReviewing) {
                                handleSubmit();
                            } else if (currentStep < questions.length - 1) {
                                setCurrentStep(prev => prev + 1);
                            } else {
                                if (selectedOption !== undefined) {
                                    setCurrentStep(questions.length);
                                }
                            }
                        }}
                        disabled={(selectedOption === undefined && !isReviewing) || submitting}
                        className="flex-1 text-white font-bold text-sm transition-all flex items-center justify-center gap-[10px] whitespace-nowrap disabled:opacity-40"
                        style={{
                            height: '40px',
                            padding: '10px 16px',
                            borderRadius: '24px',
                            background: 'linear-gradient(90deg, #EC4891 -12.18%, #A928ED 76.79%)'
                        }}
                    >
                        {submitting ? 'Processing...' : (
                            isReviewing ? 'Finish' : (
                                <div className="flex items-center">
                                    Next
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )
                        )}
                    </button>
                </div>
            </main>

        </div>
    );
};

export default TrueConnectionQuiz;