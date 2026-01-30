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
    const navigate = useNavigate();

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
        <UserLayout activeRoute="/user/secret-crush" showHeader={false}>
            <div className="w-full max-w-4xl mx-auto p-4 pb-24">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                        Secret Crush 🤫
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Add your crush securely. If they add you back, it's a match!
                        <br />We won't tell them unless they add you too.
                    </p>
                </div>

                {/* Add Form */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-pink-100">
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
                        </div>
                        <button
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? 'Adding...' : <><FaUserSecret /> Add Secretly</>}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 px-2">My Secret List</h2>

                    {crushes.length === 0 ? (
                        <div className="text-center p-8 text-gray-400 bg-white/50 rounded-xl border border-dashed border-gray-300">
                            <p>No crushes added yet. Don't be shy! 😉</p>
                        </div>
                    ) : (
                        crushes.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between border-l-4 border-pink-500 relative overflow-hidden">

                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg">{item.crush_name}</h3>
                                    <p className="text-gray-500 text-sm">{item.crush_mobile}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
                                </div>

                                <div className="flex flex-col items-end">
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
        </UserLayout>
    );
}
