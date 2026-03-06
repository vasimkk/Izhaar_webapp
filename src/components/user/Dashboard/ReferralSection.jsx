import React from 'react';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';
import { MdOutlineShare, MdContentCopy } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';
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
        <div className="w-full px-4 mt-8 mb-12">
            {/* Design Type 2: Premium Widget Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative mx-auto max-w-[320px] p-[1px] rounded-[2.5rem] bg-gradient-to-b from-pink-500/40 via-purple-500/10 to-transparent shadow-2xl"
            >
                <div className="bg-[#0D0D15]/90 backdrop-blur-2xl rounded-[2.45rem] p-6 flex flex-col items-center text-center overflow-hidden relative">
                    {/* Floating Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-pink-500/5 to-transparent" />
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-500/10 blur-[40px] rounded-full" />

                    {/* Top Icon Badge */}
                    <div className="relative mb-5">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-16 h-16 bg-gradient-to-br from-[#EC4891] to-[#A928ED] rounded-[1.5rem] flex items-center justify-center shadow-[0_0_25px_rgba(236,72,145,0.4)] relative z-10"
                        >
                            <HiSparkles className="text-3xl text-white" />
                        </motion.div>
                        <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20 animate-pulse" />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col items-center mb-6">
                        <h2 className="text-white/40 uppercase tracking-[0.2em] mb-1" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '10px' }}>
                            Limited Offer
                        </h2>
                        <h3 className="text-white tracking-tight mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '20px' }}>
                            Refer & Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200">Cash</span>
                        </h3>

                        {/* The Reward "Stamp" */}
                        <div className="bg-pink-500/10 border border-pink-500/20 px-4 py-1.5 rounded-full mb-3">
                            <span className="text-pink-400 font-black text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>₹199 <span className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">Instant</span></span>
                        </div>

                        <p className="text-white/50 px-4 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '12px' }}>
                            Share the love with your friends and earn direct rewards together.
                        </p>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex flex-row items-center gap-2 w-full pt-4 border-t border-white/5">
                        <button
                            onClick={handleCopy}
                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all shrink-0"
                            title="Copy Link"
                        >
                            <MdContentCopy className="text-lg" />
                        </button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleShare}
                            className="flex-1 h-12 bg-gradient-to-r from-[#EC4891] to-[#A928ED] rounded-2xl text-white text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-pink-500/20 flex items-center justify-center gap-3"
                        >
                            Send Invite
                            <FaArrowRight className="text-[9px]" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ReferralSection;
