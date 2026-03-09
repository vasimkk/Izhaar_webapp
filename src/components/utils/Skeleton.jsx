import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className, width, height, borderRadius = '0.5rem', circle = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={`bg-white/5 overflow-hidden relative ${className}`}
            style={{
                width: width,
                height: height,
                borderRadius: circle ? '50%' : borderRadius,
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
        </motion.div>
    );
};

export default Skeleton;
