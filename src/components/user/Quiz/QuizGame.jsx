import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";

const QuizGame = ({ questions, socket, roomId, user, opponentProgress }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        // Only run timer if we have a question and game isn't finished
        if (!currentQuestion || isFinished) return;

        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            handleOptionSelect(null);
        }
    }, [timeLeft, isFinished, currentQuestion]);

    const handleOptionSelect = (index) => {
        if (selectedOption !== null || !currentQuestion) return;
        setSelectedOption(index);

        const isCorrect = index === currentQuestion.correct_option;
        const newScore = isCorrect ? score + 10 : score;
        if (isCorrect) setScore(newScore);

        // Emit to socket
        socket.emit("submit-answer", {
            roomId,
            userId: user?.user_id || user?.id,
            questionIndex: currentIndex,
            isCorrect,
            score: newScore
        });

        setTimeout(() => {
            handleNextSub();
        }, 2000);
    };

    const handleNextSub = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setTimeLeft(15);
        } else {
            setIsFinished(true);
            socket.emit("quiz-completed", {
                roomId,
                userId: user?.user_id || user?.id,
                finalScore: score
            });
        }
    };

    if (!currentQuestion) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-6">
            <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
            <p className="text-rose-400 font-bold uppercase tracking-[0.3em]">Preparing our journey...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-6 p-4 sm:p-6 md:p-8 animate-in fade-in duration-700">
            {/* Main Garden / Arena */}
            <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] p-6 sm:p-10 md:p-16 border border-rose-100 shadow-[0_40px_80px_rgba(255,182,193,0.2)] relative overflow-hidden flex flex-col justify-between min-h-[500px] sm:min-h-[650px]">
                {/* Decorative Floral/Heart Backgrounds */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200/20 blur-[100px] -z-10 rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/20 blur-[100px] -z-10 rounded-full"></div>

                {/* Top Header */}
                <div className="flex justify-between items-center mb-8 sm:mb-12">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-[0.4em] mb-1">Moment</span>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl sm:text-5xl font-black text-slate-800 font-serif italic">{currentIndex + 1}</span>
                            <span className="text-rose-200 font-bold text-lg sm:text-2xl">/ {questions.length}</span>
                        </div>
                    </div>

                    <div className="relative group">
                        <svg className="w-16 h-16 sm:w-24 sm:h-24 transform -rotate-90">
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="transparent"
                                className="text-rose-50 sm:hidden"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="44"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-rose-50 hidden sm:block"
                            />
                            {/* Mobile Timer */}
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="transparent"
                                strokeDasharray={176}
                                strokeDashoffset={176 - (timeLeft / 15) * 176}
                                className={`transition-all duration-1000 ease-linear sm:hidden ${timeLeft < 5 ? 'text-rose-600' : 'text-rose-400'}`}
                                strokeLinecap="round"
                            />
                            {/* Desktop Timer */}
                            <circle
                                cx="48"
                                cy="48"
                                r="44"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={276}
                                strokeDashoffset={276 - (timeLeft / 15) * 276}
                                className={`transition-all duration-1000 ease-linear hidden sm:block ${timeLeft < 5 ? 'text-rose-600' : 'text-rose-400'}`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className={`absolute inset-0 flex items-center justify-center font-serif text-xl sm:text-3xl font-black ${timeLeft < 5 ? 'text-rose-600 animate-pulse' : 'text-rose-400'}`}>
                            {timeLeft}
                        </div>
                    </div>
                </div>

                {/* Question Section */}
                <div className="flex-1 flex flex-col justify-center space-y-10 sm:space-y-16">
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-800 text-center leading-[1.2] tracking-tight font-serif italic py-2">
                        "{currentQuestion.question}"
                    </h3>

                    {/* Options Grid */}
                    <div className="grid gap-3 sm:gap-5 sm:grid-cols-2">
                        {currentQuestion.options?.map((option, idx) => {
                            const isCorrect = idx === currentQuestion.correct_option;
                            const isSelected = selectedOption === idx;
                            const showCorrect = selectedOption !== null && isCorrect;
                            const showIncorrect = isSelected && !isCorrect;

                            let stateStyle = "bg-white border-rose-50 text-slate-600 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100";

                            if (showCorrect) stateStyle = "bg-rose-500 border-rose-400 text-white shadow-xl shadow-rose-200 scale-[1.03] z-10";
                            else if (showIncorrect) stateStyle = "bg-slate-800 border-slate-700 text-white shadow-xl z-10";
                            else if (selectedOption !== null) stateStyle = "opacity-40 border-rose-50 grayscale-[0.8]";

                            if (!currentQuestion) return null;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    disabled={selectedOption !== null}
                                    className={`relative group p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 font-bold transition-all duration-500 text-left overflow-hidden ${stateStyle}`}
                                >
                                    <div className="flex items-center justify-between pointer-events-none">
                                        <span className="text-sm sm:text-lg md:text-xl pr-4">{option}</span>
                                        {showCorrect && <FaHeart className="text-lg sm:text-xl animate-ping" />}
                                    </div>
                                    <div className={`absolute left-0 bottom-0 h-0.5 bg-white/30 transition-all duration-[2000ms] ease-linear ${isSelected ? 'w-full' : 'w-0'}`}></div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Progress */}
                <div className="mt-10 sm:mt-16 space-y-2">
                    <div className="flex justify-between text-[8px] sm:text-[10px] font-black text-rose-300 uppercase tracking-[0.4em]">
                        <span>Connection</span>
                        <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="h-2 sm:h-3 w-full bg-rose-50 rounded-full overflow-hidden p-0.5 border border-rose-100">
                        <div
                            className="h-full bg-gradient-to-r from-rose-400 via-purple-300 to-rose-400 bg-[length:200%_100%] animate-gradient-x rounded-full transition-all duration-700"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Side Status Panel */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6">
                {/* My Stats */}
                <div className="flex-1 bg-white/60 backdrop-blur-3xl rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 border border-rose-100 shadow-xl relative overflow-hidden group border-dashed">
                    <h4 className="text-[9px] font-black text-rose-400 uppercase tracking-[0.4em] mb-2 sm:mb-5">Hearts</h4>
                    <div className="flex items-baseline space-x-2 sm:space-x-3">
                        <span className="text-5xl sm:text-7xl font-black text-rose-600 font-serif italic drop-shadow-sm">{score}</span>
                        <FaHeart className="text-rose-200 text-xl sm:text-2xl" />
                    </div>
                </div>

                {/* Partner Status */}
                <div className="flex-1 bg-gradient-to-br from-rose-500 to-purple-600 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl relative text-white">
                    <h4 className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em] mb-4 sm:mb-10">Partner</h4>

                    {opponentProgress ? (
                        <div className="space-y-4 sm:space-y-8">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <div className="text-3xl sm:text-5xl font-black font-serif italic">{opponentProgress.score}</div>
                                    <div className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em]">Hearts</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black italic text-rose-200">S-{opponentProgress.questionIndex + 1}</div>
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-4">
                                <div className="h-2 sm:h-4 w-full bg-black/10 rounded-full p-0.5 sm:p-1 border border-white/20">
                                    <div
                                        className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                                        style={{ width: `${((opponentProgress.questionIndex + 1) / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-6 sm:py-12 space-y-4 sm:space-y-6 opacity-60">
                            <div className="relative">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                <FaHeart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse text-xs sm:text-base" />
                            </div>
                            <div className="text-[9px] text-white/70 font-black uppercase tracking-[0.3em] text-center">Syncing...</div>
                        </div>
                    )}
                </div>

                <div className="hidden lg:block p-4 text-center">
                    <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                        <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                        IK2024
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    animation: gradient-x 3s ease infinite;
                }
            `}} />
        </div>
    );
};

export default QuizGame;