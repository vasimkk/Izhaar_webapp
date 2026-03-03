import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { HiArrowRight } from "react-icons/hi2";

export default function ActivityTrackerSection() {
    const [latestActivity, setLatestActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await api.get("/izhaar/all");
                const list = Array.isArray(res.data?.izhaar) ? res.data.izhaar : [];
                if (list.length > 0) {
                    setLatestActivity(list[0]);
                }
            } catch (err) {
                console.error("Failed to fetch activities:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    if (!loading && !latestActivity) return null;

    const getStatusConfig = (status) => {
        switch (status) {
            case "ACCEPTED": return {
                message: "AMAZING! THEY ACCEPTED YOUR PROPOSAL.",
                color: "text-green-400",
                border: "border-green-500/50",
                bg: "bg-green-500/5"
            };
            case "REJECTED": return {
                message: "THEY DECLINED THE PROPOSAL. STAY STRONG!",
                color: "text-red-400",
                border: "border-red-500/50",
                bg: "bg-red-500/5"
            };
            case "SEEN": return {
                message: "SEEN! THEY ARE READING YOUR MESSAGE RIGHT NOW.",
                color: "text-purple-400",
                border: "border-purple-500/50",
                bg: "bg-purple-500/5"
            };
            case "DELIVERED": return {
                message: "DELIVERED! IT'S IN THEIR HANDS NOW.",
                color: "text-blue-400",
                border: "border-blue-500/50",
                bg: "bg-blue-500/5"
            };
            default: return {
                message: "SENT! WAITING FOR THE MAGIC TO HAPPEN.",
                color: "text-[#EC4891]",
                border: "border-[#EC4891]/50",
                bg: "bg-[#EC4891]/5"
            };
        }
    };

    const config = latestActivity ? getStatusConfig(latestActivity.status) : getStatusConfig("SENT");

    return (
        <section className="px-4 mt-16 animate-premium-in w-full max-w-4xl mx-auto">
            {/* Top Separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />
            {/* Minimal Sharp Header */}
            <div className="flex items-center justify-between mb-4 border-l-2 border-[#EC4891] pl-4">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600/40" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">LIVE ACTIVITY FEED</h3>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">REAL-TIME SYSTEM STATUS</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/user/izhaar_tracker')}
                    className="text-[10px] font-black text-[#EC4891] hover:text-white transition-all uppercase tracking-widest"
                >
                    [ View History ]
                </button>
            </div>

            {loading ? (
                <div className="h-20 border border-white/10 rounded-none animate-pulse" />
            ) : (
                <div
                    onClick={() => navigate('/user/izhaar_tracker')}
                    className={`group relative overflow-hidden bg-white/[0.02] border ${config.border} rounded-none p-6 sm:p-8 cursor-pointer transition-all hover:bg-white/[0.05] shadow-[0_0_40px_rgba(0,0,0,0.5)]`}
                >
                    {/* Stealth Glow Overlay */}
                    <div className="absolute top-0 right-0 w-32 h-full opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-l from-white/20 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-2 px-3 py-1 border ${config.border} ${config.bg}`}>
                                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'currentColor' }} />
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.color}`}>
                                        {latestActivity.status}
                                    </span>
                                </div>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <h2 className={`text-base sm:text-2xl dashboard-head-text !bg-none !-webkit-text-fill-color-inherit leading-none tracking-tighter uppercase group-hover:translate-x-1 transition-transform ${config.color}`}
                                style={{ 
                                    background: 'none', 
                                    WebkitBackgroundClip: 'initial',
                                    WebkitTextFillColor: 'currentColor' 
                                }}
                            >
                                {config.message}
                            </h2>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[8px] sm:text-[9px] font-bold text-white/30 uppercase tracking-[0.1em] sm:tracking-[0.15em]">
                                <p className="max-w-[100px] sm:max-w-none truncate">TO: <span className="text-white/60">{latestActivity.receiver_name || "SPECIAL SOMEONE"}</span></p>
                                <span className="hidden sm:inline opacity-20">/</span>
                                <p>CODE: <span className="text-[#EC4891]/60">#{latestActivity.izhaar_code || latestActivity.code}</span></p>
                                <span className="hidden sm:inline opacity-20">/</span>
                                <p className="whitespace-nowrap">
                                    {new Date(latestActivity.created_at).toLocaleDateString([], { day: '2-digit', month: 'short' })} • {new Date(latestActivity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        {/* Sharp Action Button */}
                        <div className={`flex items-center justify-center w-12 h-12 border ${config.border} ${config.color} group-hover:bg-white group-hover:text-black transition-all duration-300 hidden sm:flex`}>
                            <HiArrowRight className="text-xl" />
                        </div>
                    </div>

                    {/* Industrial Texture Decoration */}
                    <div className="absolute bottom-0 right-0 p-1 opacity-10 pointer-events-none select-none">
                        <div className="flex gap-1">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="w-[1px] h-3 bg-white" />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-12" />
        </section>
    );
}
