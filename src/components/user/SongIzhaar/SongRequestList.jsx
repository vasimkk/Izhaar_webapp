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
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto relative z-10">
                <button
                    onClick={() => navigate("/user/song")}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-white">My Songs 🎵</h1>
                <div className="w-9"></div> {/* Spacer */}
            </div>

            <div className="max-w-4xl mx-auto space-y-4 relative z-10 w-full pb-20">
                {loading ? (
                    <div className="text-center text-white/50 py-10">Loading your songs...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center text-white/50 py-10">
                        <p className="mb-4">No song requests found.</p>
                        <button
                            onClick={() => navigate("/user/song")}
                            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
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
                            <div key={req.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all shadow-lg">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    {/* Left Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {isCompleted ? '🎵' : '⏳'}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white max-w-[200px] truncate md:max-w-xs">{receiverName}</h3>
                                                <p className="text-xs text-gray-400">Request #{req.id}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 text-sm text-gray-300 mt-2">
                                            <span className="bg-white/10 px-2 py-1 rounded-md text-xs">{req.style || "Pop"}</span>
                                            <span className="bg-white/10 px-2 py-1 rounded-md text-xs">{req.mood || "Neutral"}</span>
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${isCompleted ? 'bg-green-500/20 text-green-400' : isRejected ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right Actions */}
                                    <div className="flex flex-col justify-center gap-2 md:items-end">
                                        {isCompleted ? (
                                            <>
                                                {req.song_file_path && (
                                                    <audio controls className="h-8 max-w-[250px] opacity-90 mb-2">
                                                        <source src={req.song_file_path} type="audio/mpeg" />
                                                    </audio>
                                                )}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDownload(req)}
                                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg flex items-center gap-1 transition"
                                                    >
                                                        📥 Download
                                                    </button>
                                                    <button
                                                        onClick={() => handleSend(req)}
                                                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm rounded-lg flex items-center gap-1 transition shadow-lg"
                                                    >
                                                        ✉️ Send / View
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleSend(req)}
                                                className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm rounded-lg transition"
                                            >
                                                View Status
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
