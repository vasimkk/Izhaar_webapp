import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../utils/api";

export default function SongRequestList() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get("/music/requests");
            if (res.data.success) {
                setRequests(res.data.requests);
            }
        } catch (err) {
            console.error("Failed to fetch requests", err);
            toast.error("Failed to load song requests.");
        } finally {
            setLoading(false);
        }
    };

    const getReceiverName = (request) => {
        let details = request.details;
        if (typeof details === 'string') {
            try { details = JSON.parse(details); } catch (e) { }
        }
        const r = details?.receiver;
        if (!r) return "Special Someone";

        return r.receiverName || r.name || r.fullname || r.receiver?.receiverName || "Special Someone";
    };

    const handleSend = (request) => {
        // Navigate to preview page with this request's data to handle the sending flow
        navigate("/user/song/preview", {
            state: {
                requestId: request.id,
                story: request.story,
                status: request.status,
                ...request
            }
        });
    };

    const handleDownload = (request) => {
        if (!request.song_file_path) return;
        const a = document.createElement("a");
        a.href = request.song_file_path;
        a.download = `song_${request.id}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="min-h-screen w-full p-4 sm:p-6 md:p-8 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 max-w-4xl mx-auto relative z-10">
                <button
                    onClick={() => navigate("/user/song")}
                    className="flex items-center gap-1.5 px-2.5 py-2 sm:p-2 sm:px-0 bg-white/10 hover:bg-white/20 rounded-full sm:rounded-full text-white transition hover:shadow-lg backdrop-blur-sm"
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xs sm:hidden font-semibold"></span>
                </button>
                <div className="text-center flex-1 px-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">My Songs</h1>
                    <div className="w-16 sm:w-20 h-0.5 sm:h-1 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mt-1 sm:mt-2 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                </div>
                <div className="w-14 sm:w-9"></div> {/* Spacer - wider on mobile for back button */}
            </div>

            <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3 relative z-10 w-full pb-20">
                {loading ? (
                    <div className="text-center text-white/50 py-10 flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                        Loading your songs...
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center text-white/60 py-10 bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
                        <p className="mb-4 text-sm sm:text-base font-medium">No song requests found.</p>
                        <button
                            onClick={() => navigate("/user/song")}
                            className="px-6 py-2.5 text-sm sm:text-base bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-pink-500/20 hover:scale-105 transition-all"
                        >
                            Create Your First Song
                        </button>
                    </div>
                ) : (
                    requests.map(req => {
                        const receiverName = getReceiverName(req);
                        const isCompleted = req.status === 'COMPLETED';
                        const isRejected = req.status === 'REJECTED';

                        return (
                            <div key={req.id} className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-pink-500/30 hover:bg-white/10 transition-all shadow-lg hover:shadow-pink-500/5 group">
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0 shadow-inner ${isCompleted ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                                {isCompleted ? '🎵' : '⏳'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-base sm:text-lg font-bold text-white truncate">{receiverName}</h3>
                                                <p className="text-xs text-white/40">Request #{req.id}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap flex-shrink-0 border ${isCompleted ? 'bg-green-500/10 text-green-400 border-green-500/20' : isRejected ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                            {req.status}
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium text-white/70">{req.style || "Pop"}</span>
                                        <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium text-white/70">{req.mood || "Neutral"}</span>
                                    </div>

                                    {/* Audio Player & Actions */}
                                    {isCompleted ? (
                                        <div className="flex flex-col gap-3 pt-2">
                                            {req.song_file_path && (
                                                <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                                                    <audio controls className="w-full h-8 opacity-90 invert-[.95] hue-rotate-180">
                                                        <source src={req.song_file_path} type="audio/mpeg" />
                                                    </audio>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => handleDownload(req)}
                                                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs sm:text-sm rounded-xl font-semibold transition flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                    Download
                                                </button>
                                                {!req.sent && (
                                                    <button
                                                        onClick={() => handleSend(req)}
                                                        className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs sm:text-sm rounded-xl font-bold shadow-lg shadow-pink-500/20 transition flex items-center justify-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                                        Send
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleSend(req)}
                                            className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-xs sm:text-sm rounded-xl font-semibold transition mt-2"
                                        >
                                            View Status Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
