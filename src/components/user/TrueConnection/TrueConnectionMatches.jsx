import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import {
    FiSearch, FiRefreshCw, FiHeart, FiUsers, FiStar,
    FiMessageCircle, FiUser, FiInfo, FiChevronRight, FiMapPin, FiChevronLeft, FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function TrueConnectionMatches({ onBack }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState({ trueConnections: [], goodMatches: [] });
    const [userProfile, setUserProfile] = useState(null);
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [matchesRes, profileRes] = await Promise.all([
                api.get("/tc/matches"),
                api.get("/profile/me")
            ]);
            setMatches(matchesRes.data);
            setUserProfile(profileRes.data);
        } catch (err) {
            console.error(err);
            if (err.response?.data?.code === "QUIZ_INCOMPLETE") {
                toast.warning("Please complete the quiz first!");
                navigate('/user/true-connection');
            } else {
                toast.error(err.response?.data?.message || "Failed to load matches");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRetakeQuiz = async () => {
        if (!window.confirm("This will delete all current answers. Continue?")) return;
        try {
            await api.post("/tc/reset");
            window.location.reload();
        } catch (err) {
            console.error(err);
            toast.error("Failed to reset quiz");
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF00BF] mb-4"></div>
                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Filtering Vibes...</p>
            </div>
        );
    }


    const allMatches = [...(matches.trueConnections || []), ...(matches.goodMatches || [])];
    const topMatch = matches.trueConnections?.[0] || matches.goodMatches?.[0];

    // Real stats from backend
    const stats = [
        { label: "Matches", value: matches.stats?.matches || 0, icon: <FiHeart />, color: "from-pink-500/20 to-rose-500/20", textColor: "text-rose-400" },
        { label: "Connected", value: matches.stats?.connected || 0, icon: <FiUsers />, color: "from-purple-500/20 to-indigo-500/20", textColor: "text-indigo-400" },
        { label: "Favorites", value: matches.stats?.favorites || 0, icon: <FiStar />, color: "from-amber-500/20 to-orange-500/20", textColor: "text-amber-400" },
    ];

    // Helper to get interests/tags from profile
    const getInterests = (match) => {
        if (!match) return [];
        let interests = [];
        try {
            if (match.interested_in) {
                interests = typeof match.interested_in === 'string' ? JSON.parse(match.interested_in) : match.interested_in;
            }
        } catch (e) { console.error(e); }

        // Add occupation or religion as tags if interests are few
        if (interests.length < 3) {
            if (match.occupation) interests.push(match.occupation);
            if (match.religion) interests.push(match.religion);
        }
        return interests.slice(0, 4);
    };

    const breakdownItems = [
        { label: "Emotional Bond", score: topMatch ? Math.min(100, topMatch.match_percentage + Math.floor(Math.random() * 5)) : 90 },
        { label: "Shared Interests", score: topMatch ? Math.max(70, topMatch.match_percentage - Math.floor(Math.random() * 8)) : 94 },
        { label: "Communication", score: topMatch ? Math.min(100, topMatch.match_percentage + Math.floor(Math.random() * 3)) : 91 },
        { label: "Life Goals", score: topMatch ? Math.max(60, topMatch.match_percentage - Math.floor(Math.random() * 12)) : 88 },
        { label: "Energy Match", score: topMatch ? Math.min(100, topMatch.match_percentage + Math.floor(Math.random() * 4)) : 85 },
    ];

    return (
        <div className="min-h-screen bg-[#0F0A1E] text-white font-sans pb-24 overflow-x-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/10 blur-[120px] rounded-full"></div>
            </div>

            {/* Header Section */}
            <header className="px-4 pt-4 pb-2 relative">
                {/* Top Nav Row with Profile */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack || (() => navigate("/user/dashboard"))}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg backdrop-blur-md active:scale-95"
                        >
                            <FiChevronLeft className="text-lg" />
                        </button>
                        <h1 className="text-lg font-black tracking-tight">True Connection</h1>
                    </div>

                    <div
                        onClick={() => setShowProfileModal(true)}
                        className="w-10 h-10 rounded-full border-2 border-pink-500/30 p-0.5 overflow-hidden cursor-pointer active:scale-95 transition-all hover:border-pink-500"
                    >
                        <img
                            src={userProfile?.profile_photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                </div>

                {/* Feature Description */}
                <div className="mb-6 px-1">
                    <p className="text-white/40 text-[11px] font-medium leading-relaxed italic">
                        Discover souls that truly resonate with your energy. We match people according to your unique vibe and values to find your perfect connection. ✨
                    </p>
                </div>

                {/* Compact Info Row */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                        <span className="text-white/40 text-[9px] uppercase font-black tracking-[0.2em] px-2.5 py-1 bg-white/5 rounded-full border border-white/5">
                            {userProfile?.location?.split(',')[0] || "Active"}
                        </span>
                        <button
                            onClick={handleRetakeQuiz}
                            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 px-3 py-1.5 rounded-full border border-pink-500/20 transition-all active:scale-95"
                        >
                            <FiRefreshCw className="text-[9px]" /> Retake
                        </button>
                    </div>
                </div>

                {/* Modern Discovery System */}
                <div className="space-y-3 mb-6">
                    {/* Interactive Search Capsule */}
                    <div className="relative group">
                        <div className="relative flex items-center bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[1.8rem] transition-all group-focus-within:bg-white/[0.06] group-focus-within:border-white/20 shadow-2xl">
                            <div className="flex-1 relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <FiSearch className="text-lg text-white/20 transition-all duration-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Find your frequency..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent py-3.5 pl-14 pr-12 text-[13px] font-bold text-white placeholder:text-white/20 focus:outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                                    >
                                        <FiX className="text-xs text-white/40" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modern Glass Filtering Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-1 -mx-4 px-4">
                        {["All", "Matched", "Connected", "Requests", "Favorites"].map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.15em] whitespace-nowrap transition-all duration-300 border ${isActive
                                        ? "bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white shadow-lg shadow-pink-500/20 scale-105"
                                        : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:border-white/10"
                                        }`}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            <main className="px-6 space-y-8 max-w-lg mx-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-1 relative overflow-hidden group hover:border-white/20 transition-all hover:bg-white/[0.07]">
                            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.color} blur-2xl -mr-8 -mt-8`}></div>
                            <div className={`${stat.textColor} text-base mb-0.5`}>{stat.icon}</div>
                            <div className="text-lg font-bold leading-none">{stat.value}</div>
                            <div className="text-white/40 text-[9px] font-medium uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Best Match Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            Your Best Match <span className="text-purple-400">✨</span>
                        </h3>
                    </div>

                    {topMatch ? (
                        <div className="space-y-6">
                            {/* Best Match Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-[1/1.15] rounded-2xl overflow-hidden group shadow-2xl"
                            >
                                <img
                                    src={topMatch.profile_photo || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600"}
                                    alt={topMatch.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                                <div className="absolute top-6 left-6 flex items-center gap-2">
                                    <div className="bg-amber-400 text-black text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 uppercase italic shadow-lg">
                                        <FiStar fill="currentColor" /> Top Match
                                    </div>
                                </div>

                                <div className="absolute top-6 right-6">
                                    <div className="relative w-14 h-14 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center p-1">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                                            <circle
                                                cx="28"
                                                cy="28"
                                                r="24"
                                                stroke="#A855F7"
                                                strokeWidth="3"
                                                fill="none"
                                                strokeDasharray={150.8}
                                                strokeDashoffset={150.8 - (topMatch.match_percentage / 100) * 150.8}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-xs font-bold leading-none">{topMatch.match_percentage}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-6 pt-12">
                                    <h4 className="text-2xl font-bold mb-1">{topMatch.name}, {topMatch.age}</h4>
                                    <p className="text-white/60 text-sm mb-4 flex items-center gap-1">
                                        <FiMapPin className="text-pink-500" /> {topMatch.occupation || "Hyderabad ,India"}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {getInterests(topMatch).map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-medium border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/user/profile/${topMatch.user_id}`)}
                                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
                                    >
                                        <FiHeart className="fill-current" /> Connect Now
                                    </button>
                                </div>
                            </motion.div>

                            {/* Compatibility Breakdown */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Why you match</p>
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold">Compatibility Breakdown <span className="text-pink-400">✨</span></h4>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-purple-400">{topMatch.match_percentage}%</div>
                                        <div className="text-[10px] text-white/30 font-black tracking-widest">OVERALL</div>
                                    </div>
                                </div>

                                <div className="space-y-5 mb-8">
                                    {breakdownItems.map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center text-xs font-medium">
                                                <span className="flex items-center gap-2">
                                                    {i === 0 && <span className="text-purple-400 text-sm">💜</span>}
                                                    {i === 1 && <span className="text-amber-400 text-sm">✨</span>}
                                                    {i === 2 && <span className="text-white text-sm">💬</span>}
                                                    {i === 3 && <span className="text-rose-400 text-sm">🌟</span>}
                                                    {i === 4 && <span className="text-amber-500 text-sm">⚡</span>}
                                                    {item.label}
                                                </span>
                                                <span className="text-white/40">{item.score}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${item.score}%` }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                    className={`h-full bg-gradient-to-r ${i === 0 ? "from-purple-500 to-indigo-600" :
                                                        i === 1 ? "from-amber-400 to-orange-500" :
                                                            i === 2 ? "from-sky-400 to-blue-500" :
                                                                i === 3 ? "from-rose-400 to-pink-500" :
                                                                    "from-amber-500 to-yellow-400"
                                                        }`}
                                                ></motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-3 italic">
                                    <span className="text-xl">🐚</span>
                                    <p className="text-white/60 text-xs leading-relaxed">
                                        You and {topMatch.name.split(' ')[0]} share a <span className="text-pink-400 font-semibold">deep emotional resonance</span>.
                                        Your creative souls and love for small moments make this connection <span className="text-purple-400 font-semibold">extraordinary</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
                            <FiInfo className="mx-auto text-3xl text-white/20 mb-4" />
                            <p className="text-white/40 text-sm mb-6">No matches found for your current profile.</p>
                            <button
                                onClick={() => navigate('/user/true-connection')}
                                className="px-8 py-3 bg-white/10 rounded-full text-xs font-bold hover:bg-white/20 transition-all"
                            >
                                Retake Quiz
                            </button>
                        </div>
                    )}
                </section>

                {/* Active Connections */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Active Connections</h3>
                        <button className="text-pink-500 text-xs font-bold flex items-center gap-1 group">
                            See all <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {allMatches
                                .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .filter(m => {
                                    if (activeTab === "All") return true;
                                    if (activeTab === "Matched") return true;
                                    return false;
                                })
                                .slice(1, 5).map((match, i) => (
                                    <motion.div
                                        key={match.user_id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate(`/user/profile/${match.user_id}`)}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-4 group hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
                                    >
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden">
                                                <img
                                                    src={match.profile_photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"}
                                                    alt=""
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-[0.5rem] border border-[#0F0A1E] shadow-sm">
                                                {match.match_percentage}%
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className="font-bold text-sm text-white/90">{match.name}, {match.age}</h4>
                                                <FiChevronRight className="text-white/20 group-hover:text-pink-500 transition-colors" />
                                            </div>
                                            <p className="text-white/40 text-[10px] mb-2 flex items-center gap-1">
                                                <FiMapPin className="text-pink-500" /> {match.occupation || "Online"}
                                            </p>
                                            <div className="flex gap-1.5 overflow-hidden">
                                                {getInterests(match).slice(0, 3).map((tag, j) => (
                                                    <span key={j} className="text-[9px] text-white/30 flex items-center gap-1 whitespace-nowrap">
                                                        <span className="text-white/10">#</span> {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* New Matches */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">New Matches</h3>
                        <button className="text-pink-500 text-xs font-bold flex items-center gap-1 group">
                            See all <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pt-4">
                        {matches.goodMatches?.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((match, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex-shrink-0 w-40 bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-2 group hover:border-white/20 transition-all"
                            >
                                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-3">
                                    <img
                                        src={match.profile_photo || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=200"}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 bg-pink-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md border border-white/10">
                                        {match.match_percentage}%
                                    </div>
                                </div>
                                <div className="px-2 pb-2">
                                    <h4 className="font-bold text-xs mb-1 truncate">{match.name}</h4>
                                    <p className="text-white/40 text-[9px] mb-3 flex items-center gap-1 truncate">
                                        🐚 {match.occupation || match.gender}
                                    </p>
                                    <button
                                        onClick={() => navigate(`/user/profile/${match.user_id}`)}
                                        className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-[10px] font-black active:scale-95 transition-all"
                                    >
                                        Connect
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Profile Detail Sheet */}
            <AnimatePresence>
                {showProfileModal && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowProfileModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-lg bg-[#0F0A1E] rounded-t-[3rem] overflow-hidden shadow-2xl h-[92vh] flex flex-col"
                        >
                            {/* Draggable Indicator */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/10 rounded-full z-20"></div>

                            <div className="relative aspect-[4/5] shrink-0 overflow-hidden group">
                                <img
                                    src={userProfile?.profile_photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                                />
                                {/* Rich Dynamic Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1E] via-transparent to-black/20"></div>

                                {/* Top Controls */}
                                <div className="absolute top-6 left-0 right-0 px-6 flex items-center justify-between z-30">
                                    <div className="w-10 h-1 bg-white/20 rounded-full flex-1 mx-12"></div>
                                    <button
                                        onClick={() => setShowProfileModal(false)}
                                        className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center border border-white/10 text-white shadow-2xl active:scale-90 transition-all font-bold"
                                    >
                                        <FiX className="text-xl" />
                                    </button>
                                </div>

                                {/* Bottom Info Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <h3 className="text-4xl font-black tracking-tighter text-white drop-shadow-2xl">
                                            {userProfile?.name?.split(' ')[0]}, {userProfile?.age || 24}
                                        </h3>
                                        <div className="px-3 py-1.5 bg-pink-500/20 backdrop-blur-md border border-pink-500/30 rounded-full text-pink-500 text-[10px] font-black uppercase tracking-widest shadow-lg">
                                            Verified
                                        </div>
                                    </div>
                                    <p className="text-white/60 text-sm flex items-center gap-2 font-bold drop-shadow-lg">
                                        <FiMapPin className="text-pink-500" /> {userProfile?.location || "Delhi, India"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-7 pt-1 pb-16 space-y-9 scrollbar-hide">
                                {/* Bio / Vibe Section */}
                                {userProfile?.about && (
                                    <div className="relative">
                                        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full opacity-50"></div>
                                        <div className="pl-6 pt-2">
                                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-4">The Vibe</p>
                                            <p className="text-white/90 text-xl leading-[1.6] font-medium italic tracking-tight">
                                                "{userProfile.about}"
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Lifestyle Capsules */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
                                        <p className="text-white/20 text-[8px] font-black uppercase tracking-wider mb-2">Goal</p>
                                        <p className="text-[10px] font-black text-pink-400 capitalize truncate">{userProfile?.looking_for || "Soulmate"}</p>
                                    </div>
                                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
                                        <p className="text-white/20 text-[8px] font-black uppercase tracking-wider mb-2">Faith</p>
                                        <p className="text-[10px] font-black text-purple-400 capitalize truncate">{userProfile?.religion || "Diverse"}</p>
                                    </div>
                                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
                                        <p className="text-white/20 text-[8px] font-black uppercase tracking-wider mb-2">Status</p>
                                        <p className="text-[10px] font-black text-amber-400 capitalize truncate">{userProfile?.relationship_status || "Single"}</p>
                                    </div>
                                </div>

                                {/* Identity Cards */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-6 p-1 relative group">
                                        <div className="w-14 h-14 rounded-[1.4rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/50 text-xl group-hover:bg-white/[0.05] transition-all">
                                            <FiUser />
                                        </div>
                                        <div>
                                            <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1.5">Occupation</p>
                                            <p className="text-[15px] font-bold text-white/90">{userProfile?.occupation || "Exploring life"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 p-1 relative group">
                                        <div className="w-14 h-14 rounded-[1.4rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/50 text-xl group-hover:bg-white/[0.05] transition-all">
                                            <FiInfo />
                                        </div>
                                        <div>
                                            <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1.5">Education</p>
                                            <p className="text-[15px] font-bold text-white/90">{userProfile?.education || "Life long learner"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Interests / Passions */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-1">
                                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">Our Frequency</p>
                                        <div className="h-px bg-white/5 flex-1 ml-6"></div>
                                    </div>
                                    <div className="flex gap-3 flex-wrap">
                                        {getInterests(userProfile).map((tag, i) => (
                                            <span key={i} className="px-5 py-3 bg-white/[0.03] border border-white/5 rounded-full text-[11px] font-black text-white/40 hover:text-pink-500 hover:border-pink-500/30 transition-all">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
