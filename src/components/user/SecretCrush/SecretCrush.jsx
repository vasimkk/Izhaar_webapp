import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import UserLayout from '../Dashboard/UserLayout';
import { toast } from 'react-toastify';
import { FaLock, FaHeart, FaUserSecret, FaUnlock, FaInfo, FaTimes, FaClock } from 'react-icons/fa';

const style = document.createElement('style');
style.textContent = `
  @keyframes floatHeart {
    0% {
      transform: translateY(0px) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-60px) scale(0);
      opacity: 0;
    }
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(244, 63, 94, 0.5);
    }
    50% {
      box-shadow: 0 0 40px rgba(244, 63, 94, 0.8);
    }
  }
  
  @keyframes bounce-heart {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
  
  .float-heart {
    animation: floatHeart 2s ease-out forwards;
  }
  
  .pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .bounce-heart {
    animation: bounce-heart 0.6s ease-in-out infinite;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .slide-in-up {
    animation: slideInUp 0.6s ease-out forwards;
  }

  .fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default function SecretCrush() {
    const [crushes, setCrushes] = useState([]);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [showInfoModal, setShowInfoModal] = useState(false);
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
            const res = await api.post('/secret-crush/add', { crushName: name, crushMobile: '+91' + mobile });
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
        <div className="relative min-h-screen w-full bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Mobile Back Button */}
            <button
                onClick={() => navigate("/user/dashboard")}
                className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1.5px solid rgba(236, 72, 153, 0.4)',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)'
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* Info Modal */}
            {showInfoModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-rose-900/95 rounded-3xl shadow-2xl border-2 border-pink-500/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-xl">
                        <div className="flex items-center justify-between p-6 border-b border-pink-500/30 sticky top-0 bg-black/40 backdrop-blur-md">
                            <div>
                                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text flex items-center gap-2">
                                    <span className="text-3xl">💡</span>
                                    How It Works
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="p-2 hover:bg-pink-500/20 rounded-full transition"
                            >
                                <FaTimes className="text-xl text-pink-200" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Step 1 */}
                            <div className="flex gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-pink-500/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    1
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white mb-1">Add Your Crush</h3>
                                    <p className="text-sm text-gray-300">
                                        Enter their phone number, email, or Instagram ID. The more details you provide, the higher the chance of a match!
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-pink-500/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    2
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white mb-1">Create a Crush Wishlist</h3>
                                    <p className="text-sm text-gray-300">
                                        Add all the people you like. Whenever someone from your wishlist adds you back, you get notified.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-pink-500/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    3
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white mb-1">Get Notified</h3>
                                    <p className="text-sm text-gray-300">
                                        The receiver gets a call and message from Izhaar about their Secret Crush.
                                    </p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-pink-500/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    4
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white mb-1">We Check for a Match</h3>
                                    <p className="text-sm text-gray-300">
                                        If your crush has also added you, it's a match! 💘
                                    </p>
                                </div>
                            </div>

                            {/* Step 5 */}
                            <div className="flex gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-pink-500/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    5
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white mb-1">Unlock the Secret</h3>
                                    <p className="text-sm text-gray-300">
                                        Open the Izhaar app to see who likes you (small fee may apply).
                                    </p>
                                </div>
                            </div>

                            {/* Step 6 */}
                            <div className="flex gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-pink-500/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    6
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white mb-1">Connect Safely</h3>
                                    <p className="text-sm text-gray-300">
                                        If both are interested, Izhaar helps you connect securely. 🔒
                                    </p>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-gradient-to-r from-pink-500/25 to-purple-500/25 rounded-xl p-4 border border-pink-500/40 backdrop-blur-md">
                                <p className="text-sm text-pink-100 text-center">
                                    <span className="font-bold">✨ Your privacy matters:</span> Your crush won't know unless they like you back!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-7xl mx-auto p-4 pb-24 relative z-10">

                {/* Header */}
                <div className="text-center mb-8 pt-12 md:pt-6">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-rose-300 bg-clip-text text-transparent mb-3 drop-shadow-lg">
                        Secret Crush ❤️
                    </h1>
                    <p className="text-pink-100 text-sm sm:text-base md:text-lg lg:text-xl px-2 font-semibold">
                        "What if your crush likes you back? Discover it safely with Izhaar!"
                    </p>
                </div>

                {/* Mobile Info Icon */}
                <button
                    onClick={() => setShowInfoModal(true)}
                    className="md:hidden fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                    title="How It Works"
                    style={{
                        boxShadow: '0 6px 16px rgba(236, 72, 153, 0.3)'
                    }}
                >
                    <FaInfo className="text-lg text-white bounce-heart" />
                </button>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Left Side - How It Works (Desktop Only) */}
                    <div className="hidden lg:block order-2 lg:order-1">
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-pink-500/30 lg:sticky lg:top-4"
                            style={{
                                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.15)'
                            }}>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text mb-4 flex items-center gap-2 drop-shadow-lg">
                                <span className="text-2xl sm:text-3xl">💡</span>
                                How It Works
                            </h2>
                            
                            <div className="space-y-3">
                                {/* Step 1 */}
                                <div className="flex gap-3 bg-white/5 p-2 sm:p-3 rounded-xl border border-pink-500/30 backdrop-blur-md hover:bg-white/10 transition">
                                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                                        1
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-xs sm:text-sm mb-0.5">Add Your Crush</h3>
                                        <p className="text-xs text-gray-300">
                                            Enter their phone number, email, or Instagram ID.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex gap-3 bg-white/5 p-2 sm:p-3 rounded-xl border border-pink-500/30 backdrop-blur-md hover:bg-white/10 transition">
                                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                                        2
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-xs sm:text-sm mb-0.5">Create a Wishlist</h3>
                                        <p className="text-xs text-gray-300">
                                            Get notified when they add you back!
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex gap-3 bg-white/5 p-2 sm:p-3 rounded-xl border border-pink-500/30 backdrop-blur-md hover:bg-white/10 transition">
                                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                                        3
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-xs sm:text-sm mb-0.5">Get Notified</h3>
                                        <p className="text-xs text-gray-300">
                                            They receive a message from Izhaar.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="flex gap-3 bg-white/5 p-2 sm:p-3 rounded-xl border border-pink-500/30 backdrop-blur-md hover:bg-white/10 transition">
                                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                                        4
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-xs sm:text-sm mb-0.5">Check for Match</h3>
                                        <p className="text-xs text-gray-300">
                                            If they add you too, it's a match! 💘
                                        </p>
                                    </div>
                                </div>

                                {/* Step 5 */}
                                <div className="flex gap-3 bg-white/5 p-2 sm:p-3 rounded-xl border border-pink-500/30 backdrop-blur-md hover:bg-white/10 transition">
                                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                                        5
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-xs sm:text-sm mb-0.5">Unlock Secret</h3>
                                        <p className="text-xs text-gray-300">
                                            Unlock to see who likes you!
                                        </p>
                                    </div>
                                </div>

                                {/* Step 6 */}
                                <div className="flex gap-3 bg-white/5 p-2 sm:p-3 rounded-xl border border-pink-500/30 backdrop-blur-md hover:bg-white/10 transition">
                                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                                        6
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-xs sm:text-sm mb-0.5">Connect Safely</h3>
                                        <p className="text-xs text-gray-300">
                                            Izhaar helps you connect securely. 🔒
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-3 border border-pink-500/40 mt-4 backdrop-blur-md">
                                <p className="text-xs text-pink-100 text-center">
                                    <span className="font-bold">✨ Privacy:</span> They won't know unless they add you back!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Add Form and List */}
                    <div className="order-1 lg:order-2 space-y-6">
                        
                        {/* Add Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowForm((prev) => !prev)}
                                className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all font-bold text-base sm:text-lg"
                                style={{
                                    boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)'
                                }}
                            >
                                <span className="text-xl sm:text-2xl bounce-heart">💕</span>
                                <span>Add New Crush</span>
                            </button>
                        </div>

                        {/* Add Form */}
                        {showForm && (
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-pink-500/30"
                                style={{
                                    boxShadow: '0 8px 32px rgba(236, 72, 153, 0.15)'
                                }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text">Add Your Crush 💘</h3>
                                        <p className="text-xs sm:text-sm text-pink-200 mt-1">We keep it private until it's mutual.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="w-8 h-8 rounded-full bg-white/10 text-pink-200 flex items-center justify-center hover:bg-white/20 transition text-lg border border-pink-500/30"
                                        aria-label="Close"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <form onSubmit={handleAddCrush} className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-pink-100 text-xs sm:text-sm font-bold mb-2">Crush's Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-pink-500/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all text-white placeholder:text-gray-400 backdrop-blur-sm text-sm"
                                            placeholder="e.g. Aditi Sharma"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-pink-100 text-xs sm:text-sm font-bold mb-2">Mobile Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                <span className="text-pink-200 font-bold">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={mobile}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    if (val.length <= 10) setMobile(val);
                                                }}
                                                className="w-full pl-12 sm:pl-14 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-pink-500/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all text-white placeholder:text-gray-400 font-medium tracking-wide backdrop-blur-sm text-sm"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2.5 sm:py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                        style={{
                                            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
                                        }}
                                    >
                                        {loading ? 'Adding...' : <><FaUserSecret /> Add Secretly</>}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* List */}
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/15 backdrop-blur-md p-3 sm:p-5 rounded-2xl border-2 border-pink-500/40">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text drop-shadow-lg">My Secret Love List 💕</h2>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold bg-white/10 text-pink-100 border-2 border-pink-500/40 shadow-md backdrop-blur-sm">
                                        Pending: {pendingCount}
                                    </span>
                                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-pink-500/40 to-purple-500/40 text-pink-100 border-2 border-pink-500/60 shadow-md backdrop-blur-sm">
                                        Matches: {matchCount} 💖
                                    </span>
                                </div>
                            </div>

                            {crushes.length === 0 ? (
                                <div className="text-center p-6 sm:p-8 md:p-12 text-pink-100 bg-white/5 backdrop-blur-md rounded-2xl border-2 border-pink-500/30">
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold">No crushes added yet. Don't be shy! 😉</p>
                                </div>
                            ) : (
                                crushes.map((item) => (
                                    <div key={item.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border border-pink-500/40 relative overflow-hidden hover:border-pink-500/60 transition-all"
                                        style={{
                                            boxShadow: '0 2px 8px rgba(236, 72, 153, 0.08)'
                                        }}>
                                        <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-pink-400/15 blur-xl" />
                                        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-purple-400/15 blur-xl" />

                                        <div className="flex-1 relative z-10">
                                            <h3 className="font-bold text-white text-sm sm:text-base md:text-lg flex items-center gap-1.5 drop-shadow-lg">
                                                {item.crush_name}
                                                <span className="text-pink-300 text-sm sm:text-base bounce-heart">💗</span>
                                            </h3>
                                            <p className="text-pink-50 text-xs sm:text-sm font-semibold mt-0.5">{item.crush_mobile}</p>
                                            <p className="text-xs text-pink-100/70 mt-0.5">Added: {new Date(item.created_at).toLocaleDateString()}</p>
                                        </div>

                                        <div className="flex flex-col items-start sm:items-end relative z-10">
                                            {item.is_match ? (
                                                item.is_revealed ? (
                                                    <div className="flex items-center gap-1.5 text-white font-bold bg-gradient-to-r from-pink-500 to-rose-500 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm border border-pink-300/60 shadow-md">
                                                        <FaHeart className="text-red-200 bounce-heart text-xs" /> Matched!
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={handleUnlock}
                                                        className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 sm:px-4 py-1.5 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-md hover:scale-105 active:scale-95 text-xs sm:text-sm font-bold border border-purple-300/60"
                                                    >
                                                        <FaUnlock className="text-xs" /> Unlock!
                                                    </button>
                                                )
                                            ) : (
                                                <div className="text-pink-100 text-xs font-semibold italic bg-white/10 px-3 py-1.5 rounded-lg border border-pink-500/30 backdrop-blur-sm">
                                                    Waiting...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </div>

    );
}
