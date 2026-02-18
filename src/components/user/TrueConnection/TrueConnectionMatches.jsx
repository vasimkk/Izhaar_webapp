import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function TrueConnectionMatches() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState({ trueConnections: [], goodMatches: [] });

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            const res = await api.get("/tc/matches");
            setMatches(res.data);
        } catch (err) {
            console.error(err);
            if (err.response?.data?.code === "QUIZ_INCOMPLETE") {
                toast.warning("Please complete the quiz first!");
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

    const CompatibilityCircle = ({ percentage }) => (
        <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="22"
                        cy="22"
                        r="18"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="4"
                        fill="transparent"
                    />
                    <circle
                        cx="22"
                        cy="22"
                        r="18"
                        stroke="url(#gradient-match)"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={113}
                        strokeDashoffset={113 - (percentage / 100) * 113}
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="gradient-match" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#EC4899" />
                            <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>
                    </defs>
                </svg>
                <span className="absolute text-[11px] font-black text-white">{percentage}%</span>
            </div>
            <span className="text-white font-medium text-[12px] tracking-tight">Compatibility matched</span>
        </div>
    );

    const MatchCard = ({ match, isHero = false }) => {
        const tags = [
            { label: "Developer", icon: "💻" },
            { label: "Tea lover", icon: "🍵" }
        ];

        return (
            <Link to={`/user/profile/${match.user_id}`} className="block group relative">
                {/* Layered Deck Effect (Subtle) */}
                <div className="absolute inset-0 bg-white/5 rounded-[2.5rem] translate-y-2 translate-x-2 blur-sm -z-10 group-hover:translate-y-3 group-hover:translate-x-3 transition-transform duration-500 opacity-50"></div>

                <div className={`relative bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden group-hover:border-white/20 transition-all duration-500 shadow-2xl
                    ${isHero ? 'w-full p-4' : 'p-3'}
                `}>
                    {/* Hero Label */}
                    {isHero && (
                        <div className="absolute top-4 left-0 z-20">
                            <div className="bg-white px-5 py-2 rounded-r-full shadow-lg">
                                <span className="text-[#EC4899] text-[11px] font-black uppercase tracking-wider italic">Top Match</span>
                            </div>
                        </div>
                    )}

                    {/* Image Area */}
                    <div className={`relative rounded-[1.8rem] overflow-hidden mb-4
                        ${isHero ? 'aspect-[4/5]' : 'aspect-square'}
                    `}>
                        {/* Blurred Profile Image */}
                        {match.profile_photo ? (
                            <img
                                src={match.profile_photo}
                                alt="Profile"
                                className="w-full h-full object-cover filter blur-2xl scale-110 group-hover:scale-125 transition-transform duration-1000"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#000000] flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-transparent"></div>
                            </div>
                        )}

                        {/* Centered Lock Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                {/* Glowing Aura */}
                                <div className="absolute inset-x-0 inset-y-0 bg-[#FF00BF] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden group-hover:scale-110 transition-transform duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF00BF]/20 via-[#8000FF]/20 to-transparent"></div>
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current drop-shadow-[0_0_10px_rgba(255,0,191,0.5)]" viewBox="0 0 24 24">
                                        <path d="M12 1L9 11H12L12 1L15 11H12L12 1Z" className="hidden" /> {/* Placeholder for heart lock */}
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#lock-grad)" />
                                        <path d="M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1c-1.1 0-2 .9-2 2v1h4v-1c0-1.1-.9-2-2-2z" fill="black" opacity="0.5" />
                                        <defs>
                                            <linearGradient id="lock-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#FF00BF" />
                                                <stop offset="100%" stopColor="#8000FF" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    {/* Small Lock Hole Icon Overlay */}
                                    <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-3 bg-black/40 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Tags Area */}
                        <div className="absolute inset-x-0 bottom-3 px-3">
                            <div className="flex flex-wrap justify-center gap-2">
                                {tags.map((tag, i) => (
                                    <div key={i} className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5 hover:bg-black/60 transition-colors">
                                        <span className="text-xs">{tag.icon}</span>
                                        <span className="text-[10px] font-bold text-white tracking-tight">{tag.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Compatibility Info */}
                    <CompatibilityCircle percentage={match.match_percentage} />
                </div>
            </Link>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF00BF] mb-4"></div>
                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Filtering Vibes...</p>
            </div>
        );
    }

    const allMatches = [...matches.trueConnections, ...matches.goodMatches];
    const topMatch = allMatches[0];

    return (
        <div className="min-h-screen bg-transparent animate-fade-in">
            {/* Header */}
            <header className="px-6 py-8 flex items-center justify-between animate-slide-up-fade">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/user/dashboard')}
                        className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">Your Matches</h1>
                </div>

                <button
                    onClick={handleRetakeQuiz}
                    className="text-white/40 hover:text-white/80 transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white/5"
                >
                    <span>Retake Quiz</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </header>

            <main className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
                {/* Hero Title Section */}
                <div className="text-center mb-8 animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-[20px] sm:text-[22px] font-semibold text-center" style={{
                        fontFamily: 'Poppins, sans-serif',
                        background: 'linear-gradient(90deg, #EC4899 0%, #A855F7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 'normal'
                    }}>
                        It's a match ✨
                    </h2>
                    <p className="mx-auto mt-2 px-2 text-center font-normal text-white/70 text-[11px] sm:text-[12px] leading-normal max-w-[268px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Based on your answers, these people match your vibe perfectly.
                    </p>
                </div>

                {/* Top Match */}
                {topMatch && (
                    <div className="mb-14">
                        <MatchCard match={topMatch} isHero={true} />
                    </div>
                )}

                <div className="space-y-8">
                    <h3 className="text-[22px] font-semibold text-center" style={{
                        fontFamily: 'Poppins, sans-serif',
                        background: 'linear-gradient(90deg, #EC4899 0%, #A855F7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 'normal'
                    }}>Matched Profiles</h3>

                    {allMatches.length > 1 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {allMatches.slice(1).map((match, idx) => (
                                <MatchCard key={idx} match={match} />
                            ))}
                        </div>
                    ) : (
                        allMatches.length === 0 && (
                            <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/10">
                                <p className="text-white/40 font-bold mb-4">No matches found yet.</p>
                                <button
                                    onClick={handleRetakeQuiz}
                                    className="px-10 py-4 bg-gradient-to-r from-[#FF00BF] to-[#8000FF] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    Retake Quiz
                                </button>
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
}
