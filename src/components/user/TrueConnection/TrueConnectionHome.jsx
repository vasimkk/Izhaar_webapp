import React, { useState, useEffect } from "react";
import TrueConnectionQuiz from "./TrueConnectionQuiz";
import TrueConnectionMatches from "./TrueConnectionMatches";
import TrueConnectOnboarding from "./TrueConnectOnboarding";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import api from "../../../utils/api";

const TrueConnectionHome = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isQuizCompleted, setIsQuizCompleted] = useState(null);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null);
    const [isStarted, setIsStarted] = useState(false);
    const [loading, setLoading] = useState(true);

    const TCLogo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/TrueConnect/TC?_a=BAMAOGeA0";
    const V1Icon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/TrueConnect/V1?_a=BAMAOGeA0";
    const V2Icon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/TrueConnect/V2?_a=BAMAOGeA0";
    const V3Icon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/TrueConnect/V3?_a=BAMAOGeA0";

    useEffect(() => {
        checkCompletionStatus();
    }, []);

    const checkCompletionStatus = async () => {
        try {
            // First check if profile is complete
            try {
                const profileRes = await api.get("/tc/profile/check");
                setIsOnboardingCompleted(profileRes.data.completed);
            } catch (pErr) {
                // If endpoint doesn't exist yet, fallback to assuming it's done for existing users
                // or handle specifically
                if (pErr.response && pErr.response.status === 404) {
                    setIsOnboardingCompleted(true);
                } else {
                    console.error("Error checking profile status:", pErr);
                }
            }

            // Then check quiz status
            try {
                await api.get("/tc/matches");
                setIsQuizCompleted(true);
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data.code === "QUIZ_INCOMPLETE") {
                    setIsQuizCompleted(false);
                } else {
                    console.error("Critical error checking quiz status:", err);
                }
            }
        } catch (err) {
            console.error("Global status check failed:", err);
            toast.error("Failed to check status");
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

            </div>

            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 12px 2px var(--sparkle-color); }
                }
            `}</style>

            <div className="min-h-screen w-full relative z-10 flex flex-col">
                {!isStarted && !isQuizCompleted && !loading ? (
                    <div className="flex flex-col items-center justify-between min-h-screen text-center px-6 py-8 animate-fade-in relative z-10 bg-transparent">
                        <header className="w-full flex justify-start items-center mb-4 pt-1">
                            <button
                                onClick={() => navigate("/user/dashboard")}
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </header>

                        <div className="flex-1 flex flex-col items-center justify-start w-full max-w-lg mx-auto h-full px-2">
                            <h1 className="text-center mb-4 md:mb-6 tracking-tight" style={{
                                color: 'var(--text, #FFF)',
                                fontFamily: 'Poppins',
                                fontSize: '32px',
                                fontStyle: 'normal',
                                fontWeight: 700,
                                lineHeight: 'normal'
                            }}>
                                True Connect
                            </h1>

                            <div className="mb-4 md:mb-8">
                                <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-[#400B63] flex items-center justify-center shadow-[0_0_40px_rgba(64,11,99,0.4)] border border-white/10">
                                    <img src={TCLogo} alt="True Connect Icon" className="w-[65%] h-[65%] object-contain" />
                                </div>
                            </div>

                            <h2 className="text-[18px] md:text-[20px] text-white text-center mb-10 md:mb-6 px-4 leading-tight" style={{
                                fontFamily: 'Outfit, sans-serif',
                                fontWeight: 600
                            }}>
                                Find someone who truly<br />understands you..
                            </h2>

                            <div className="w-full max-w-[260px] md:max-w-[300px] mb-4 md:mb-8">
                                <div className="border border-purple-500/40 bg-[#1A0B2E]/60 backdrop-blur-xl rounded-[1.2rem] md:rounded-[1.5rem] p-3 md:p-5 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                                    <p className="text-center" style={{
                                        color: '#E4E8EE',
                                        fontFamily: 'Outfit',
                                        fontSize: '11px',
                                        fontWeight: 400,
                                        lineHeight: '1.4'
                                    }}>
                                        Build your profile so we can discover people who truly match your personality.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-1 md:gap-2 mb-4 md:mb-8 w-full max-w-sm px-1">
                                {[
                                    { icon: V1Icon, label: "Personality Matching" },
                                    { icon: V2Icon, label: "Emotional Compatibility" },
                                    { icon: V3Icon, label: "Meaningful Connections" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-1 md:gap-2">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/5 flex items-center justify-center p-2.5">
                                            <img src={item.icon} alt={item.label} className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[8px] md:text-[10px] font-bold text-white/90 text-center leading-tight max-w-[70px]">
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full max-w-[260px] mt-6">
                                <button
                                    onClick={() => navigate("/user/trueconnect_onboarding")}
                                    className="w-full text-white font-bold text-sm transition-all duration-300 mb-3 flex items-center justify-center gap-[10px]"
                                    style={{
                                        height: '40px',
                                        padding: '10px 16px',
                                        borderRadius: '24px',
                                        background: 'linear-gradient(90deg, #EC4891 -12.18%, #A928ED 76.79%)',
                                        alignSelf: 'stretch'
                                    }}
                                >
                                    Begin your Journey
                                </button>
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest text-center">
                                    takes ~ <span className="text-white/60">2 minutes</span> • <span className="text-white/60">100% private</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : !isOnboardingCompleted ? (
                    <TrueConnectOnboarding onComplete={() => setIsOnboardingCompleted(true)} />
                ) : isQuizCompleted ? (
                    <TrueConnectionMatches />
                ) : (
                    <TrueConnectionQuiz onComplete={() => setIsQuizCompleted(true)} />
                )}
            </div>
        </div>
    );
};

export default TrueConnectionHome;
