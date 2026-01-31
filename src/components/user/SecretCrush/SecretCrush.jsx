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
`;
document.head.appendChild(style);

export default function SecretCrush() {
    const [crushes, setCrushes] = useState([]);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
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
        <div className="relative min-h-screen w-full bg-gradient-to-br from-red-950 via-rose-900 to-pink-900 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Mobile Back Button */}
            <button
                onClick={() => navigate("/user/dashboard")}
                className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
                style={{
                    background: 'rgba(244, 63, 94, 0.7)',
                    border: '2px solid rgba(244, 63, 94, 0.5)',
                    boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)'
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
                    <div className="bg-gradient-to-br from-red-950 via-rose-900 to-pink-900 rounded-3xl shadow-2xl border-2 border-red-400/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-red-400/20 sticky top-0 bg-black/40 backdrop-blur-md">
                            <div>
                                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text flex items-center gap-2">
                                    <span className="text-3xl">💡</span>
                                    How It Works
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="p-2 hover:bg-red-500/20 rounded-full transition"
                            >
                                <FaTimes className="text-xl text-red-200" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Step 1 */}
                            <div className="flex gap-4 bg-red-500/10 backdrop-blur-md p-4 rounded-xl border border-red-400/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold">
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
                            <div className="flex gap-4 bg-red-500/10 backdrop-blur-md p-4 rounded-xl border border-red-400/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold">
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
                            <div className="flex gap-4 bg-red-500/10 backdrop-blur-md p-4 rounded-xl border border-red-400/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold">
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
                            <div className="flex gap-4 bg-red-500/10 backdrop-blur-md p-4 rounded-xl border border-red-400/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold">
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
                            <div className="flex gap-4 bg-red-500/10 backdrop-blur-md p-4 rounded-xl border border-red-400/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold">
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
                            <div className="flex gap-4 bg-red-500/10 backdrop-blur-md p-4 rounded-xl border border-red-400/30">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold">
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
                            <div className="bg-gradient-to-r from-red-500/30 to-rose-500/30 rounded-xl p-4 border border-red-400/40">
                                <p className="text-sm text-red-100 text-center">
                                    <span className="font-bold">✨ Your privacy matters:</span> Your crush won't know unless they like you back!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-7xl mx-auto p-4 pb-24 relative z-10">

                {/* Header */}
                <div className="text-center mb-6 pt-12 md:pt-6">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-300 via-pink-300 to-rose-300 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                        Secret Crush ❤️
                    </h1>
                    <p className="text-red-100 text-sm md:text-base px-2 font-semibold">
                        "What if your crush likes you back? Discover it safely with Izhaar!"
                    </p>
                </div>

                {/* Mobile Info Icon */}
                <button
                    onClick={() => setShowInfoModal(true)}
                    className="md:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all pulse-glow"
                    title="How It Works"
                >
                    <FaInfo className="text-xl text-white bounce-heart" />
                </button>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Left Side - How It Works (Desktop Only) */}
                    <div className="hidden lg:block order-2 lg:order-1">
                        <div className="bg-gradient-to-br from-red-500/15 to-rose-500/10 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-red-400/40 lg:sticky lg:top-4 pulse-glow">
                            <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text mb-4 flex items-center gap-2 drop-shadow-lg">
                                <span className="text-3xl">💡</span>
                                How It Works
                            </h2>
                            
                            <div className="space-y-3">
                                {/* Step 1 */}
                                <div className="flex gap-3 bg-red-500/10 p-3 rounded-xl border border-red-400/30">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                                        1
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm mb-0.5">Add Your Crush</h3>
                                        <p className="text-xs text-gray-300">
                                            Enter their phone number, email, or Instagram ID.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex gap-3 bg-red-500/10 p-3 rounded-xl border border-red-400/30">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                                        2
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm mb-0.5">Create a Wishlist</h3>
                                        <p className="text-xs text-gray-300">
                                            Get notified when they add you back!
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex gap-3 bg-red-500/10 p-3 rounded-xl border border-red-400/30">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                                        3
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm mb-0.5">Get Notified</h3>
                                        <p className="text-xs text-gray-300">
                                            They receive a message from Izhaar.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="flex gap-3 bg-red-500/10 p-3 rounded-xl border border-red-400/30">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                                        4
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm mb-0.5">Check for Match</h3>
                                        <p className="text-xs text-gray-300">
                                            If they add you too, it's a match! 💘
                                        </p>
                                    </div>
                                </div>

                                {/* Step 5 */}
                                <div className="flex gap-3 bg-red-500/10 p-3 rounded-xl border border-red-400/30">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                                        5
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm mb-0.5">Unlock Secret</h3>
                                        <p className="text-xs text-gray-300">
                                            Unlock to see who likes you!
                                        </p>
                                    </div>
                                </div>

                                {/* Step 6 */}
                                <div className="flex gap-3 bg-red-500/10 p-3 rounded-xl border border-red-400/30">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                                        6
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm mb-0.5">Connect Safely</h3>
                                        <p className="text-xs text-gray-300">
                                            Izhaar helps you connect securely. 🔒
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-gradient-to-r from-red-500/30 to-rose-500/30 rounded-xl p-3 border border-red-400/40 mt-4">
                                <p className="text-xs text-red-100 text-center">
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
                                className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 via-pink-500 to-rose-600 text-white w-full sm:w-auto px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all font-bold text-lg pulse-glow"
                            >
                                <span className="text-2xl bounce-heart">❤</span>
                                <span>Add New Crush</span>
                            </button>
                        </div>

                        {/* Add Form */}
                        {showForm && (
                            <div className="bg-gradient-to-br from-red-500/15 to-rose-500/10 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-red-400/40 pulse-glow">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Add Your Crush ❤️</h3>
                                        <p className="text-xs text-red-100">We keep it private until it's mutual.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="w-8 h-8 rounded-full bg-red-500/30 text-red-200 flex items-center justify-center hover:bg-red-500/50 transition text-lg"
                                        aria-label="Close"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <form onSubmit={handleAddCrush} className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-red-100 text-sm font-bold mb-2">Crush's Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-red-600/20 border border-red-400/40 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all text-white placeholder:text-red-300"
                                            placeholder="e.g. Aditi Sharma"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-red-100 text-sm font-bold mb-2">Mobile Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                <span className="text-red-200 font-bold">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={mobile}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    if (val.length <= 10) setMobile(val);
                                                }}
                                                className="w-full pl-14 pr-4 py-3 rounded-xl bg-red-600/20 border border-red-400/40 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all text-white placeholder:text-red-300 font-medium tracking-wide"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed pulse-glow"
                                    >
                                        {loading ? 'Adding...' : <><FaUserSecret /> Add Secretly</>}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* List */}
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gradient-to-r from-red-500/25 to-rose-500/20 backdrop-blur-md p-5 rounded-2xl border-2 border-red-400/40 pulse-glow">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">My Secret Love List ❤️</h2>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-red-500/40 text-red-100 border-2 border-red-400/60 shadow-md">
                                        Pending: {pendingCount}
                                    </span>
                                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-green-600/50 text-green-100 border-2 border-green-400/60 shadow-md">
                                        Matches: {matchCount}
                                    </span>
                                </div>
                            </div>

                            {crushes.length === 0 ? (
                                <div className="text-center p-12 text-red-100 bg-red-500/10 backdrop-blur-md rounded-2xl border-2 border-red-400/30">
                                    <p className="text-2xl font-bold">No crushes added yet. Don't be shy! 😉</p>
                                </div>
                            ) : (
                                crushes.map((item) => (
                                    <div key={item.id} className="bg-gradient-to-br from-red-500/20 to-rose-500/15 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-2 border-red-400/40 relative overflow-hidden hover:border-red-400/60 transition-all pulse-glow">
                                        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-red-400/20 blur-xl" />
                                        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-rose-400/20 blur-xl" />

                                        <div className="flex-1 relative z-10">
                                            <h3 className="font-bold text-white text-lg sm:text-xl md:text-2xl flex items-center gap-2 drop-shadow-lg">
                                                {item.crush_name}
                                                <span className="text-red-300 text-lg sm:text-xl bounce-heart">❤</span>
                                            </h3>
                                            <p className="text-red-50 text-sm sm:text-base font-semibold mt-1">{item.crush_mobile}</p>
                                            <p className="text-xs sm:text-sm text-red-100/80 mt-1">Added: {new Date(item.created_at).toLocaleDateString()}</p>
                                        </div>

                                        <div className="flex flex-col items-start sm:items-end relative z-10">
                                            {item.is_match ? (
                                                item.is_revealed ? (
                                                    <div className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base border-2 border-green-400/60 shadow-lg">
                                                        <FaHeart className="text-red-300 bounce-heart" /> Matched!
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={handleUnlock}
                                                        className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all shadow-lg animate-pulse text-sm sm:text-base font-bold border-2 border-yellow-400/60"
                                                    >
                                                        <FaLock /> Match Found!
                                                    </button>
                                                )
                                            ) : (
                                                <div className="text-red-100 text-xs sm:text-sm font-semibold italic bg-red-600/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 border-red-400/40">
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
            </div>
        </div>

    );
}
