import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfessWithLetter = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full mb-12 px-6">

            {/* Top Header Row */}
            <div className="flex justify-between items-center mb-16 w-full">
                <h2 className="text-white text-[18px] font-semibold tracking-tight flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-2xl drop-shadow-md pb-1">💌</span>
                    <span className="drop-shadow-md">Express Feelings</span>
                </h2>
                <button
                    onClick={() => navigate('/user/letter-izhaar/samples')}
                    className="text-[#b46bfb] text-[14px] font-semibold flex items-center gap-1 hover:text-pink-400 transition"
                >
                    Try Now <span className="text-lg leading-none mb-[2px]">&rarr;</span>
                </button>
            </div>

            {/* Center Envelope Graphic with Animation */}
            <div className="flex justify-center mb-12">
                <style>{`
                    .envelope-wrapper-small {
                        perspective: 1000px;
                        width: 180px;
                        height: 120px;
                        position: relative;
                        z-index: 1;
                        pointer-events: none;
                    }

                    .envelope-small {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        background: #E6CA68; /* Envelope Back */
                        transition: transform 0.3s ease;
                        border-radius: 4px;
                        box-shadow: 0 15px 25px rgba(0,0,0,0.4);
                    }
                    
                    /* Flap */
                    .envelope-flap-small {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 70px;
                        background: #EDD572;
                        clip-path: polygon(0 0, 50% 100%, 100% 0);
                        transform-origin: top;
                        transition: transform 0.6s ease-in-out, z-index 0.6s step-end;
                        z-index: 20;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    }

                    /* Front Pocket - creating the bottom and side folds */
                    .envelope-pocket-small {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        height: 120px;
                        background: #F9DF7D;
                        clip-path: polygon(0 0, 50% 60%, 100% 0, 100% 100%, 0 100%);
                        z-index: 10;
                        /* Optional inner shadow for depth */
                        box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
                    }
                    
                    /* Second side flap for that traditional envelope look */
                    .envelope-pocket-small::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 120px;
                        background: #ECD26F;
                        clip-path: polygon(0 0, 50% 60%, 100% 0, 0 0); /* Wait, SVG is better for cross-browser, but css is fine. Let's make it simpler */
                        display: none;
                    }

                    /* Letter Inside */
                    .letter-preview-card-small {
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 160px;
                        height: 110px;
                        background: white;
                        border-radius: 4px;
                        z-index: 5;
                        box-shadow: 0 -2px 8px rgba(0,0,0,0.15);
                        display: flex;
                        flex-direction: column;
                        padding: 12px;
                        justify-content: flex-start;
                    }

                    /* Mini Wax Seal */
                    .wax-seal-small {
                        position: absolute;
                        top: 68px;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 25;
                    }

                    /* AUTO ANIMATION LOGIC */
                    .envelope-small.auto-open-small {
                        animation: envelope-bob-small 8s ease-in-out infinite;
                    }

                    @keyframes envelope-bob-small {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                    }

                    .envelope-small.auto-open-small .envelope-flap-small {
                        animation: flap-open-small 8s ease-in-out infinite;
                    }

                    .envelope-small.auto-open-small .letter-preview-card-small {
                        animation: letter-slide-small 8s ease-in-out infinite;
                    }

                    .envelope-small.auto-open-small .wax-seal-small {
                        animation: wax-fade-small 8s ease-in-out infinite;
                    }

                    @keyframes flap-open-small {
                        0%, 15% { transform: rotateX(0deg); z-index: 20; }
                        25%, 80% { transform: rotateX(180deg); z-index: 1; filter: brightness(0.9); }
                        90%, 100% { transform: rotateX(0deg); z-index: 20; }
                    }

                    @keyframes letter-slide-small {
                        0%, 20% { transform: translateX(-50%) translateY(0) scale(1); }
                        30%, 75% { transform: translateX(-50%) translateY(-65px) scale(1.05); }
                        85%, 100% { transform: translateX(-50%) translateY(0) scale(1); }
                    }

                    @keyframes wax-fade-small {
                        0%, 15% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                        20%, 85% { transform: translate(-50%, -100px) scale(0.5); opacity: 0; }
                        90%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    }
                `}</style>
                <div className="envelope-wrapper-small">
                    <div className="envelope-small auto-open-small">
                        {/* Letter Inside */}
                        <div className="letter-preview-card-small">
                            <div className="w-full h-2 bg-pink-100 rounded-full mb-2"></div>
                            <div className="w-3/4 h-2 bg-pink-100 rounded-full mb-3"></div>
                            <div className="w-full h-[1px] bg-gray-100 my-1"></div>
                            <div className="w-full h-1 bg-gray-200 rounded-full mt-2"></div>
                            <div className="w-5/6 h-1 bg-gray-200 rounded-full mt-1.5"></div>
                            <div className="w-4/6 h-1 bg-gray-200 rounded-full mt-1.5"></div>
                        </div>

                        {/* Pocket */}
                        <div className="envelope-pocket-small">
                            {/* Faux side flaps via gradient */}
                            <div className="absolute inset-0" style={{
                                background: 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.03) 100%)'
                            }}></div>
                        </div>

                        {/* Flap */}
                        <div className="envelope-flap-small"></div>

                        {/* Wax Seal */}
                        <div className="wax-seal-small">
                            <div className="w-6 h-6 rounded-full bg-red-600 shadow-[0_2px_4px_rgba(0,0,0,0.3)] border-[1.5px] border-red-700 flex items-center justify-center">
                                <span className="text-[10px] filter drop-shadow-sm text-white">❤️</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtext */}
            <p className="text-white text-center text-[14px] font-semibold mb-10 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Let them feel your words, without revealing your name.
            </p>

            {/* Unlock Button */}
            <div className="flex justify-center w-full">
                <button
                    onClick={() => navigate('/user/letter-izhaar')}
                    className="w-full max-w-[170px] h-[38px] rounded-full border border-white/10 shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-95 group relative overflow-hidden flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600"
                >
                    <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none"></div>
                    <span className="text-white font-black text-[11px] uppercase tracking-[0.3em] relative z-10" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Unlock Now
                    </span>
                </button>
            </div>

        </div>
    );
};

export default ConfessWithLetter;
