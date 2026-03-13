import React, { useState, useEffect } from "react";
import TrueConnectionQuiz from "./TrueConnectionQuiz";
import TrueConnectionMatches from "./TrueConnectionMatches";
import TrueConnectOnboarding from "./TrueConnectOnboarding";
import TrueConnectProfile from "./TrueConnectProfile";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaChevronLeft, FaHeart } from "react-icons/fa";

const TrueConnectionHome = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const handleBack = () => {
        if (location.state?.fromProfile) {
            navigate("/user/true-connection-profile");
        } else {
            navigate("/user/dashboard");
        }
    };

    const [isQuizCompleted, setIsQuizCompleted] = useState(null);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null);
    const [isStarted, setIsStarted] = useState(location.state?.autoStart || false);
    const [viewMatches, setViewMatches] = useState(false);
    const [loading, setLoading] = useState(true);

    const V1Icon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/TrueConnect/V1?_a=BAMAOGeA0";
    const V2Icon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/TrueConnect/V2?_a=BAMAOGeA0";
    const V3Icon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/TrueConnect/V3?_a=BAMAOGeA0";

    useEffect(() => {
        checkCompletionStatus();
    }, []);

    useEffect(() => {
        if (location.state?.autoStart) {
            setIsStarted(true);
        }
    }, [location.state]);

    const checkCompletionStatus = async () => {
        try {
            try {
                const profileRes = await api.get("/profile/me");
                const profile = profileRes.data.profile || profileRes.data;

                if (profile && profile.height) {
                    setIsOnboardingCompleted(true);
                } else {
                    try {
                        const checkRes = await api.get("/tc/profile/check");
                        setIsOnboardingCompleted(checkRes.data.completed);
                    } catch (err) {
                        setIsOnboardingCompleted(false);
                    }
                }
            } catch (pErr) {
                console.error("Error checking profile status:", pErr);
                setIsOnboardingCompleted(true);
            }

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
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
                {/* Twisted background effect */}
            </div>

            <div className="min-h-screen w-full relative z-10 flex flex-col">
                {viewMatches ? (
                    <TrueConnectionMatches onBack={() => setViewMatches(false)} />
                ) : isStarted ? (
                    !isOnboardingCompleted ? (
                        <TrueConnectOnboarding 
                            onComplete={() => setIsOnboardingCompleted(true)} 
                            onBack={() => setIsStarted(false)}
                        />
                    ) : (
                        <TrueConnectionQuiz 
                            onComplete={() => {
                                setIsQuizCompleted(true);
                                setIsStarted(false);
                                setViewMatches(true);
                            }} 
                            onBack={() => setIsStarted(false)}
                        />
                    )
                ) : (
                    <div className="flex flex-col items-center min-h-screen text-center animate-fade-in relative z-10 bg-transparent">
                        <div className="relative z-50 px-3 py-4 sm:py-6 sm:px-7 w-full max-w-xl mx-auto flex justify-between items-center">
                            <button
                                onClick={handleBack}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-md"
                            >
                                <FaChevronLeft size={16} />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-start p-6 pt-2 pb-20 w-full">
                            <div className="w-full max-w-sm flex flex-col items-center text-center">
                                <h1 className="w-full text-center text-[28px] font-bold text-white mb-20 leading-none mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    True Connect
                                </h1>

                                <div className="mb-8 md:mb-6 relative flex items-center justify-center">
                                    {/* Network Pulse Rings */}
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0.8, opacity: 0.5 }}
                                            animate={{ scale: 2.2, opacity: 0 }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                delay: i * 1.3,
                                                ease: "easeOut"
                                            }}
                                            className="absolute w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                        />
                                    ))}

                                    {/* Rotating Radar Sweep */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute w-[160px] h-[160px] md:w-[220px] md:h-[220px] rounded-full pointer-events-none z-0 opacity-40"
                                        style={{
                                            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(168, 85, 247, 0) 300deg, rgba(168, 85, 247, 0.4) 360deg)'
                                        }}
                                    />

                                    <div className="relative">
                                        <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#1A0B2E] flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)] border-[3px] border-[#EC4899] overflow-hidden group">
                                            {user?.profile_photo ? (
                                                <img
                                                    src={user.profile_photo}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#1A0B2E] to-[#400B63] flex items-center justify-center">
                                                    <FaUser className="text-white/20 text-4xl" />
                                                </div>
                                            )}

                                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                        </div>

                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center shadow-xl border-2 border-white z-20"
                                        >
                                            {isOnboardingCompleted ? (
                                                <FaHeart className="text-[#EC4899] text-[12px] md:text-[16px]" />
                                            ) : (
                                                <span className="text-base md:text-lg font-bold text-[#EC4899] leading-none pb-[1px]">?</span>
                                            )}
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="mt-1 mb-3">
                                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                        {user?.name || "User Name"}
                                    </h2>
                                </div>

                                <h2 className="text-[16px] md:text-[18px] text-white/70 text-center mb-8 px-4 leading-tight font-medium" style={{
                                    fontFamily: 'Outfit, sans-serif'
                                }}>
                                    Find someone who truly<br />understands you..
                                </h2>

                                <div className="w-full max-w-[260px] md:max-w-[300px] mb-4 shadow-2xl">
                                    <div className="border border-purple-500/40 bg-[#1A0B2E]/60 backdrop-blur-xl rounded-[1.2rem] md:rounded-[1.5rem] p-3 md:p-5">
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

                                <div className="grid grid-cols-3 gap-2 mb-6 w-full max-w-sm px-1">
                                    {[
                                        { icon: V1Icon, label: "Personality Matching" },
                                        { icon: V2Icon, label: "Emotional Compatibility" },
                                        { icon: V3Icon, label: "Meaningful Connections" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/5 flex items-center justify-center p-2.5 shadow-lg">
                                                <img src={item.icon} alt={item.label} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-[8px] md:text-[10px] font-bold text-white/90 text-center leading-tight max-w-[70px]">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full max-w-[260px] mt-2">
                                    <button
                                        onClick={() => {
                                            if (isQuizCompleted) {
                                                setViewMatches(true);
                                            } else {
                                                setIsStarted(true);
                                            }
                                        }}
                                        className="w-full text-white font-bold text-sm transition-all duration-300 mb-3 flex items-center justify-center gap-[10px] shadow-xl hover:scale-105 active:scale-95"
                                        style={{
                                            height: '42px',
                                            borderRadius: '24px',
                                            background: 'linear-gradient(90deg, #EC4891 -12.18%, #A928ED 76.79%)'
                                        }}
                                    >
                                        {isQuizCompleted
                                            ? "Check your Connection"
                                            : (!isOnboardingCompleted ? "Make Profile" : "Start the Journey")}
                                    </button>
                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest text-center">
                                        takes ~ <span className="text-white/60">2 minutes</span> • <span className="text-white/60">100% private</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrueConnectionHome;
