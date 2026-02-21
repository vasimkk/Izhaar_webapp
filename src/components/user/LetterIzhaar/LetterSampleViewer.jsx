import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoChevronDown, IoCheckmark, IoPencil, IoColorPaletteOutline, IoTextOutline, IoResizeOutline, IoClose } from 'react-icons/io5';
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
    const [isEditing, setIsEditing] = useState(false);
    const [showAllTemplates, setShowAllTemplates] = useState(false);
    const [letterContent, setLetterContent] = useState("My Dearest,\n\nEvery moment we spend together feels like a dream I never want to wake up from. Your smile is the light that guides me through my darkest days, and your love is the anchor that keeps me steady.\n\nI just wanted to let you know how much you mean to me. You are my today and all of my tomorrows.\n\nWith all my love,\nAlways Yours");

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
                    onClick={() => navigate("/user/letter-izhaar/envelopes")}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-sm font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
                >
                    Next
                </button>
            </header>

            {/* Toolbar Controls */}
            {/* Toolbar Controls */}
            <div className="px-6 py-4 flex items-center justify-start sm:justify-center gap-3 z-40 relative overflow-x-auto no-scrollbar">
                {/* Font Color Dropdown */}
                <div className="relative flex-shrink-0">
                    <button
                        id="color-trigger"
                        onClick={() => toggleDropdown('color')}
                        className={`w-[110px] h-[52px] bg-white/5 backdrop-blur-xl border rounded-2xl flex flex-col gap-1 items-center justify-center cursor-pointer transition-all ${activeDropdown === 'color' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:bg-white/10'}`}
                    >
                        <span className="text-[7px] uppercase tracking-[2px] text-white/40 font-black">Color</span>
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-lg" style={{ backgroundColor: fontColor.hex }}></div>
                            <span className="text-[10px] font-bold text-white/80">{fontColor.name.split(' ')[0]}</span>
                            <IoChevronDown size={10} className={`text-white/40 transition-transform duration-300 ${activeDropdown === 'color' ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    <AnimatePresence>
                        {activeDropdown === 'color' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="fixed mt-3 min-w-[180px] bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-3 shadow-2xl z-[1000]"
                                style={{
                                    top: document.getElementById('color-trigger')?.getBoundingClientRect().bottom + 'px',
                                    left: Math.max(20, Math.min(window.innerWidth - 200, document.getElementById('color-trigger')?.getBoundingClientRect().left)) + 'px'
                                }}
                            >
                                <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1.5">
                                    {COLORS.map((c) => (
                                        <div
                                            key={c.hex}
                                            onClick={() => { setFontColor(c); setActiveDropdown(null); }}
                                            className={`flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer ${fontColor.hex === c.hex ? 'bg-pink-500/20 text-pink-400' : 'text-white/70'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.hex }}></div>
                                                <span className="text-xs font-bold">{c.name}</span>
                                            </div>
                                            {fontColor.hex === c.hex && <IoCheckmark className="text-pink-500" size={16} />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Font Style Dropdown */}
                <div className="relative flex-shrink-0">
                    <button
                        id="font-trigger"
                        onClick={() => toggleDropdown('font')}
                        className={`w-[110px] h-[52px] bg-white/5 backdrop-blur-xl border rounded-2xl flex flex-col gap-1 items-center justify-center cursor-pointer transition-all ${activeDropdown === 'font' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:bg-white/10'}`}
                    >
                        <span className="text-[7px] uppercase tracking-[2px] text-white/40 font-black">Style</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-white/80 truncate max-w-[60px]" style={{ fontFamily: fontStyle.family }}>{fontStyle.name}</span>
                            <IoChevronDown size={10} className={`text-white/40 transition-transform duration-300 ${activeDropdown === 'font' ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    <AnimatePresence>
                        {activeDropdown === 'font' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="fixed mt-3 min-w-[180px] bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-3 shadow-2xl z-[1000]"
                                style={{
                                    top: document.getElementById('font-trigger')?.getBoundingClientRect().bottom + 'px',
                                    left: Math.max(20, Math.min(window.innerWidth - 200, document.getElementById('font-trigger')?.getBoundingClientRect().left)) + 'px'
                                }}
                            >
                                <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1.5">
                                    {FONTS.map((f) => (
                                        <div
                                            key={f.family}
                                            onClick={() => { setFontStyle(f); setActiveDropdown(null); }}
                                            className={`flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer ${fontStyle.family === f.family ? 'bg-pink-500/20 text-pink-400' : 'text-white/70'}`}
                                        >
                                            <span className="text-xs font-bold" style={{ fontFamily: f.family }}>{f.name}</span>
                                            {fontStyle.family === f.family && <IoCheckmark className="text-pink-500" size={16} />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Font Size Selector */}
                <div className="flex-shrink-0 w-[110px] h-[52px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-1 items-center justify-center">
                    <span className="text-[7px] uppercase tracking-[2px] text-white/40 font-black">Size</span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); setFontSize(prev => Math.max(prev - 1, 8)); }}
                            className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/5 text-pink-500 hover:bg-pink-500/20 transition-all active:scale-90"
                        >
                            <span className="text-xs font-black">-</span>
                        </button>
                        <span className="text-[11px] font-black text-white/90 w-4 text-center">{fontSize}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFontSize(prev => Math.min(prev + 1, 30)); }}
                            className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/5 text-pink-500 hover:bg-pink-500/20 transition-all active:scale-90"
                        >
                            <span className="text-xs font-black">+</span>
                        </button>
                    </div>
                </div>

                {/* Edit Toggle */}
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex-shrink-0 w-[110px] h-[52px] bg-white/5 backdrop-blur-xl border rounded-2xl flex flex-col gap-1 items-center justify-center cursor-pointer transition-all ${isEditing ? 'border-pink-500 bg-pink-500/20' : 'border-white/10 hover:bg-white/10'}`}
                >
                    <span className="text-[7px] uppercase tracking-[2px] text-white/40 font-black">{isEditing ? 'Done' : 'Edit'}</span>
                    <div className="flex items-center gap-2">
                        <IoPencil size={12} className={isEditing ? 'text-pink-400' : 'text-white/60'} />
                        <span className="text-[10px] font-bold text-white/80">{isEditing ? 'Save' : 'Text'}</span>
                    </div>
                </button>
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

                        <div className="absolute inset-x-0 inset-y-24 px-10 flex flex-col items-center justify-start overflow-hidden group">
                            {isEditing ? (
                                <textarea
                                    value={letterContent}
                                    onChange={(e) => setLetterContent(e.target.value)}
                                    autoFocus
                                    className="w-full h-full bg-pink-50/10 p-4 rounded-xl border border-pink-500/20 outline-none resize-none text-center custom-scrollbar"
                                    style={{
                                        color: fontColor.hex,
                                        fontFamily: fontStyle.family,
                                        fontSize: `${fontSize}px`,
                                        lineHeight: '1.6',
                                    }}
                                />
                            ) : (
                                <motion.div
                                    layout
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        color: fontColor.hex,
                                        fontFamily: fontStyle.family,
                                        fontSize: `${fontSize}px`,
                                        lineHeight: '1.6',
                                        textAlign: 'center',
                                        whiteSpace: 'pre-wrap',
                                        width: '100%',
                                        cursor: 'text'
                                    }}
                                    className="transition-all duration-500 ease-in-out relative"
                                >
                                    {letterContent}
                                    <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-500 text-white p-1 rounded-full shadow-lg">
                                        <IoPencil size={12} />
                                    </div>
                                </motion.div>
                            )}
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
                    <button
                        onClick={() => setShowAllTemplates(true)}
                        className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-pink-400 text-[10px] font-black uppercase tracking-widest hover:bg-pink-500/10 transition-all active:scale-95"
                    >
                        View All
                    </button>
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

            <AnimatePresence>
                {showAllTemplates && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="fixed inset-0 z-[200] bg-black/80 flex flex-col p-6"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white">All Templates</h2>
                                <p className="text-white/50 text-xs uppercase tracking-widest mt-1">Select your favorite letter design</p>
                            </div>
                            <button
                                onClick={() => setShowAllTemplates(false)}
                                className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {TEMPLATES.map((tmpl) => (
                                    <motion.div
                                        key={tmpl.id}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setSelectedTemplate(tmpl);
                                            setShowAllTemplates(false);
                                        }}
                                        className={`group relative aspect-[1/1.4] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${selectedTemplate.id === tmpl.id
                                            ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]'
                                            : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <img src={tmpl.url} alt={tmpl.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                            <span className="text-xs font-medium text-white/90">{tmpl.name}</span>
                                        </div>
                                        {selectedTemplate.id === tmpl.id && (
                                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-lg">
                                                <IoCheckmark size={14} />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.4);
        }
      `}</style>
        </div>
    );
};

export default LetterSampleViewer;
