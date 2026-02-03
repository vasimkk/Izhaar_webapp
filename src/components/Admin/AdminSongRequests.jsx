import React, { useEffect, useState } from "react";
import { FaMusic, FaCloudUploadAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function AdminSongRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/songs");
            if (res.data?.success) {
                setRequests(res.data.requests);
            }
        } catch (err) {
            console.error("Failed to fetch song requests", err);
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (requestId, file) => {
        if (!file) return;

        // Validate if audio
        if (!file.type.startsWith('audio') && !file.type.startsWith('video')) {
            toast.error("Please upload an audio/video file");
            return;
        }

        try {
            setUploadingId(requestId);
            const formData = new FormData();
            formData.append("songFile", file);

            const res = await api.post(`/admin/songs/${requestId}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data?.success) {
                toast.success("Song uploaded & fulfilled!");
                // Update list
                setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'COMPLETED', song_file_path: res.data.songUrl } : r));
            } else {
                toast.error("Upload failed: " + res.data?.message);
            }
        } catch (err) {
            console.error("Upload error", err);
            toast.error("Upload failed");
        } finally {
            setUploadingId(null);
        }
    };

    const parseDetails = (jsonDetails) => {
        try {
            if (typeof jsonDetails === 'string') return JSON.parse(jsonDetails);
            return jsonDetails || {};
        } catch (e) { return {}; }
    };

    if (loading) return <div className="p-10 text-center text-rose-500 font-bold animate-pulse font-serif italic text-2xl">Loading Requests...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-rose-100 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-800 font-serif italic">Song Requests</h3>
                    <FaMusic className="text-rose-400 text-2xl" />
                </div>

                <div className="space-y-6">
                    {requests.length === 0 ? (
                        <p className="text-center text-slate-400 italic">No song requests found.</p>
                    ) : (
                        requests.map(req => {
                            const details = parseDetails(req.details);
                            const receiver = details.receiver || {};
                            const isPending = req.status === 'PENDING';

                            return (
                                <div key={req.id} className={`p-6 rounded-3xl border transition-all ${isPending ? 'bg-white border-rose-200 shadow-md' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
                                    <div className="flex flex-col md:flex-row gap-6 justify-between">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPending ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                                        {req.status}
                                                    </span>
                                                    <span className="ml-2 text-xs font-mono text-slate-400">ID: #{req.id}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(req.created_at).toLocaleString()}
                                                </span>
                                            </div>

                                            <h4 className="text-slate-800 font-bold">From: {req.mobile || req.sender_id}</h4>

                                            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                                                <div className="bg-rose-50 p-2 rounded-lg">
                                                    <p className="text-[10px] text-slate-400 uppercase font-black">Receiver</p>
                                                    <p className="font-semibold text-slate-700">
                                                        {receiver.receiverName || receiver.name || receiver.receiver?.receiverName || 'Unknown'}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {receiver.receiverMobile || receiver.mobile || receiver.receiver?.receiverMobile}
                                                    </p>
                                                </div>
                                                <div className="bg-blue-50 p-2 rounded-lg">
                                                    <p className="text-[10px] text-slate-400 uppercase font-black">Style & Mood</p>
                                                    <p className="font-semibold text-slate-700">{req.style || details.genre} / {req.mood}</p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50/50 p-3 rounded-xl text-sm italic text-slate-600 border border-slate-100">
                                                "{req.story}"
                                            </div>
                                        </div>

                                        <div className="md:w-64 flex flex-col justify-center items-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            {isPending ? (
                                                uploadingId === req.id ? (
                                                    <div className="flex flex-col items-center text-rose-500 animate-pulse">
                                                        <FaSpinner className="spin text-2xl mb-2" />
                                                        <span className="text-xs font-bold">Uploading...</span>
                                                    </div>
                                                ) : (
                                                    <label className="cursor-pointer flex flex-col items-center hover:text-rose-500 transition group">
                                                        <FaCloudUploadAlt className="text-3xl text-slate-300 group-hover:text-rose-400 mb-2 transition" />
                                                        <span className="text-xs font-bold text-slate-400 group-hover:text-rose-500">Upload Song File</span>
                                                        <input
                                                            type="file"
                                                            accept="audio/*,video/*"
                                                            className="hidden"
                                                            onChange={(e) => handleFileUpload(req.id, e.target.files[0])}
                                                        />
                                                    </label>
                                                )
                                            ) : (
                                                <div className="flex flex-col items-center text-green-500">
                                                    <FaCheckCircle className="text-3xl mb-2" />
                                                    <span className="text-xs font-bold">Completed</span>
                                                    <a href={req.song_file_path} target="_blank" rel="noreferrer" className="text-[10px] underline mt-1 text-slate-400 hover:text-rose-500">Download/Play</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
