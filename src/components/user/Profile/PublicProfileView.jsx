import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

export default function PublicProfileView() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [unlockStatus, setUnlockStatus] = useState(null);

    useEffect(() => {
        fetchProfileAndUnlockStatus();
    }, [userId]);

    const fetchProfileAndUnlockStatus = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch profile data
            const profileRes = await api.get(`/profile/public/${userId}`);
            setProfileData(profileRes.data.profile || profileRes.data);

            // Check unlock status
            try {
                const unlockRes = await api.get(`/unlock/check/${userId}`);
                setUnlockStatus(unlockRes.data);
                setIsUnlocked(unlockRes.data.isUnlocked);

                console.log('=== UNLOCK DEBUG INFO ===');
                console.log('Current User ID:', unlockRes.data);
                console.log('Target User ID:', userId);
                console.log('Is Matched:', unlockRes.data.isMatched);
                console.log('Is Unlocked:', unlockRes.data.isUnlocked);
                console.log('Current User Has Paid:', unlockRes.data.currentUserHasPaid);
                console.log('Target User Has Paid:', unlockRes.data.targetUserHasPaid);
                console.log('========================');
            } catch (unlockErr) {
                // If unlock check fails, default to locked
                console.error('Unlock check failed:', unlockErr);
                console.error('Error details:', unlockErr.response?.data);
                setIsUnlocked(false);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.message || 'Failed to load profile');
            toast.error('Could not load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUnlockProfile = () => {
        navigate('/user/profile-unlock-payment', { state: { targetUserId: userId } });
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const AnimationBackground = () => (
        <>
            <style>{`
                @keyframes blast-pulse {
                    0% { transform: scale(0); opacity: 0; }
                    40% { opacity: 1; transform: scale(1.2); }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                .blast-particle {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(3px);
                    z-index: 2;
                }
            `}</style>

            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden fixed h-full w-full">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={`blast-${i}`}
                        className="blast-particle"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 5 + 3}px`,
                            height: `${Math.random() * 5 + 3}px`,
                            backgroundColor: ['#EC4899', '#A855F7', '#60A5FA'][Math.floor(Math.random() * 3)],
                            animation: `blast-pulse ${Math.random() * 3 + 2}s ease-out infinite -${Math.random() * 5}s`,
                            boxShadow: `0 0 ${Math.random() * 20 + 5}px currentColor`
                        }}
                    />
                ))}
            </div>
        </>
    );

    if (loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)' }}>
                <AnimationBackground />
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4 relative z-10"></div>
                <div className="text-lg text-white relative z-10">Loading profile...</div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)' }}>
                <AnimationBackground />
                <div className="relative z-10 flex flex-col items-center max-w-md mx-auto px-4">
                    <div className="text-6xl mb-4">😕</div>
                    <div className="text-2xl font-bold text-white mb-2 text-center">Profile Not Found</div>
                    <div className="text-gray-300 mb-6 text-center">{error || 'This profile may not exist or is no longer available.'}</div>
                    <button
                        className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-6 py-3 font-semibold transition-all shadow-lg hover:shadow-pink-500/30"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const age = profileData.date_of_birth ? calculateAge(profileData.date_of_birth) : profileData.age;

    return (
        <div className="min-h-screen w-full overflow-hidden relative" style={{
            background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
            backgroundAttachment: 'fixed'
        }}>
            <AnimationBackground />

            <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="fixed top-4 left-4 z-50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 bg-white/10 border border-white/20 text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* Header */}
                <div className="w-full flex flex-col items-center mb-6 sm:mb-8 mt-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md text-center">
                        User Profile
                    </h1>
                    {unlockStatus && !isUnlocked && (
                        <div className="mt-4 px-6 py-2 bg-yellow-500/20 border border-yellow-500/40 rounded-full backdrop-blur-sm">
                            <p className="text-yellow-200 text-sm font-medium">
                                🔒 {unlockStatus.isMatched ? 'Unlock to view full profile - ₹49' : 'Match required to unlock'}
                            </p>
                        </div>
                    )}
                    <div className="mt-3 h-px w-full max-w-4xl bg-white/20" />
                </div>

                {/* Profile Card */}
                <div className="w-full max-w-3xl relative">
                    <div className="rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-lg border border-white/10 bg-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Profile Photo */}
                        <div className="flex justify-center mb-6 relative z-10">
                            <div className={`relative ${!isUnlocked ? 'filter blur-md' : ''}`}>
                                {profileData.profile_photo ? (
                                    <img
                                        src={profileData.profile_photo}
                                        alt={profileData.name}
                                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-pink-400/50 shadow-[0_0_30px_rgba(236,72,153,0.4)]"
                                    />
                                ) : (
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center border-4 border-pink-400/50 text-white shadow-[0_0_30px_rgba(236,72,153,0.4)]">
                                        <span className="text-6xl sm:text-7xl md:text-8xl">👤</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Blur Overlay for Locked Content */}
                        <div className={`relative ${!isUnlocked ? '' : ''}`}>
                            {/* Profile Info */}
                            <div className={`text-center mb-8 relative z-10 ${!isUnlocked ? 'filter blur-sm' : ''}`}>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-sm">
                                    {profileData.name || 'Anonymous User'}
                                </h2>
                                {profileData.bio && (
                                    <p className="text-purple-200 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
                                        {profileData.bio}
                                    </p>
                                )}
                            </div>

                            {/* Profile Details Grid */}
                            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 relative z-10 ${!isUnlocked ? 'filter blur-lg' : ''}`}>
                                <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">📧</span>
                                        <h3 className="text-sm font-bold text-purple-200 uppercase">Email</h3>
                                    </div>
                                    <p className="text-white text-lg font-medium">{profileData.email || 'Not specified'}</p>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">📱</span>
                                        <h3 className="text-sm font-bold text-purple-200 uppercase">Mobile</h3>
                                    </div>
                                    <p className="text-white text-lg font-medium">{profileData.mobile || 'Not specified'}</p>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">⚧️</span>
                                        <h3 className="text-sm font-bold text-purple-200 uppercase">Gender</h3>
                                    </div>
                                    <p className="text-white text-lg font-medium">{profileData.gender || 'Not specified'}</p>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🎂</span>
                                        <h3 className="text-sm font-bold text-purple-200 uppercase">Age</h3>
                                    </div>
                                    <p className="text-white text-lg font-medium">{age ? `${age} years` : 'Not specified'}</p>
                                </div>
                            </div>

                            {/* Unlock Overlay */}
                            {!isUnlocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20 rounded-2xl">
                                    <div className="text-center px-6">
                                        <div className="text-6xl mb-4">🔒</div>
                                        <h3 className="text-2xl font-bold text-white mb-3">Profile Locked</h3>
                                        <p className="text-gray-200 mb-6 max-w-md">
                                            {unlockStatus?.isMatched
                                                ? 'Unlock to view full profile details including contact info'
                                                : 'You need to be matched to unlock this profile'}
                                        </p>
                                        {unlockStatus?.isMatched && (
                                            <>
                                                <button
                                                    onClick={handleUnlockProfile}
                                                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all mb-3"
                                                >
                                                    🔓 Unlock for ₹49
                                                </button>
                                                {unlockStatus?.currentUserHasPaid && (
                                                    <p className="text-sm text-green-300">✓ You've already unlocked profiles</p>
                                                )}
                                                {unlockStatus?.targetUserHasPaid && !unlockStatus?.currentUserHasPaid && (
                                                    <p className="text-sm text-yellow-300">This user has unlocked - unlock yours to connect!</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 relative z-10 mt-4">
                            {isUnlocked && (
                                <button
                                    onClick={() => navigate(`/user/chat-interface?userId=${userId}`)}
                                    className="flex-1 rounded-xl px-6 py-4 font-bold text-base transition-all shadow-lg text-white hover:scale-[1.02] active:scale-[0.98]"
                                    style={{
                                        background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                                        boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)',
                                    }}
                                >
                                    💬 Start Chat
                                </button>
                            )}
                            <button
                                onClick={() => navigate(-1)}
                                className="flex-1 rounded-xl px-6 py-4 font-bold text-base transition-all shadow-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-[0.98]"
                            >
                                ← Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
