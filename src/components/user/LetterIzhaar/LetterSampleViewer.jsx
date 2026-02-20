import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoChevronDown, IoCheckmark } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

// Importing actual templates
import T1 from '../../../assets/temp/letter_01.png';
import T2 from '../../../assets/temp/letter_02.jpeg';
import T3 from '../../../assets/temp/letter_03.png';
import T4 from '../../../assets/temp/letter_04.png';
import T5 from '../../../assets/temp/letter_05.png';
import T6 from '../../../assets/temp/letter_06.jpeg';
import T7 from '../../../assets/temp/letter_07.png';
import T8 from '../../../assets/temp/letter_08.png';
import T9 from '../../../assets/temp/letter_09.png';
import T10 from '../../../assets/temp/letter_10.png';

const TEMPLATES = [
    { id: 1, url: T1, name: 'Classic Rose' },
    { id: 2, url: T2, name: 'Vintage Love' },
    { id: 3, url: T3, name: 'Floral Whisper' },
    { id: 4, url: T4, name: 'Modern Heart' },
    { id: 5, url: T5, name: 'Eternal Bloom' },
    { id: 6, url: T6, name: 'Sealed with a Kiss' },
    { id: 7, url: T7, name: 'Golden Glow' },
    { id: 8, url: T8, name: 'Pink Dream' },
    { id: 9, url: T9, name: 'Night Sky' },
    { id: 10, url: T10, name: 'Secret Garden' },
];

const COLORS = [
    { name: 'Classic Red', hex: '#FF0004' },
    { name: 'Soft Pink', hex: '#FF69B4' },
    { name: 'Royal Purple', hex: '#8A2BE2' },
    { name: 'Deep Blue', hex: '#4169E1' },
    { name: 'Pure Black', hex: '#000000' },
    { name: 'Chocolate', hex: '#A52A2A' },
    { name: 'Forest Green', hex: '#2E8B57' },
    { name: 'Gold', hex: '#DAA520' },
    { name: 'Midnight', hex: '#1e1b4b' },
];

const FONTS = [
    { name: 'Poppins', family: 'Poppins' },
    { name: 'Serif Classic', family: 'Playfair Display' },
    { name: 'Handwritten', family: 'Dancing Script' },
    { name: 'Modern Sans', family: 'Montserrat' },
    { name: 'Elegant', family: 'Outfit' },
    { name: 'Cursive', family: 'Cursive' },
    { name: 'Serif', family: 'Serif' },
];

const LetterSampleViewer = () => {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [fontColor, setFontColor] = useState(COLORS[0]);
    const [fontStyle, setFontStyle] = useState(FONTS[0]);
    const [fontSize, setFontSize] = useState(14);
    const [activeDropdown, setActiveDropdown] = useState(null); // 'color', 'font', or null

    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sampleLetter = "My Dearest,\n\nEvery moment we spend together feels like a dream I never want to wake up from. Your smile is the light that guides me through my darkest days, and your love is the anchor that keeps me steady.\n\nI just wanted to let you know how much you mean to me. You are my today and all of my tomorrows.\n\nWith all my love,\nAlways Yours";

    const toggleDropdown = (type) => {
        setActiveDropdown(activeDropdown === type ? null : type);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans overflow-hidden select-none">
            {/* Header */}
            <header className="p-6 flex items-center justify-between z-50">
                <button
                    onClick={() => navigate("/user/letter-izhaar")}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <IoChevronBack size={18} />
                </button>
                <h1 className="text-xl font-['Playfair_Display'] font-bold tracking-tight">Samples</h1>
                <button

                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-sm font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
                >
                    Next
                </button>
            </header>

            {/* Toolbar Controls */}
            <div className="px-6 py-2 flex items-center justify-center gap-3 z-40 relative">
                {/* Font Color Dropdown */}
                <div className="relative" ref={activeDropdown === 'color' ? dropdownRef : null}>
                    <div
                        onClick={() => toggleDropdown('color')}
                        className={`bg-black/40 backdrop-blur-md border px-3 py-2 rounded-xl flex flex-col gap-1 items-center min-w-[90px] cursor-pointer transition-all ${activeDropdown === 'color' ? 'border-pink-500 ring-1 ring-pink-500/30' : 'border-white/10 hover:bg-white/5'}`}
                    >
                        <span className="text-[8px] uppercase tracking-widest text-white/50">Font Color</span>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm shadow-[0_0_8px_currentColor]" style={{ backgroundColor: fontColor.hex, color: fontColor.hex }}></div>
                            <IoChevronDown size={10} className={`transition-transform duration-300 ${activeDropdown === 'color' ? 'rotate-180' : ''}`} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {activeDropdown === 'color' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full mt-2 left-0 min-w-[150px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden z-[100]"
                            >
                                <div className="max-h-[250px] overflow-y-auto no-scrollbar space-y-1">
                                    {COLORS.map((c) => (
                                        <div
                                            key={c.hex}
                                            onClick={() => { setFontColor(c); setActiveDropdown(null); }}
                                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${fontColor.hex === c.hex ? 'bg-pink-500/20' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.hex }}></div>
                                                <span className="text-xs font-medium">{c.name}</span>
                                            </div>
                                            {fontColor.hex === c.hex && <IoCheckmark className="text-pink-500" size={14} />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Font Style Dropdown */}
                <div className="relative" ref={activeDropdown === 'font' ? dropdownRef : null}>
                    <div
                        onClick={() => toggleDropdown('font')}
                        className={`bg-black/40 backdrop-blur-md border px-4 py-2 rounded-xl flex flex-col gap-1 items-center min-w-[110px] cursor-pointer transition-all ${activeDropdown === 'font' ? 'border-pink-500 ring-1 ring-pink-500/30' : 'border-white/10 hover:bg-white/5'}`}
                    >
                        <span className="text-[8px] uppercase tracking-widest text-white/50">Font Style</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium truncate max-w-[70px]">{fontStyle.name}</span>
                            <IoChevronDown size={10} className={`transition-transform duration-300 ${activeDropdown === 'font' ? 'rotate-180' : ''}`} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {activeDropdown === 'font' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full mt-2 left-0 min-w-[160px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden z-[100]"
                            >
                                <div className="max-h-[250px] overflow-y-auto no-scrollbar space-y-1">
                                    {FONTS.map((f) => (
                                        <div
                                            key={f.family}
                                            onClick={() => { setFontStyle(f); setActiveDropdown(null); }}
                                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${fontStyle.family === f.family ? 'bg-pink-500/20 text-pink-400' : ''}`}
                                        >
                                            <span className="text-xs font-medium" style={{ fontFamily: f.family }}>{f.name}</span>
                                            {fontStyle.family === f.family && <IoCheckmark className="text-pink-500" size={14} />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Font Size Selector (Inline Toggle) */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl flex flex-col gap-1 items-center min-w-[80px]">
                    <span className="text-[8px] uppercase tracking-widest text-white/50">Font Size</span>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); setFontSize(prev => Math.min(prev + 1, 30)); }}
                            className="text-[16px] font-bold text-pink-500 hover:scale-125 transition-transform"
                        >
                            +
                        </button>
                        <span className="text-[11px] font-bold w-4 text-center">{fontSize}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFontSize(prev => Math.max(prev - 2, 8)); }}
                            className="text-[16px] font-bold text-pink-500 hover:scale-125 transition-transform"
                        >
                            -
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Preview Component */}
            <div className="flex-1 flex items-center justify-center p-6 z-10 overflow-hidden relative">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedTemplate.id}
                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                        transition={{ duration: 0.4, type: 'spring', damping: 20 }}
                        className="relative w-full aspect-[1/1.4] max-w-[320px] bg-white rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/10"
                    >
                        <img
                            src={selectedTemplate.url}
                            alt={selectedTemplate.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 p-10 flex items-start justify-center pt-24 overflow-hidden">
                            <motion.div
                                layout
                                style={{
                                    color: fontColor.hex,
                                    fontFamily: fontStyle.family,
                                    fontSize: `${fontSize}px`,
                                    lineHeight: '1.6',
                                    textAlign: 'center',
                                    whiteSpace: 'pre-wrap',
                                    width: '100%'
                                }}
                                className="transition-all duration-500 ease-in-out"
                            >
                                {sampleLetter}
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Templates Section */}
            <div className="p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-['Playfair_Display'] font-bold text-pink-100">Templates</h2>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">Choose your archetype</span>
                    </div>
                    <button className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-pink-400 text-[10px] font-black uppercase tracking-widest hover:bg-pink-500/10 transition-all">View All</button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 mask-linear">
                    {TEMPLATES.map((tmpl) => (
                        <motion.div
                            key={tmpl.id}
                            whileHover={{ y: -8, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTemplate(tmpl)}
                            className={`relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${selectedTemplate.id === tmpl.id
                                ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)] z-50 ring-2 ring-pink-500/20'
                                : 'border-white/5 opacity-50 hover:opacity-100'
                                }`}
                        >
                            <img src={tmpl.url} alt={tmpl.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mask-linear {
          mask-image: linear-gradient(to right, black 85%, transparent 100%);
        }
      `}</style>
        </div>
    );
};

export default LetterSampleViewer;
