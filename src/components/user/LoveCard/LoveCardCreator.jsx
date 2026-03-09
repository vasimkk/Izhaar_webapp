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
        className={`relative cursor-pointer group/photo overflow-hidden border-2 border-dashed border-red-200 aspect-square flex items-center justify-center bg-red-50/30 hover:bg-red-50 transition-all min-w-0 ${className}`}
    >
        <div className="absolute inset-0 w-full h-full">
            {image ? (
                <>
                    <img
                        src={image}
                        alt="Memory"
                        className="w-full h-full object-cover pointer-events-none"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                        <IoImageOutline className="text-white" size={20} />
                    </div>
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <IoImageOutline className="text-red-300" size={16} />
                    <span className="text-[8px] font-bold text-red-300 uppercase tracking-widest px-1 text-center">Add Photo</span>
                </div>
            )}
        </div>
    </div>
);

const EditableText = ({ value, onChange, className, multiline = false }) => {
    return (
        <div className="relative group/text w-full">
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full bg-transparent border-none outline-none resize-none px-4 focus:ring-1 focus:ring-red-200 rounded transition-all text-center overflow-hidden break-words leading-tight ${className}`}
                    rows={3}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full bg-transparent border-none outline-none px-4 focus:ring-1 focus:ring-red-200 rounded transition-all text-center ${className}`}
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
            <div ref={cardRef} className="w-full h-full bg-[#FFEAEF] flex flex-col items-center relative overflow-hidden shadow-2xl p-6 md:p-8 pb-10">
                <div className="absolute top-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-white/30 rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-[20%] left-[-10%] w-64 h-64 bg-white/30 rounded-full blur-3xl opacity-60" />
                </div>

                <div className="z-10 w-full mb-2 pt-2 flex flex-col items-center">
                    <EditableText
                        value={to}
                        onChange={(val) => setCardData(prev => ({ ...prev, to: val }))}
                        className={`text-[20px] md:text-[24px] font-['Playfair_Display'] font-black text-[#D32F2F] leading-snug italic ${isBulkEditing ? 'bg-white/40 ring-1 ring-red-500/20' : ''}`}
                    />
                    <EditableText
                        value={subTitle}
                        onChange={(val) => setCardData(prev => ({ ...prev, subTitle: val }))}
                        className={`text-[14px] md:text-[18px] font-['Playfair_Display'] font-bold text-[#D32F2F] leading-snug italic opacity-90 ${isBulkEditing ? 'bg-white/40 ring-1 ring-red-500/20' : ''}`}
                    />
                </div>

                <div className="relative z-10 w-full max-w-[300px] md:max-w-[340px] aspect-[1.1/1] mx-auto grid grid-cols-5 grid-rows-4 gap-1 p-1 shrink-0">
                    <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="col-start-2 rounded-xl border-white rotate-[-5deg] shadow-sm" />
                    <PhotoSlot index={1} image={images[1]} onTrigger={triggerUpload} className="col-start-4 rounded-xl border-white rotate-[5deg] shadow-sm" />
                    <PhotoSlot index={2} image={images[2]} onTrigger={triggerUpload} className="col-start-1 row-start-2 rounded-xl border-white rotate-[-3deg] shadow-sm" />
                    <PhotoSlot index={3} image={images[3]} onTrigger={triggerUpload} className="col-start-2 row-start-2 rounded-xl border-white z-10 scale-110 shadow-md" />
                    <PhotoSlot index={4} image={images[4]} onTrigger={triggerUpload} className="col-start-3 row-start-2 rounded-xl border-white rotate-[2deg] shadow-sm" />
                    <PhotoSlot index={5} image={images[5]} onTrigger={triggerUpload} className="col-start-4 row-start-2 rounded-xl border-white z-10 scale-110 shadow-md" />
                    <PhotoSlot index={6} image={images[6]} onTrigger={triggerUpload} className="col-start-5 row-start-2 rounded-xl border-white rotate-[3deg] shadow-sm" />
                    <PhotoSlot index={7} image={images[7]} onTrigger={triggerUpload} className="col-start-2 row-start-3 rounded-xl border-white z-10 scale-105 shadow-md" />
                    <PhotoSlot index={8} image={images[8]} onTrigger={triggerUpload} className="col-start-3 row-start-3 rounded-xl border-white rotate-[-2deg] shadow-sm" />
                    <PhotoSlot index={9} image={images[9]} onTrigger={triggerUpload} className="col-start-4 row-start-3 rounded-xl border-white z-10 scale-105 shadow-md" />
                    <PhotoSlot index={10} image={images[10]} onTrigger={triggerUpload} className="col-start-3 row-start-4 rounded-xl border-white rotate-[5deg] shadow-sm" />
                    <div className="absolute top-[10%] left-0 text-red-500 opacity-60 animate-bounce"><IoHeartOutline size={20} /></div>
                    <div className="absolute top-[5%] right-4 text-red-500 opacity-60 animate-pulse"><IoHeartOutline size={18} /></div>
                    <div className="absolute bottom-[20%] right-[-5px] text-red-500 opacity-60"><IoHeartOutline size={24} /></div>
                </div>

                <div className="mt-auto w-full z-10 flex flex-col items-center pb-2">
                    <div className="w-full px-4 mb-2">
                        <EditableText
                            value={message}
                            onChange={(val) => setCardData(prev => ({ ...prev, message: val }))}
                            multiline
                            className={`text-[12px] font-['Playfair_Display'] font-bold text-[#424242] italic leading-tight ${isBulkEditing ? 'bg-white/40 ring-1 ring-red-500/20' : ''}`}
                        />
                    </div>
                    <div className="w-full flex justify-end pr-8">
                        <div className="flex flex-col items-end">
                            <EditableText
                                value={header || 'With Love,'}
                                onChange={(val) => setCardData(prev => ({ ...prev, header: val }))}
                                className={`text-[8px] font-black uppercase tracking-widest text-[#BDBDBD] text-right ${isBulkEditing ? 'bg-white/40 ring-1 ring-red-500/20' : ''}`}
                            />
                            <EditableText
                                value={from}
                                onChange={(val) => setCardData(prev => ({ ...prev, from: val }))}
                                className={`text-[15px] font-['Playfair_Display'] font-black text-[#D32F2F] italic ${isBulkEditing ? 'bg-white/40 ring-1 ring-red-500/20' : ''}`}
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
                <div className="relative z-10 w-[85%] aspect-[1.2/1] mt-16 mb-8 shadow-[0_20px_50px_rgba(255,182,193,0.5)] group transition-all border-4 border-white rounded-2xl p-1 bg-white">
                    <div className="w-full h-full rounded-xl overflow-hidden">
                        <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                    </div>
                    {/* Overlapping 'Love' Decoration - Fully Editable! */}
                    <div className="absolute -left-10 bottom-4 z-30 w-max max-w-[120%] h-auto">
                        <EditableText
                            value={to}
                            onChange={(val) => setCardData(prev => ({ ...prev, to: val }))}
                            className={`text-[80px] leading-none font-['Playball'] text-red-500 drop-shadow-2xl italic select-none pointer-events-auto ${isBulkEditing ? 'ring-2 ring-red-500/30' : ''}`}
                        />
                    </div>
                </div>

                {/* Subtitle Ribbon */}
                <div className="z-20 w-[70%] bg-[#26C6DA] py-2 px-4 shadow-lg transform rotate-[-2deg] mb-6">
                    <EditableText
                        value={subTitle}
                        onChange={(val) => setCardData(prev => ({ ...prev, subTitle: val }))}
                        className={`text-white text-[16px] md:text-[18px] font-bold tracking-tight italic ${isBulkEditing ? 'bg-black/10' : ''}`}
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

                <div className="w-full flex-1 flex flex-col items-center justify-center py-4 overflow-hidden space-y-4">
                    {/* Quote Side */}
                    <div className="w-full z-10 text-center px-4">
                        <div className="w-full max-w-[280px] mx-auto">
                            <EditableText
                                value={message}
                                onChange={(val) => setCardData(prev => ({ ...prev, message: val }))}
                                multiline
                                className={`text-white text-[13px] md:text-sm font-light leading-relaxed text-center tracking-normal border-none hover:bg-white/5 ${isBulkEditing ? 'bg-white/10 ring-1 ring-white/20' : ''}`}
                            />
                        </div>
                        <div className="mt-2 space-y-1">
                            <EditableText
                                value={subTitle}
                                onChange={(val) => setCardData(prev => ({ ...prev, subTitle: val }))}
                                className={`text-xl md:text-2xl font-['Playball'] text-white drop-shadow-lg text-center ${isBulkEditing ? 'bg-white/10' : ''}`}
                            />
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                                <div className="h-[1px] w-8 bg-white/20" />
                            </div>
                        </div>
                    </div>

                    {/* Polaroid Side */}
                    <div className="w-full md:flex-1 relative min-h-[300px] md:h-full flex items-center justify-center mt-8 md:mt-0">
                        {/* Polaroid 1 */}
                        <div className="absolute top-0 md:top-10 rotate-[-8deg] bg-white p-2 pb-10 shadow-xl w-[130px] md:w-[150px] transform group hover:rotate-0 transition-all duration-500">
                            <div className="w-full aspect-square overflow-hidden bg-gray-100">
                                <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                            </div>
                            <div className="mt-4 text-center">
                                <EditableText
                                    value={to}
                                    onChange={(val) => setCardData(prev => ({ ...prev, to: val }))}
                                    className={`text-orange-500 font-bold text-sm tracking-widest uppercase border-none ${isBulkEditing ? 'bg-orange-50 ring-1 ring-orange-200' : ''}`}
                                />
                            </div>
                        </div>
                        {/* Polaroid 2 */}
                        <div className="absolute bottom-0 md:bottom-10 rotate-[6deg] bg-white p-2 pb-10 shadow-xl w-[130px] md:w-[150px] group hover:rotate-0 transition-all duration-500 z-10">
                            <div className="w-full aspect-square overflow-hidden bg-gray-100">
                                <PhotoSlot index={1} image={images[1]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                            </div>
                            <div className="mt-4 text-center">
                                <EditableText
                                    value={from}
                                    onChange={(val) => setCardData(prev => ({ ...prev, from: val }))}
                                    className={`text-sm font-bold text-orange-500 tracking-widest uppercase border-none ${isBulkEditing ? 'bg-orange-50 ring-1 ring-orange-200' : ''}`}
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

                <div className="relative z-10 w-[70%] aspect-square mx-auto group shrink-0">
                    <div className="absolute inset-[-12px] rounded-full border-4 border-dashed border-white/30 animate-spin-slow pointer-events-none" />
                    <div className="absolute inset-[-4px] rounded-full border-2 border-white/60 pointer-events-none" />
                    <div className="w-full h-full rounded-full border-8 border-white overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-500">
                        <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                    </div>
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

    // --- PINK BALLOONS THEME (Inspired by Image 1) ---
    if (theme === 'pink_balloons') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#FF7396] flex flex-col items-center relative overflow-hidden shadow-2xl p-6 font-poppins text-center">
                {/* Decorative Elements */}
                <div className="absolute top-10 left-4 text-white/40 rotate-12"><IoHeartOutline size={60} className="fill-white/10" /></div>
                <div className="absolute top-1/2 right-[-20px] text-white/30 -rotate-12"><IoHeartOutline size={100} className="fill-white/10" /></div>

                {/* Floating Clouds */}
                <div className="absolute bottom-0 left-[-10%] w-40 h-20 bg-white/20 rounded-full blur-xl" />
                <div className="absolute bottom-[-10px] right-[-5%] w-48 h-24 bg-white/30 rounded-full blur-lg" />

                <div className="z-10 w-full mb-6 mt-4">
                    <EditableText
                        value={to}
                        onChange={(val) => setCardData(prev => ({ ...prev, to: val }))}
                        className={`text-3xl font-['Playball'] text-white drop-shadow-md ${isBulkEditing ? 'bg-white/10' : ''}`}
                    />
                    <EditableText
                        value={subTitle}
                        onChange={(val) => setCardData(prev => ({ ...prev, subTitle: val }))}
                        className={`text-[12px] font-bold text-white/80 tracking-widest uppercase mt-1 ${isBulkEditing ? 'bg-white/10' : ''}`}
                    />
                </div>

                <div className="relative z-10 w-[75%] aspect-square mx-auto mb-8 shrink-0">
                    <div className="absolute inset-[-8px] bg-white/30 rounded-full blur-md" />
                    <div className="relative w-full h-full rounded-full border-[10px] border-white/60 overflow-hidden shadow-[0_15px_35px_rgba(255,115,150,0.4)] p-1.5 bg-white/20">
                        <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none rounded-full" />
                    </div>
                </div>

                {/* Big Heart for Message */}
                <div className="relative z-10 w-full mt-auto mb-4">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <IoHeartOutline size={200} className="fill-red-600 text-red-600" />
                    </div>
                    <div className="relative p-6 space-y-2">
                        <EditableText
                            value={header || 'I Love You'}
                            onChange={(val) => setCardData(prev => ({ ...prev, header: val }))}
                            className={`text-xl font-black text-white ${isBulkEditing ? 'bg-white/10' : ''}`}
                        />
                        <EditableText
                            value={message}
                            onChange={(val) => setCardData(prev => ({ ...prev, message: val }))}
                            multiline
                            className={`text-sm italic text-white leading-tight px-6 ${isBulkEditing ? 'bg-white/10' : ''}`}
                        />
                        <EditableText
                            value={from}
                            onChange={(val) => setCardData(prev => ({ ...prev, from: val }))}
                            className={`text-[12px] font-bold text-white uppercase tracking-widest pt-2 ${isBulkEditing ? 'bg-white/10' : ''}`}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // --- RUSTIC FRAME THEME (Inspired by Image 2) ---
    if (theme === 'rustic_frame') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#f4f1ea] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl p-12 font-serif italic text-gray-800">
                {/* Wooden Style Background Texture */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #8b4513 0, #8b4513 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />

                {/* Scattered Decorative Hearts */}
                <div className="absolute top-[10%] right-[15%] text-red-500/40 rotate-12"><IoHeartOutline size={24} className="fill-red-500/20" /></div>
                <div className="absolute bottom-[20%] left-[10%] text-red-500/40 -rotate-12"><IoHeartOutline size={32} className="fill-red-500/20" /></div>

                {/* The "Physical" Frame */}
                <div className="relative z-10 w-[90%] aspect-[4/5] bg-white p-5 shadow-[0_30px_60px_rgba(0,0,0,0.2)] border-[14px] border-white ring-1 ring-stone-200 transform rotate-[-1deg] flex flex-col">
                    <div className="w-full h-[75%] overflow-hidden relative group border border-stone-100 p-0.5 bg-stone-50">
                        <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none transition-all duration-700 hover:scale-110" />
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none" />
                    </div>
                    <div className="w-full h-[25%] flex flex-col items-center justify-center px-2 space-y-1 mt-3">
                        <EditableText
                            value={to || 'I Love You'}
                            onChange={(val) => setCardData(prev => ({ ...prev, to: val }))}
                            className={`text-xl font-bold text-gray-800 font-['Playball'] ${isBulkEditing ? 'bg-gray-50' : ''}`}
                        />
                        <EditableText
                            value={message}
                            onChange={(val) => setCardData(prev => ({ ...prev, message: val }))}
                            multiline
                            className={`text-[10px] text-gray-600 leading-relaxed font-sans italic px-2 ${isBulkEditing ? 'bg-gray-50' : ''}`}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // --- LOVE ADVENTURE THEME (Inspired by Image 3) ---
    if (theme === 'love_adventure') {
        return (
            <div ref={cardRef} className="w-full h-full bg-white flex flex-col items-center relative overflow-hidden shadow-2xl p-8 font-poppins text-center">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 text-[80px] font-black text-pink-500 pointer-events-none overflow-hidden select-none" style={{ lineHeight: '80px', wordBreak: 'break-all' }}>
                    LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE LOVE
                </div>

                {/* Hot Air Balloon SVG Decoration */}
                <div className="absolute top-4 left-4 text-pink-500 transform scale-x-[-1] opacity-80">
                    <IoSparklesOutline size={30} className="animate-pulse" />
                </div>

                {/* Illustrative Icons */}
                <div className="absolute top-10 right-8 text-pink-400"><IoHeartOutline size={40} className="fill-pink-100" /></div>

                <div className="relative z-10 w-full aspect-[4/5] mt-12 mb-6 group">
                    <div className="absolute inset-[-15px] border-4 border-dashed border-pink-200 rounded-3xl" />
                    <div className="absolute top-[-20px] left-[-20px] text-pink-500 rotate-[-15deg]"><IoHeartOutline size={40} className="fill-pink-500" /></div>
                    <div className="absolute bottom-[-20px] right-[-20px] text-indigo-500 rotate-[15deg]"><IoHeartOutline size={30} className="fill-indigo-500" /></div>
                    <div className="relative w-full h-full border-8 border-white shadow-[0_20px_40px_rgba(255,182,193,0.3)] overflow-hidden rounded-2xl bg-white p-2">
                        <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none rounded-xl" />
                    </div>
                </div>

                <div className="z-10 flex flex-col items-center w-full mt-auto">
                    <EditableText
                        value={header || 'I Love You'}
                        onChange={(val) => setCardData(prev => ({ ...prev, header: val }))}
                        className={`text-6xl font-['Playball'] text-indigo-900 leading-none ${isBulkEditing ? 'bg-indigo-50/50' : ''}`}
                    />
                    <EditableText
                        value={message}
                        onChange={(val) => setCardData(prev => ({ ...prev, message: val }))}
                        multiline
                        className={`text-[12px] text-indigo-700 font-medium px-4 mt-2 ${isBulkEditing ? 'bg-indigo-50/50' : ''}`}
                    />
                    <EditableText
                        value={from || 'COUPLE NAME HERE'}
                        onChange={(val) => setCardData(prev => ({ ...prev, from: val }))}
                        className={`text-[16px] font-black text-red-500 uppercase tracking-widest mt-4 ${isBulkEditing ? 'bg-red-50' : ''}`}
                    />
                </div>
            </div>
        );
    }


    // --- GOLDEN LUXURY ---
    if (theme === 'golden_luxury') {
        return (
            <div ref={cardRef} className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden shadow-2xl p-10 text-[#D4AF37] border-[1px] border-[#D4AF37]/30">
                <div className="absolute inset-4 border border-[#D4AF37]/20 pointer-events-none" />
                <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#D4AF37]/50 m-6" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#D4AF37]/50 m-6" />
                <div className="z-10 text-center space-y-8">
                    <EditableText value={header || 'ETERNAL'} onChange={(v) => setCardData(p => ({ ...p, header: v }))} className="tracking-[0.5em] text-[10px] font-black uppercase" />
                    <div className="w-44 h-44 mx-auto border-2 border-[#D4AF37] p-1.5 transform rotate-45 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                        <div className="w-full h-full border border-[#D4AF37]/40 p-1 transform overflow-hidden bg-black">
                            <div className="w-full h-full transform -rotate-45 scale-150">
                                <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                            </div>
                        </div>
                    </div>
                    <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-4xl font-serif italic tracking-tighter" />
                    <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-[12px] font-light leading-relaxed opacity-70 px-8" />
                    <div className="pt-4"><EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-sm font-bold uppercase tracking-widest" /></div>
                </div>
            </div>
        );
    }

    // --- VINTAGE NEWSPAPER ---
    if (theme === 'vintage_news') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#f8f5e1] flex flex-col p-8 font-serif text-gray-900 border-4 border-double border-gray-400">
                <div className="border-b-2 border-gray-800 pb-2 mb-4 flex justify-between items-end">
                    <div className="font-black text-2xl uppercase tracking-tighter">THE LOVE TIMES</div>
                    <div className="text-[10px] font-bold">EST. 2024 • PRICELESS</div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <EditableText value={header || 'EXTRA! EXTRA! LOVE FOUND!'} onChange={(v) => setCardData(p => ({ ...p, header: v }))} className="text-3xl font-black leading-none text-left" />
                    <div className="relative h-64 bg-stone-100 border-y-2 border-gray-800 p-2 overflow-hidden flex flex-col">
                        <div className="flex-1 w-full relative">
                            <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full grayscale border-none saturate-50 contrast-125" />
                        </div>
                        <div className="text-[9px] font-bold text-center mt-2 border-t border-gray-400 pt-1 tracking-tight">Fig 1.0: A Rare Moment of Pure Love Captured in High Fidelity</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-[11px] leading-snug divide-y text-left border-r pr-4 border-gray-300" />
                        <div className="flex flex-col justify-end text-right gap-1">
                            <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-xl font-black italic underline" />
                            <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-[10px] uppercase font-bold text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- VAPORWAVE RETRO ---
    if (theme === 'vaporwave') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#000000] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff00ff]/20 to-[#00ffff]/20" />
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)', backgroundSize: '40px 40px', perspective: '500px', transform: 'rotateX(60deg) translateY(100px)' }} />
                <div className="relative z-10 w-full text-center space-y-6">
                    <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ffff] drop-shadow-[0_0_10px_#ff00ff]" />
                    <div className="w-[85%] aspect-[1.4/1] mx-auto border-[10px] border-[#ff00ff] shadow-[0_0_40px_#ff00ff,inset_0_0_20px_#ff00ff] skew-x-3 p-1 bg-black">
                        <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none contrast-125 brightness-110 saturate-150" />
                    </div>
                    <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-[#00ffff] font-['Playball'] text-xl italic" />
                    <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-[#ff00ff] font-bold tracking-[0.3em] uppercase text-xs" />
                </div>
            </div>
        );
    }

    // --- MINIMALIST CHIC ---
    if (theme === 'minimal') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#fafafa] flex flex-col items-start p-16 font-sans text-stone-800">
                <div className="w-full flex justify-between items-start mb-20">
                    <EditableText value={header || '01'} onChange={(v) => setCardData(p => ({ ...p, header: v }))} className="text-4xl font-light opacity-20 border-b border-stone-800" />
                    <EditableText value={subTitle || 'MOMENT'} onChange={(v) => setCardData(p => ({ ...p, subTitle: v }))} className="text-[10px] font-bold tracking-widest rotate-90" />
                </div>
                <div className="relative w-full aspect-square bg-white mb-12 shadow-[40px_40px_0px_#f0f0f0] group">
                    <div className="absolute inset-0 border border-stone-200 group-hover:border-stone-400 transition-colors duration-500" />
                    <div className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000 p-4">
                        <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none shadow-inner" />
                    </div>
                </div>
                <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-4xl font-bold tracking-tighter mb-4 text-left" />
                <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-sm font-light leading-relaxed text-left max-w-[80%]" />
                <div className="mt-auto pt-8 border-t border-stone-200 w-full flex justify-between">
                    <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-[10px] font-black uppercase" />
                    <EditableText value="2024" onChange={() => { }} className="text-[10px] opacity-30" />
                </div>
            </div>
        );
    }

    // --- WATERCOLOR DREAM ---
    if (theme === 'watercolor') {
        return (
            <div ref={cardRef} className="w-full h-full bg-white flex flex-col items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-[-50px] left-[-30px] w-64 h-64 bg-pink-100 rounded-full blur-[80px] opacity-60" />
                <div className="absolute bottom-[-40px] right-[-20px] w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-60" />
                <div className="z-10 w-full text-center space-y-8">
                    <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-5xl font-['Playball'] text-pink-500 drop-shadow-sm" />
                    <div className="relative w-52 h-52 mx-auto">
                        <div className="absolute inset-[-10px] bg-pink-100 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-sm opacity-50" />
                        <div className="relative w-full h-full rounded-[30%_70%_70%_30%/30%_30%_70%_70%] overflow-hidden border-4 border-white shadow-[0_20px_40px_rgba(255,192,203,0.4)] rotate-3">
                            <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                        </div>
                    </div>
                    <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-stone-600 font-serif italic text-lg leading-snug px-4" />
                    <div className="flex flex-col items-center gap-1">
                        <div className="h-px w-12 bg-pink-200 mb-2" />
                        <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-stone-400 font-bold uppercase tracking-widest text-[10px]" />
                    </div>
                </div>
            </div>
        );
    }

    // --- SCRAPBOOK MOOD ---
    if (theme === 'scrapbook') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#e8e4d9] flex flex-col p-8 font-serif relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '15px 15px' }} />
                <div className="z-10 space-y-6">
                    <div className="relative inline-block px-4 py-1 bg-yellow-100 border border-yellow-200 shadow-sm rotate-[-2deg]">
                        <EditableText value={header || 'ALWAYS'} onChange={(v) => setCardData(p => ({ ...p, header: v }))} className="text-[12px] font-bold text-yellow-800" />
                    </div>
                    <div className="relative group mx-auto w-[92%] aspect-square bg-white p-3 pb-16 shadow-[0_15px_30px_rgba(0,0,0,0.1)] rotate-2 border border-stone-200 ring-4 ring-stone-100/50">
                        {/* Washi Tape Effect */}
                        <div className="absolute top-[-15px] left-[-20px] w-24 h-10 bg-pink-200/40 backdrop-blur-sm border-x border-pink-300/30 rotate-[-45deg] z-20" />
                        <div className="absolute top-[-10px] right-[-20px] w-24 h-10 bg-teal-200/40 backdrop-blur-sm border-x border-teal-300/30 rotate-[45deg] z-20" />

                        <div className="w-full h-full overflow-hidden relative">
                            <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                        </div>
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-2xl font-['Playball'] text-stone-700" />
                        </div>
                    </div>
                    <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-lg text-stone-600 px-4 leading-relaxed font-['Playball'] italic text-left" />
                    <div className="flex justify-start pl-8 pt-4">
                        <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-sm font-black text-red-700 underline decoration-wavy decoration-red-200" />
                    </div>
                </div>
            </div>
        );
    }

    // --- COSMIC LOVE ---
    if (theme === 'galaxy') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#050510] flex flex-col items-center justify-center p-12 text-blue-100 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#050510_100%)] opacity-80" />
                <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.webp")' }} />
                <div className="z-10 text-center space-y-8 w-full">
                    <div className="relative inline-block">
                        <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-4xl font-['Playfair_Display'] font-black tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] uppercase italic" />
                        <div className="absolute -top-4 -right-4 text-yellow-200 animate-spin-slow"><IoSparklesOutline size={24} /></div>
                    </div>
                    <div className="relative w-52 h-52 mx-auto group">
                        <div className="absolute inset-[-15px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse blur-2xl opacity-40" />
                        <div className="absolute inset-0 rounded-full border-2 border-white/40 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative w-full h-full rounded-full border-4 border-white overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                            <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                        </div>
                    </div>
                    <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-sm font-light italic leading-loose opacity-80 tracking-widest px-6" />
                    <div className="flex flex-col items-center gap-1 opacity-60">
                        <div className="h-[0.5px] w-20 bg-white/20 mb-2" />
                        <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-[10px] font-light uppercase tracking-[0.5em]" />
                    </div>
                </div>
            </div>
        );
    }

    // --- SUNSET GLOW ---
    if (theme === 'sunset') {
        return (
            <div ref={cardRef} className="w-full h-full bg-gradient-to-b from-[#ff5e62] to-[#ff9966] flex flex-col items-center justify-center p-12 relative overflow-hidden text-white">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-200 rounded-full blur-[100px] opacity-40" />
                <div className="z-10 text-center space-y-6 w-full">
                    <EditableText value={header || 'MOMENTS'} onChange={(v) => setCardData(p => ({ ...p, header: v }))} className="text-[10px] font-black tracking-[0.6em] text-white/60 mb-8 uppercase" />
                    <div className="relative w-full aspect-[1.1/1] rounded-3xl group shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-[12px] border-white/10 ring-1 ring-white/20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent pointer-events-none z-10" />
                        <div className="w-full h-full scale-110 group-hover:scale-100 transition-transform duration-[2s]">
                            <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                        </div>
                    </div>
                    <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-5xl font-['Playball'] drop-shadow-lg" />
                    <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-sm font-medium leading-relaxed opacity-90 px-4" />
                    <div className="pt-4 flex flex-col items-center gap-2">
                        <div className="w-8 h-px bg-white/40" />
                        <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-sm font-black italic tracking-widest" />
                    </div>
                </div>
            </div>
        );
    }

    // --- ROYAL VELVET ---
    if (theme === 'royal') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#2d0d3a] flex flex-col items-center justify-center p-14 relative overflow-hidden border-[16px] border-[#3d1d4a] shadow-inner">
                <div className="absolute inset-0 opacity-10 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, gold 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="z-10 text-center space-y-10 w-full text-gold-200">
                    <EditableText value={header || 'REGAL'} onChange={(v) => setCardData(p => ({ ...p, header: v }))} className="text-[#bf953f] text-[10px] font-black tracking-[1em] mb-4 uppercase" />
                    <div className="relative w-56 h-72 mx-auto border-[6px] border-[#bf953f] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-black">
                        {/* Ornate Inner Frame */}
                        <div className="absolute inset-1 border border-[#bf953f]/30" />
                        <div className="absolute -top-6 -left-6 w-16 h-16 border-t-[6px] border-l-[6px] border-[#bf953f]" />
                        <div className="absolute -bottom-6 -right-6 w-16 h-16 border-b-[6px] border-r-[6px] border-[#bf953f]" />
                        <div className="w-full h-full overflow-hidden shadow-inner grayscale contrast-125 saturate-50 sepia-[0.3]">
                            <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                        </div>
                    </div>
                    <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-4xl font-serif font-black italic text-[#fcf6ba] drop-shadow-md" />
                    <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-[#bf953f] text-sm font-light italic leading-loose opacity-80" />
                    <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-[#aa771c] font-black tracking-widest text-xs uppercase" />
                </div>
            </div>
        );
    }

    // --- COMIC POP ---
    if (theme === 'comic') {
        return (
            <div ref={cardRef} className="w-full h-full bg-yellow-400 flex flex-col p-6 font-black border-8 border-black shadow-[15px_15px_0_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 border-b-8 border-l-8 border-black transform rotate-12 -mr-10 -mt-10" />
                <div className="z-10 flex flex-col h-full gap-4">
                    <div className="bg-black text-white p-3 inline-block rotate-[-2deg] self-start shadow-[5px_5px_0_#ff00ff]">
                        <EditableText value={header || 'WOW!'} onChange={(v) => setCardData(p => ({ ...p, header: v }))} className="text-2xl italic tracking-tighter" />
                    </div>
                    <div className="flex-1 border-8 border-black bg-white relative group overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,1)]">
                        <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none contrast-150 saturate-150" />
                    </div>
                    <div className="bg-white border-8 border-black p-4 rotate-[1deg] shadow-[8px_8px_0_rgba(0,0,0,1)]">
                        <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-3xl italic underline decoration-blue-500 mb-2 leading-none" />
                        <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-lg leading-tight tracking-tight uppercase" />
                    </div>
                    <div className="self-end bg-pink-500 border-8 border-black p-2 rotate-[-3deg] shadow-[5px_5px_0_rgba(0,0,0,1)]">
                        <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-xl italic text-white" />
                    </div>
                </div>
            </div>
        );
    }

    // --- MARBLE BLUSH ---
    if (theme === 'marble') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#fcfcfc] flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/white-diamond-dark.webp")', backgroundRepeat: 'repeat' }} />
                <div className="absolute top-0 right-0 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl" />
                <div className="z-10 text-center space-y-6 w-full">
                    <EditableText value={header || 'ELEGANCE'} onChange={(v) => setCardData(p => ({ ...p, header: v }))} className="text-[10px] font-bold tracking-[0.8em] text-stone-300 uppercase" />
                    <div className="relative w-full h-[280px] group">
                        <div className="absolute inset-[-15px] border border-stone-200 rounded-sm opacity-50" />
                        <div className="w-full h-full bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-stone-100 flex flex-col">
                            <div className="flex-1 w-full overflow-hidden relative grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000">
                                <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]" />
                            </div>
                        </div>
                    </div>
                    <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-4xl font-serif text-stone-800 tracking-tighter" />
                    <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-sm font-light leading-relaxed text-stone-400 italic px-8" />
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-px w-8 bg-stone-200" />
                        <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-sm font-black text-pink-300 italic tracking-[0.1em]" />
                    </div>
                </div>
            </div>
        );
    }

    // --- MODERN ARCH ---
    if (theme === 'arch') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#1c1c1c] flex flex-col p-8 md:p-14 font-sans text-white relative overflow-hidden">
                <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 bg-orange-600/20 rounded-full blur-[100px]" />
                <div className="flex justify-between items-start mb-12">
                    <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-5xl font-black leading-none text-left tracking-tighter italic" />
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center shrink-0">
                        <IoHeartOutline size={24} className="fill-white" />
                    </div>
                </div>
                <div className="flex-1 flex gap-6">
                    <div className="w-2/3 mt-12 relative group">
                        <div className="absolute inset-[-10px] bg-orange-600/10 rounded-t-full -z-10 blur-sm" />
                        <div className="w-full h-full bg-stone-800 rounded-t-full overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-4 border-stone-700/50">
                            <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none brightness-90 group-hover:brightness-110 transition-all duration-700" />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-end pb-12 gap-6">
                        <EditableText value={header || 'MDRN'} onChange={(v) => setCardData(p => ({ ...p, header: v }))} className="text-[10px] font-black border-l-2 border-orange-600 pl-4 tracking-widest uppercase opacity-40" />
                        <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-sm font-medium leading-snug text-left opacity-80" />
                        <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-xl font-black italic text-orange-600 text-left" />
                    </div>
                </div>
            </div>
        );
    }

    // --- FLORAL GARDEN ---
    if (theme === 'floral') {
        return (
            <div ref={cardRef} className="w-full h-full bg-[#fffcfc] flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-2xl border-8 border-pink-50 text-stone-800">
                <div className="absolute top-0 left-0 w-32 h-32 text-pink-200 rotate-[-15deg] opacity-40"><IoSparklesOutline size={120} /></div>
                <div className="absolute bottom-[-20px] right-[-20px] w-48 h-48 bg-teal-50 rounded-full blur-[80px] opacity-60" />
                <div className="z-10 text-center space-y-6 w-full">
                    <EditableText value={header || 'FLORENCE'} onChange={(v) => setCardData(p => ({ ...p, header: v }))} className="text-[10px] font-bold tracking-[0.8em] text-stone-300 uppercase mb-4" />
                    <div className="relative w-48 h-48 mx-auto">
                        <div className="absolute inset-[-15px] border-2 border-pink-100 rounded-full animate-spin-slow opacity-60" style={{ borderStyle: 'dashed' }} />
                        <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white shadow-xl">
                            <PhotoSlot index={0} image={images[0]} onTrigger={triggerUpload} className="w-full h-full border-none" />
                        </div>
                    </div>
                    <EditableText value={to} onChange={(v) => setCardData(p => ({ ...p, to: v }))} className="text-5xl font-['Playball'] text-pink-400 italic" />
                    <EditableText value={message} onChange={(v) => setCardData(p => ({ ...p, message: v }))} multiline className="text-stone-500 font-serif text-lg leading-snug italic px-6" />
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-px w-10 bg-pink-100" />
                        <EditableText value={from} onChange={(v) => setCardData(p => ({ ...p, from: v }))} className="text-sm font-black text-pink-300 tracking-widest uppercase italic" />
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
            icon: '❤️',
            defaults: { to: 'To My Sweetheart', subTitle: 'the Light of My Life', message: 'You are my heart, my home, my everything.', from: 'Your Love', header: '' }
        },
        {
            id: 'pop_up_love',
            name: 'Pop-up Passion',
            description: '3D Hearts & Modern Art',
            previewColor: 'from-white to-pink-100',
            icon: '☁️',
            defaults: { to: 'Mon Amour', subTitle: 'Forever & Always', message: "A thousand hearts wouldn't be enough to carry all my love for you.", from: 'Love, Forever', header: 'I LOVE YOU' }
        },
        {
            id: 'polaroid_night',
            name: 'Midnight Polaroids',
            description: 'Deep Blue & Duo Frames',
            previewColor: 'from-[#001f3f] to-[#003366]',
            icon: '📸',
            defaults: { to: 'Us Two', subTitle: 'Midnight Memories', message: 'In the silence of the night, your love is the brightest star I see.', from: 'Always Yours', header: '' }
        },
        {
            id: 'birthday_heart',
            name: 'Birthday Bliss',
            description: 'Balloons & Single Photo',
            previewColor: 'from-red-500 to-pink-600',
            icon: '🎈',
            defaults: { to: 'Happy Birthday!', subTitle: 'To My Favorite Human', message: 'May your special day be as beautiful and radiant as your smile.', from: 'With All My Love', header: 'CELEBRATE' }
        },
        {
            id: 'pink_balloons',
            name: 'Pink Balloons',
            description: 'Image Style 1',
            previewColor: 'from-[#FF7396] to-[#FF4B78]',
            icon: '💖',
            defaults: { to: 'Love is in the Air', subTitle: 'Floating on Clouds', message: "Every day with you feels like a celebration. I'm so lucky to have you.", from: 'Forever Together', header: 'I LOVE YOU' }
        },
        {
            id: 'rustic_frame',
            name: 'Rustic Frame',
            description: 'Image Style 2',
            previewColor: 'from-[#f4f1ea] to-[#e4e1da]',
            icon: '🖼️',
            defaults: { to: 'Our Roots', subTitle: 'Grown in Love', message: 'Our love is simple, strong, and beautiful—just like this moment.', from: 'Eternally Yours', header: '' }
        },
        {
            id: 'love_adventure',
            name: 'Love Adventure',
            description: 'Image Style 3',
            previewColor: 'from-white to-pink-50',
            icon: '☁️',
            defaults: { to: 'Adventure Awaits', subTitle: 'Exploring Life Together', message: "I don't need a map when I'm with you. You are my destination.", from: 'Your Partner', header: 'I LOVE YOU' }
        },
        {
            id: 'golden_luxury',
            name: 'Golden Luxury',
            description: 'Elegance & Gold',
            previewColor: 'from-black to-stone-800',
            icon: '👑',
            defaults: { to: 'Royal Romance', subTitle: 'Precious & Pure', message: 'You are the greatest treasure I have ever found. Pure gold in my soul.', from: 'With Love', header: 'ETERNAL' }
        },
        {
            id: 'vintage_news',
            name: 'Retro News',
            description: 'Vintage Newspaper',
            previewColor: 'from-[#f8f5e1] to-[#e8e5d1]',
            icon: '📰',
            defaults: { to: 'Breaking News!', subTitle: 'Extra! Extra! Love Found!', message: "The search is over. I've found the person I want to spend forever with.", from: 'The Editor', header: 'THE LOVE TIMES' }
        },
        {
            id: 'vaporwave',
            name: 'Cyber Neon',
            description: '80s Vaporwave',
            previewColor: 'from-[#ff00ff] to-[#00ffff]',
            icon: '🕶️',
            defaults: { to: 'Synthetic Souls', subTitle: 'Neon Dreams', message: 'In this digital world, our love is the only thing that feels real.', from: 'Cyber Love', header: 'RETRO' }
        },
        {
            id: 'minimal',
            name: 'Minimal Chic',
            description: 'Clean & Modern',
            previewColor: 'from-[#fafafa] to-stone-100',
            icon: '◻️',
            defaults: { to: 'Only You', subTitle: 'Pure Simplicity', message: "I don't need much. Just you, and us, forever.", from: 'Simply, Me', header: '01' }
        },
        {
            id: 'watercolor',
            name: 'Water Dream',
            description: 'Soft Flowing Arts',
            previewColor: 'from-pink-100 to-blue-100',
            icon: '🎨',
            defaults: { to: 'Soft Whispers', subTitle: 'Flowing Like Water', message: 'My love for you is deep and quiet, flowing through every part of me.', from: 'Like a Dream', header: '' }
        },
        {
            id: 'scrapbook',
            name: 'Mood Diary',
            description: 'Tape & Scrapbook',
            previewColor: 'from-[#e8e4d9] to-[#d8d4c9]',
            icon: '📔',
            defaults: { to: 'Taped in My Heart', subTitle: 'Our Story', message: "I'm keeping every memory of us tucked away in my heart, forever.", from: 'Your Storyteller', header: 'ALWAYS' }
        },
        {
            id: 'galaxy',
            name: 'Cosmic Sky',
            description: 'Stars & Nebula',
            previewColor: 'from-[#050510] to-[#1e1b4b]',
            icon: '🌌',
            defaults: { to: 'Stardust Souls', subTitle: 'Across Space', message: 'Even in a galaxy of billions, my heart would always find its way back to you.', from: 'Your Lover', header: 'UNIVERSE' }
        },
        {
            id: 'sunset',
            name: 'Sunset Glow',
            description: 'Warm Summer Sky',
            previewColor: 'from-[#ff5e62] to-[#ff9966]',
            icon: '🌇',
            defaults: { to: 'Golden Hour', subTitle: 'Fading Into You', message: "There's no sunset more beautiful than the glow in your eyes.", from: 'Always yours', header: 'MOMENTS' }
        },
        {
            id: 'royal',
            name: 'Royal Velvet',
            description: 'Deep Purple & Gold',
            previewColor: 'from-[#2d0d3a] to-[#3d1d4a]',
            icon: '🏰',
            defaults: { to: 'Monarch of My Heart', subTitle: 'Magnificent Love', message: 'To the one who rules my heart with kindness and grace.', from: 'Your Loyal Love', header: 'REGAL' }
        },
        {
            id: 'comic',
            name: 'Comic Pop',
            description: 'Fun Pop Art Style',
            previewColor: 'from-yellow-400 to-pink-500',
            icon: '💥',
            defaults: { to: 'BOOM! YOU!', subTitle: 'Incredible Love', message: "You're my superhero. Every day you save me from the ordinary.", from: 'Your Fan', header: 'WOW!' }
        },
        {
            id: 'marble',
            name: 'Blush Marble',
            description: 'Sophisticated Stone',
            previewColor: 'from-[#fcfcfc] to-stone-100',
            icon: '💎',
            defaults: { to: 'Solid as Rock', subTitle: 'Elegant Eternity', message: 'Like marble, our love is timeless, strong, and built to last forever.', from: 'For Always', header: 'ELEGANCE' }
        },
        {
            id: 'arch',
            name: 'Modern Arch',
            description: 'Architectural Look',
            previewColor: 'from-[#1c1c1c] to-[#3c3c3c]',
            icon: '🏛️',
            defaults: { to: 'Architect of Love', subTitle: 'Strong & True', message: "We built this love brick by brick, and it's the strongest thing I know.", from: 'The Builder', header: 'MDRN' }
        },
        {
            id: 'floral',
            name: 'Floral Garden',
            description: 'Soft Flower Bliss',
            previewColor: 'from-[#fffcfc] to-pink-50',
            icon: '🌸',
            defaults: { to: 'Blooming Heart', subTitle: 'Spring in My Soul', message: 'You make my heart bloom with joy every single time you say my name.', from: 'Your Garden', header: 'FLORENCE' }
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

                // Wait for fonts to be ready to prevent clipping or wrong fonts in export
                await document.fonts.ready;

                // Get the actual dimensions of the card
                const element = cardRef.current;
                const width = element.offsetWidth;
                const height = element.offsetHeight;

                const canvas = await html2canvas(element, {
                    scale: 3,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null,
                    // Use fixed dimensions for the capture to ensure consistency across devices
                    windowWidth: 400,
                    onclone: (clonedDoc, clonedElement) => {
                        const style = clonedElement.style;
                        style.transform = 'none';
                        // Ensure the cloned element is correctly sized
                        style.width = '400px';
                        style.height = '600px';
                        style.position = 'relative';
                        style.overflow = 'hidden';

                        // CRITICAL: Replace all form elements (input/textarea) with static text 
                        // because html2canvas often fails to render inputs correctly across browsers
                        const inputs = clonedElement.querySelectorAll('input, textarea');
                        inputs.forEach(input => {
                            const replacement = clonedDoc.createElement('div');
                            replacement.textContent = input.value;
                            replacement.className = input.className;
                            replacement.style.whiteSpace = 'pre-wrap';
                            replacement.style.wordBreak = 'break-word';
                            // Remove textAlign override to respect theme classes (e.g., text-left)
                            replacement.style.display = 'block';
                            replacement.style.minHeight = input.offsetHeight + 'px';
                            replacement.style.background = 'transparent';
                            replacement.style.border = 'none';
                            replacement.style.padding = '0';
                            replacement.style.margin = '0 auto';
                            replacement.style.width = '100%';

                            // Remove any interaction UI
                            replacement.classList.remove('focus:ring-1', 'focus:ring-red-200');

                            input.parentNode.replaceChild(replacement, input);
                        });

                        // Fix for object-cover in html2canvas
                        const allImages = clonedElement.querySelectorAll('img');
                        allImages.forEach(img => {
                            img.style.objectFit = 'cover';
                            img.style.width = '100%';
                            img.style.height = '100%';
                            if (img.parentElement) {
                                img.parentElement.style.overflow = 'hidden';
                                img.parentElement.style.position = 'relative';
                            }
                        });

                        // Hide the floating UI elements and disable scrolling containers
                        const uiElements = clonedDoc.querySelectorAll('.fixed, button');
                        uiElements.forEach(el => {
                            if (!clonedElement.contains(el)) {
                                el.style.display = 'none';
                            }
                        });

                        // Ensure no scrollbars exist in the capture and keep fixed height
                        const scrollContainers = clonedElement.querySelectorAll('.overflow-y-auto, .overflow-x-auto');
                        scrollContainers.forEach(el => {
                            el.style.overflow = 'hidden';
                        });
                    }
                });

                const link = document.createElement('a');
                link.download = `Izhaar-Love-Card-${Date.now()}.webp`;
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
                        <div className="relative w-full flex items-center justify-center p-4">
                            <div className="relative w-full max-w-[350px] md:max-w-[420px] aspect-[4/6] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 mb-40 shrink-0 origin-top bg-white transform scale-90 sm:scale-100 transition-transform">
                                <CardPreview
                                    cardData={cardData}
                                    cardRef={cardRef}
                                    setCardData={setCardData}
                                    isBulkEditing={isBulkEditing}
                                    triggerUpload={triggerUpload}
                                />
                            </div>
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

                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-lg bg-black/90 backdrop-blur-3xl border border-white/10 p-2 rounded-full shadow-2xl z-50 flex items-center overflow-hidden">
                            <div className="pl-4 pr-3 flex items-center gap-3 border-r border-white/20 shrink-0 h-10">
                                <IoColorPaletteOutline className="text-pink-500" size={22} />
                            </div>
                            <div className="flex-1 flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-4 scroll-smooth min-w-0">
                                {samples.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            setCardData(prev => ({
                                                ...prev,
                                                theme: s.id,
                                                ...(prev.to === samples.find(samp => samp.id === prev.theme)?.defaults.to || prev.to === 'To My Sweetheart' ? s.defaults : {})
                                            }));
                                        }}
                                        className={`shrink-0 w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center text-xl ${cardData.theme === s.id ? 'border-pink-500 scale-110 bg-pink-500/15' : 'border-white/10 scale-90 opacity-40 hover:opacity-100 hover:scale-100'}`}
                                    >
                                        <span className="drop-shadow-lg">{s.icon}</span>
                                    </button>
                                ))}
                            </div>
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
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default LoveCardCreator;
