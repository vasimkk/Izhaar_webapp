import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { useUserId } from '../../../hooks/useUserId';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfileUnlockPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = useUserId();
    const [loading, setLoading] = useState(true);
    const [unlockStatus, setUnlockStatus] = useState(null);
    const targetUserId = location.state?.targetUserId;

    useEffect(() => {
        checkUnlockStatus();
    }, []);

    const checkUnlockStatus = async () => {
        try {
            setLoading(true);
            const res = await api.get('/unlock/status');
            setUnlockStatus(res.data);

            // If user already has unlock, redirect them back
            if (res.data.hasUnlock) {
                toast.success('You already have profile unlock access!');
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            }
        } catch (err) {
            console.error('Error checking unlock status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        try {
            // 1. Create order on backend
            const orderPayload = {
                amount: 4900, // ₹49 in paise
                currency: 'INR',
                userId,
                service: 'profile_unlock',
            };

            console.log('Order payload:', orderPayload);
            const { data: order } = await api.post('/razorpay/order', orderPayload);

            // 2. Open Razorpay checkout
            const options = {
                key: "rzp_test_Rt2p9OZv2KbFMZ", // Replace with your actual Razorpay public key
                amount: order.amount,
                currency: order.currency,
                name: 'Izhaar',
                description: 'Profile Unlock Premium',
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify payment on backend
                    try {
                        const verifyRes = await api.post('/razorpay/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            userId,
                            service: 'profile_unlock',
                        });

                        // Also verify with profile unlock endpoint
                        await api.post('/unlock/verify', {
                            unlockId: order.id,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature
                        });

                        toast.success('🎉 Profile Unlock Successful!');

                        // Navigate back to the profile or matches page
                        setTimeout(() => {
                            if (targetUserId) {
                                navigate(`/user/profile/${targetUserId}`, { replace: true });
                            } else {
                                navigate('/user/true-connection', { replace: true });
                            }
                        }, 1500);
                    } catch (err) {
                        toast.error(err.response?.data?.message || 'Payment verification failed');
                    }
                },
                theme: { color: '#E91E63' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to initiate payment');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full overflow-hidden relative" style={{
            background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
            backgroundAttachment: 'fixed'
        }}>

            {/* Ambient Background Lights */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {/* Floating Particles */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                {[...Array(20)].map((_, i) => {
                    const colors = ['rgba(233, 30, 99, 0.4)', 'rgba(156, 39, 176, 0.4)', 'rgba(59, 130, 246, 0.4)'];
                    const size = Math.random() * 4 + 2;
                    const left = Math.random() * 100;
                    const top = Math.random() * 100;
                    const duration = Math.random() * 10 + 10;

                    return (
                        <div
                            key={i}
                            className="absolute rounded-full filter blur-[1px]"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${left}%`,
                                top: `${top}%`,
                                background: colors[Math.floor(Math.random() * colors.length)],
                                animation: `float ${duration}s infinite linear`,
                                opacity: 0.6
                            }}
                        />
                    );
                })}
            </div>

            <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 py-8">

                {/* Mobile Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white shadow-lg active:scale-95 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <div className="w-full max-w-lg mx-auto" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                    {/* Payment Card */}
                    <div className="rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl border border-white/10 bg-white/5 relative overflow-hidden group">

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl shadow-lg">
                                💎
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white text-center mb-2 leading-tight drop-shadow-md">
                            Unlock Premium Profiles
                        </h1>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-light text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                            Connect with Your True Matches
                        </h2>

                        {/* Features List */}
                        <div className="mb-8 space-y-4">
                            <div className="flex items-start gap-4 text-white/90 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="mt-1 bg-green-500/20 text-green-400 p-1 rounded-full flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-base font-medium">View Full Contact Details (Email & Mobile)</span>
                            </div>
                            <div className="flex items-start gap-4 text-white/90 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="mt-1 bg-green-500/20 text-green-400 p-1 rounded-full flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-base font-medium">Access Complete Profile Information</span>
                            </div>
                            <div className="flex items-start gap-4 text-white/90 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="mt-1 bg-green-500/20 text-green-400 p-1 rounded-full flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-base font-medium">Chat & Connect Directly</span>
                            </div>
                            <div className="flex items-start gap-4 text-white/90 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="mt-1 bg-green-500/20 text-green-400 p-1 rounded-full flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-base font-medium">Unlock All Your Matched Profiles</span>
                            </div>
                            <div className="flex items-start gap-4 text-white/90 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                                <div className="mt-1 bg-yellow-500/20 text-yellow-400 p-1 rounded-full flex-shrink-0">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" /></svg>
                                </div>
                                <span className="text-base font-medium text-yellow-200">⚡ Mutual Unlock: If either you or your match pays, both can view!</span>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex flex-col items-center justify-center gap-1 mb-8">
                            <span className="text-lg text-white/40 line-through">₹99</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-white tracking-tight">₹49</span>
                                <span className="text-lg text-white/60">one-time</span>
                            </div>
                            <p className="text-sm text-purple-200 mt-2 text-center">Unlock all your matched profiles forever</p>
                        </div>

                        {/* Payment Button */}
                        <button
                            onClick={handlePayment}
                            className="w-full rounded-2xl px-6 py-4 font-bold text-lg text-white transition-all duration-300 shadow-[0_0_20px_rgba(233,30,99,0.3)] hover:shadow-[0_0_30px_rgba(233,30,99,0.5)] hover:scale-[1.02] active:scale-[0.98] border border-white/10 relative overflow-hidden group/btn"
                            style={{
                                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                            }}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                🔓 Unlock Profiles Now
                                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        </button>

                        <p className="text-center text-white/30 text-xs mt-4">
                            🔒 Secure payment via Razorpay. One-time fee.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUnlockPayment;
