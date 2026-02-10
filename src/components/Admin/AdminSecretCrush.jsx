import React, { useEffect, useState } from "react";
import { FaHeart, FaUserSecret, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function AdminSecretCrush() {
    const [stats, setStats] = useState({ total: 0, matches: 0 });
    const [crushes, setCrushes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCrushData();
    }, []);

    const fetchCrushData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/secret-crush");
            if (res.data?.success) {
                setStats(res.data.stats);
                setCrushes(res.data.crushes);
            }
        } catch (err) {
            console.error("Failed to fetch secret crush data", err);
            toast.error("Failed to load secret crush data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-rose-500 font-bold animate-pulse font-serif italic text-2xl">Loading Secret Crushes...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-rose-100 shadow-xl flex items-center space-x-4">
                    <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 text-3xl">
                        <FaUserSecret />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Crushes</p>
                        <h3 className="text-3xl font-black text-slate-800 font-serif">{stats.total}</h3>
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-rose-100 shadow-xl flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-500 text-3xl">
                        <FaHeart />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Matches</p>
                        <h3 className="text-3xl font-black text-slate-800 font-serif">{stats.matches}</h3>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-rose-100 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-800 font-serif italic">Secret Crush Activity</h3>
                    <FaUserSecret className="text-rose-400 text-2xl" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                                <th className="p-4">Date</th>
                                <th className="p-4">Sender</th>
                                <th className="p-4">Target (Crush)</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Revealed?</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-slate-600">
                            {crushes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400 italic">No secret crushes found.</td>
                                </tr>
                            ) : (
                                crushes.map(crush => (
                                    <tr key={crush.id} className="border-b border-slate-50 hover:bg-rose-50/30 transition">
                                        <td className="p-4 text-slate-400 text-xs font-mono whitespace-nowrap">
                                            {new Date(crush.created_at).toLocaleDateString()}
                                            <div className="text-[10px]">{new Date(crush.created_at).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{crush.sender_real_name || "Unknown"}</div>
                                            <div className="text-xs text-rose-400">{crush.sender_mobile}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">
                                                {crush.target_real_name ? crush.target_real_name : (
                                                    <span className="text-slate-400 font-normal italic">Unregistered</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-500">{crush.crush_name} (Entered Name)</div>
                                            <div className="text-xs text-rose-400 font-mono">{crush.crush_mobile}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {crush.is_match ? (
                                                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    <FaCheckCircle /> <span>Match</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    <FaHourglassHalf /> <span>Pending</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {crush.is_revealed ? (
                                                <span className="text-green-500 font-bold text-xs">Yes</span>
                                            ) : (
                                                <span className="text-slate-300 font-bold text-xs">No</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
