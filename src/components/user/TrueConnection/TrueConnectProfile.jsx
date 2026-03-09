import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEdit, FaChevronLeft, FaHeart, FaUserCircle, FaMapMarkerAlt, FaMusic, FaPlane, FaCoffee, FaBook, FaFilm, FaPalette, FaBriefcase, FaGraduationCap, FaPaw, FaPray, FaBalanceScale, FaSmoking, FaWineGlass, FaClock, FaSmile } from "react-icons/fa";
import api from "../../../utils/api";

const TrueConnectProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);

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
                {/* ✨ QUIZ CALL TO ACTION ✨ */}
                {!isQuizCompleted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md mb-10 bg-[#1A0B2E]/60 backdrop-blur-xl border border-[#B72099]/30 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(183,32,153,0.15)] relative overflow-hidden"
                    >
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#EC4891]/20 blur-3xl rounded-full -mr-10 -mt-10" />

                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#EC4891] to-[#A928ED] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(236,72,145,0.4)]">
                            <FaHeart className="text-white text-2xl" />
                        </div>

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

                {/* Profile Header Section Title */}
                <div className="w-full max-w-md mb-6 px-1">
                    <h2 className="text-[22px] font-bold text-center text-white" style={{ fontFamily: 'Outfit' }}>Your Profile</h2>
                    <p className="text-center text-white/40 text-[12px] font-medium uppercase tracking-[0.1em] mt-1">This is how others will see you</p>
                </div>

                {/* Profile Section */}
                <div className="w-full max-w-md flex flex-col items-center">
                    {/* Centered Profile Image with Glow */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative mb-6"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#EC4891] to-[#A928ED] rounded-full blur-2xl opacity-20" />
                        <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-[#EC4891] to-[#A928ED] relative z-10">
                            <div className="w-full h-full rounded-full bg-[#0A0A0A] overflow-hidden flex items-center justify-center border-4 border-[#0A0A0A]">
                                {profile?.profile_photo ? (
                                    <img src={profile.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <FaUserCircle className="w-full h-full text-white/10" />
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Name & Location */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit' }}>
                            {profile?.name || "User"}{profile?.age ? `, ${profile.age}` : ""}
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-white/50 text-[14px]">
                            <FaMapMarkerAlt className="text-white/30" />
                            <span>{profile?.location || "Location not set"}</span>
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <button
                        onClick={() => navigate('/user/trueconnect_onboarding')}
                        className="mb-10 px-8 py-2.5 rounded-full border border-white/20 bg-white/5 text-white/80 text-[14px] font-semibold hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <FaEdit className="w-3.5 h-3.5" />
                        Edit Profile
                    </button>

                    {/* Quick Tags Section */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10 px-2">
                        {[
                            { label: profile?.relationship_status || "Single", icon: "❤️", color: "pink" },
                            { label: profile?.occupation || "Occupation", icon: "💼", color: "purple" },
                            { label: "Coffee", icon: "☕", color: "blue" },
                            { label: "Reading", icon: "📚", color: "pink" },
                            { label: "Movies", icon: "🎬", color: "purple" },
                            { label: "Art", icon: "🎨", color: "yellow" }
                        ].map((tag, i) => (
                            <div
                                key={i}
                                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-[14px] font-medium text-white/90"
                            >
                                <span>{tag.icon}</span>
                                <span>{tag.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* About Me Section */}
                    <div className="w-full mb-8">
                        <div className="bg-[#1A0B2E]/40 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group">
                            <div className="flex items-center gap-3 mb-4">
                                <FaHeart className="text-[#EC4891] opacity-60" />
                                <h4 className="text-[16px] font-bold text-white/90" style={{ fontFamily: 'Outfit' }}>About Me</h4>
                            </div>
                            <p className="text-white/40 text-[14px] leading-relaxed italic">
                                {profile?.bio || "Double tap Add about you here........"}
                            </p>
                        </div>
                    </div>

                    {/* Interests Section */}
                    <div className="w-full mb-8">
                        <div className="bg-[#1A0B2E]/40 border border-white/5 rounded-[2rem] p-8 pb-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-5 h-5 bg-purple-500/20 rounded flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-sm" />
                                </div>
                                <h4 className="text-[18px] font-bold text-white/90" style={{ fontFamily: 'Outfit' }}>Interests</h4>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { label: "Music Lover", subtitle: "Indie, Jazz & Soul", icon: <FaMusic /> },
                                    { label: "Travel Enthusiast", subtitle: "Always planning the next adventure", icon: <FaPlane /> },
                                    { label: "Coffee Addict", subtitle: "Can't start the day without it", icon: <FaCoffee /> }
                                ].map((interest, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                                            {interest.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[16px] font-bold text-white/90 leading-tight mb-1">{interest.label}</span>
                                            <span className="text-[13px] text-white/40 font-medium">{interest.subtitle}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Relationship Preferences Section */}
                    <div className="w-full mb-12">
                        <div className="bg-[#1A0B2E]/40 border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm" />
                                </div>
                                <h4 className="text-[18px] font-bold text-white/90" style={{ fontFamily: 'Outfit' }}>Relationship Preferences</h4>
                            </div>

                            <div className="flex flex-col gap-6">
                                {[
                                    { label: "Looking for", value: profile?.looking_for || "Serious relationship" },
                                    { label: "Age range", value: "30+" },
                                    { label: "Personality type", value: "Calm and supportive" },
                                    { label: "Ideal date", value: "Outdoor adventures" },
                                    { label: "Identity", value: profile?.gender || "Man" },
                                    { label: "Height", value: cmToFeet(profile?.height) }
                                ].map((pref, i) => (
                                    <div key={i} className="flex items-center justify-between py-1">
                                        <span className="text-[14px] text-white/40 font-medium">{pref.label}</span>
                                        <span className="text-[15px] text-white font-semibold text-right">{pref.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Link */}
                <div className="w-full max-w-md mb-12">
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
