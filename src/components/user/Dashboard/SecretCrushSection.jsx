import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SCImg from '../../../assets/SC.png';

const SecretCrushSection = () => {
    const navigate = useNavigate();

    return (
        <section className="w-full mb-12 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col mb-2 px-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">💕</span>
                    <h2 className="text-white tracking-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '18px' }}>
                        Secret Crush
                    </h2>
                </div>
                <p className="text-white/50 mt-1" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '14px' }}>
                    Anonymously reach out to your special someone?
                </p>
            </div>

            {/* Design Container - Edge to Edge */}
            <div className="relative w-full flex flex-col items-center">

                {/* Illustration Area - Reduced height to remove gap */}
                <div className="w-full relative min-h-[260px] sm:min-h-[300px] flex items-start justify-center overflow-hidden">
                    <img
                        src={SCImg}
                        alt="Secret Crush"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top scale-105 opacity-90"
                    />

                    {/* Integrated Vignette */}
                    <div className="absolute inset-0 h-full w-full" />
                </div>

                {/* Content - Increased negative margin to pull text closer */}
                <div className="w-full px-6 -mt-20 relative z-30 flex flex-col items-center text-center">
                    <h3 className="text-white mb-1 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '18px' }}>
                        Send your secret crush 💌
                    </h3>
                    <p className="text-white/60 mb-6 max-w-[280px] leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '14px' }}>
                        Will they guess it's you? Add them to your secret list and find out.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/user/secret-crush')}
                        className="w-[180px] h-[32px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white text-[9px] font-bold uppercase tracking-[0.15em] shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        Add Secret Crush
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default SecretCrushSection;
