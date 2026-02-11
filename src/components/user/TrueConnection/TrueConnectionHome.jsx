import React, { useState, useEffect } from "react";
import TrueConnectionQuiz from "./TrueConnectionQuiz";
import TrueConnectionMatches from "./TrueConnectionMatches";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import UserLayout from "../Dashboard/UserLayout";

const TrueConnectionHome = () => {
    const { user } = useAuth();
    const [isQuizCompleted, setIsQuizCompleted] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkCompletionStatus();
    }, []);

    const checkCompletionStatus = async () => {
        try {
            // We can use the /matches endpoint to check status. 
            // If incomplete, it returns 400 with code QUIZ_INCOMPLETE
            const res = await api.get("/tc/matches"); // axios throws on non-2xx by default usually, but our interceptor handles 401. 
            // If 200 OK, quiz is complete
            setIsQuizCompleted(true);

        } catch (err) {
            // Check if it's the specific QUIZ_INCOMPLETE error
            if (err.response && err.response.status === 400 && err.response.data.code === "QUIZ_INCOMPLETE") {
                setIsQuizCompleted(false);
            } else {
                console.error("Error checking status:", err);
                toast.error("Failed to check status");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)' }}>

            {/* Exit Button */}
            <button
                onClick={() => window.location.href = '/user/dashboard'}
                className="fixed top-6 left-6 z-50 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20 shadow-lg"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>

            {/* ✨ TRUE CONNECTION THEME BACKGROUND ✨ */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Random twinkling stars */}
                {[...Array(30)].map((_, i) => {
                    const colors = ['#EC4899', '#A855F7', '#3B82F6', '#FACC15', '#FFFFFF', '#F472B6'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    return (
                        <div
                            key={`twinkle-${i}`}
                            className="absolute rounded-full"
                            style={{
                                backgroundColor: randomColor,
                                '--sparkle-color': randomColor,
                                width: Math.random() * 3 + 1 + 'px',
                                height: Math.random() * 3 + 1 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                opacity: 0,
                                animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    );
                })}

                {/* Shooting Stars */}
                <div className="shooting-star" style={{ top: '15%', left: '20%', animationDelay: '0s' }}></div>
                <div className="shooting-star" style={{ top: '35%', left: '60%', animationDelay: '4s' }}></div>
                <div className="shooting-star" style={{ top: '75%', left: '10%', animationDelay: '7s' }}></div>

                {/* Floating Hearts */}
                {[...Array(15)].map((_, i) => {
                    const colors = [
                        { fill: 'rgba(233, 30, 99, 0.3)', stroke: 'rgba(233, 30, 99, 0.2)' },
                        { fill: 'rgba(156, 39, 176, 0.3)', stroke: 'rgba(156, 39, 176, 0.2)' },
                        { fill: 'rgba(244, 67, 54, 0.3)', stroke: 'rgba(244, 67, 54, 0.2)' },
                    ];
                    const color = colors[i % colors.length];
                    return (
                        <div
                            key={`heart-${i}`}
                            style={{
                                position: 'absolute',
                                width: `${20 + Math.random() * 40}px`,
                                height: `${20 + Math.random() * 40}px`,
                                opacity: 0.5,
                                animation: `continuousFloat ${6 + Math.random() * 8}s linear infinite`,
                                animationDelay: `${Math.random() * 3}s`,
                                left: `${Math.random() * 100}%`,
                                bottom: '-100px'
                            }}
                        >
                            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: `drop-shadow(0 4px 8px ${color.stroke})` }}>
                                <path
                                    d="M50,85 C20,70 5,55 5,40 C5,25 15,15 25,15 C35,15 45,25 50,35 C55,25 65,15 75,15 C85,15 95,25 95,40 C95,55 80,70 50,85 Z"
                                    fill={color.fill}
                                    stroke={color.stroke}
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 12px 3px var(--sparkle-color); }
                }
                .shooting-star {
                    position: absolute;
                    width: 100px;
                    height: 2px;
                    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%);
                    transform: rotate(-45deg) translateX(-100px);
                    opacity: 0;
                    animation: shootingStar 6s linear infinite;
                }
                 @keyframes shootingStar {
                    0% { transform: rotate(-45deg) translateX(-100px); opacity: 0; }
                    10% { opacity: 1; }
                    20% { transform: rotate(-45deg) translateX(calc(100vw + 100px)); opacity: 0; }
                    100% { transform: rotate(-45deg) translateX(calc(100vw + 100px)); opacity: 0; }
                }
                @keyframes continuousFloat {
                    0% { transform: translateY(0) rotate(0deg) scale(0.8); opacity: 0; }
                    10% { opacity: 0.6; }
                    50% { opacity: 0.5; transform: translateY(-40vh) rotate(180deg) scale(1); }
                    100% { transform: translateY(-100vh) rotate(360deg) scale(0.7); opacity: 0; }
                }
            `}</style>

            <div className="min-h-screen w-full py-12 px-4 relative z-10">
                {isQuizCompleted ? (
                    <TrueConnectionMatches />
                ) : (
                    <TrueConnectionQuiz onComplete={() => setIsQuizCompleted(true)} />
                )}
            </div>
        </div>
    );
};

export default TrueConnectionHome;
