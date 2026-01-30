import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import UserLayout from '../Dashboard/UserLayout';
import { toast } from 'react-toastify';
import { FaLock, FaHeart, FaUserSecret, FaUnlock } from 'react-icons/fa';

export default function SecretCrush() {
    const [crushes, setCrushes] = useState([]);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const pendingCount = crushes.filter((item) => !item.is_match).length;
    const matchCount = crushes.filter((item) => item.is_match).length;

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
            const res = await api.post('/secret-crush/add', { crushName: name, crushMobile: mobile });
            if (res.data.status === 'success') {
                toast.success(res.data.message);
                if (res.data.isMatch) {
                    toast.success("It's a Match! 💘");
                }
                setName('');
                setMobile('');
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
        // Simulate Payment
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
            <div className="relative min-h-screen w-full bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 overflow-hidden">
                {/* Mobile Back Button */}
      <button
        onClick={() => navigate("/")}
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
                <style>{`
                    @keyframes floatHeart {
                        0% { transform: translateY(0) scale(0.8); opacity: 0; }
                        20% { opacity: 0.8; }
                        50% { transform: translateY(-40px) scale(1); opacity: 0.6; }
                        100% { transform: translateY(-120px) scale(0.6); opacity: 0; }
                    }
                    .heart-float {
                        position: absolute;
                        animation: floatHeart 6s ease-in-out infinite;
                    }
                `}</style>

                {/* Floating hearts */}
                <div className="heart-float left-6 top-24 text-pink-300 text-2xl" style={{ animationDelay: '0s' }}>❤</div>
                <div className="heart-float right-8 top-40 text-rose-300 text-xl" style={{ animationDelay: '1.2s' }}>❤</div>
                <div className="heart-float left-12 top-64 text-purple-300 text-2xl" style={{ animationDelay: '2.4s' }}>❤</div>
                <div className="heart-float right-16 top-80 text-pink-200 text-3xl" style={{ animationDelay: '3.6s' }}>❤</div>

                <div className="w-full max-w-4xl mx-auto p-4 pb-24 relative z-10">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                        Secret Crush ✨
                    </h1>
                    <p className="text-gray-600 text-xs sm:text-sm px-2">
                        A soft place to keep your feelings safe.
                        <br />If they choose you too, love reveals itself.
                    </p>
                </div>

                {/* Add Button */}
                <div className="flex justify-center mb-6 px-2">
                    <button
                        onClick={() => setShowForm((prev) => !prev)}
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white w-full sm:w-auto px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all active:scale-95 ring-2 ring-pink-200/60"
                    >
                        <span className="text-xl">＋</span>
                        <span className="font-semibold">Add New Crush</span>
                    </button>
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 mb-8 border border-pink-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Add Your Crush 💌</h3>
                                <p className="text-xs text-gray-500">We keep it private until it’s mutual.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleAddCrush} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Crush's Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                                    placeholder="e.g. Aditi Sharma"
                                />
                                <p className="text-[11px] text-gray-400 mt-1">Add the name exactly as you know it.</p>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                                    placeholder="e.g. 9876543210"
                                />
                                <p className="text-[11px] text-gray-400 mt-1">Used only to match if they add you too.</p>
                            </div>
                            <button
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Adding...' : <><FaUserSecret /> Add Secretly</>}
                            </button>
                        </form>
                    </div>
                )}

                {/* List */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-2">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">My Secret Love List</h2>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-pink-100 text-pink-700">
                                Pending: {pendingCount}
                            </span>
                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                                Matches: {matchCount}
                            </span>
                        </div>
                    </div>

                    {crushes.length === 0 ? (
                        <div className="text-center p-8 text-gray-400 bg-white/50 rounded-xl border border-dashed border-gray-300">
                            <p>No crushes added yet. Don't be shy! 😉</p>
                        </div>
                    ) : (
                        crushes.map((item) => (
                            <div key={item.id} className="bg-white/90 backdrop-blur rounded-2xl shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-pink-100 relative overflow-hidden">
                                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-pink-100/50" />
                                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-purple-100/50" />

                                <div className="flex-1 relative">
                                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                        {item.crush_name}
                                        <span className="text-pink-400">❤</span>
                                    </h3>
                                    <p className="text-gray-500 text-sm">{item.crush_mobile}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
                                </div>

                                <div className="flex flex-col items-start sm:items-end relative">
                                    {item.is_match ? (
                                        item.is_revealed ? (
                                            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">
                                                <FaHeart className="animate-pulse" /> Matched!
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleUnlock}
                                                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition-all shadow-lg animate-pulse"
                                            >
                                                <FaLock /> Match Found! (Locked)
                                            </button>
                                        )
                                    ) : (
                                        <div className="text-gray-400 text-sm italic bg-gray-100 px-3 py-1 rounded-full">
                                            Pending... 🤞
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
       
    );
}
