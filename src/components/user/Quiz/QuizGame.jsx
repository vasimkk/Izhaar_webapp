import React, { useState, useEffect } from "react";

const QuizGame = ({ questions, socket, roomId, user, opponentProgress }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        if (timeLeft > 0 && !isFinished) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isFinished) {
            handleNextSub(null);
        }
    }, [timeLeft, isFinished]);

    const handleOptionSelect = (index) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);

        const isCorrect = index === currentQuestion.correct_option;
        const newScore = isCorrect ? score + 10 : score;
        setScore(newScore);

        // Emit to socket
        socket.emit("submit-answer", {
            roomId,
            userId: user?.user_id || user?.id,
            questionIndex: currentIndex,
            isCorrect,
            score: newScore
        });

        setTimeout(() => {
            handleNextSub(index);
        }, 1500);
    };

    const handleNextSub = (index) => {
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

    if (!currentQuestion) return <div className="text-white text-center">Loading Questions...</div>;

    return (
        <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_280px] gap-8 p-6">
            <div className="bg-black/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-10">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="px-6 py-2 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30 text-sm font-black uppercase tracking-widest">
                        Question {currentIndex + 1}/{questions.length}
                    </div>
                    <div className={`px-6 py-2 rounded-full border-2 font-mono text-xl font-bold ${timeLeft < 5 ? 'bg-red-600/20 text-red-400 border-red-500/50 animate-pulse' : 'bg-white/5 text-white/80 border-white/10'}`}>
                        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                    </div>
                </div>

                {/* Question Area */}
                <div className="space-y-6">
                    <h3 className="text-3xl font-black text-white text-center leading-tight">
                        {currentQuestion.question}
                    </h3>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000 ease-linear"
                            style={{ width: `${(timeLeft / 15) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Options */}
                <div className="grid gap-5">
                    {currentQuestion.options.map((option, idx) => {
                        let btnStyle = "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]";
                        if (selectedOption === idx) {
                            btnStyle = idx === currentQuestion.correct_option
                                ? "bg-green-500 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                : "bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]";
                        } else if (selectedOption !== null && idx === currentQuestion.correct_option) {
                            btnStyle = "bg-green-500/40 border-green-500/50 text-white";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                disabled={selectedOption !== null}
                                className={`w-full p-6 rounded-2xl border-2 text-left font-bold transition-all flex justify-between items-center group text-lg ${btnStyle}`}
                            >
                                <span>{option}</span>
                                {selectedOption === idx && (
                                    <span className="text-xs uppercase tracking-widest font-black">
                                        {idx === currentQuestion.correct_option ? "✓ Correct" : "✕ Incorrect"}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sidebar / Opponent Progress */}
            <div className="space-y-6">
                <div className="bg-black/60 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-2xl transform hover:scale-[1.02] transition-transform">
                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Your Score</h4>
                    <div className="text-6xl font-black text-white tabular-nums">{score}</div>
                    <div className="mt-2 text-xs text-white/30 font-bold uppercase tracking-widest">Points earned</div>
                </div>

                <div className="bg-black/60 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-6">Opponent</h4>
                    {opponentProgress ? (
                        <div className="space-y-5">
                            <div className="flex justify-between items-end">
                                <div className="text-4xl font-black text-white tabular-nums">{opponentProgress.score}</div>
                                <div className="text-[10px] font-black text-white/30 uppercase pb-1">Question {opponentProgress.questionIndex + 1}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-white/40 uppercase">
                                    <span>Progress</span>
                                    <span>{Math.round(((opponentProgress.questionIndex + 1) / questions.length) * 100)}%</span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-700"
                                        style={{ width: `${((opponentProgress.questionIndex + 1) / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-4 space-y-3">
                            <div className="w-8 h-8 border-4 border-white/10 border-t-cyan-500 rounded-full animate-spin"></div>
                            <div className="text-xs text-white/20 font-bold uppercase tracking-widest">Syncing with Rival...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizGame;
