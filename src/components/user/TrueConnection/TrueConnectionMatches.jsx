import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";

const TrueConnectionMatches = () => {
    const { user } = useAuth();
    const [matches, setMatches] = useState({ trueConnections: [], goodMatches: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const res = await api.get("/tc/matches");
            setMatches(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Could not load matches");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const MatchCard = ({ match, type }) => (
        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-white/20">
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700/50">
                {match.profile_photo ? (
                    <img src={match.profile_photo} alt={match.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400/50 to-pink-500/50 text-white text-4xl">
                        {match.name?.charAt(0) || "?"}
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold border border-white/10 shadow-lg">
                    {match.match_percentage}% Match
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-pink-500 transition-colors">
                    {match.name || "Anonymous User"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {match.about || "No bio available."}
                </p>

                <div className="flex justify-between items-center mt-4">
                    <Link
                        to={`/user/profile/${match.user_id}`}
                        className="text-purple-600 dark:text-purple-300 hover:text-pink-500 dark:hover:text-pink-400 font-bold text-sm tracking-wide transition-colors"
                    >
                        View Profile
                    </Link>
                    <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all">
                        Chat 💬
                    </button>
                </div>
            </div>

            {/* Type Badge */}
            {type === 'TRUE' && (
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm text-yellow-700 dark:text-yellow-200 text-xs font-bold uppercase tracking-wider text-center border-t border-yellow-500/30">
                    🔥 True Connection
                </div>
            )}
        </div>
    );

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

            {/* TRUE CONNECTIONS SECTION */}
            {matches.trueConnections.length > 0 && (
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <span className="text-3xl filter drop-shadow-md">🔥</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">Top Matches (80%+)</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {matches.trueConnections.map((m, idx) => (
                            <MatchCard key={idx} match={m} type="TRUE" />
                        ))}
                    </div>
                </section>
            )}

            {/* GOOD MATCHES SECTION */}
            {matches.goodMatches.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <span className="text-3xl filter drop-shadow-md">✨</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">Potential Connections (60-79%)</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {matches.goodMatches.map((m, idx) => (
                            <MatchCard key={idx} match={m} type="GOOD" />
                        ))}
                    </div>
                </section>
            )}

            {matches.trueConnections.length === 0 && matches.goodMatches.length === 0 && (
                <div className="text-center py-24 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 max-w-2xl mx-auto">
                    <div className="text-7xl mb-6 opacity-80">🔍</div>
                    <h3 className="text-3xl font-bold text-white mb-4">No Matches Yet</h3>
                    <p className="text-gray-300 max-w-md mx-auto mb-10 text-lg">
                        We're still looking for your perfect connection. Check back later or invite friends to join!
                    </p>
                    <button
                        onClick={fetchMatches}
                        className="px-8 py-4 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 border border-white/20 transition-all backdrop-blur-md shadow-xl"
                    >
                        Refresh Matches ↻
                    </button>
                </div>
            )}
        </div>
    );
};

export default TrueConnectionMatches;
