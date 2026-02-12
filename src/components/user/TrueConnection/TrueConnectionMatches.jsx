import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

export default function TrueConnectionMatches() {
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

    const MatchCard = ({ match, type }) => (
        <div className="group relative">
            {/* Gradient Border Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl opacity-60 group-hover:opacity-100 blur transition-all duration-500"></div>

            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Photo Section with Blur */}
                <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90 z-10"></div>

                    {/* Blurred Photo */}
                    {match.profile_photo ? (
                        <img
                            src={match.profile_photo}
                            alt="Profile"
                            className="w-full h-full object-cover filter blur-md scale-110 group-hover:scale-125 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white text-3xl sm:text-5xl md:text-6xl font-black filter blur-md">
                            {match.name?.charAt(0) || "?"}
                        </div>
                    )}

                    {/* Floating Premium Lock */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="relative animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-2xl opacity-75"></div>
                            <div className="relative bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-full p-2.5 sm:p-4 md:p-5 shadow-2xl ring-2 sm:ring-4 ring-white/30">
                                <svg className="w-4 h-4 sm:w-6 md:w-7 sm:h-6 md:h-7 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Match % - Floating Badge */}
                    <div className="absolute top-2 right-2 z-20">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full blur opacity-80"></div>
                            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full shadow-xl ring-1 sm:ring-2 ring-white/40">
                                <span className="text-[10px] sm:text-xs font-black text-white drop-shadow">{match.match_percentage}%</span>
                            </div>
                        </div>
                    </div>

                    {/* TRUE Badge */}
                    {type === 'TRUE' && (
                        <div className="absolute top-2 left-2 z-20">
                            <div className="bg-gradient-to-r from-red-500 to-pink-600 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full shadow-xl ring-1 sm:ring-2 ring-white/40 flex items-center gap-1">
                                <span className="text-[10px] sm:text-xs">🔥</span>
                                <span className="text-[9px] sm:text-xs font-black text-white">TRUE</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-2.5 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
                    {/* Blurred Name with Shimmer */}
                    <div className="relative overflow-hidden">
                        <h3 className="text-base sm:text-xl md:text-2xl font-black text-white filter blur-md line-clamp-1">
                            {match.name || "Anonymous"}
                        </h3>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                    </div>

                    {/* Blurred Bio */}
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-1 sm:line-clamp-2 filter blur-md">
                        {match.about || "No bio available"}
                    </p>

                    {/* Unlock CTA */}
                    <Link to={`/user/profile/${match.user_id}`} className="block">
                        <div className="relative group/btn mt-2 sm:mt-3 md:mt-4 overflow-hidden rounded-xl sm:rounded-2xl">
                            {/* Animated Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 opacity-100 animate-gradient"></div>

                            {/* Button */}
                            <div className="relative px-3 py-2 sm:px-4 sm:py-3 md:py-3.5 flex items-center justify-center gap-1.5 sm:gap-2 backdrop-blur-sm">
                                <svg className="w-3.5 h-3.5 sm:w-4 md:w-5 sm:h-4 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                                </svg>
                                <span className="text-white font-black text-[11px] sm:text-xs md:text-sm tracking-wide">UNLOCK</span>
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Price */}
                    <div className="text-center pt-0.5 hidden xs:block">
                        <span className="text-[10px] sm:text-xs text-gray-500">Only </span>
                        <span className="text-sm sm:text-base md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">₹49</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 4s ease infinite;
                }
            `}</style>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 drop-shadow-sm mb-6">
                    Your True Connections
                </h1>
                <p className="text-lg text-gray-200/90 max-w-3xl mx-auto leading-relaxed">
                    Based on your quiz answers, we've found people who share your core values and personality traits.
                    <br className="hidden md:block" />
                    A higher match percentage means a stronger potential for a meaningful connection.
                </p>
            </div>

            <div className="flex justify-end items-center mb-8">
                <button
                    onClick={handleRetakeQuiz}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-white/10 text-white"
                >
                    Retake Quiz ↺
                </button>
            </div>

            {/* TRUE CONNECTIONS */}
            {matches.trueConnections.length > 0 && (
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <span className="text-3xl filter drop-shadow-md">🔥</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">Top Matches (80%+)</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {matches.trueConnections.map((m, idx) => (
                            <MatchCard key={idx} match={m} type="TRUE" />
                        ))}
                    </div>
                </section>
            )}

            {/* GOOD MATCHES */}
            {matches.goodMatches.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <span className="text-3xl filter drop-shadow-md">✨</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">Potential Connections (60-79%)</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {matches.goodMatches.map((m, idx) => (
                            <MatchCard key={idx} match={m} type="GOOD" />
                        ))}
                    </div>
                </section>
            )}

            {matches.trueConnections.length === 0 && matches.goodMatches.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-2xl text-gray-400 mb-4">No matches yet!</p>
                    <p className="text-gray-500">Complete the quiz to find your connections.</p>
                </div>
            )}
        </div>
    );
}
