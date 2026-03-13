import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import { FiChevronLeft, FiCheck, FiArrowRight, FiUser, FiHeart, FiSearch, FiStar, FiCoffee, FiGlobe, FiBriefcase, FiBookOpen, FiActivity, FiMoon, FiShield, FiWind, FiTv, FiTarget, FiHome, FiPlus, FiMinus } from "react-icons/fi";
import { LuBaby, LuDog, LuCat, LuBird, LuGraduationCap, LuUsers } from "react-icons/lu";
import { FaChevronLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const TrueConnectOnboarding = ({ onComplete, onBack }) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        height: 165, // default in cm
        identity: "",
        relationshipStatus: "",
        connectingWith: [],
        intent: "",
        kids: "",
        occupation: "",
        education: "",
        pets: [],
        beliefs: "",
        politics: "",
        smoking: "",
        drinking: ""
    });

    const ONBOARDING_QUESTIONS = [
        {
            id: 1,
            question: "How tall are you?",
            type: "height",
            key: "height"
        },
        {
            id: 2,
            question: "How do you identify?",
            type: "choice",
            key: "identity",
            options: ["Man", "Woman", "Trans Man", "Trans Woman", "Non-binary", "Prefer not to say"]
        },
        {
            id: 3,
            question: "What’s your current relationship status?",
            type: "choice",
            key: "relationshipStatus",
            options: ["Single", "In a relationship", "Engaged", "Married", "Divorced"]
        },
        {
            id: 4,
            question: "Who would you like to connect with?",
            type: "multi-choice",
            key: "connectingWith",
            options: ["Men", "Women", "Trans Men", "Trans Women", "Non-binary people"]
        },
        {
            id: 5,
            question: "What are you hoping to find here?",
            type: "choice",
            key: "intent",
            options: ["A serious relationship", "Something casual", "Friendship", "Just exploring"]
        },
        {
            id: 6,
            question: "How do you feel about having kids?",
            type: "choice",
            key: "kids",
            options: ["I’d like kids someday", "I don’t want kids", "I already have kids", "Not sure yet"]
        },
        {
            id: 7,
            question: "What do you currently do?",
            type: "choice",
            key: "occupation",
            options: ["Student", "Working professional", "Self-employed / entrepreneur", "Still figuring things out"]
        },
        {
            id: 8,
            question: "What’s your highest level of education?",
            type: "choice",
            key: "education",
            options: ["High school", "Some college", "Bachelor’s degree", "Master’s degree", "Doctorate"]
        },
        {
            id: 9,
            question: "Do pets play a role in your life?",
            type: "multi-choice",
            key: "pets",
            options: ["Dogs", "Cats", "Birds", "Reptiles", "Fish", "No pets"]
        },
        {
            id: 10,
            question: "What guides your beliefs?",
            type: "choice",
            key: "beliefs",
            options: ["Buddhism", "Christianity", "Hinduism", "Islam", "Jainism", "Sikhism", "Agnostic", "Atheist", "Other"]
        },
        {
            id: 11,
            question: "What best describes your political views?",
            type: "choice",
            key: "politics",
            options: ["Liberal", "Conservative", "Moderate / Centrist", "Prefer not to say"]
        },
        {
            id: 12,
            question: "Do you smoke?",
            type: "choice",
            key: "smoking",
            options: ["Regularly", "Occasionally", "I don’t smoke", "Trying to quit"]
        },
        {
            id: 13,
            question: "Do you drink alcohol?",
            type: "choice",
            key: "drinking",
            options: ["Regularly", "Occasionally", "I don’t drink", "Completely sober"]
        }
    ];

    const currentQ = ONBOARDING_QUESTIONS[currentStep];

    const handleOptionSelect = (option) => {
        if (currentQ.type === "choice") {
            setProfileData(prev => ({ ...prev, [currentQ.key]: option }));
            if (currentStep < ONBOARDING_QUESTIONS.length - 1) {
                setTimeout(() => setCurrentStep(prev => prev + 1), 300);
            }
        } else if (currentQ.type === "multi-choice") {
            setProfileData(prev => {
                const currentArr = prev[currentQ.key] || [];
                if (currentArr.includes(option)) {
                    return { ...prev, [currentQ.key]: currentArr.filter(o => o !== option) };
                } else {
                    return { ...prev, [currentQ.key]: [...currentArr, option] };
                }
            });
        }
    };

    const handleNext = () => {
        if (currentStep < ONBOARDING_QUESTIONS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else if (onBack) {
            onBack();
        } else {
            navigate('/user/dashboard');
        }
    };

    const [existingProfile, setExistingProfile] = useState(null);

    React.useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await api.get("/profile/me");
                const profile = res.data.profile || res.data;
                setExistingProfile(profile);
            } catch (err) {
                console.error("No existing profile found");
            }
        };
        fetchInitialData();
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...existingProfile,
                gender: profileData.identity,
                height: profileData.height,
                relationship_status: profileData.relationshipStatus,
                interested_in: profileData.connectingWith,
                looking_for: profileData.intent,
                kids: profileData.kids,
                occupation: profileData.occupation,
                education: profileData.education,
                pets: profileData.pets,
                religion: profileData.beliefs,
                politics: profileData.politics,
                smoking: profileData.smoking,
                drinking: profileData.drinking,
            };
            if (existingProfile && existingProfile.id) {
                await api.put(`/profile/${existingProfile.id}`, payload);
            } else {
                await api.post("/profile", payload);
            }
            toast.success("Profile updated!");
            if (onComplete) {
                onComplete();
            } else {
                navigate("/user/true-connection-profile");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    const HeightPicker = () => {
        const cmToFeet = (cm) => {
            if (!cm || cm < 1) return "0'0\"";
            const realFeet = ((cm * 0.393700) / 12);
            const feet = Math.floor(realFeet);
            const inches = Math.round((realFeet - feet) * 12);
            return `${feet}'${inches}"`;
        };

        const adjustHeight = (amount) => {
            const current = parseInt(profileData.height) || 165;
            const next = Math.min(Math.max(current + amount, 100), 250);
            setProfileData(prev => ({ ...prev, height: next }));
        };

        return (
            <div className="flex flex-col items-center justify-center w-full py-12 relative select-none">
                <div className="flex items-center gap-6 sm:gap-10">
                    {/* Decrease Button */}
                    <button 
                        onClick={() => adjustHeight(-1)}
                        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-white hover:bg-[#EC4891]/20 hover:border-[#EC4891]/40 transition-all active:scale-90"
                    >
                        <FiMinus size={24} />
                    </button>

                    {/* Numeric Display / Input Area */}
                    <div className="relative flex flex-col items-center">
                        <div className="group relative">
                            <input 
                                type="number"
                                value={profileData.height || ""}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) setProfileData(prev => ({ ...prev, height: Math.min(val, 300) }));
                                    else setProfileData(prev => ({ ...prev, height: 0 }));
                                }}
                                className="w-40 bg-transparent text-white text-7xl font-black text-center focus:outline-none transition-all placeholder:text-white/5"
                                placeholder="000"
                            />
                            {/* Animated underline */}
                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#EC4891]/40 to-transparent rounded-full" />
                        </div>
                        
                        <div className="mt-6 flex flex-col items-center gap-1">
                            <span className="text-sm font-black text-[#EC4891] uppercase tracking-[0.3em]">Centimeters</span>
                            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mt-2">
                                <span className="text-white/40 font-bold tracking-widest text-[11px]">
                                    {cmToFeet(profileData.height)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Increase Button */}
                    <button 
                        onClick={() => adjustHeight(1)}
                        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-white hover:bg-[#A928ED]/20 hover:border-[#A928ED]/40 transition-all active:scale-90"
                    >
                        <FiPlus size={24} />
                    </button>
                </div>

                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-[#EC4891]/10 blur-[80px] rounded-full pointer-events-none" />
            </div>
        );
    };

    const getOptionIcon = (option) => {
        const text = option.toLowerCase();

        // Identity
        if (text === "man") return <FiUser />;
        if (text === "woman") return <FiUser className="text-pink-400" />;
        if (text.includes("trans")) return <FiUser className="text-purple-400" />;
        if (text.includes("non-binary")) return <LuUsers className="text-indigo-400" />;

        // Relationship
        if (text === "single") return <FiUser />;
        if (text.includes("relationship")) return <FiHeart className="text-red-400" />;
        if (text.includes("engaged")) return <FiHeart className="text-pink-300" strokeWidth={3} />;
        if (text.includes("married")) return <FiHeart className="text-rose-500" />;
        if (text.includes("divorced")) return <FiWind className="text-gray-400" />;

        // Intent
        if (text.includes("serious")) return <FiTarget className="text-rose-400" />;
        if (text.includes("casual")) return <FiCoffee className="text-amber-400" />;
        if (text.includes("friendship")) return <LuUsers className="text-blue-400" />;
        if (text.includes("exploring")) return <FiSearch className="text-cyan-400" />;

        // Kids
        if (text.includes("kids someday")) return <LuBaby className="text-blue-300" />;
        if (text.includes("don't want kids")) return <FiMoon className="text-gray-500" />;
        if (text.includes("already have kids")) return <LuBaby className="text-rose-300" />;
        if (text.includes("not sure")) return <FiWind className="text-slate-400" />;

        // Education/Work
        if (text.includes("student")) return <FiBookOpen className="text-emerald-400" />;
        if (text.includes("professional")) return <FiBriefcase className="text-blue-500" />;
        if (text.includes("entrepreneur") || text.includes("employed")) return <FiActivity className="text-orange-400" />;
        if (text.includes("high school")) return <FiBookOpen />;
        if (text.includes("bachelor")) return <LuGraduationCap className="text-indigo-400" />;
        if (text.includes("master")) return <LuGraduationCap className="text-purple-400" />;
        if (text.includes("doctorate")) return <LuGraduationCap className="text-amber-500" strokeWidth={2.5} />;

        // Pets
        if (text.includes("dog")) return <LuDog className="text-amber-600" />;
        if (text.includes("cat")) return <LuCat className="text-orange-400" />;
        if (text.includes("bird")) return <LuBird className="text-sky-400" />;
        if (text.includes("reptile")) return <FiWind className="text-green-500" />;
        if (text.includes("fish")) return <FiActivity className="text-blue-400" />;
        if (text.includes("no pets")) return <FiHome className="text-gray-400" />;

        // Beliefs
        if (text === "hinduism") return <FiStar className="text-orange-400" />;
        if (text === "islam") return <FiMoon className="text-emerald-500" />;
        if (text === "christianity") return <FiStar className="text-blue-400" />;
        if (text === "buddhism") return <FiWind className="text-amber-300" />;
        if (text === "sikhism") return <FiTarget className="text-orange-500" />;
        if (text.includes("atheist") || text.includes("agnostic")) return <FiGlobe className="text-slate-400" />;

        // Lifestyle
        if (text.includes("liberal")) return <FiWind className="text-cyan-400" />;
        if (text.includes("conservative")) return <FiShield className="text-blue-600" />;
        if (text.includes("moderate")) return <FiActivity className="text-slate-400" />;
        if (text.includes("regularly")) return <FiWind className="text-rose-400" />;
        if (text.includes("occasionally")) return <FiWind className="text-amber-400" />;
        if (text.includes("don't smoke") || text.includes("don't drink")) return <FiCheck className="text-emerald-500" />;
        if (text.includes("sober")) return <FiWind className="text-sky-400" strokeWidth={3} />;

        return <FiStar />;
    };

    const FloatingParticles = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [-20, -1200],
                        opacity: [0, 0.3, 0],
                        scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                        duration: 15 + Math.random() * 20,
                        repeat: Infinity,
                        delay: Math.random() * 20,
                        ease: "linear",
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        bottom: "-5%",
                        filter: "blur(1px)",
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="flex flex-col h-screen w-full relative text-white overflow-hidden bg-black select-none">
            {/* Immersive Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F0A1E] via-[#1A1025] to-[#0F0A1E]" />
            <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-[#EC4891]/5 blur-[150px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-full h-full bg-[#A928ED]/5 blur-[150px] rounded-full pointer-events-none" />



            {/* Header Redesign */}
            <header className="fixed top-0 inset-x-0 z-50 ">
                <div className="max-w-xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4">
                    <div className="flex items-center justify-start gap-4">
                        <button
                            onClick={handleBack}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-md active:scale-95"
                        >
                            <FaChevronLeft size={14} />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-[18px] font-bold text-white tracking-tight leading-tight">
                                True Connect Profile
                            </span>
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#EC4891] opacity-70">
                                {currentQ.type === "height" ? "Core Stats" : "Personality Build"} • Step {currentStep + 1}
                            </span>
                        </div>
                    </div>

                    {/* Integrated Progress Bar */}
                    <div className="w-full flex gap-1 px-1">
                        {ONBOARDING_QUESTIONS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-700 ${i <= currentStep ? 'bg-gradient-to-r from-[#EC4891] to-[#A928ED]' : 'bg-white/10'
                                    } ${i === currentStep ? 'ring-2 ring-white/20' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start w-full px-6 pt-36 pb-12 overflow-y-auto scrollbar-hide relative z-10">
                <div className="w-full max-w-[480px] flex flex-col items-center h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full flex flex-col flex-1 items-center"
                        >
                            <div className="mb-10 text-center">
                                <h1 className="text-2xl font-bold tracking-tight mb-3 px-4 leading-tight text-white">
                                    {currentQ.question}
                                </h1>
                                <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.2em]">
                                    {currentQ.type === "multi-choice" ? "Select multiple" : "Choose one"}
                                </p>
                            </div>

                            <div className="flex-1 w-full max-w-[500px]">
                                {currentQ.type === "height" ? (
                                    <HeightPicker />
                                ) : (
                                    <div className="grid grid-cols-3 gap-3 py-2 w-full">
                                        {currentQ.options.map((option, idx) => {
                                            const isSelected = currentQ.type === "multi-choice"
                                                ? profileData[currentQ.key]?.includes(option)
                                                : profileData[currentQ.key] === option;

                                            return (
                                                <motion.button
                                                    key={option}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: idx * 0.03 }}
                                                    onClick={() => handleOptionSelect(option)}
                                                    className={`group relative flex flex-col items-center justify-center aspect-square rounded-2xl p-2 transition-all duration-500 overflow-hidden border
                                                        ${isSelected
                                                            ? 'bg-[#EC4891]/10 border-[#EC4891]/40 text-white shadow-[0_0_20px_rgba(236,72,145,0.1)]'
                                                            : 'bg-white/[0.03] border-white/5 text-white/40 hover:bg-white/[0.06] hover:border-white/10 hover:scale-[1.05]'}
                                                    `}
                                                >
                                                    {/* Selection Glow - Removed blur to keep text visible */}
                                                    {isSelected && (
                                                        <motion.div
                                                            layoutId="activeGlow"
                                                            className="absolute inset-0 bg-gradient-to-br from-[#EC4891]/20 to-[#A928ED]/20"
                                                        />
                                                    )}

                                                    <div className={`flex items-center justify-center rounded-xl transition-all duration-500 relative z-10
                                                        ${isSelected ? 'bg-gradient-to-br from-[#EC4891] to-[#A928ED] text-white shadow-lg shadow-[#EC4891]/40 scale-110 mb-2' : 'bg-white/5 text-white/20 mb-1'}
                                                        w-9 h-9 sm:w-11 sm:h-11
                                                    `}>
                                                        <span className="text-lg sm:text-xl">
                                                            {getOptionIcon(option)}
                                                        </span>
                                                    </div>

                                                    <span className={`font-bold transition-all duration-300 text-center leading-tight px-1 relative z-10
                                                        ${isSelected ? 'text-[11px] sm:text-[12px] text-white shadow-sm' : 'text-[10px] sm:text-[11px] text-white/50'}
                                                    `}>
                                                        {option}
                                                    </span>

                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white flex items-center justify-center"
                                                        >
                                                            <FiCheck className="text-[#EC4891] text-[8px] stroke-[4px]" />
                                                        </motion.div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Sticky-like Footer Area */}
                            <div className="py-6 mt-auto w-full max-w-[400px]">
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={handleBack}
                                        className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95 text-white/70"
                                    >
                                        <FiChevronLeft size={16} />
                                        <span className="font-bold text-xs tracking-wide">Back</span>
                                    </button>

                                    <button
                                        onClick={handleNext}
                                        disabled={loading || (currentQ.type !== "height" && !profileData[currentQ.key]?.length)}
                                        className="flex-[2] group h-12 rounded-xl bg-gradient-to-r from-[#EC4891] to-[#A928ED] p-[1.5px] transition-all duration-500 hover:scale-[1.02] active:scale-95 disabled:opacity-20 disabled:grayscale"
                                    >
                                        <div className="w-full h-full rounded-[11px] bg-[#0F0A1E]/20 backdrop-blur-md flex items-center justify-center gap-2 group-hover:bg-transparent transition-all overflow-hidden relative">
                                            {loading ? (
                                                <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
                                            ) : (
                                                <>
                                                    <span className="font-bold text-xs tracking-wide">
                                                        {currentStep === ONBOARDING_QUESTIONS.length - 1 ? 'Unlock My Matches' : 'Next'}
                                                    </span>
                                                    <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>

                                <p className="text-center mt-3 text-[8px] font-black uppercase tracking-[0.2em] text-white/10 italic">
                                    Secure & Private Protocol
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default TrueConnectOnboarding;
