import React, { useState, useEffect } from "react";
import { FaClock, FaTimes, FaCopy, FaCheck, FaHeart, FaWhatsapp } from "react-icons/fa";

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

    const handleShare = () => {
        const message = `Hi! I'm challenging you to a real-time Quiz Battle on Izhaar! 🎮\n\nJoin my room using this code: *${roomId}*\nOr click here to join instantly: https://izhaar.com/user/quiz?roomId=${roomId}`;
        const whatsappUrl = `https://wa.me/${targetMobile}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center space-y-6 p-6 sm:p-10 md:p-12 bg-gradient-to-br from-rose-50/90 to-purple-50/90 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[3.5rem] border border-white shadow-[0_30px_60px_rgba(255,182,193,0.3)] relative overflow-hidden animate-in fade-in zoom-in duration-700">
            {/* Soft Ambient Glows */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-rose-300/20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-300/20 blur-[100px] rounded-full"></div>

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
                            className="text-rose-100 sm:hidden"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="76"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-rose-100 hidden sm:block"
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
                            className="text-rose-400 transition-all duration-1000 ease-linear sm:hidden"
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
                            className="text-rose-400 transition-all duration-1000 ease-linear hidden sm:block"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="flex flex-col items-center">
                        <FaHeart className="text-2xl sm:text-4xl text-rose-500 animate-pulse mb-1" />
                        <span className="text-2xl sm:text-3xl font-black text-rose-600 font-serif">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="space-y-2 sm:space-y-4">
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
                        Finding your Partner...
                    </h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {status || (targetMobile ? `Calling ${targetMobile}` : "Sending the love signal...")}
                    </p>
                </div>

                {/* Connection Code Card */}
                <div className="bg-white/60 border border-rose-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-2 sm:space-y-3 shadow-sm border-dashed">
                    <span className="text-[8px] font-black text-rose-400 uppercase tracking-[0.2em]">Secret Room Code</span>
                    <div className="flex items-center justify-between space-x-3 bg-rose-50/50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-rose-100">
                        <code className="text-xl sm:text-2xl font-black text-rose-600 tracking-[0.3em] font-mono">{roomId}</code>
                        <div className="flex gap-2">
                            <button
                                onClick={handleShare}
                                className="p-2 sm:p-2.5 rounded-lg bg-[#25D366] text-white hover:bg-[#128C7E] transition-all shadow-sm flex items-center justify-center"
                                title="Share on WhatsApp"
                            >
                                <FaWhatsapp className="text-sm" />
                            </button>
                            <button
                                onClick={handleCopy}
                                className={`p-2 sm:p-2.5 rounded-lg transition-all shadow-sm ${copied ? 'bg-rose-500 text-white' : 'bg-white text-rose-400 hover:bg-rose-50'}`}
                            >
                                {copied ? <FaCheck className="text-xs" /> : <FaCopy className="text-xs" />}
                            </button>
                        </div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium italic text-center">Share to connect instantly! ✨</p>
                </div>

                <button
                    onClick={onCancel}
                    className="flex items-center justify-center space-x-1.5 text-slate-400 hover:text-rose-500 transition-colors font-bold uppercase tracking-[0.2em] text-[9px] mx-auto py-1"
                >
                    <FaTimes className="text-[8px]" />
                    <span>Cancel Invite</span>
                </button>
            </div>

            {/* Floating Sparkles Design */}
            <div className="absolute top-6 right-6 text-rose-200 animate-bounce delay-75">✨</div>
            <div className="absolute bottom-10 left-6 text-rose-200 animate-bounce delay-300">💖</div>
        </div>
    );
};

export default QuizWaiting;
