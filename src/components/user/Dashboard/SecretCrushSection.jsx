import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SCImg from '../../../assets/SC.png';

const SecretCrushSection = () => {
    const navigate = useNavigate();

    return (
        <section className="w-full mb-16 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col mb-4 px-6">
                <div className="flex items-center gap-2">
                    <span className="text-xl">💕</span>
                    <h2 className="dashboard-head-text">
                        Secret Crush
                    </h2>
                </div>
                <p className="dashboard-subtext text-gray-400 mt-1">
                    Anonymously reach out to your crush?
                </p>
            </div>

            {/* Design Container - Edge to Edge */}
            <div className="relative w-full flex flex-col items-center">
                {/* Illustration Area - Reduced height to bring text closer */}
                <div className="w-full relative min-h-[380px] sm:min-h-[450px] flex items-start justify-center overflow-hidden">
                    <img
                        src={SCImg}
                        alt="Secret Crush"
                        className="w-full h-full object-cover object-top scale-105"
                    />

                    {/* Integrated Vignette - Slightly shorter to match height */}
                    <div className="absolute inset-x-0 bottom-0 h-[50%] " />
                </div>

                {/* Content - Increased negative margin to pull text up further */}
                <div className="w-full px-6 -mt-32 relative z-10 flex flex-col items-center text-center">
                    <h3 className="dashboard-head-text !text-2xl mb-1">
                        Send your secret crush 💌
                    </h3>
                    <p className="dashboard-subtext !text-[13px] mb-8 max-w-[280px] leading-tight text-gray-400 font-medium">
                        Will they guess it's you? Add them to your secret list.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(236, 72, 145, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/user/secret-crush')}
                        className="w-full max-w-[300px] h-14 rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] text-white font-black text-[13px] tracking-widest uppercase shadow-2xl transition-all border border-white/5"
                    >
                        Add Secret Crush
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default SecretCrushSection;
