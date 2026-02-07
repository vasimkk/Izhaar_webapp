import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { FaLock, FaHeart, FaUserSecret, FaUnlock, FaInfo, FaTimes, FaClock, FaList } from 'react-icons/fa';

export default function SecretCrush() {
    const [crushes, setCrushes] = useState([]);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false); // Default hidden form like Watch Party tabs logic could be tailored
    const [showInfoModal, setShowInfoModal] = useState(false);
    const navigate = useNavigate();

    const [filter, setFilter] = useState('all');

    const pendingCount = crushes.filter((item) => !item.is_match).length;
    const matchCount = crushes.filter((item) => item.is_match).length;

    const filteredCrushes = crushes.filter((item) => {
        if (filter === 'match') return item.is_match;
        if (filter === 'pending') return !item.is_match;
        return true;
    });

    useEffect(() => {
        fetchCrushes();
    }, []);

    const fetchCrushes = async () => {
        try {
            const res = await api.get('/secret-crush/list');
            if (res.data.status === 'success') {
                setCrushes(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching crushes", error);
        }
    };

    const handleAddCrush = async (e) => {
        e.preventDefault();
        if (!name || !mobile) {
            toast.error("Please enter both name and mobile number");
            return;
        }
        if (mobile.length < 10) {
            toast.error("Please enter a valid mobile number");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/secret-crush/add', { crushName: name, crushMobile: '+91' + mobile });
            if (res.data.status === 'success') {
                toast.success(
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-white text-sm sm:text-base">Secret Sent! 🤫</span>
                        <span className="text-[10px] sm:text-xs text-gray-300 leading-tight">{res.data.message || "Crush added successfully!"}</span>
                    </div>,
                    {
                        icon: <span className="text-lg sm:text-xl">💌</span>,
                        style: {
                            background: 'rgba(20, 10, 40, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(236, 72, 153, 0.3)',
                            borderRadius: '12px',
                            color: '#fff',
                        },
                        className: 'm-2 sm:m-0 shadow-xl shadow-pink-500/10',
                        progressStyle: { background: 'linear-gradient(to right, #ec4899, #a855f7)' }
                    }
                );
                if (res.data.isMatch) {
                    toast.success(
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-pink-300 text-base sm:text-lg">It's a Match! 💘</span>
                            <span className="text-[10px] sm:text-xs text-gray-200 leading-tight">They liked you back! Check Matches.</span>
                        </div>,
                        {
                            icon: <span className="text-xl sm:text-2xl">🎉</span>,
                            style: {
                                background: 'rgba(40, 10, 60, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(236, 72, 153, 0.6)',
                                borderRadius: '16px',
                                color: '#fff',
                            },
                            className: 'm-2 sm:m-0 shadow-2xl shadow-pink-500/20',
                            progressStyle: { background: 'linear-gradient(to right, #ec4899, #a855f7)' },
                            autoClose: 6000
                        }
                    );
                }
                setName('');
                setMobile('');
                setShowForm(false);
                fetchCrushes();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add crush");
        } finally {
            setLoading(false);
        }
    };

    const handleUnlock = async () => {
        const confirm = window.confirm("Unlock your matches for ₹99? (Demo: Click OK to Unlock)");
        if (!confirm) return;

        try {
            const res = await api.post('/secret-crush/unlock');
            if (res.data.status === 'success') {
                toast.success("Matches Unlocked! 💖");
                fetchCrushes();
            }
        } catch (error) {
            toast.error("Failed to unlock");
        }
    };

    return (
        <div className="flex flex-col min-h-screen text-white relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
                .font-vibes { font-family: 'Great Vibes', cursive; }
                .bounce-heart { animation: bounce-heart 0.6s ease-in-out infinite; }
                @keyframes bounce-heart {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
                /* Custom Scrollbar */
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(236, 72, 153, 0.5); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(236, 72, 153, 0.8); }
            `}</style>

            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Mobile Back Button */}
            <button
                onClick={() => navigate("/user/dashboard")}
                className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
                style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(212, 197, 232, 0.3)',
                    boxShadow: '0 4px 12px rgba(45, 27, 78, 0.15)'
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-[#2D1B4E]"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* Info Modal */}
            {showInfoModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-rose-900/95 rounded-3xl shadow-2xl border-2 border-pink-500/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-xl">
                        <div className="flex items-center justify-between p-6 border-b border-pink-500/30 sticky top-0 bg-black/40 backdrop-blur-md">
                            <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text flex items-center gap-2">
                                <span className="text-3xl">💡</span> How It Works
                            </h2>
                            <button onClick={() => setShowInfoModal(false)} className="p-2 hover:bg-pink-500/20 rounded-full transition">
                                <FaTimes className="text-xl text-pink-200" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { step: 1, title: "Add Your Crush", desc: "Enter their phone details silently." },
                                { step: 2, title: "Create Wishlist", desc: "List all people you are interested in." },
                                { step: 3, title: "Get Notified", desc: "They receive an anonymous hint from Izhaar." },
                                { step: 4, title: "Match Check", desc: "If they add you back, it's a match! 💘" },
                                { step: 5, title: "Unlock Secret", desc: "Reveal who likes you (small fee)." },
                                { step: 6, title: "Connect Safely", desc: "Izhaar helps you connect securely." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-pink-500/30">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-300">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col items-center py-8 px-4 relative z-10 w-full max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8 pt-6 sm:pt-0 animate-fade-in">
                    <div className="inline-block mb-2">
                        <div className="relative">
                            <FaUserSecret className="text-6xl text-pink-400 animate-bounce" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3 font-serif tracking-tight">
                        Secret Crush
                    </h1>
                    <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light">
                        "What if they like you back? Discover the magic safely! ✨"
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">

                    {/* Left Panel: How it Works (Desktop) */}
                    <div className="hidden lg:block space-y-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <FaInfo className="text-pink-400" /> How It Works
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { icon: "1", text: "Add your crush securely via phone number." },
                                    { icon: "2", text: "We discreetly notify them about a crush (anonymous)." },
                                    { icon: "3", text: "If they add you back, it's a Match! 💘" },
                                    { icon: "4", text: "Unlock to connect and start your story." }
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition border border-white/5">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg">
                                            {step.icon}
                                        </div>
                                        <p className="text-gray-200 text-sm">{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-3xl p-6 border border-pink-500/30 text-center">
                            <h3 className="font-bold text-pink-200 mb-2">🔒 100% Private & Secure</h3>
                            <p className="text-sm text-gray-300">Your crush will NEVER know it's you unless the feeling is mutual.</p>
                        </div>
                    </div>

                    {/* Right Panel: Action Area */}
                    <div className="space-y-6">

                        {/* Add Crush Toggle/Form */}
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-white/20 shadow-2xl relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

                            {!showForm ? (
                                <div className="text-center space-y-3 sm:space-y-6 py-1 sm:py-4">
                                    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                                        <div
                                            onClick={() => setFilter('all')}
                                            className={`cursor-pointer rounded-lg sm:rounded-2xl p-1 sm:p-2 border transition-all flex flex-col items-center justify-center gap-0.5 sm:gap-1 ${filter === 'all'
                                                ? 'bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border-purple-400 shadow-purple-500/20 shadow-lg'
                                                : 'bg-black/30 border-white/10 hover:bg-black/40'
                                                }`}
                                        >
                                            <div className="flex items-center gap-1">
                                                <FaList className="text-purple-300 text-[10px] sm:text-base opacity-90" />
                                                <p className="text-gray-300 text-[9px] sm:text-xs uppercase tracking-wider font-bold leading-tight">All</p>
                                            </div>
                                            <p className="text-sm sm:text-2xl font-bold text-white leading-tight">{crushes.length}</p>
                                        </div>

                                        <div
                                            onClick={() => setFilter('match')}
                                            className={`cursor-pointer rounded-lg sm:rounded-2xl p-1 sm:p-2 border transition-all flex flex-col items-center justify-center gap-0.5 sm:gap-1 ${filter === 'match'
                                                ? 'bg-gradient-to-br from-pink-500/30 to-purple-500/30 border-pink-500 shadow-pink-500/20 shadow-lg'
                                                : 'bg-black/30 border-white/10 hover:bg-black/40'
                                                }`}
                                        >
                                            <div className="flex items-center gap-1">
                                                <FaHeart className="text-pink-400 text-[10px] sm:text-base opacity-90" />
                                                <p className="text-gray-300 text-[9px] sm:text-xs uppercase tracking-wider font-bold leading-tight">Matches</p>
                                            </div>
                                            <p className="text-sm sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 leading-tight">{matchCount}</p>
                                        </div>

                                        <div
                                            onClick={() => setFilter('pending')}
                                            className={`cursor-pointer rounded-lg sm:rounded-2xl p-1 sm:p-2 border transition-all flex flex-col items-center justify-center gap-0.5 sm:gap-1 ${filter === 'pending'
                                                ? 'bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border-blue-400 shadow-blue-500/20 shadow-lg'
                                                : 'bg-black/30 border-white/10 hover:bg-black/40'
                                                }`}
                                        >
                                            <div className="flex items-center gap-1">
                                                <FaClock className="text-blue-400 text-[10px] sm:text-base opacity-90" />
                                                <p className="text-gray-300 text-[9px] sm:text-xs uppercase tracking-wider font-bold leading-tight">Pending</p>
                                            </div>
                                            <p className="text-sm sm:text-2xl font-bold text-white leading-tight">{pendingCount}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 py-2 sm:py-3 px-3 sm:px-5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-base shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 transform hover:shadow-pink-500/50 flex items-center justify-center gap-1.5 sm:gap-2"
                                    >
                                        <span>Add New Crush</span> <span className="text-base sm:text-xl">💌</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-5 animate-fade-in-up">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-bold text-white">Add Your Crush 💘</h3>
                                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white transition"><FaTimes /></button>
                                    </div>

                                    <form onSubmit={handleAddCrush} className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1.5 font-semibold pl-1">Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-black/30 border-2 border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition placeholder:text-gray-500 text-sm sm:text-base"
                                                placeholder="E.g. Aditi Sharma"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1.5 font-semibold pl-1">Mobile Number</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm sm:text-base">+91</span>
                                                <input
                                                    type="tel"
                                                    value={mobile}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val.length <= 10) setMobile(val);
                                                    }}
                                                    className="w-full bg-black/30 border-2 border-white/20 rounded-xl pl-12 pr-4 py-2.5 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition placeholder:text-gray-500 tracking-wider font-mono text-sm sm:text-base"
                                                    placeholder="9876543210"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2.5 rounded-xl font-bold text-base shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                        >
                                            {loading ? 'Adding...' : 'Add Secretly 🤫'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* List of Crushes */}
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                            <div className="pl-2 mb-3">
                                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                                    {filter === 'all' ? 'Your Secret List 💖' : filter === 'match' ? 'Your Matches 💘' : 'Pending Requests ⏳'}
                                </h3>
                                <p className="text-xs text-purple-200 mt-1 font-medium opacity-90">
                                    {filter === 'all'
                                        ? "Keep your heart's secrets safe here."
                                        : filter === 'match'
                                            ? "The stars have aligned! It's mutual."
                                            : "Good things take time. Keep believing!"}
                                </p>
                            </div>
                            {filteredCrushes.length === 0 ? (
                                <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl text-gray-400">
                                    <p>
                                        {filter === 'all'
                                            ? "No crushes added yet. Don't be shy! 😉"
                                            : filter === 'match'
                                                ? "No matches yet. Keep hoping! 🤞"
                                                : "No pending requests."}
                                    </p>
                                </div>
                            ) : (
                                filteredCrushes.map((item) => (
                                    <div key={item.id} className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition flex items-center justify-between group">
                                        <div>
                                            <h4 className="font-bold text-white flex items-center gap-2">
                                                {item.crush_name}
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-pink-300 border border-pink-500/20">
                                                    {item.is_match ? 'Matched!' : 'Pending'}
                                                </span>
                                            </h4>
                                            <p className="text-xs text-gray-300 mt-1 font-mono tracking-wide">{item.crush_mobile}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
                                                {new Date(item.created_at).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </p>
                                        </div>

                                        <div>
                                            {item.is_match ? (
                                                item.is_revealed ? (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg animate-pulse">
                                                        <FaHeart className="text-white" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={handleUnlock}
                                                        className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-xs font-bold text-white shadow-md hover:scale-105 transition flex items-center gap-1"
                                                    >
                                                        <FaUnlock /> Unlock
                                                    </button>
                                                )
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-500 group-hover:text-pink-400 transition">
                                                    <FaUserSecret size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>

                {/* Mobile Floating Info Button */}
                <button
                    onClick={() => setShowInfoModal(true)}
                    className="md:hidden fixed bottom-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl z-40 active:scale-90 transition"
                >
                    <span className="text-2xl">💡</span>
                </button>
            </div>
        </div>
    );
}
