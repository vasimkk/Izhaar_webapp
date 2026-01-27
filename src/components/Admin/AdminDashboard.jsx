import React, { useEffect, useState } from "react";
import { FaUsers, FaHeart, FaMoneyBillWave, FaGamepad, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import api from "../../utils/api";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-rose-100 shadow-xl shadow-rose-100/20 group hover:scale-[1.02] transition-all">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-4 rounded-2xl ${color} text-white shadow-lg`}>
                <Icon className="text-2xl" />
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div className="space-y-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
            <p className="text-3xl font-black text-slate-800">{value}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/admin/stats");
                if (res.data.success) {
                    setStats(res.data.stats);
                    setRecentUsers(res.data.recentUsers);
                }
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center text-rose-500 font-bold animate-pulse">Scanning systems...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Explorers"
                    value={stats?.users || 0}
                    icon={FaUsers}
                    color="bg-blue-500"
                    trend={12}
                />
                <StatCard
                    title="Soulmate Quests"
                    value={stats?.activeQuizzes || 0}
                    icon={FaGamepad}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Izhaars Shared"
                    value={stats?.izhaars || 0}
                    icon={FaHeart}
                    color="bg-rose-500"
                    trend={8}
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.revenue || 0}`}
                    icon={FaMoneyBillWave}
                    color="bg-green-500"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Users Table */}
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-rose-100 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-800 font-serif italic">Recent Explorers</h3>
                        <button className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest">View All</button>
                    </div>
                    <div className="space-y-4">
                        {recentUsers.map((user, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50 hover:bg-rose-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.name ? user.name[0] : user.mobile?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800">{user.name || 'Anonymous'}</h5>
                                        <p className="text-[10px] text-slate-400 font-medium">{user.mobile}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Joined</span>
                                    <p className="text-[10px] font-bold text-slate-800">{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-rose-100 shadow-xl">
                    <h3 className="text-xl font-black text-slate-800 font-serif italic mb-8">Maintenance Hub</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                <span className="text-sm font-bold text-slate-700">Database Server</span>
                            </div>
                            <span className="text-[10px] font-black text-green-500 uppercase">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                <span className="text-sm font-bold text-slate-700">Socket.IO Gateway</span>
                            </div>
                            <span className="text-[10px] font-black text-green-500 uppercase">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                <span className="text-sm font-bold text-slate-700">Maintenance Mode</span>
                            </div>
                            <span className="text-[10px] font-black text-rose-500 uppercase">Inactive</span>
                        </div>

                        <button className="w-full bg-slate-800 text-white font-black py-4 rounded-2xl hover:bg-slate-900 transition-all text-xs uppercase tracking-[0.2em] shadow-lg shadow-slate-200">
                            Run System Diagnostics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
