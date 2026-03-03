import React from 'react';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';
import { MdOutlineShare } from 'react-icons/md';

const ReferralSection = () => {
    const handleShare = async () => {
        const shareData = {
            title: 'Izhaar Love',
            text: 'Refer your friend to Izhaar Love and earn real cash!',
            url: 'https://izhaarlove.com',
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: Copy to clipboard
                await navigator.clipboard.writeText('https://izhaarlove.com');
                alert('Referral link copied to clipboard!');
            }
        } catch (err) {
            console.log('Error sharing:', err);
        }
    };

    return (
        <div className="w-full px-4 md:px-8 mt-12 mb-16">
            {/* Heading */}
            <div className="flex items-center gap-3 mb-8">
                <HiSparkles className="text-pink-500 text-xl drop-shadow-[0_0_8px_rgba(236,72,145,0.6)]" />
                <h2
                    className="text-white tracking-[0.1em]"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '18px' }}
                >
                    Refer & Earn
                </h2>
            </div>

            {/* Refer & Earn Banner */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative overflow-hidden bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-white/10 rounded-3xl p-6 md:p-8"
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#EC4891] to-[#A928ED] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                            <MdOutlineShare className="text-3xl text-white" />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-1">Refer & Earn Real Cash</h3>
                            <p className="text-white/50 text-xs md:text-sm">Refer your friend and earn <span className="text-pink-400 font-bold">₹30 to ₹100</span> cashback directly!</p>
                        </div>
                    </div>
                    <button
                        onClick={handleShare}
                        className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-pink-100 transition-all flex items-center gap-2 active:scale-95 shadow-xl shadow-white/5"
                    >
                        Refer Now
                        <span className="text-lg">➜</span>
                    </button>
                </div>

                {/* Decorative background vectors */}
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-pink-500/5 to-transparent pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
            </motion.div>
        </div>
    );
};

export default ReferralSection;
