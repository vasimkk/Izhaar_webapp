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
    // QUIZ INTERFACE
    // ==========================================
    const currentQ = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
            {/* Header & Progress */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-pink-500 uppercase tracking-wider">
                        Question {currentStep + 1}/{questions.length}
                    </span>
                    <button
                        onClick={() => setIsStarted(false)}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    >
                        Exit
                    </button>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white/90 dark:bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-10 relative overflow-hidden transition-all duration-300">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 leading-snug relative z-10 drop-shadow-sm">
                    {currentQ.question}
                </h2>

                <div className="space-y-4 relative z-10">
                    {currentQ.options_json.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(currentQ.id, idx)}
                            className={`w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between group backdrop-blur-sm
                                ${answers[currentQ.id] === idx
                                    ? 'border-pink-500 bg-pink-50/90 dark:bg-pink-900/40 text-pink-700 dark:text-pink-200 shadow-lg scale-[1.01]'
                                    : 'border-transparent bg-white/50 dark:bg-white/5 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-white/10 hover:border-pink-300 dark:hover:border-pink-500/50 hover:shadow-md'
                                }`}
                        >
                            <span className="font-medium text-lg">{option}</span>
                            {answers[currentQ.id] === idx && (
                                <div className="bg-pink-500 text-white rounded-full p-1 shadow-md">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer Controls */}
                <div className="mt-10 flex justify-between items-center relative z-10">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2
                            ${currentStep === 0
                                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        Back
                    </button>

                    {currentStep === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!answers[currentQ.id] || submitting}
                            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-pink-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : 'Reveal Matches 💘'}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            disabled={answers[currentQ.id] === undefined}
                            className="px-6 py-3 rounded-full font-bold text-white bg-gray-900 dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrueConnectionQuiz;
