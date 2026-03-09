import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoChevronDown, IoCheckmark, IoPencil, IoColorPaletteOutline, IoTextOutline, IoResizeOutline, IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

// Importing actual templates
// Importing actual templates from New assets
const T1 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/1?_a=BAMAOGeA0";
const T2 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/2?_a=BAMAOGeA0";
const T3 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/3?_a=BAMAOGeA0";
const T4 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/4?_a=BAMAOGeA0";
const T5 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/5?_a=BAMAOGeA0";
const T6 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/6?_a=BAMAOGeA0";
const T7 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/7?_a=BAMAOGeA0";
const T8 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/8?_a=BAMAOGeA0";
const T9 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/9?_a=BAMAOGeA0";
const T10 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/10?_a=BAMAOGeA0";
const T11 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/11?_a=BAMAOGeA0";
const T12 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/12?_a=BAMAOGeA0";
const T13 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/13?_a=BAMAOGeA0";
const T14 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/14?_a=BAMAOGeA0";
const T15 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/15?_a=BAMAOGeA0";
const T16 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/New/16?_a=BAMAOGeA0";

const TEMPLATES = [
    { id: 1, url: T1, name: 'Classic Rose' },
    { id: 2, url: T2, name: 'Vintage Love' },
    { id: 3, url: T3, name: 'Floral Whisper' },
    { id: 4, url: T4, name: 'Sweetheart' },
    { id: 5, url: T5, name: 'Modern Heart' },
    { id: 6, url: T6, name: 'Eternal Bloom' },
    { id: 7, url: T7, name: 'Sealed Kiss' },
    { id: 8, url: T8, name: 'Golden Glow' },
    { id: 9, url: T9, name: 'Pink Dream' },
    { id: 10, url: T10, name: 'Night Sky' },
    { id: 11, url: T11, name: 'Secret Garden' },
    { id: 12, url: T12, name: 'Elegance' },
    { id: 13, url: T13, name: 'Pure Love' },
    { id: 14, url: T14, name: 'Majestic' },
    { id: 15, url: T15, name: 'Serenity' },
    { id: 16, url: T16, name: 'Infinity' },
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
    { name: 'Rose Gold', hex: '#B76E79' },
    { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'Crimson', hex: '#DC143C' },
    { name: 'Sky Blue', hex: '#87CEEB' },
    { name: 'Emerald', hex: '#50C878' },
];

const FONTS = [
    { name: 'Poppins', family: 'Poppins' },
    { name: 'Serif Classic', family: 'Playfair Display' },
    { name: 'Handwritten', family: 'Dancing Script' },
    { name: 'Modern Sans', family: 'Montserrat' },
    { name: 'Elegant', family: 'Outfit' },
    { name: 'Cursive', family: 'Great Vibes' },
    { name: 'Sacramento', family: 'Sacramento' },
    { name: 'Caveat', family: 'Caveat' },
    { name: 'Pacifico', family: 'Pacifico' },
    { name: 'Merriweather', family: 'Merriweather' },
    { name: 'Lora', family: 'Lora' },
    { name: 'Satisfy', family: 'Satisfy' },
];

const LetterSampleViewer = () => {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[8]);
    const [fontColor, setFontColor] = useState(COLORS[4]);
    const [fontStyle, setFontStyle] = useState(FONTS[0]);
    const [fontSize, setFontSize] = useState(11);
    const [activeDropdown, setActiveDropdown] = useState(null); // 'color', 'font', or null
    const [isEditing, setIsEditing] = useState(false);
    const [showAllTemplates, setShowAllTemplates] = useState(false);
    const [letterContent, setLetterContent] = useState("My Dearest,\n\nEvery moment we spend together feels like a dream I never want to wake up from. Your smile is the light that guides me through my darkest days, and your love is the anchor that keeps me steady.\n\nI just wanted to let you know how much you mean to me. You are my today and all of my tomorrows.\n\nWith all my love,\nAlways Yours");

    const dropdownRef = useRef(null);
    const textareaRef = useRef(null);

    // Auto-adjust textarea height
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = '0px';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = scrollHeight + 'px';
        }
    }, [letterContent, isEditing, fontSize]);

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
        <div className="min-h-screen text-white flex flex-col font-sans overflow-hidden select-none" style={{ background: 'var(--letter, linear-gradient(349deg, #01095E 0%, #000 103.43%))' }}>
            {/* Header */}
            <header className="px-3 py-2 flex items-center justify-between z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-1.5 sm:gap-3">
                    <button
                        onClick={() => navigate("/user/letter-izhaar")}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <IoChevronBack size={18} />
                    </button>

                    {/* Color Dropdown Toggle */}
                    <button
                        id="color-trigger"
                        onClick={() => toggleDropdown('color')}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border flex items-center justify-center transition-all ${activeDropdown === 'color' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:bg-white/10'}`}
                        title="Change Color"
                    >
                        <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: fontColor.hex }}></div>
                    </button>

                    {/* Font Dropdown Toggle */}
                    <button
                        id="font-trigger"
                        onClick={() => toggleDropdown('font')}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border flex items-center justify-center transition-all ${activeDropdown === 'font' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:bg-white/10'}`}
                        title="Change Font Style"
                    >
                        <IoTextOutline size={18} className={activeDropdown === 'font' ? 'text-pink-500' : 'text-white/70'} />
                    </button>

                    {/* Font Size Dropdown Toggle */}
                    <button
                        id="size-trigger"
                        onClick={() => toggleDropdown('size')}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border flex items-center justify-center transition-all ${activeDropdown === 'size' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:bg-white/10'}`}
                        title="Change Font Size"
                    >
                        <span className={`text-[11px] font-black ${activeDropdown === 'size' ? 'text-pink-500' : 'text-white/70'}`}>{fontSize}</span>
                    </button>

                    {/* Edit Toggle */}
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border flex items-center justify-center transition-all ${isEditing ? 'border-pink-500 bg-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'border-white/10 hover:bg-white/10'}`}
                        title={isEditing ? 'Save Changes' : 'Customize Text'}
                    >
                        {isEditing ? <IoCheckmark className="text-green-400" size={20} /> : <IoPencil className="text-pink-400" size={18} />}
                    </button>
                </div>

                <button
                    onClick={() => navigate("/user/letter-izhaar/envelopes")}
                    className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-all text-white whitespace-nowrap"
                >
                    Next ➜
                </button>
            </header>

            {/* Dropdowns (Same as before but relative to header triggers) */}
            <AnimatePresence>
                {activeDropdown === 'color' && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="fixed mt-2 min-w-[200px] bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 shadow-2xl z-[1000]"
                        style={{
                            top: document.getElementById('color-trigger')?.getBoundingClientRect().bottom + 'px',
                            left: Math.max(10, Math.min(window.innerWidth - 210, document.getElementById('color-trigger')?.getBoundingClientRect().left)) + 'px'
                        }}
                    >
                        <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1.5 pt-1">
                            <div className="px-3 py-2 border-b border-white/10 mb-2">
                                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-2 py-1.5">
                                    <input
                                        type="color"
                                        value={fontColor.hex}
                                        onChange={(e) => setFontColor({ name: 'Custom', hex: e.target.value })}
                                        className="w-5 h-5 rounded-lg bg-transparent border-0 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={fontColor.hex}
                                        onChange={(e) => setFontColor({ name: 'Custom', hex: e.target.value })}
                                        className="bg-transparent border-0 text-[10px] font-mono text-white/70 focus:outline-none w-16"
                                        placeholder="#Hex"
                                    />
                                </div>
                            </div>
                            {COLORS.map((c) => (
                                <div
                                    key={c.hex}
                                    onClick={() => { setFontColor(c); setActiveDropdown(null); }}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${fontColor.hex === c.hex ? 'bg-pink-500/20 text-pink-400' : 'text-white/70'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }}></div>
                                        <span className="text-[11px] font-bold">{c.name}</span>
                                    </div>
                                    {fontColor.hex === c.hex && <IoCheckmark className="text-pink-500" size={14} />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeDropdown === 'font' && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="fixed mt-2 min-w-[200px] bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 shadow-2xl z-[1000]"
                        style={{
                            top: document.getElementById('font-trigger')?.getBoundingClientRect().bottom + 'px',
                            left: Math.max(10, Math.min(window.innerWidth - 210, document.getElementById('font-trigger')?.getBoundingClientRect().left)) + 'px'
                        }}
                    >
                        <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1">
                            {FONTS.map((f) => (
                                <div
                                    key={f.family}
                                    onClick={() => { setFontStyle(f); setActiveDropdown(null); }}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${fontStyle.family === f.family ? 'bg-pink-500/20 text-pink-400' : 'text-white/70'}`}
                                >
                                    <span className="text-[11px] font-bold" style={{ fontFamily: f.family }}>{f.name}</span>
                                    {fontStyle.family === f.family && <IoCheckmark className="text-pink-500" size={14} />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
                {activeDropdown === 'size' && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="fixed mt-2 min-w-[200px] bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 shadow-2xl z-[1000]"
                        style={{
                            top: document.getElementById('size-trigger')?.getBoundingClientRect().bottom + 'px',
                            left: Math.max(10, Math.min(window.innerWidth - 210, document.getElementById('size-trigger')?.getBoundingClientRect().left)) + 'px'
                        }}
                    >
                        <div className="p-4 flex flex-col items-center gap-4">
                            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Font Size</span>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setFontSize(prev => Math.max(prev - 1, 8))}
                                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pink-500 hover:bg-pink-500/20 transition-all font-bold text-lg"
                                >
                                    -
                                </button>
                                <span className="text-xl font-black text-white">{fontSize}</span>
                                <button
                                    onClick={() => setFontSize(prev => Math.min(prev + 1, 30))}
                                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pink-500 hover:bg-pink-500/20 transition-all font-bold text-lg"
                                >
                                    +
                                </button>
                            </div>
                            <input
                                type="range"
                                min="8"
                                max="30"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full accent-pink-500 mt-2 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Templates Section (Moved up) */}
            <div className="py-4 px-4 sm:px-6 bg-gradient-to-b from-black/20 to-transparent z-20">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-['Playfair_Display'] font-bold text-pink-100">Templates</h2>
                        <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-bold">Choose your archetype</span>
                    </div>
                    <button
                        onClick={() => setShowAllTemplates(true)}
                        className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-pink-400 text-[9px] font-black uppercase tracking-widest hover:bg-pink-500/10 transition-all active:scale-95"
                    >
                        View All
                    </button>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
                    {TEMPLATES.map((tmpl) => (
                        <motion.div
                            key={tmpl.id}
                            whileHover={{ y: -4, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTemplate(tmpl)}
                            className={`relative flex-shrink-0 w-14 h-20 sm:w-18 sm:h-24 rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${selectedTemplate.id === tmpl.id
                                ? 'border-pink-500 z-50 ring-2 ring-pink-500/20 shadow-lg shadow-pink-500/20'
                                : 'border-white/5 opacity-50 hover:opacity-100'
                                }`}
                        >
                            <img src={tmpl.url} alt={tmpl.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </motion.div>
                    ))}
                </div>
            </div>


            {/* Main Preview Component */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-6 z-10 overflow-hidden relative" style={{ perspective: '1200px' }}>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedTemplate.id}
                        initial={{ opacity: 0, scale: 0.9, rotateY: -15, rotateX: 5 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.9, rotateY: 15, rotateX: -5 }}
                        whileHover={{ rotateY: -2, rotateX: 2, scale: 1.01 }}
                        transition={{ duration: 0.6, type: 'spring', damping: 25 }}
                        className="relative w-full aspect-[1/1.4] max-w-[300px] sm:max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/20 transform-gpu"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <img
                            src={selectedTemplate.url}
                            alt={selectedTemplate.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />



                        <div className="absolute inset-0 px-6 sm:px-12 pt-16 sm:pt-24 pb-12 sm:pb-16 overflow-y-auto custom-scrollbar group z-0">
                            <div className="flex flex-col min-h-full justify-center py-4">
                                {isEditing ? (
                                    <textarea
                                        ref={textareaRef}
                                        value={letterContent}
                                        onChange={(e) => setLetterContent(e.target.value)}
                                        autoFocus
                                        className="w-full bg-transparent outline-none resize-none text-center overflow-hidden"
                                        style={{
                                            color: fontColor.hex,
                                            fontFamily: fontStyle.family,
                                            fontSize: `${fontSize}px`,
                                            lineHeight: '1.7',
                                            padding: '0',
                                            minHeight: '100px'
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
                                            lineHeight: '1.7',
                                            textAlign: 'center',
                                            whiteSpace: 'pre-wrap',
                                            width: '100%',
                                            cursor: 'text',
                                            padding: '2rem 0'
                                        }}
                                        className="transition-all duration-500 ease-in-out relative group"
                                    >
                                        {letterContent}
                                        <div className="absolute top-0 -right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-500/10 text-pink-500 p-2 rounded-full backdrop-blur-md border border-pink-500/20">
                                            <IoPencil size={14} />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>


                    </motion.div>
                </AnimatePresence>
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
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
        </div>
    );
};

export default LetterSampleViewer;
