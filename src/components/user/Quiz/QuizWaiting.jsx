import React, { useState, useEffect } from "react";
import { FaClock, FaTimes, FaCopy, FaCheck, FaHeart } from "react-icons/fa";

const QuizWaiting = ({ roomId, onCancel, targetMobile, status }) => {
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes countdown
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            onCancel();
        }
    }, [timeLeft, onCancel]);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center space-y-6 p-6 sm:p-10 md:p-12 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/10 shadow-[0_30px_60px_rgba(236,72,153,0.2)] relative overflow-hidden animate-in fade-in zoom-in duration-700">
            {/* Soft Ambient Glows */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full"></div>

            <div className="text-center space-y-6 sm:space-y-8 relative z-10 w-full">
                {/* Pulsing Heart Loader */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="60"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            className="text-white/10 sm:hidden"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="76"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-white/10 hidden sm:block"
                        />
                        {/* Mobile Circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="60"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={377}
                            strokeDashoffset={377 - (timeLeft / 180) * 377}
                            className="text-pink-500 transition-all duration-1000 ease-linear sm:hidden"
                            strokeLinecap="round"
                        />
                        {/* Desktop Circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r="76"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={477}
                            strokeDashoffset={477 - (timeLeft / 180) * 477}
                            className="text-pink-500 transition-all duration-1000 ease-linear hidden sm:block"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="flex flex-col items-center">
                        <FaHeart className="text-2xl sm:text-4xl text-pink-500 animate-pulse mb-1" />
                        <span className="text-2xl sm:text-3xl font-black text-white font-serif">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="space-y-2 sm:space-y-4">
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                        Finding your Partner...
                    </h2>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {status || (targetMobile ? `Calling ${targetMobile}` : "Sending the love signal...")}
                    </p>
                </div>

                {/* Connection Code Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-2 sm:space-y-3 shadow-sm border-dashed">
                    <span className="text-[8px] font-black text-pink-300 uppercase tracking-[0.2em]">Secret Room Code</span>
                    <div className="flex items-center justify-between space-x-3 bg-black/20 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/5">
                        <code className="text-xl sm:text-2xl font-black text-purple-300 tracking-[0.3em] font-mono">{roomId}</code>
                        <button
                            onClick={handleCopy}
                            className={`p-2 sm:p-2.5 rounded-lg transition-all shadow-sm ${copied ? 'bg-pink-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            {copied ? <FaCheck className="text-xs" /> : <FaCopy className="text-xs" />}
                        </button>
                    </div>
                    <p className="text-[9px] text-white/30 font-medium italic text-center">Share to connect instantly! ✨</p>
                </div>

                <button
                    onClick={onCancel}
                    className="flex items-center justify-center space-x-1.5 text-white/40 hover:text-red-400 transition-colors font-bold uppercase tracking-[0.2em] text-[9px] mx-auto py-1"
                >
                    <FaTimes className="text-[8px]" />
                    <span>Cancel Invite</span>
                </button>
            </div>

            {/* Floating Sparkles Design */}
            <div className="absolute top-6 right-6 text-pink-200 animate-bounce delay-75 opacity-50">✨</div>
            <div className="absolute bottom-10 left-6 text-pink-200 animate-bounce delay-300 opacity-50">💖</div>
        </div>
    );
};

export default QuizWaiting;
