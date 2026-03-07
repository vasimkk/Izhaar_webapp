import React from 'react';

const SectionDivider = () => {
    return (
        <div className="w-full flex justify-center items-center py-6 opacity-60">
            {/* Left fading line */}
            <div className="h-[1px] w-full max-w-[100px] bg-gradient-to-r from-transparent to-white/30"></div>

            {/* Center modern dot/diamond */}
            <div className="mx-4 w-1.5 h-1.5 rotate-45 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.4)]"></div>

            {/* Right fading line */}
            <div className="h-[1px] w-full max-w-[100px] bg-gradient-to-l from-transparent to-white/30"></div>
        </div>
    );
};

export default SectionDivider;
