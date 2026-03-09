import React from 'react';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi2';
import { MdContentCopy } from 'react-icons/md';
import { toast } from 'react-toastify';

const ReferralSection = () => {
    const referralLink = 'https://izhaarlove.com/ref/user123';

    const handleShare = async () => {
        const shareData = {
            title: 'Izhaar Love',
            text: 'Refer your friend to Izhaar Love and earn real cash!',
            url: referralLink,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                handleCopy();
            }
        } catch (err) {
            console.log('Error sharing:', err);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            toast.success('Referral link copied to clipboard!', {
                position: "bottom-center",
                autoClose: 2000,
                theme: "dark"
            });
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    return (
        <section className="mx-4 mb-10 rounded-2xl border border-white/5 overflow-hidden pt-8 pb-10 px-6">
            {/* Top Header Row */}
            <div className="flex justify-between items-center mb-10 w-full px-2">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center text-3xl text-yellow-400">
                        <HiSparkles />
                    </div>
                    <div>
                        <h3 className="text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px' }}>
                            Refer & Earn
                        </h3>
                        <p className="text-white/40 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '12px' }}>
                            Spread the love.
                        </p>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center justify-center">
                    <span className="text-pink-400 font-bold text-[10px] uppercase tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        ₹199 Reward
                    </span>
                </div>
            </div>

            {/* Visual Graphic */}
            <div className="flex justify-center mb-10 relative">
                <div className="absolute inset-0 bg-yellow-400/10 blur-[40px] rounded-full w-[120px] h-[120px] mx-auto pointer-events-none"></div>
                <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F9DF7D] to-[#E6CA68] flex items-center justify-center shadow-[0_10px_25px_rgba(230,202,104,0.4)] relative z-10"
                >
                    <span className="text-[40px] filter drop-shadow-sm pb-1">🎁</span>
                </motion.div>
            </div>

            {/* Subtext */}
            <p className="text-white text-center text-[14px] font-semibold mb-8 tracking-wide px-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Share the love with your friends and earn direct rewards together.
            </p>

            {/* Action Buttons Row */}
            <div className="flex justify-center flex-row items-center gap-3 w-full">
                <button
                    onClick={handleCopy}
                    className="w-12 h-[38px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all shrink-0"
                    title="Copy Link"
                >
                    <MdContentCopy className="text-lg" />
                </button>

                <button
                    onClick={handleShare}
                    className="w-full max-w-[170px] h-[38px] bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-95 group relative overflow-hidden flex items-center justify-center gap-2"
                >
                    <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none"></div>
                    <span className="relative z-10 font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Send Invite</span>
                </button>
            </div>
        </section>
    );
};

export default ReferralSection;
