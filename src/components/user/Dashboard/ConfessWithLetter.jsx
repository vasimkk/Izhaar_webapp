import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const ConfessWithLetter = () => {
    const navigate = useNavigate();

    return (
        <section className="mx-4 mb-10 rounded-2xl border border-white/5 overflow-hidden pt-8 pb-20 px-6">

            {/* Top Header Row */}
            <div className="w-full flex items-center mb-6 z-20 px-2">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center text-3xl">💌</div>
                    <div>
                        <h3 className="text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px' }}>
                            Express Feelings
                        </h3>
                        <p className="text-white/40 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '12px' }}>
                            Share your heart secretly.
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-center z-40 w-full max-w-[320px] mx-auto flex flex-col items-center mb-8">
                <p className="text-white/50 mb-6 leading-relaxed px-4" style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                    fontSize: '12px'
                }}>
                    Let them feel your words, without revealing your name. Share your deepest feelings anonymously.
                </p>

                <button
                    onClick={() => navigate('/user/letter-izhaar')}
                    className="flex items-center justify-center gap-2 text-[#FF4AB3] font-bold text-[12px] tracking-widest uppercase group transition-all"
                >
                    Unlock Now
                    <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1.5" />
                </button>
            </div>

            {/* Center Envelope Graphic with Animation */}
            <div className="flex justify-center mt-32">
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
                        background: linear-gradient(to bottom, #ffffff 0%, #fff9fb 100%);
                        border-radius: 4px;
                        z-index: 5;
                        box-shadow: 0 -4px 20px rgba(0,0,0,0.15), inset 0 0 10px rgba(236,72,153,0.02);
                        display: flex;
                        flex-direction: column;
                        padding: 12px 14px;
                        justify-content: flex-start;
                        border-top: 3px solid #EC4899;
                        border-left: 1px solid rgba(236,72,153,0.05);
                        border-right: 1px solid rgba(236,72,153,0.05);
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
                        26%, 42% { transform: translateX(-50%) translateY(-85px) scale(1.05); }
                        54%, 100%{ transform: translateX(-50%) translateY(0px) scale(1); }
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
                            <h4 className="text-[10px] font-bold text-pink-600 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Love Letter</h4>
                            <p className="text-[8.5px] text-gray-600 leading-normal italic" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                "I’ve wanted to tell you this for so long. Every time we speak, my day gets a little brighter.
                                There's something about you that I can't quite put into words, but my heart knows exactly what it feels..."
                            </p>
                            <div className="mt-auto flex justify-between items-center pt-1 border-t border-pink-50">
                                <span className="text-[7px] text-pink-400 font-medium uppercase tracking-wider">Someone who cares</span>
                                <span className="text-[10px]">❤️</span>
                            </div>
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

            {/* Subtext and Button removed from here */}

        </section>
    );
};

export default ConfessWithLetter;
