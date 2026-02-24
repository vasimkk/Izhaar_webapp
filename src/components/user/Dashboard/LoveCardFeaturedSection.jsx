import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoSparklesOutline, IoArrowForward } from 'react-icons/io5';

const LoveCardFeaturedSection = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full px-4 mb-12 animate-premium-in" style={{ animationDelay: '1500ms' }}>
            <div className="flex flex-col mb-6 px-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-10 h-[1px] bg-gradient-to-r from-pink-500 to-transparent"></span>
                    <span className="text-[9px] font-black text-pink-400 uppercase tracking-[0.3em]">New Feature</span>
                </div>
                <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white tracking-wide">
                    Love Card Designer
                </h3>
            </div>

            <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/user/love-card')}
                className="group relative w-full h-48 sm:h-56 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl border border-white/5"
            >
                {/* Background with Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4B0000] via-[#800000] to-[#B72099] opacity-90 group-hover:opacity-100 transition-opacity" />

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex items-center justify-between">
                    <div className="max-w-[60%] space-y-4">
                        <div className="flex items-center gap-2">
                            <IoSparklesOutline className="text-yellow-400 animate-pulse" size={20} />
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Unlimited Customization</span>
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-white leading-tight">
                            Design Your Own <br />
                            <span className="italic text-pink-300">Love Greeting</span>
                        </h4>
                        <p className="text-white/50 text-[10px] sm:text-xs font-medium leading-relaxed max-w-xs">
                            Upload photos, write sweet messages, and download high-quality cards instantly for your special one.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white/20 transition-all duration-500">
                            <IoHeartOutline className="text-white group-hover:scale-110 transition-transform" size={32} />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest bg-pink-600/50 px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                            Create Now <IoArrowForward />
                        </div>
                    </div>
                </div>

                {/* Floating Heart Icon */}
                <motion.div
                    animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-10 right-1/4 text-white/20"
                >
                    <IoHeartOutline size={40} />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoveCardFeaturedSection;
