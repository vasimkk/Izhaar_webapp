import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaChevronLeft, FaHeart, FaUserCircle, FaMapMarkerAlt, FaMusic, FaPlane, FaCoffee, FaBook, FaFilm, FaPalette, FaBriefcase, FaGraduationCap, FaPaw, FaPray, FaBalanceScale, FaSmoking, FaWineGlass, FaClock, FaSmile, FaTimes } from "react-icons/fa";
import api from "../../../utils/api";

const TrueConnectProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch Profile
                const profileRes = await api.get("/profile/me");
                setProfile(profileRes.data);

                // Fetch Quiz Status
                try {
                    await api.get("/tc/matches");
                    setIsQuizCompleted(true);
                } catch (err) {
                    if (err.response && err.response.status === 400 && err.response.data.code === "QUIZ_INCOMPLETE") {
                        setIsQuizCompleted(false);
                    }
                }
            } catch (err) {
                console.error("Error fetching initial data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const cmToFeet = (cm) => {
        if (!cm) return "N/A";
        const realFeet = ((cm * 0.393700) / 12);
        const feet = Math.floor(realFeet);
        const inches = Math.round((realFeet - feet) * 12);
        return `${feet}'${inches}" (${cm} cm)`;
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC4891]"></div>
            </div>
        );
    }

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
            {/* Top Back Button */}
            <div className="absolute top-6 left-6 z-[60]">
                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/10 transition-all active:scale-95"
                >
                    <FaChevronLeft className="w-4 h-4" />
                </button>
            </div>

            <main className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10">
                {/* ✨ QUIZ CALL TO ACTION ✨ */}
                {!isQuizCompleted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md mb-10 bg-[#1A0B2E]/60 backdrop-blur-xl border border-[#B72099]/30 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(183,32,153,0.15)] relative overflow-hidden"
                    >
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#EC4891]/20 blur-3xl rounded-full -mr-10 -mt-10" />

                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="flex flex-col items-center group active:scale-95 transition-all outline-none mb-4"
                        >
                            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#EC4891] to-[#A928ED] mb-3 shadow-[0_0_20px_rgba(236,72,145,0.4)] relative">
                                <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                                    {profile?.profile_photo ? (
                                        <img src={profile.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUserCircle className="w-full h-full text-white/10" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#EC4891] shadow-lg border border-[#EC4891]/20">
                                    <FaHeart className="text-[10px]" />
                                </div>
                            </div>
                            <span className="text-white font-bold text-sm tracking-tight group-hover:text-[#EC4891] transition-colors">
                                {profile?.name || "My Profile"}
                            </span>
                        </button>

                        <h3 className="text-[20px] font-bold mb-2 text-white" style={{ fontFamily: 'Outfit' }}>Discover your matches</h3>
                        <p className="text-white/60 text-sm mb-6 max-w-[240px] leading-relaxed">
                            Take a short quiz to find people who match your vibe.
                        </p>

                        <button
                            onClick={() => navigate('/user/true-connection', { state: { autoStart: true } })}
                            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] text-white font-bold text-sm shadow-[0_8px_16px_rgba(236,72,145,0.3)] hover:brightness-110 transition-all active:scale-95"
                        >
                            Start Compatibility Quiz
                        </button>
                    </motion.div>
                )}






            </main>

            {/* Profile Detail Modal */}
            <AnimatePresence>
                {showProfileModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowProfileModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-[#160B2E]/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] max-h-[85vh] flex flex-col"
                            style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                            {/* Decorative Background Glows inside modal */}
                            <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-[#EC4891]/10 blur-[60px] rounded-full pointer-events-none" />
                            <div className="absolute bottom-[-5%] left-[-10%] w-[250px] h-[250px] bg-[#A928ED]/10 blur-[80px] rounded-full pointer-events-none" />

                            {/* Modal Header */}
                            <div className="p-6 flex justify-between items-center border-b border-white/5 relative z-10">
                                <h3 className="text-xl font-bold text-white tracking-tight">My Profile Profile</h3>
                                <button
                                    onClick={() => setShowProfileModal(false)}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 transition-all"
                                >
                                    <FaTimes className="text-sm" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-white relative z-10">
                                <div className="flex flex-col items-center mb-10">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#EC4891] to-[#A928ED] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#EC4891] to-[#A928ED] relative z-10 shadow-2xl">
                                            <div className="w-full h-full rounded-full bg-[#0A0A0A] overflow-hidden flex items-center justify-center border-4 border-[#0A0A0A]">
                                                {profile?.profile_photo ? (
                                                    <img src={profile.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <FaUserCircle className="w-full h-full text-white/10" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mt-5 tracking-tight">
                                        {profile?.name}{profile?.age ? `, ${profile.age}` : ""}
                                    </h2>
                                </div>

                                <div className="space-y-6">


                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-1.5 pb-2">
                                        {[
                                            { label: "Height", value: cmToFeet(profile?.height), icon: "📏" },
                                            { label: "Identity", value: profile?.gender, icon: "👤" },
                                            { label: "Status", value: profile?.relationship_status, icon: "❤️" },
                                            { label: "Connecting", value: Array.isArray(profile?.interested_in) ? profile.interested_in.join(", ") : profile?.interested_in, icon: "🤝" },
                                            { label: "Intent", value: profile?.looking_for, icon: "🎯" },
                                            { label: "Kids", value: profile?.kids, icon: "👶" },
                                            { label: "Occupation", value: profile?.occupation, icon: "💼" },
                                            { label: "Education", value: profile?.education, icon: "🎓" },
                                            { label: "Pets", value: Array.isArray(profile?.pets) ? profile.pets.join(", ") : profile?.pets, icon: "🐾" },
                                            { label: "Religion", value: profile?.religion, icon: "✨" },
                                            { label: "Politics", value: profile?.politics, icon: "⚖️" },
                                            { label: "Smoking", value: profile?.smoking, icon: "🚬" },
                                            { label: "Drinking", value: profile?.drinking, icon: "🍷" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-white/5 rounded-2xl p-2 border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/[0.08] transition-all">
                                                <div className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center text-sm mb-1.5 shadow-inner group-hover:scale-105 transition-transform">
                                                    {item.icon}
                                                </div>
                                                <span className="text-[7.5px] text-white/30 font-black uppercase tracking-wider mb-0.5">{item.label}</span>
                                                <span className="text-[11px] text-white/90 font-bold truncate max-w-full tracking-tight">{item.value || "N/A"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-white/5 relative z-10">
                                <button
                                    onClick={() => {
                                        setShowProfileModal(false);
                                        navigate('/user/trueconnect_onboarding');
                                    }}
                                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] text-white font-black text-sm tracking-widest uppercase shadow-[0_10px_30px_rgba(236,72,145,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <FaEdit className="text-xs" />
                                    Edit Profile
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrueConnectProfile;
