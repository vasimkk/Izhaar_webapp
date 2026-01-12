import React from "react";
import { FaTrophy, FaRedo, FaHome } from "react-icons/fa";

const QuizResult = ({ results, user, isHost, onBack }) => {
    const myScore = isHost ? results?.hostScore : results?.guestScore;
    const opponentScore = isHost ? results?.guestScore : results?.hostScore;
    const isWinner = myScore > opponentScore;
    const isDraw = myScore === opponentScore;

    return (
        <div className="max-w-md mx-auto bg-black/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 text-center space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4">
                <div className="text-7xl mx-auto flex justify-center filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    {isWinner ? "🏆" : isDraw ? "🤝" : "💔"}
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">
                    {isWinner ? "VICTORY!" : isDraw ? "STALEMATE" : "DEFEAT"}
                </h2>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Battle analysis complete</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className={`p-6 rounded-[2rem] border-2 transition-all ${isWinner ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-2">You</div>
                    <div className="text-4xl font-black text-white">{myScore}</div>
                </div>
                <div className={`p-6 rounded-[2rem] border-2 transition-all ${!isWinner && !isDraw ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-2">Enemy</div>
                    <div className="text-4xl font-black text-white">{opponentScore}</div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    onClick={onBack}
                    className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-3 text-lg uppercase tracking-widest shadow-xl"
                >
                    <FaHome className="text-xl" />
                    <span>Return to Command</span>
                </button>
            </div>
        </div>
    );
};

export default QuizResult;
