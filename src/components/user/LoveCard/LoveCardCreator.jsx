import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IoChevronBack,
    IoDownloadOutline,
    IoSparklesOutline,
    IoHeartOutline,
    IoCreateOutline,
    IoImageOutline,
    IoColorPaletteOutline
} from 'react-icons/io5';
import html2canvas from 'html2canvas';

const PhotoSlot = ({ index, image, onTrigger, className = "" }) => (
    <div
        onClick={() => onTrigger(index)}
        className={`relative cursor-pointer group/photo overflow-hidden border-2 border-dashed border-red-200 aspect-square flex items-center justify-center bg-red-50/30 hover:bg-red-50 transition-all ${className}`}
    >
        {image ? (
            <>
                <img src={image} alt="Memory" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                    <IoImageOutline className="text-white" size={20} />
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center gap-1">
                <IoImageOutline className="text-red-300" size={16} />
                <span className="text-[8px] font-bold text-red-300 uppercase letter-spacing-widest">Add Photo</span>
            </div>
        )}
    </div>
);

const EditableText = ({ value, onChange, className, multiline = false }) => {
    return (
        <div className="relative group/text w-full">
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full bg-transparent border-none outline-none resize-none px-1 focus:ring-1 focus:ring-red-200 rounded transition-all text-center ${className}`}
                    rows={3}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full bg-transparent border-none outline-none px-1 focus:ring-1 focus:ring-red-200 rounded transition-all text-center ${className}`}
                />
            )}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/text:opacity-100 transition-opacity">
                <IoCreateOutline className="text-red-400" size={12} />
            </div>
        </div>
    );
};

const CardPreview = ({ cardData, cardRef, setCardData, isBulkEditing, triggerUpload }) => {
    const { theme, to, subTitle, from, message, header, images } = cardData;

    // --- HEART COLLAGE THEME ---
    if (theme === 'sweetheart_collage') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#FFEAEF] flex flex-col items-center relative overflow-hidden shadow-2xl p-6 md:p-8">
                <div className="absolute top-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-white/30 rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-[20%] left-[-10%] w-64 h-64 bg-white/30 rounded-full blur-3xl opacity-60" />
                </div>

                <div className="z-10 w-full mb-4 pt-4">
                    <EditableText
                        value={to}
                        onChange={(val) => setCardData(prev => ({ ...prev, to: val }))}
                        className={`text-[26px] font-['Playfair_Display'] font-black text-[#D32F2F] leading-none mb-1 italic ${isBulkEditing ? 'bg-white/40 ring-1 ring-red-500/20' : ''}`}
                    />
                    <EditableText
                        value={subTitle}
                        onChange={(val) => setCardData(prev => ({ ...prev, subTitle: val }))}
                        className={`text-[20px] font-['Playfair_Display'] font-bold text-[#D32F2F] leading-none italic opacity-90 ${isBulkEditing ? 'bg-white/40 ring-1 ring-red-500/20' : ''}`}
                    />
                </div>

                <div className="relative z-10 w-full max-w-[320px] aspect-[1.1/1] grid grid-cols-5 grid-rows-4 gap-1 p-2">
                    <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="col-start-2 rounded-xl border-white rotate-[-5deg]" />
                    <PhotoSlot index={1} image={images[1]} onTrigger={triggerUpload} className="col-start-4 rounded-xl border-white rotate-[5deg]" />
                    <PhotoSlot index={2} image={images[2]} onTrigger={triggerUpload} className="col-start-1 row-start-2 rounded-xl border-white rotate-[-3deg]" />
                    <PhotoSlot index={3} image={images[3]} onTrigger={triggerUpload} className="col-start-2 row-start-2 rounded-xl border-white z-10 scale-110" />
                    <PhotoSlot index={4} image={images[4]} onTrigger={triggerUpload} className="col-start-3 row-start-2 rounded-xl border-white rotate-[2deg]" />
                    <PhotoSlot index={5} image={images[5]} onTrigger={triggerUpload} className="col-start-4 row-start-2 rounded-xl border-white z-10 scale-110" />
                    <PhotoSlot index={6} image={images[6]} onTrigger={triggerUpload} className="col-start-5 row-start-2 rounded-xl border-white rotate-[3deg]" />
                    <PhotoSlot index={7} image={images[7]} onTrigger={triggerUpload} className="col-start-2 row-start-3 rounded-xl border-white z-10 scale-105" />
                    <PhotoSlot index={8} image={images[8]} onTrigger={triggerUpload} className="col-start-3 row-start-3 rounded-xl border-white rotate-[-2deg]" />
                    <PhotoSlot index={9} image={images[9]} onTrigger={triggerUpload} className="col-start-4 row-start-3 rounded-xl border-white z-10 scale-105" />
                    <PhotoSlot index={10} image={images[10]} onTrigger={triggerUpload} className="col-start-3 row-start-4 rounded-xl border-white rotate-[5deg]" />
                    <div className="absolute top-[10%] left-0 text-red-500 opacity-80 animate-bounce"><IoHeartOutline size={20} /></div>
                    <div className="absolute top-[5%] right-4 text-red-500 opacity-80 animate-pulse"><IoHeartOutline size={18} /></div>
                    <div className="absolute bottom-[20%] right-[-5px] text-red-500 opacity-80"><IoHeartOutline size={24} /></div>
                </div>

                <div className="mt-auto w-full z-10 flex flex-col items-center">
                    <div className="w-full px-4 mb-4">
                        <EditableText
                            value={message}
                            onChange={(val) => setCardData(prev => ({ ...prev, message: val }))}
                            multiline
                            className={`text-[13px] font-['Playfair_Display'] font-bold text-[#424242] italic leading-tight ${isBulkEditing ? 'bg-white/40 ring-1 ring-red-500/20' : ''}`}
                        />
                    </div>
                    <div className="w-full flex justify-end pr-8">
                        <div className="flex flex-col items-end">
                            <EditableText
                                value={header || 'With Love,'}
                                onChange={(val) => setCardData(prev => ({ ...prev, header: val }))}
                                className={`text-[9px] font-black uppercase tracking-widest text-[#BDBDBD] text-right ${isBulkEditing ? 'bg-white/40 ring-1 ring-red-500/20' : ''}`}
                            />
                            <EditableText
                                value={from}
                                onChange={(val) => setCardData(prev => ({ ...prev, from: val }))}
                                className={`text-[16px] font-['Playfair_Display'] font-black text-[#D32F2F] italic ${isBulkEditing ? 'bg-white/40 ring-1 ring-red-500/20' : ''}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- POP-UP PASSION THEME (3D Hearts & Masked Photo) ---
    if (theme === 'pop_up_love') {
        return (
            <div ref={cardRef} className="w-full h-full bg-white flex flex-col items-center relative overflow-hidden shadow-2xl p-0 font-poppins">
                {/* Aesthetic Pink Slants */}
                <div className="absolute top-0 right-0 w-full h-[30%] bg-[#FFD1D9] transform -skew-y-6 origin-top-right transition-all" />
                <div className="absolute bottom-0 left-0 w-full h-[15%] bg-[#FFF0F2] transform skew-y-3 origin-bottom-left" />

                {/* Decorative 3D Elements */}
                <div className="absolute top-10 right-10 z-20 text-pink-400 rotate-12 drop-shadow-md animate-bounce"><IoHeartOutline size={40} className="fill-pink-200" /></div>
                <div className="absolute top-[15%] left-10 z-20 text-red-500 -rotate-12 drop-shadow-md"><IoHeartOutline size={30} className="fill-red-500" /></div>

                {/* Modern Frame Slot */}
                <div className="relative z-10 w-[85%] aspect-[1.2/1] mt-16 mb-8 shadow-2xl group transition-all">
                    <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none rounded-sm transition-transform duration-700" />
                    {/* Overlapping 'Love' Decoration - Fully Editable directly on card! */}
                    <div className="absolute -left-10 bottom-4 z-30">
                        <EditableText
                            value={to}
                            onChange={(val) => setCardData(prev => ({ ...prev, to: val }))}
                            className={`text-[100px] leading-none font-['Playball'] text-red-500 drop-shadow-2xl italic ${isBulkEditing ? 'ring-2 ring-red-500/30' : ''}`}
                        />
                    </div>
                </div>

                {/* Subtitle Ribbon */}
                <div className="z-20 w-[60%] bg-[#26C6DA] py-2 px-4 shadow-lg transform rotate-[-2deg] mb-6">
                    <EditableText
                        value={subTitle}
                        onChange={(val) => setCardData(prev => ({ ...prev, subTitle: val }))}
                        className={`text-white text-[14px] font-medium tracking-tight italic ${isBulkEditing ? 'bg-black/10' : ''}`}
                    />
                </div>

                {/* Content Section */}
                <div className="z-20 w-full px-12 text-center space-y-3">
                    <EditableText
                        value={message}
                        onChange={(val) => setCardData(prev => ({ ...prev, message: val }))}
                        multiline
                        className={`text-[12px] text-[#555] leading-relaxed font-medium ${isBulkEditing ? 'bg-pink-50 ring-1 ring-pink-500/20' : ''}`}
                    />
                    <div className="h-[1px] w-20 bg-pink-100 mx-auto" />
                    <div className="flex flex-col items-center">
                        <EditableText
                            value={header || 'izhaar studio'}
                            onChange={(val) => setCardData(prev => ({ ...prev, header: val }))}
                            className={`text-[8px] font-black tracking-[0.3em] text-pink-300 uppercase ${isBulkEditing ? 'bg-pink-50' : ''}`}
                        />
                        <EditableText
                            value={from}
                            onChange={(val) => setCardData(prev => ({ ...prev, from: val }))}
                            className={`text-[10px] text-gray-400 hover:text-pink-500 transition-colors ${isBulkEditing ? 'bg-pink-50' : ''}`}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // --- MIDNIGHT POLAROIDS THEME ---
    if (theme === 'polaroid_night') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#001f3f] flex flex-col items-center relative overflow-hidden shadow-2xl p-8 font-poppins">
                {/* Pinstripe Texture */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 20px)' }} />

                {/* Scattering Hearts */}
                <div className="absolute top-10 left-10 text-orange-400 rotate-12"><IoHeartOutline size={20} className="fill-orange-400" /></div>
                <div className="absolute bottom-40 right-10 text-orange-400 -rotate-12"><IoHeartOutline size={28} className="fill-orange-400" /></div>
                <div className="absolute top-1/2 left-5 text-orange-400 rotate-45"><IoHeartOutline size={16} className="fill-orange-400" /></div>

                <div className="w-full flex flex-col md:flex-row gap-8 items-center h-full">
                    {/* Quote Side */}
                    <div className="flex-1 space-y-6 z-10 text-left">
                        <EditableText
                            value={message}
                            onChange={(val) => setCardData(prev => ({ ...prev, message: val }))}
                            multiline
                            className={`text-white text-lg font-light leading-snug text-left tracking-tight border-none hover:bg-white/5 ${isBulkEditing ? 'bg-white/10 ring-1 ring-white/20' : ''}`}
                        />
                        <div className="space-y-4">
                            <EditableText
                                value={subTitle}
                                onChange={(val) => setCardData(prev => ({ ...prev, subTitle: val }))}
                                className={`text-3xl font-['Playball'] text-white drop-shadow-lg text-left ${isBulkEditing ? 'bg-white/10' : ''}`}
                            />
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-orange-400" />
                                <div className="h-[1px] w-12 bg-white/20" />
                            </div>
                        </div>
                    </div>

                    {/* Polaroid Side */}
                    <div className="flex-1 relative h-[80%] flex items-center justify-center">
                        {/* Polaroid 1 */}
                        <div className="absolute top-0 rotate-[-8deg] bg-white p-2 pb-10 shadow-xl w-[140px] transform group hover:rotate-0 transition-all duration-500">
                            <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full aspect-square border-none" />
                            <div className="mt-4 text-center">
                                <EditableText
                                    value={to}
                                    onChange={(val) => setCardData(prev => ({ ...prev, to: val }))}
                                    className={`text-orange-500 font-bold text-sm tracking-widest uppercase border-none ${isBulkEditing ? 'bg-orange-50 ring-1 ring-orange-200' : ''}`}
                                />
                            </div>
                        </div>
                        {/* Polaroid 2 */}
                        <div className="absolute bottom-0 rotate-[6deg] bg-white p-2 pb-10 shadow-xl w-[140px] group hover:rotate-0 transition-all duration-500 z-10">
                            <PhotoSlot index={1} image={images[1]} onTrigger={triggerUpload} className="w-full aspect-square border-none" />
                            <div className="mt-4 text-center">
                                <EditableText
                                    value={from}
                                    onChange={(val) => setCardData(prev => ({ ...prev, from: val }))}
                                    className={`text-orange-500 font-bold text-sm tracking-widest uppercase border-none ${isBulkEditing ? 'bg-orange-50 ring-1 ring-orange-200' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- BIRTHDAY BLISS THEME ---
    if (theme === 'birthday_heart') {
        return (
            <div ref={cardRef} className="w-full h-full bg-gradient-to-br from-red-500 to-pink-600 flex flex-col items-center relative overflow-hidden shadow-2xl p-8 text-white font-poppins text-center">
                {/* Decorative Balloons/Hearts */}
                <div className="absolute top-[-20px] left-[-20px] text-white/20 rotate-12"><IoHeartOutline size={120} className="fill-white/10" /></div>
                <div className="absolute top-10 right-10 text-yellow-300 animate-bounce"><IoSparklesOutline size={30} /></div>
                <div className="absolute bottom-10 left-10 text-white/40"><IoHeartOutline size={40} className="fill-white/20" /></div>

                <div className="z-10 mt-10 mb-6 flex flex-col items-center w-full">
                    <EditableText
                        value={header || 'HAPPY BIRTHDAY'}
                        onChange={(val) => setCardData(prev => ({ ...prev, header: val }))}
                        className={`text-[12px] font-black tracking-[0.5em] text-white/80 uppercase ${isBulkEditing ? 'bg-white/10' : ''}`}
                    />
                    <EditableText
                        value={to}
                        onChange={(val) => setCardData(prev => ({ ...prev, to: val }))}
                        className={`text-4xl font-['Playfair_Display'] font-black mt-2 drop-shadow-lg italic ${isBulkEditing ? 'bg-white/10' : ''}`}
                    />
                </div>

                <div className="relative z-10 w-[70%] aspect-square rounded-full border-8 border-white/20 overflow-hidden shadow-2xl group transition-transform hover:scale-105 duration-500 shrink-0">
                    <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                </div>

                <div className="z-10 mt-auto mb-8 space-y-4 w-full flex flex-col items-center">
                    <EditableText
                        value={message}
                        onChange={(val) => setCardData(prev => ({ ...prev, message: val }))}
                        multiline
                        className={`text-lg font-['Playball'] text-white drop-shadow-md leading-tight ${isBulkEditing ? 'bg-white/10' : ''}`}
                    />
                    <div className="flex flex-col items-center w-full">
                        <EditableText
                            value={subTitle || 'With all my love,'}
                            onChange={(val) => setCardData(prev => ({ ...prev, subTitle: val }))}
                            className={`text-[10px] font-bold tracking-widest text-white/60 uppercase ${isBulkEditing ? 'bg-white/10' : ''}`}
                        />
                        <EditableText
                            value={from}
                            onChange={(val) => setCardData(prev => ({ ...prev, from: val }))}
                            className={`text-2xl font-['Playball'] text-yellow-300 mt-1 drop-shadow-md ${isBulkEditing ? 'bg-white/10' : ''}`}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={cardRef} className="w-full h-full bg-white flex flex-col items-center justify-center p-12 shadow-2xl relative">
            <div className="text-center space-y-4">
                <IoHeartOutline className="text-pink-500 mx-auto animate-pulse" size={48} />
                <h2 className="text-3xl font-serif italic text-gray-800">Classic Theme</h2>
                <p className="text-gray-400 text-sm">Tap on the themes below to start Designing!</p>
            </div>
        </div>
    );
};

const LoveCardCreator = () => {
    const navigate = useNavigate();
    const cardRef = useRef(null);
    const fileInputRef = useRef(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState(null);

    const [view, setView] = useState('samples');
    const [isDownloading, setIsDownloading] = useState(false);

    const [cardData, setCardData] = useState({
        to: 'To My Sweetheart',
        subTitle: 'the Light of My Life',
        from: 'Your Love',
        message: 'You are my heart, my home, my everything.',
        header: '',
        images: Array(12).fill(null),
        theme: 'sweetheart_collage',
    });

    const [isBulkEditing, setIsBulkEditing] = useState(false);

    const samples = [
        {
            id: 'sweetheart_collage',
            name: 'Heart Collage',
            description: '12-Photo Heart Shape',
            previewColor: 'from-pink-400 to-red-500',
            icon: '❤️'
        },
        {
            id: 'pop_up_love',
            name: 'Pop-up Passion',
            description: '3D Hearts & Modern Art',
            previewColor: 'from-white to-pink-100',
            icon: '☁️'
        },
        {
            id: 'polaroid_night',
            name: 'Midnight Polaroids',
            description: 'Deep Blue & Duo Frames',
            previewColor: 'from-[#001f3f] to-[#003366]',
            icon: '📸'
        },
        {
            id: 'birthday_heart',
            name: 'Birthday Bliss',
            description: 'Balloons & Single Photo',
            previewColor: 'from-red-500 to-pink-600',
            icon: '🎈'
        },
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && activePhotoIndex !== null) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImages = [...cardData.images];
                newImages[activePhotoIndex] = reader.result;
                setCardData(prev => ({ ...prev, images: newImages }));
                e.target.value = "";
                setActivePhotoIndex(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpload = useCallback((index) => {
        setActivePhotoIndex(index);
        fileInputRef.current.click();
    }, []);

    const downloadCard = async () => {
        if (cardRef.current) {
            try {
                setIsDownloading(true);
                const canvas = await html2canvas(cardRef.current, {
                    scale: 4,
                    useCORS: true,
                    backgroundColor: '#fff',
                });
                const link = document.createElement('a');
                link.download = `Izhaar-Love-Card-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png', 1.0);
                link.click();
            } catch (err) {
                console.error('Failed to download card:', err);
            } finally {
                setIsDownloading(false);
            }
        }
    };

    return (
        <div className="h-screen bg-[#0a0a0f] text-white flex flex-col font-poppins relative overflow-hidden">
            <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,#311b92_0%,#0a0a0f_100%)] opacity-30" />

            <header className="relative z-50 p-4 backdrop-blur-3xl bg-black/40 border-b border-white/5 flex items-center justify-between shrink-0">
                <button
                    onClick={() => view === 'samples' ? navigate('/user/dashboard') : setView('samples')}
                    className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-95 text-white/50 hover:text-white"
                >
                    <IoChevronBack size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <IoHeartOutline className="text-pink-500" size={18} />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase">Love Studio</span>
                    </div>
                </div>
                <button
                    onClick={downloadCard}
                    disabled={isDownloading || view === 'samples'}
                    className={`px-6 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2x transition-all flex items-center gap-2 ${isDownloading || view === 'samples' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    {isDownloading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <IoDownloadOutline size={16} />
                    )}
                    {isDownloading ? 'Saving...' : 'Save Card'}
                </button>
            </header>

            <AnimatePresence mode="wait">
                {view === 'samples' ? (
                    <motion.main
                        key="samples"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex-1 overflow-y-auto px-6 py-12 relative z-10 flex flex-col items-center"
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-serif italic text-white/90 mb-4 px-4 leading-tight">Pick Your Layout</h2>
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Customize your romantic greeting</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
                            {samples.map((sample) => (
                                <motion.div
                                    key={sample.id}
                                    whileHover={{ y: -10 }}
                                    onClick={() => {
                                        setCardData({ ...cardData, theme: sample.id });
                                        setView('editor');
                                    }}
                                    className="group cursor-pointer"
                                >
                                    <div className={`aspect-[4/5] rounded-[3rem] bg-gradient-to-br ${sample.previewColor} p-px relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all`}>
                                        <div className="absolute inset-px bg-[#0a0a0f] rounded-[3rem] overflow-hidden flex flex-col items-center justify-center">
                                            <div className="text-7xl group-hover:scale-110 transition-all duration-700 filter drop-shadow-[0_0_20px_rgba(236,72,153,0.3)]">{sample.icon}</div>
                                            <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                                <h4 className="font-black text-[13px] text-white uppercase tracking-widest mb-2">{sample.name}</h4>
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{sample.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.main>
                ) : (
                    <motion.main
                        key="editor"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 relative z-10 flex flex-col items-center p-4 md:p-12 overflow-y-auto"
                    >
                        <div className="mb-6 flex flex-col items-center gap-2 shrink-0">
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-xl">
                                <IoSparklesOutline className="text-pink-500" size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isBulkEditing ? 'Edit everything directly' : 'Scroll to see more'}</span>
                            </div>
                        </div>

                        {/* Large Scrollable Card Frame */}
                        <div className="relative w-full max-w-[350px] md:max-w-[420px] aspect-[4/6] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 mb-40 shrink-0 origin-top bg-white">
                            <CardPreview
                                cardData={cardData}
                                cardRef={cardRef}
                                setCardData={setCardData}
                                isBulkEditing={isBulkEditing}
                                triggerUpload={triggerUpload}
                            />
                        </div>

                        {/* Bottom Spacer for Palette */}
                        <div className="h-20 shrink-0" />

                        {/* Bulk Edit Toggle - Now Direct on Card! */}
                        <motion.button
                            onClick={() => setIsBulkEditing(!isBulkEditing)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`fixed bottom-32 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border-4 border-white transition-all ${isBulkEditing ? 'bg-pink-600 scale-110' : 'bg-gray-800'}`}
                        >
                            <IoCreateOutline size={24} color="white" />
                            {isBulkEditing && <span className="absolute -top-1 -right-1 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500"></span></span>}
                        </motion.button>

                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-3xl border border-white/10 px-6 py-4 rounded-full shadow-2xl z-50">
                            <IoColorPaletteOutline className="text-pink-500" size={20} />
                            <div className="h-6 w-px bg-white/10" />
                            {samples.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setCardData({ ...cardData, theme: s.id })}
                                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center text-sm ${cardData.theme === s.id ? 'border-pink-500 scale-110 bg-pink-500/10' : 'border-white/10 scale-90 opacity-40 hover:opacity-100'}`}
                                >
                                    {s.icon}
                                </button>
                            ))}
                        </div>
                    </motion.main>
                )}
            </AnimatePresence>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
            />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playball&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Poppins:wght@300;400;600;700;900&display=swap');
                .font-poppins { font-family: 'Poppins', sans-serif; }
            `}</style>
        </div>
    );
};

export default LoveCardCreator;
