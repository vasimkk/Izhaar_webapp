import React from "react";
import { FaTrophy, FaRedo, FaHome } from "react-icons/fa";

const QuizResult = ({ results, user, isHost, onBack }) => {
    const myScore = isHost ? results?.hostScore : results?.guestScore;
    const opponentScore = isHost ? results?.guestScore : results?.hostScore;
    const isWinner = myScore > opponentScore;
    const isDraw = myScore === opponentScore;

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center space-y-8 p-8 sm:p-12 md:p-16 bg-white/80 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] border border-rose-100 shadow-[0_50px_100px_rgba(255,182,193,0.3)] relative overflow-hidden animate-in zoom-in duration-700">
            {/* Romantic Glow */}
            <div className={`absolute -top-24 w-[600px] h-[600px] blur-[150px] -z-10 rounded-full opacity-40 ${isWinner || isDraw ? 'bg-rose-300' : 'bg-purple-200'}`}></div>

            <div className="text-center space-y-4 sm:space-y-6 relative z-10">
                <div className="relative inline-block">
                    <div className="text-7xl sm:text-9xl filter drop-shadow-[0_0_40px_rgba(255,182,193,0.6)] animate-bounce duration-1000">
                        {isWinner ? "💖" : isDraw ? "✨" : "🌸"}
                    </div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                    <h2 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight font-serif italic text-transparent bg-clip-text bg-gradient-to-r ${isWinner ? 'from-rose-500 to-pink-600' : 'from-purple-500 to-rose-400'}`}>
                        {isWinner ? "Soulmates!" : isDraw ? "Harmony" : "A Sweet Effort"}
                    </h2>
                    <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[9px] sm:text-[10px]">Your Connection Analysis</p>
                </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 sm:gap-10 relative z-10">
                <div className={`relative p-5 sm:p-10 rounded-3xl sm:rounded-[3rem] border-2 sm:border-4 flex flex-col items-center justify-center transition-all ${isWinner ? 'bg-rose-50 border-rose-200 shadow-xl' : 'bg-white border-slate-50'}`}>
                    <div className="text-[8px] sm:text-[10px] font-black text-rose-300 uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-4">My Heart</div>
                    <div className="text-4xl sm:text-7xl font-black text-rose-500 font-serif italic">{myScore}</div>
                    <div className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] text-slate-300 font-bold">Hearts</div>
                </div>

                <div className={`relative p-5 sm:p-10 rounded-3xl sm:rounded-[3rem] border-2 sm:border-4 flex flex-col items-center justify-center transition-all ${!isWinner && !isDraw ? 'bg-purple-50 border-purple-200 shadow-xl' : 'bg-white border-slate-50'}`}>
                    <div className="text-[8px] sm:text-[10px] font-black text-purple-300 uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-4">Partner</div>
                    <div className="text-4xl sm:text-7xl font-black text-purple-500 font-serif italic">{opponentScore}</div>
                    <div className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] text-slate-300 font-bold">Hearts</div>
                </div>
            </div>

            <div className="w-full pt-4 sm:pt-8 flex gap-4 sm:gap-6 relative z-10">
                <button
                    onClick={onBack}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl hover:from-rose-600 hover:to-rose-700 active:scale-95 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base uppercase tracking-widest shadow-lg shadow-rose-100"
                >
                    <FaHome className="text-sm sm:text-lg" />
                    <span>Return to Dashboard</span>
                </button>
            </div>

            {/* Floating Hearts Decor */}
            <div className="absolute top-1/4 left-6 text-rose-200 animate-pulse text-xl">💝</div>
            <div className="absolute top-1/2 right-8 text-rose-100 animate-ping text-lg">💕</div>
        </div>
    );
};

export default QuizResult;
