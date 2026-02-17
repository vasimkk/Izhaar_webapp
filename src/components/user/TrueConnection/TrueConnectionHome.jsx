import React, { useState, useEffect } from "react";
import TrueConnectionQuiz from "./TrueConnectionQuiz";
import TrueConnectionMatches from "./TrueConnectionMatches";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import api from "../../../utils/api";

const TrueConnectionHome = () => {
    const { user } = useAuth();
    const [isQuizCompleted, setIsQuizCompleted] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkCompletionStatus();
    }, []);

    const checkCompletionStatus = async () => {
        try {
            await api.get("/tc/matches");
            setIsQuizCompleted(true);
        } catch (err) {
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
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B72099]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-black" style={{ background: 'linear-gradient(170deg, #000 41.18%, #4E006C 100%)' }}>
            {/* ✨ TRUE CONNECTION THEME BACKGROUND ✨ */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
                {/* Random twinkling stars */}
                {[...Array(20)].map((_, i) => {
                    const colors = ['#EC4899', '#A855F7', '#FFFFFF'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    return (
                        <div
                            key={`twinkle-${i}`}
                            className="absolute rounded-full"
                            style={{
                                backgroundColor: randomColor,
                                '--sparkle-color': randomColor,
                                width: Math.random() * 2 + 1 + 'px',
                                height: Math.random() * 2 + 1 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                opacity: 0,
                                animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    );
                })}
            </div>

            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 12px 2px var(--sparkle-color); }
                }
            `}</style>

            <div className="min-h-screen w-full relative z-10 flex flex-col">
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
