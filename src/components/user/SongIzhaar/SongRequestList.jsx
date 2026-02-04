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
                background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 max-w-4xl mx-auto relative z-10">
                <button
                    onClick={() => navigate("/user/song")}
                    className="flex items-center gap-1.5 px-2.5 py-2 sm:p-2 sm:px-0 bg-white/20 hover:bg-white/30 rounded-full sm:rounded-full text-gray-800 transition hover:shadow-md"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xs sm:hidden font-semibold"></span>
                </button>
                <div className="text-center flex-1 px-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">My Songs</h1>
                  <div className="w-16 sm:w-20 h-0.5 sm:h-1 mx-auto rounded-full bg-gradient-to-r from-pink-400 to-purple-400 mt-1 sm:mt-2" />
                </div>
                <div className="w-14 sm:w-9"></div> {/* Spacer - wider on mobile for back button */}
            </div>

            <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3 relative z-10 w-full pb-20">
                {loading ? (
                    <div className="text-center text-gray-600 py-10">Loading your songs...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center text-gray-600 py-10">
                        <p className="mb-4 text-sm sm:text-base">No song requests found.</p>
                        <button
                            onClick={() => navigate("/user/song")}
                            className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg hover:shadow-lg transition"
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
                            <div key={req.id} className="bg-gradient-to-br from-white/90 to-white/70 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/30 hover:shadow-md transition-all">
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold flex-shrink-0 ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {isCompleted ? '🎵' : '⏳'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{receiverName}</h3>
                                                <p className="text-xs text-gray-500">Request #{req.id}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap flex-shrink-0 ${isCompleted ? 'bg-green-100 text-green-700' : isRejected ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {req.status}
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 sm:gap-2">
                                        <span className="bg-white/70 px-2 py-1 rounded text-xs font-medium text-gray-700">{req.style || "Pop"}</span>
                                        <span className="bg-white/70 px-2 py-1 rounded text-xs font-medium text-gray-700">{req.mood || "Neutral"}</span>
                                    </div>

                                    {/* Audio Player & Actions */}
                                    {isCompleted ? (
                                        <div className="flex flex-col gap-2">
                                            {req.song_file_path && (
                                                <audio controls className="w-full h-6 opacity-90">
                                                    <source src={req.song_file_path} type="audio/mpeg" />
                                                </audio>
                                            )}
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => handleDownload(req)}
                                                    className="px-3 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 text-gray-800 text-xs sm:text-sm rounded-lg font-semibold transition"
                                                >
                                                    Download
                                                </button>
                                                {!req.sent && (
                                                    <button
                                                        onClick={() => handleSend(req)}
                                                        className="px-3 py-1.5 sm:py-2 bg-gradient-to-r from-pink-400 to-purple-400 hover:shadow-lg text-white text-xs sm:text-sm rounded-lg font-semibold transition"
                                                    >
                                                        Send
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleSend(req)}
                                            className="w-full px-3 py-2 bg-white/70 hover:bg-white/90 text-gray-800 text-xs sm:text-sm rounded-lg font-semibold transition"
                                        >
                                            View Status
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
