import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const FlowerSVG = ({ type, color, isGreenery, showStem = false }) => {
    const filterId = "artisan-ink-pro";
    const washFilterId = "artisan-wash-pro";

    // Transparent, grainy wash color - matches the bleed in reference
    const washColor = color === '#FFFFFF' ? 'rgba(200,200,200,0.4)' : `${color}66`;

    return (
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible drop-shadow-sm">
            <defs>
                {/* High disruption filter for that 'shaky hand' ink look */}
                <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="4" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" />
                </filter>

                {/* Loose watercolor filter for grain and soft bleeding edges */}
                <filter id={washFilterId} x="-50%" y="-50%" width="200%" height="200%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="3" result="grain" />
                    <feDisplacementMap in="SourceGraphic" in2="grain" scale="12" />
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Loose Background Wash - Intentional bleed outside the ink lines */}
            {!isGreenery && (
                <g filter={`url(#${washFilterId})`} opacity="0.8">
                    <circle cx="60" cy="55" r="42" fill={washColor} />
                    <circle cx="50" cy="45" r="30" fill={washColor} opacity="0.4" />
                </g>
            )}

            <g filter={`url(#${filterId})`} strokeLinecap="round" strokeLinejoin="round">
                {isGreenery ? (
                    <g>
                        <path d="M60 110 C30 80 20 40 60 10 C100 40 90 80 60 110" fill="#166534" stroke="black" strokeWidth="2.5" />
                        <path d="M60 110 Q50 60 60 20" fill="none" stroke="black" strokeWidth="1" opacity="0.3" />
                    </g>
                ) : (
                    <g>
                        {type === 'anemone' && ( // iconic dark-eyed bloom
                            <g>
                                {[0, 72, 144, 216, 288].map(d => (
                                    <path key={d} d="M60 60 C115 0 150 80 85 110 Q60 125 60 60" fill={color} stroke="black" strokeWidth="3" transform={`rotate(${d} 60 60)`} />
                                ))}
                                <circle cx="60" cy="62" r="18" fill="#111827" stroke="black" strokeWidth="2.5" />
                                <circle cx="60" cy="62" r="8" fill="#000" />
                                <circle cx="62" cy="60" r="3" fill="white" opacity="0.1" />
                            </g>
                        )}
                        {type === 'ranunculus' && ( // nested cabbage look
                            <g>
                                <circle cx="60" cy="60" r="48" fill={color} stroke="black" strokeWidth="3.5" />
                                <path d="M60 15 C95 15 110 60 60 105 Q10 60 25 15" fill="none" stroke="black" strokeWidth="2" opacity="0.4" />
                                <circle cx="60" cy="60" r="32" fill="none" stroke="black" strokeWidth="1.5" opacity="0.5" />
                                <circle cx="60" cy="60" r="18" fill="none" stroke="black" strokeWidth="1.2" opacity="0.5" />
                                <circle cx="60" cy="60" r="6" fill="#000" opacity="0.2" />
                            </g>
                        )}
                        {type === 'zinnia' && ( // complex layered look
                            <g>
                                {[...Array(16)].map((_, i) => (
                                    <path key={i} d="M60 60 Q95 5 115 60 Q95 115 60 60" fill={color} stroke="black" strokeWidth="1.8" transform={`rotate(${i * 22.5} 60 60)`} />
                                ))}
                                <circle cx="60" cy="60" r="14" fill="#FACC15" stroke="black" strokeWidth="2.2" />
                            </g>
                        )}
                        {type === 'peony' && ( // loose fluffy petals
                            <g>
                                {[0, 60, 120, 180, 240, 300].map(d => (
                                    <path key={d} d="M60 60 C110 0 150 60 110 105 C75 125 50 115 60 60" fill={color} stroke="black" strokeWidth="3" transform={`rotate(${d} 60 60)`} />
                                ))}
                                <circle cx="60" cy="65" r="20" fill={color} stroke="black" strokeWidth="3" />
                            </g>
                        )}
                        {type === 'rose' && ( // swirling center
                            <g>
                                <path d="M60 60 C130 -20 160 80 85 120 C15 150 0 50 60 60" fill={color} stroke="black" strokeWidth="4" />
                                <circle cx="60" cy="60" r="15" fill={color} stroke="black" strokeWidth="3.5" />
                                <path d="M48 55 Q60 42 72 55" fill="none" stroke="black" strokeWidth="2.5" />
                            </g>
                        )}
                        {type === 'tulip' && (
                            <g>
                                <path d="M60 105 C10 80 15 5 60 10 C105 5 110 80 60 105" fill={color} stroke="black" strokeWidth="3.5" />
                                <path d="M60 105 Q45 50 60 20 Q75 50 60 105" fill={color} stroke="black" strokeWidth="2" opacity="0.7" />
                            </g>
                        )}
                        {type === 'orchid' && (
                            <g>
                                <path d="M60 60 L10 20 L55 10 L110 20 L60 60" fill={color} stroke="black" strokeWidth="3.5" />
                                <path d="M60 60 Q105 105 60 115 Q15 105 60 60" fill={color} stroke="black" strokeWidth="3.5" />
                                <circle cx="60" cy="55" r="8" fill="#FDE047" stroke="black" strokeWidth="2" />
                            </g>
                        )}
                        {(!['anemone', 'ranunculus', 'zinnia', 'peony', 'rose', 'tulip', 'orchid'].includes(type)) && (
                            <g>
                                {[0, 120, 240].map(d => (
                                    <path key={d} d="M60 60 Q115 -10 105 60" fill={color} stroke="black" strokeWidth="3" transform={`rotate(${d} 60 60)`} />
                                ))}
                                <circle cx="60" cy="60" r="15" fill={color} stroke="black" strokeWidth="2.5" />
                            </g>
                        )}
                    </g>
                )}
                {(showStem && !isGreenery) && <path d="M60 110 L60 175" stroke="#166534" strokeWidth="7" strokeLinecap="round" opacity="0.9" />}
            </g>
        </svg>
    );
};

const BouquetWrap = ({ style = 'paper' }) => (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[340px] h-[340px] pointer-events-none z-[100]">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl overflow-visible">
            <path d="M20 195 L180 195 L215 10 L100 45 L-15 10 Z" fill="#EADBC8" stroke="#8b4513" strokeWidth="0.5" />
            <path d="M100 180 Q80 155 60 180 Q80 205 100 185 Q120 205 140 180 Q120 155 100 180" fill="#B72099" stroke="black" strokeWidth="1" />
        </svg>
    </div>
);

const BLOOMS = [
    { id: 'b1', name: 'Orchid', type: 'orchid', color: '#FDA4AF' },
    { id: 'b2', name: 'Tulip', type: 'tulip', color: '#F97316' },
    { id: 'b3', name: 'Carnation', type: 'peony', color: '#F472B6' },
    { id: 'b4', name: 'Anemone', type: 'anemone', color: '#D1FAE5' },
    { id: 'b5', name: 'Peony', type: 'peony', color: '#FDA4AF' },
    { id: 'b6', name: 'Zinnia', type: 'zinnia', color: '#B72099' },
    { id: 'b7', name: 'Dahlia', type: 'peony', color: '#E11D48' },
    { id: 'b8', name: 'Sunflower', type: 'zinnia', color: '#FACC15' },
    { id: 'b9', name: 'Lily', type: 'lily', color: '#C4B5FD' },
    { id: 'b10', name: 'Daisy', type: 'zinnia', color: '#FFFFFF' },
    { id: 'b11', name: 'Gerbera', type: 'zinnia', color: '#FB7185' },
    { id: 'b12', name: 'Rose', type: 'rose', color: '#BE123C' },
];

const GREENERY = [
    { id: 'g1', name: 'Meadow Fern', type: 'leaf', isGreenery: true },
    { id: 'g2', name: 'Wild Ivy', type: 'leaf', isGreenery: true },
    { id: 'g3', name: 'Forest Stem', type: 'leaf', isGreenery: true },
];

const VirtualBouquet = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedBlooms, setSelectedBlooms] = useState([]);
    const [arrangedBlooms, setArrangedBlooms] = useState([]);
    const [wrapStyle, setWrapStyle] = useState('paper');
    const [cardData, setCardData] = useState({ to: '', message: '', from: '' });

    const handleBloomSelect = (bloom) => {
        if (selectedBlooms.length >= 10) {
            toast.warning("Pick 6 to 10 blooms!");
            return;
        }
        setSelectedBlooms([...selectedBlooms, bloom]);

        const isGreenery = bloom.isGreenery;
        const newArrangement = {
            ...bloom,
            instanceId: Date.now() + Math.random(),
            x: (Math.random() - 0.5) * 160,
            y: (Math.random() - 0.5) * 60 - 140,
            scale: 0.8 + Math.random() * 0.4,
            rotation: (selectedBlooms.length - 5) * 20 + (Math.random() * 20 - 10),
            zIndex: isGreenery ? 0 : selectedBlooms.length + 10
        };
        setArrangedBlooms([...arrangedBlooms, newArrangement]);
    };

    const handleSend = () => {
        localStorage.setItem('temp_bouquet', JSON.stringify(arrangedBlooms));
        localStorage.setItem('temp_card', JSON.stringify(cardData));
        navigate('/user/bouquet/receiver');
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] selection:bg-[#B72099]/10">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Martian+Mono:wght@400;700;800&family=Dancing+Script:wght@700&family=Crimson+Pro:ital,wght@0,400;0,700;1,400&display=swap');
                .font-martian { font-family: 'Martian Mono', monospace; }
                .font-script { font-family: 'Dancing Script', cursive; }
                .font-crimson { font-family: 'Crimson Pro', serif; }
                body { font-family: 'Martian Mono', monospace; background-color: #FDFBF7; }
            `}</style>

            <main className="container flex flex-col p-4 mx-auto font-martian text-center lg:px-24">
                <header className="mb-16 cursor-pointer pt-12" onClick={() => navigate('/user/dashboard')}>
                    <h1 className="text-6xl font-script tracking-tight text-black lowercase">Digibouquet</h1>
                </header>

                {/* Step 1: Picking */}
                {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                        <h2 className="text-[13px] font-bold uppercase tracking-[0.4em] mb-16 text-black/80">Pick 6 to 10 Blooms</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 mb-24 w-full">
                            {BLOOMS.map((bloom) => (
                                <button
                                    key={bloom.id}
                                    onClick={() => handleBloomSelect(bloom)}
                                    className="group relative flex flex-col items-center justify-center transition-all active:scale-95"
                                >
                                    <div className="w-28 h-28 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2">
                                        <FlowerSVG type={bloom.type} color={bloom.color} isGreenery={bloom.isGreenery} showStem={false} />
                                    </div>
                                    <div className="mt-3">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-black/20 group-hover:text-black/60 transition-colors">
                                            {bloom.name}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Floating Status Bar */}
                        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 px-10 py-5 bg-white shadow-2xl border border-black/5 z-[200]">
                            <div className="flex flex-col items-start leading-none pr-6 border-r border-black/10">
                                <span className="text-[14px] font-black uppercase tracking-widest">{selectedBlooms.length}</span>
                                <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Blooms</span>
                            </div>

                            <button
                                onClick={() => { setSelectedBlooms([]); setArrangedBlooms([]); }}
                                className="text-[10px] font-black uppercase tracking-widest hover:text-[#B72099] transition-colors"
                            >
                                Reset
                            </button>

                            <button
                                onClick={() => setStep(2)}
                                disabled={selectedBlooms.length < 6}
                                className={`px-12 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${selectedBlooms.length < 6
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-[#B72099]'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Arrangement */}
                {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                        <div className="relative w-full aspect-[4/5] max-w-lg mx-auto flex items-end justify-center mb-16">
                            <div className="relative w-full h-[550px] flex items-end justify-center">
                                <AnimatePresence>
                                    {arrangedBlooms.map((bloom) => (
                                        <motion.div
                                            key={bloom.instanceId}
                                            initial={{ opacity: 0, scale: 0, y: 200 }}
                                            animate={{
                                                scale: bloom.scale,
                                                opacity: 1,
                                                x: `calc(-50% + ${bloom.x}px)`,
                                                y: `${bloom.y}px`,
                                                rotate: bloom.rotation
                                            }}
                                            className="absolute left-1/2 bottom-[160px] pointer-events-none w-48 h-48"
                                            style={{ zIndex: bloom.zIndex }}
                                        >
                                            <FlowerSVG type={bloom.type} color={bloom.color} isGreenery={bloom.isGreenery} showStem={true} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <BouquetWrap />
                            </div>
                        </div>

                        <div className="flex justify-center gap-12 mb-32">
                            {GREENERY.map(g => (
                                <button key={g.id} onClick={() => handleBloomSelect(g)} className="group flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 transition-all group-hover:scale-110 group-active:scale-95">
                                        <FlowerSVG type={g.type} isGreenery={true} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-30 group-hover:opacity-100 Transition-opacity">Add {g.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-4">
                            <button onClick={() => setStep(1)} className="bg-white text-black border border-black/10 px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Back</button>
                            <button onClick={() => setStep(3)} className="bg-black text-white px-16 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-[#B72099] transition-all shadow-2xl">
                                Continue
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Card */}
                {step === 3 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-sm font-black font-inter uppercase tracking-[0.4em] mb-4 text-black/30">Personalize Your Gift</h2>
                            <p className="text-[10px] font-medium text-black/40 uppercase tracking-widest">A hand-written note to complete the bouquet</p>
                        </div>

                        <div className="bg-[#FAF9F6] p-12 rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-black/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B72099]/20 to-transparent"></div>

                            <div className="space-y-10 relative z-10">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-4 ml-1">To Someone Special</label>
                                    <input
                                        type="text"
                                        placeholder="Name of recipient"
                                        className="w-full bg-transparent border-b-2 border-black/10 py-4 px-1 text-lg font-medium focus:outline-none focus:border-[#B72099] transition-colors placeholder:text-black/10"
                                        onChange={(e) => setCardData({ ...cardData, to: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-4 ml-1">Your Message</label>
                                    <textarea
                                        rows="6"
                                        placeholder="Write something from the heart..."
                                        className="w-full bg-transparent border-2 border-black/5 rounded-2xl p-6 text-lg font-medium focus:outline-none focus:border-[#B72099] transition-all resize-none placeholder:text-black/10"
                                        onChange={(e) => setCardData({ ...cardData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-4 ml-1">From</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        className="w-full bg-transparent border-b-2 border-black/10 py-4 px-1 text-lg font-medium focus:outline-none focus:border-[#B72099] transition-colors placeholder:text-black/10"
                                        onChange={(e) => setCardData({ ...cardData, from: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Petite Bouquet Preview */}
                        <div className="mt-12 flex justify-center items-end gap-2 h-20 opacity-40">
                            {arrangedBlooms.slice(0, 5).map((b, i) => (
                                <div key={i} className="w-12 h-12 -mx-4 group hover:opacity-100 transition-opacity">
                                    <FlowerSVG type={b.type} color={b.color} isGreenery={b.isGreenery} />
                                </div>
                            ))}
                        </div>

                        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-4">
                            <button onClick={() => setStep(2)} className="bg-white/80 backdrop-blur-md text-black/60 px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">← Back</button>
                            <button
                                onClick={handleSend}
                                className="bg-[#B72099] text-white px-16 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(183,32,153,0.3)]"
                            >
                                Wrap & Deliver ➜
                            </button>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default VirtualBouquet;
