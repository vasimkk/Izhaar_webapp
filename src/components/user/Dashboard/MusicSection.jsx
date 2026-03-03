import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMusicNote, HiPlay, HiPause } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import sampleSong from "../../../assets/song/song.mp3";

const MusicSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const navigate = useNavigate();

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Reset state when song ends
    const handleEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div className="w-full px-4 md:px-8 mt-6 mb-12">
            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={sampleSong}
                onEnded={handleEnded}
            />

            {/* Heading */}
            <div className="flex items-center gap-2 mb-4">
                <HiMusicNote className="text-cyan-400 text-lg drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <h2
                    className="text-white tracking-[0.1em]"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '16px' }}
                >
                    Izhaar Music
                </h2>
            </div>

            {/* Compact Player Card */}
            <motion.div
                whileHover={{ y: -2 }}
                className="relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-2xl p-3 md:p-4 flex items-center gap-4 transition-all hover:bg-white/[0.05]"
            >
                {/* Album Art / Play Icon */}
                <div
                    onClick={togglePlay}
                    className="relative w-12 h-12 flex-shrink-0 cursor-pointer group"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl transition-transform duration-300 ${isPlaying ? 'scale-95' : 'scale-100 group-hover:scale-105'}`} />
                    <div className="absolute inset-0 flex items-center justify-center text-white text-2xl z-10">
                        {isPlaying ? <HiPause /> : <HiPlay className="ml-0.5" />}
                    </div>
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-white text-xs md:text-sm font-bold truncate mb-1">Our Story (Personalized Demo)</h3>
                    <button
                        onClick={() => navigate('/user/song')}
                        className="text-pink-500 text-[11px] md:text-xs font-black uppercase tracking-widest text-left hover:text-white transition-all flex items-center gap-1"
                    >
                        Create Your Song
                        <span className="text-[14px]">➜</span>
                    </button>
                </div>

                {/* Waveform / Visualizer (Hidden on very small screens to avoid crowding) */}
                <div className="hidden sm:flex items-end gap-0.5 h-6 px-2">
                    {[0.6, 0.4, 0.8, 0.5, 0.9, 0.3, 0.7, 0.5, 0.6, 0.4].map((h, i) => (
                        <motion.div
                            key={i}
                            animate={isPlaying ? {
                                height: ["20%", "100%", "20%"],
                            } : { height: `${h * 100}%` }}
                            transition={isPlaying ? {
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut"
                            } : { duration: 0.5 }}
                            className={`w-0.5 rounded-full ${isPlaying ? 'bg-cyan-400' : 'bg-white/10'}`}
                            style={{ height: `${h * 100}%` }}
                        />
                    ))}
                </div>

                {/* Buy Button */}
                <button
                    onClick={() => navigate('/user/song')}
                    className="hidden sm:block px-4 py-2 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest text-white transition-all"
                >
                    Order Yours
                </button>

                {/* Background Accent */}
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full pointer-events-none" />
            </motion.div>
        </div>
    );
};

export default MusicSection;
