import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../utils/api";

const TrueConnectOnboarding = ({ onComplete }) => {
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
    const progress = ((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100;

    const handleOptionSelect = (option) => {
        if (currentQ.type === "choice") {
            setProfileData(prev => ({ ...prev, [currentQ.key]: option }));
            // Auto next for single choice
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
            await api.post("/profile", payload);
            toast.success("Profile updated!");
            if (onComplete) {
                onComplete();
            } else {
                navigate("/user/true-connection");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    const HeightPicker = () => {
        const heights = Array.from({ length: 101 }, (_, i) => 130 + i);
        const scrollRef = React.useRef(null);

        const cmToFeet = (cm) => {
            const realFeet = ((cm * 0.393700) / 12);
            const feet = Math.floor(realFeet);
            const inches = Math.round((realFeet - feet) * 12);
            return `${feet}'${inches}"`;
        };

        return (
            <div className="flex flex-col items-center justify-center w-full py-8 h-72 overflow-hidden relative">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60px] border-y border-[#EC4891]/30 bg-[#EC4891]/5 pointer-events-none z-0"></div>
                <div
                    ref={scrollRef}
                    className="flex flex-col items-center gap-4 overflow-y-auto scrollbar-hide py-32 snap-y snap-mandatory w-full z-10"
                    onScroll={(e) => {
                        const top = e.target.scrollTop;
                        const index = Math.round(top / 56);
                        if (heights[index] && heights[index] !== profileData.height) {
                            setProfileData(prev => ({ ...prev, height: heights[index] }));
                        }
                    }}
                >
                    {heights.map((h) => (
                        <div key={h} className="h-10 flex items-center justify-center snap-center shrink-0">
                            <span className={`text-[22px] font-bold transition-all duration-300 ${profileData.height === h ? 'text-white scale-110' : 'text-white/20 scale-100'}`}>
                                {h} <span className="text-[12px] font-normal opacity-50 ml-1">cm</span>
                                <span className="mx-3 opacity-30">|</span>
                                <span className="text-[18px] opacity-80">{cmToFeet(h)}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen w-full relative text-white overflow-hidden" style={{
            background: 'linear-gradient(172deg, #000 0%, #4E006C 100%)'
        }}>
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#EC4891]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-5%] left-[-10%] w-[500px] h-[500px] bg-[#A928ED]/15 blur-[150px] rounded-full pointer-events-none" />

            {/* Header / Progress bar */}
            <header className="flex-none px-6 py-8 flex justify-between items-center z-50">
                <button
                    onClick={handleBack}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/10 transition-all active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#EC4891] mb-2" style={{ fontFamily: 'Poppins' }}>
                        Step {currentStep + 1}/{ONBOARDING_QUESTIONS.length}
                    </span>
                    <div className="w-24 h-[3px] bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(236,72,145,0.5)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start w-full px-6 pt-2 pb-12 overflow-y-auto scrollbar-hide relative z-10">
                <div className="w-full max-w-[360px] flex flex-col items-center justify-start h-full">



                    <div className="w-full">
                        <h2 className="text-[18px] font-semibold text-center mb-8 px-2 text-white/90" style={{ fontFamily: 'Outfit' }}>
                            {currentQ.question}
                        </h2>

                        {currentQ.type === "height" ? (
                            <HeightPicker />
                        ) : (
                            <div className="flex flex-col gap-3.5 w-full">
                                {currentQ.options.map((option) => {
                                    const isSelected = currentQ.type === "multi-choice"
                                        ? profileData[currentQ.key]?.includes(option)
                                        : profileData[currentQ.key] === option;

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => handleOptionSelect(option)}
                                            className={`w-full py-4 px-6 rounded-[20px] transition-all duration-300 font-semibold text-[14px] border-2
                                                ${isSelected
                                                    ? 'border-[#EC4891] bg-[#2E0045]/60 text-white shadow-[0_0_20px_rgba(236,72,145,0.2)]'
                                                    : 'border-white/5 bg-[#1A1025]/60 hover:border-white/20 hover:bg-[#251833]/80 text-[#B8A1C9]/80'}
                                            `}
                                            style={{ fontFamily: 'Poppins' }}
                                        >
                                            <div className="flex justify-between items-center text-center w-full">
                                                <span className="w-full">{option}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className="w-full mt-12 mb-6">
                        <button
                            onClick={handleNext}
                            disabled={loading || (currentQ.type !== "height" && !profileData[currentQ.key]?.length && !profileData[currentQ.key])}
                            className="w-full text-white font-bold text-sm transition-all duration-500 flex items-center justify-center gap-[10px] disabled:opacity-40 hover:brightness-110 active:scale-95 shadow-[0_12px_24px_rgba(236,72,145,0.3)]"
                            style={{
                                height: '48px',
                                padding: '10px 16px',
                                borderRadius: '24px',
                                background: 'linear-gradient(90deg, #EC4891 -12.18%, #A928ED 76.79%)',
                            }}
                        >
                            {loading ? (
                                <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
                            ) : (
                                <span>{currentStep === ONBOARDING_QUESTIONS.length - 1 ? 'Finish Profile Building' : 'Next Question'}</span>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TrueConnectOnboarding;
