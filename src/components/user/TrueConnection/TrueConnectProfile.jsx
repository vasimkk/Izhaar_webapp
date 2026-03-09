import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEdit, FaChevronLeft, FaHeart, FaUserCircle } from "react-icons/fa";
import api from "../../../utils/api";

const TrueConnectProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/profile/me");
                setProfile(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC4891]"></div>
            </div>
        );
    }

    const cmToFeet = (cm) => {
        if (!cm) return "N/A";
        const realFeet = ((cm * 0.393700) / 12);
        const feet = Math.floor(realFeet);
        const inches = Math.round((realFeet - feet) * 12);
        return `${feet}'${inches}" (${cm} cm)`;
    };

    const details = [
        { label: "Height", value: cmToFeet(profile?.height), icon: "📏" },
        { label: "Identity", value: profile?.gender, icon: "👤" },
        { label: "Relationship Status", value: profile?.relationship_status, icon: "💍" },
        { label: "Connecting With", value: Array.isArray(profile?.interested_in) ? profile.interested_in.join(", ") : profile?.interested_in, icon: "🤝" },
        { label: "Intent", value: profile?.looking_for, icon: "🎯" },
        { label: "Kids", value: profile?.kids, icon: "👶" },
        { label: "Occupation", value: profile?.occupation, icon: "💼" },
        { label: "Education", value: profile?.education, icon: "🎓" },
        { label: "Pets", value: Array.isArray(profile?.pets) ? profile.pets.join(", ") : profile?.pets, icon: "🐾" },
        { label: "Beliefs", value: profile?.religion, icon: "✨" },
        { label: "Politics", value: profile?.politics, icon: "⚖️" },
        { label: "Smoking", value: profile?.smoking, icon: "🚬" },
        { label: "Drinking", value: profile?.drinking, icon: "🍷" },
    ];

    return (
        <div className="min-h-screen w-full relative text-white overflow-x-hidden" style={{
            background: 'linear-gradient(172deg, #000 0%, #4E006C 100%)'
        }}>
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#EC4891]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-5%] left-[-10%] w-[500px] h-[500px] bg-[#A928ED]/15 blur-[150px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 inset-x-0 px-6 py-6 flex justify-between items-center z-50 bg-black/20 backdrop-blur-md border-b border-white/5">
                <button
                    onClick={() => navigate('/user/true-connection')}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/10 transition-all active:scale-95"
                >
                    <FaChevronLeft className="w-4 h-4" />
                </button>
                <h1 className="text-[18px] font-bold" style={{ fontFamily: 'Outfit' }}>Your Connection Profile</h1>
                <button
                    onClick={() => navigate('/user/trueconnect_onboarding')}
                    className="w-10 h-10 rounded-full bg-[#EC4891]/20 border border-[#EC4891]/30 flex items-center justify-center text-[#EC4891] hover:bg-[#EC4891]/30 transition-all active:scale-95"
                >
                    <FaEdit className="w-4 h-4" />
                </button>
            </header>

            <main className="pt-28 pb-12 px-6 flex flex-col items-center">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-10 text-center"
                >
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#EC4891] to-[#A928ED]">
                            <div className="w-full h-full rounded-full bg-[#0A0A0A] overflow-hidden flex items-center justify-center border-2 border-black">
                                {profile?.profile_photo ? (
                                    <img src={profile.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <FaUserCircle className="w-full h-full text-white/10" />
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-[#EC4891] to-[#A928ED] w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-[10px]">
                            <FaHeart className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{profile?.name || "User"}</h2>
                    <p className="text-white/50 text-sm">{profile?.age ? `${profile.age} years old` : "Age not set"}</p>
                </motion.div>

                {/* Details Grid */}
                <div className="w-full max-w-md grid grid-cols-1 gap-4">
                    {details.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-xl w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl">{item.icon}</span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">{item.label}</span>
                                    <span className="text-[15px] font-semibold text-white/90">{item.value || "Not specified"}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Action button at bottom */}
                <div className="w-full max-w-md mt-10">
                    <button
                        onClick={() => navigate('/user/true-connection')}
                        className="w-full py-4 rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] font-bold text-[15px] shadow-[0_12px_24px_rgba(236,72,145,0.3)] hover:brightness-110 transition-all active:scale-95"
                    >
                        Back to True Connection
                    </button>
                    <p className="text-center mt-4 text-white/30 text-[11px] px-6 leading-relaxed">
                        This profile helps us match you with the right people. You can update these details anytime.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default TrueConnectProfile;
