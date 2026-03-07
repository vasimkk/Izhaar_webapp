import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfessWithLetter = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full mb-24 px-6">

            {/* Top Header Row */}
            <div className="flex justify-between items-center mb-20 w-full">
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
            <div className="flex justify-center mt-16 mb-12">
                <style>{`
                    .envelope-wrapper-small {
                        perspective: 1200px;
                        width: 220px;
                        height: 145px;
                        position: relative;
                        z-index: 1;
                        pointer-events: none;
                    }

                    .envelope-small {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(160deg, #f9e4d0 0%, #f4c9b3 100%);
                        border-radius: 6px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.35), 0 2px 8px rgba(236,72,153,0.15);
                        border: 1px solid rgba(236,72,153,0.15);
                    }
                    
                    /* Flap */
                    .envelope-flap-small {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 85px;
                        background: linear-gradient(160deg, #fce8d5 0%, #f5cdb8 100%);
                        clip-path: polygon(0 0, 50% 90%, 100% 0);
                        transform-origin: top center;
                        z-index: 20;
                        box-shadow: 0 6px 20px rgba(0,0,0,0.12);
                        border-radius: 6px 6px 0 0;
                    }

                    /* Front Pocket */
                    .envelope-pocket-small {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        height: 145px;
                        background: linear-gradient(160deg, #fbd5bb 0%, #f0b99a 100%);
                        clip-path: polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%);
                        z-index: 10;
                    }

                    .envelope-pocket-small::after {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0;
                        height: 145px;
                        background: linear-gradient(90deg, rgba(0,0,0,0.04) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.04) 100%);
                        clip-path: polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%);
                    }

                    /* Letter Inside */
                    .letter-preview-card-small {
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 195px;
                        height: 130px;
                        background: #ffffff;
                        border-radius: 3px;
                        z-index: 5;
                        box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
                        display: flex;
                        flex-direction: column;
                        padding: 14px;
                        justify-content: flex-start;
                        border-top: 3px solid #EC4899;
                    }

                    /* Mini Wax Seal */
                    .wax-seal-small {
                        position: absolute;
                        top: 78px;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 25;
                    }

                    /* 12s animation cycle:
                       0-8%:   idle (closed)
                       8-18%:  flap opens
                       18-40%: letter slides UP (out)
                       40-56%: letter slides DOWN (back inside envelope)
                       56-68%: flap closes AFTER letter is safely inside
                       68-82%: send-ready glow pulse
                       82-100%: idle reset
                    */

                    .envelope-small.auto-open-small {
                        animation: envelope-main-small 12s ease-in-out infinite;
                    }

                    @keyframes envelope-main-small {
                        0%, 8%   { transform: translateY(0); box-shadow: 0 20px 40px rgba(0,0,0,0.35); }
                        16%, 62% { transform: translateY(-6px); }
                        70%, 80% { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(236,72,153,0.45), 0 0 30px rgba(236,72,153,0.25); }
                        92%, 100%{ transform: translateY(0); box-shadow: 0 20px 40px rgba(0,0,0,0.35); }
                    }

                    .envelope-small.auto-open-small .envelope-flap-small {
                        animation: flap-open-small 12s ease-in-out infinite;
                    }

                    /* Flap opens at 8%, stays open through letter exit & entry, closes at 58% AFTER letter is in */
                    @keyframes flap-open-small {
                        0%, 6%   { transform: rotateX(0deg); z-index: 20; }
                        16%, 54% { transform: rotateX(180deg); z-index: 1; filter: brightness(0.9); }
                        66%, 100%{ transform: rotateX(0deg); z-index: 20; }
                    }

                    .envelope-small.auto-open-small .letter-preview-card-small {
                        animation: letter-slide-small 12s ease-in-out infinite;
                    }

                    /* Letter rises after flap opens. Returns at ~48% so it's fully inside before flap closes at 54% */
                    @keyframes letter-slide-small {
                        0%, 16%  { transform: translateX(-50%) translateY(0px) scale(1); }
                        26%, 40% { transform: translateX(-50%) translateY(-82px) scale(1.05); }
                        52%, 100%{ transform: translateX(-50%) translateY(0px) scale(1); }
                    }

                    .envelope-small.auto-open-small .wax-seal-small {
                        animation: wax-fade-small 12s ease-in-out infinite;
                    }

                    /* Seal disappears before flap opens, reappears after flap closes */
                    @keyframes wax-fade-small {
                        0%, 5%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                        10%, 70% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                        76%, 100%{ transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    }

                    /* Send-ready pink glow on wrapper */
                    .envelope-wrapper-small {
                        animation: send-glow-wrapper 12s ease-in-out infinite;
                    }
                    @keyframes send-glow-wrapper {
                        0%, 66%  { filter: drop-shadow(0 0 0px transparent); }
                        72%, 80% { filter: drop-shadow(0 0 18px rgba(236,72,153,0.7)); }
                        90%, 100%{ filter: drop-shadow(0 0 0px transparent); }
                    }
                `}</style>
                <div className="envelope-wrapper-small">
                    <div className="envelope-small auto-open-small">
                        {/* Letter Inside */}
                        <div className="letter-preview-card-small">
                            <div className="w-full h-1.5 bg-pink-200 rounded-full mb-2"></div>
                            <div className="w-3/4 h-1.5 bg-pink-200 rounded-full mb-3"></div>
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
