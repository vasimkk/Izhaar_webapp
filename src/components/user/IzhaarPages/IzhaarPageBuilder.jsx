import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiHeart, HiCamera, HiSparkles, HiChevronRight, HiChevronLeft, HiTrash, HiCheck, HiPlay, HiStar, HiMicrophone, HiArrowLeft, HiPhotograph, HiMusicNote, HiCheckCircle, HiShare } from 'react-icons/hi';
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import UserLayout from '../Dashboard/UserLayout';
import api from '../../../utils/api';
import { generateIzhaarPageMagic } from '../../../utils/aiSuggestionService';

const templates = [
    { id: 'proposal', label: 'Proposal 💍', color: 'from-pink-500 to-rose-700', icon: '💍' },
    { id: 'birthday', label: 'Birthday 🎂', color: 'from-yellow-400 to-orange-600', icon: '🎂' },
    { id: 'anniversary', label: 'Anniversary 🌹', color: 'from-red-500 to-purple-800', icon: '🌹' },
    { id: 'sorry', label: 'Sorry 🙏', color: 'from-blue-400 to-indigo-600', icon: '🙏' },
    { id: 'surprise', label: 'Surprise 🎁', color: 'from-purple-400 to-pink-600', icon: '🎁' },
];

const themes = [
    { id: 'Rose', color: '#ff4d6d', bg: 'bg-rose-50', style: 'romantic' },
    { id: 'Modern', color: '#d4af37', bg: 'bg-amber-50', style: 'modern' },
    { id: 'Midnight', color: '#0f172a', bg: 'bg-slate-950', style: 'midnight' },
];

const dummyPages = [
    { id: '1', title: 'Eternal Promise', type: 'PROPOSAL', user: 'Rohan', slug: 'demo-proposal', style: 'romantic', color: 'from-pink-500/40 to-rose-600/40' },
    { id: '2', title: 'The Golden Year', type: 'BIRTHDAY', user: 'Aisha', slug: 'demo-modern', style: 'modern', color: 'from-amber-400/40 to-orange-500/40' },
    { id: '3', title: 'Infinite Echoes', type: 'ANNIVERSARY', user: 'Vikram', slug: 'demo-midnight', style: 'midnight', color: 'from-indigo-600/40 to-purple-800/40' },
];

const IzhaarPageBuilder = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [isAiMode, setIsAiMode] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        to_name: '',
        from_name: '',
        message: '',
        music: null,
        yt_link: '',
        type: 'General',
        theme: 'Rose',
        style: 'romantic',
        photos: []
    });
    const [loading, setLoading] = useState(false);

    const handleAiMagic = async () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);
        try {
            const result = await generateIzhaarPageMagic(aiPrompt);
            if (result) {
                setFormData(prev => ({
                    ...prev,
                    title: result.title || prev.title,
                    message: result.message || prev.message,
                    theme: result.theme || prev.theme,
                    style: result.style || prev.style || 'romantic',
                    type: result.type || prev.type
                }));
                setStep(2); // Jump to details step to review
            }
        } catch (error) {
            console.error('AI Build failed:', error);
        } finally {
            setIsGenerating(false);
            setIsAiMode(false);
        }
    };
    const [publishedSlug, setPublishedSlug] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handlePublish = async () => {
        setLoading(true);
        try {
            // Simulated API call for frontend-only demonstration
            // In real scenario: const res = await api.post('/api/pages', formData);
            setTimeout(() => {
                const mockSlug = Math.random().toString(36).substring(2, 8);
                setPublishedSlug(mockSlug);
                setStep(4);
                setLoading(false);
            }, 2000);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <UserLayout showHeader={false} showBottomNav={false}>
            {/* Glassmorphic Mobile Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 z-[60] w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            <div className="min-h-screen bg-[#050505] text-white pt-16 pb-20 md:pb-8 px-4 font-['Outfit']">
                <div className="max-w-4xl mx-auto">
                    {/* Header Title */}
                    <div className="mb-10 md:mb-16 relative text-center md:text-left">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 100 }}
                            transition={{ duration: 1 }}
                            className="h-1 bg-pink-500 mb-6 mx-auto md:mx-0"
                        />
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter italic leading-none">THE SIGNATURE<br /><span className="text-pink-500">EXHIBITION</span></h1>
                        <p className="text-white/20 text-[9px] md:text-xs font-black tracking-[0.5em] uppercase mt-4">Selected Premium Masterpieces</p>
                    </div>

                    {/* Progress Bar */}
                    {step > 0 && (
                        <div className="flex gap-2 mb-10">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,145,0.8)]' : 'bg-white/10'}`} />
                            ))}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div key="step0" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                                <div className="text-left space-y-0.5 mb-4 pl-2">
                                    <h2 className="text-2xl font-black italic text-pink-500">Discover Moments</h2>
                                    <p className="text-white/40 text-[10px] font-black tracking-wide uppercase">See how others are expressing their love</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {dummyPages.map(page => (
                                        <motion.div
                                            key={page.id}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => navigate(`/p/${page.slug}`)}
                                            className="relative h-56 md:h-64 rounded-[2.5rem] overflow-hidden cursor-pointer group shadow-2xl border border-white/5"
                                        >
                                            {/* Background Image */}
                                            <img
                                                src={page.slug === 'demo-proposal' ? "/proposal_hero.png" : page.slug === 'demo-modern' ? "/birthday_hero.png" : "/sorry_hero.png"}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                                                alt={page.title}
                                            />

                                            {/* Gradient Overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-r ${page.color} mix-blend-overlay`} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                            {/* Content */}
                                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[8px] bg-pink-500/80 backdrop-blur-md px-3 py-1 rounded-full text-white font-black uppercase tracking-widest shadow-lg">
                                                            {page.type}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-[8px] text-white/80 font-black lowercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Live
                                                        </span>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                                        <HiChevronRight size={20} />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-black italic tracking-tighter text-white drop-shadow-xl">{page.title}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
                                                        <p className="text-[10px] text-white/60 font-medium uppercase tracking-[0.2em]">Crafted by {page.user}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="pt-8 max-w-sm mx-auto">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-full bg-white text-black h-16 rounded-[2rem] font-black text-lg shadow-lg hover:scale-[1.01] active:scale-95 transition-all"
                                    >
                                        CREATE YOUR OWN MOMENT
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="max-w-2xl mx-auto space-y-8">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <HiSparkles className="text-pink-500" /> Choose Your Path
                                </h2>

                                {isAiMode ? (
                                    <div className="space-y-4">
                                        <div className="bg-pink-50 rounded-3xl p-6 border-2 border-pink-100">
                                            <p className="text-sm text-pink-600 mb-4 font-medium italic">"Tell me who it's for and what the occasion is, and I'll build a personalized masterpiece for you..."</p>
                                            <textarea
                                                value={aiPrompt}
                                                onChange={(e) => setAiPrompt(e.target.value)}
                                                placeholder="e.g. A romantic apology to my wife Sarah, mentioning our first date at the beach..."
                                                className="w-full bg-white rounded-2xl p-4 border-2 border-pink-200 outline-none text-gray-700 min-h-[120px] shadow-inner"
                                            />
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={handleAiMagic}
                                                    disabled={isGenerating || !aiPrompt.trim()}
                                                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl py-4 font-bold shadow-lg shadow-pink-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {isGenerating ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Crafting Magic...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <HiMicrophone size={20} /> Build My Page
                                                        </>
                                                    )}
                                                </button>
                                                <button onClick={() => setIsAiMode(false)} className="px-6 py-4 bg-gray-100 text-gray-500 rounded-xl font-bold">Back</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setIsAiMode(true)}
                                            className="col-span-2 relative h-24 rounded-2xl overflow-hidden group transition-all p-4 flex flex-col items-center justify-center text-center border-2 border-pink-200 bg-white hover:border-pink-500 hover:shadow-lg hover:shadow-pink-100"
                                        >
                                            <div className="absolute top-0 right-0 p-2">
                                                <span className="bg-pink-500 text-white text-[7px] px-1.5 py-0.5 rounded-full font-black animate-pulse">AI MAGIC</span>
                                            </div>
                                            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 mb-1 group-hover:scale-110 transition-transform">
                                                <HiSparkles size={20} />
                                            </div>
                                            <span className="text-sm font-black text-gray-800 leading-tight">AI Magic Assistant</span>
                                        </button>

                                        <div className="col-span-2 flex items-center gap-2 py-1 uppercase text-[7px] font-black tracking-widest text-gray-300">
                                            <div className="h-px flex-1 bg-gray-200" />
                                            <span>MANUAL</span>
                                            <div className="h-px flex-1 bg-gray-200" />
                                        </div>

                                        {templates.map(tmp => (
                                            <button
                                                key={tmp.id}
                                                onClick={() => { setFormData(prev => ({ ...prev, type: tmp.id })); nextStep(); }}
                                                className={`relative h-20 rounded-xl overflow-hidden group transition-all p-2.5 flex flex-col justify-end text-left border-2 ${formData.type === tmp.id ? 'border-pink-500' : 'border-transparent'}`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${tmp.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                                                <span className="text-xl mb-0.5">{tmp.icon}</span>
                                                <span className="font-bold text-xs leading-tight text-gray-800">{tmp.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="max-w-2xl mx-auto space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <HiPhotograph className="text-pink-500" /> Fill Details
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 block">Receiver's Name</label>
                                            <input
                                                type="text"
                                                name="to_name"
                                                placeholder="Who is this for?"
                                                value={formData.to_name}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 block">Your Name (Sender)</label>
                                            <input
                                                type="text"
                                                name="from_name"
                                                placeholder="From whom?"
                                                value={formData.from_name}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 block">Hero Headline</label>
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="e.g. Will you marry me? / Happy Birthday Aisha"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 block">Personal Message</label>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            placeholder="Write your heart out..."
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    {/* Photo Upload Section */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3 block">Upload 3-8 Photos</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {formData.photos.map((src, i) => (
                                                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/10 relative group">
                                                    <img src={src} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }))}
                                                        className="absolute inset-0 bg-red-500/80 items-center justify-center hidden group-hover:flex"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.photos.length < 8 && (
                                                <label className="aspect-square rounded-lg bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 transition-colors">
                                                    <HiCamera className="text-white/20 mb-1" size={24} />
                                                    <span className="text-[8px] uppercase tracking-widest text-white/40">Add</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files);
                                                            const urls = files.map(f => URL.createObjectURL(f));
                                                            setFormData(prev => ({ ...prev, photos: [...prev.photos, ...urls].slice(0, 8) }));
                                                        }}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <button onClick={prevStep} className="flex items-center gap-1 text-white/50 px-4 py-2">
                                            <BiChevronLeft size={24} /> Back
                                        </button>
                                        <button onClick={nextStep} className="bg-pink-600 hover:bg-pink-500 px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95">
                                            Next Step
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="max-w-2xl mx-auto space-y-8">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <HiMusicNote className="text-pink-500" /> Customize Style
                                </h2>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4 block">Select Theme</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {themes.map(theme => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setFormData(prev => ({ ...prev, theme: theme.id }))}
                                                className={`flex flex-col items-center gap-2 transition-transform active:scale-90 ${formData.theme === theme.id ? 'scale-110' : 'opacity-50'}`}
                                            >
                                                <div className={`w-12 h-12 rounded-full border-2 ${formData.theme === theme.id ? 'border-pink-500' : 'border-transparent'}`} style={{ backgroundColor: theme.color }} />
                                                <span className="text-[10px] whitespace-nowrap">{theme.id}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 block">Background Music or Media</label>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="music_url"
                                                placeholder="YouTube URL or Direct MP3 Link"
                                                value={formData.music_url}
                                                onChange={handleInputChange}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-px bg-white/10 flex-1" />
                                            <span className="text-[10px] uppercase font-bold text-white/20">OR</span>
                                            <div className="h-px bg-white/10 flex-1" />
                                        </div>
                                        <label className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-pink-500/50 transition-colors group">
                                            <HiMusicNote className="text-white/20 group-hover:text-pink-500 transition-colors" size={20} />
                                            <span className="text-sm font-medium text-white/60">Upload MP3 from Gallery</span>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const url = URL.createObjectURL(file);
                                                        setFormData(prev => ({ ...prev, music_url: url }));
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-[10px] text-white/30 mt-3 leading-relaxed">
                                        Supported: YouTube links, Direct .mp3 files, or upload from your device.
                                    </p>
                                </div>

                                <div className="pt-10 space-y-4">
                                    <button
                                        onClick={handlePublish}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-pink-600 to-rose-700 h-14 rounded-2xl font-black tracking-widest text-lg shadow-[0_10px_30px_rgba(225,29,72,0.3)] flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>PUBLISH & GET LINK <HiCheckCircle /></>
                                        )}
                                    </button>
                                    <button onClick={prevStep} className="w-full py-3 text-white/40 text-sm font-medium">
                                        Go back to details
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="flex flex-col items-center gap-6 p-8 bg-white/5 border border-white/10 rounded-3xl text-center">
                                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                                        <HiCheck size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2 lowercase">izhaarLove from {formData.to_name}</h2>
                                        <p className="text-white/40 text-sm">Your moment is live. Share it with {formData.to_name} now.</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8 mt-8">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-500 mb-2">Sharable Link</p>
                                    <div className="text-sm font-mono bg-black/40 p-4 rounded-xl border border-white/5 mb-4 select-all">
                                        izhaarlove.com/p/{publishedSlug}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`https://izhaarlove.com/p/${publishedSlug}`);
                                                alert("Link copied!");
                                            }}
                                            className="flex-1 bg-white/10 hover:bg-white/20 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                                        >
                                            Copy <HiShare />
                                        </button>
                                        <button className="flex-1 bg-[#25D366] py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                                            WhatsApp
                                        </button>
                                    </div>
                                </div>

                                <button onClick={() => navigate('/user/dashboard')} className="text-white/40 border-b border-white/10 pb-1 text-sm font-bold tracking-widest uppercase">
                                    Back to Dashboard
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                input::placeholder, textarea::placeholder {
                    color: rgba(255,255,255,0.2);
                }
            `}</style>
        </UserLayout>
    );
};

export default IzhaarPageBuilder;
