import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import {
  IoMusicalNotes, IoPersonCircleOutline, IoInformationCircle, IoClose, IoPerson,
  IoMusicalNote, IoSparkles, IoWalletOutline, IoPersonOutline,
  IoCreateOutline, IoOptionsOutline, IoPaperPlaneOutline, IoPulseOutline,
  IoPlayCircle, IoPauseCircle
} from "react-icons/io5";
import {
  FiChevronLeft, FiPlay, FiPause, FiClock, FiCheckCircle, FiChevronRight, FiMusic,
  FiShuffle, FiSkipBack, FiRewind, FiFastForward, FiSkipForward, FiRepeat
} from "react-icons/fi";
import { FaRegHeart, FaMusic } from 'react-icons/fa';

import api from "../../../utils/api";
import { useUserId } from "../../../hooks/useUserId";
import SongStepProgress from "./SongStepProgress";
import songGirl from "../../../assets/images/song-girl.png";
import songBgVideo from "../../../assets/song/bg.mp4";
import songsIcon from "../../../assets/services/songs.png";

// Premium Visualizer Component
const SimpleVisualizer = ({ isActive }) => (
  <div className="flex items-center gap-1 h-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        animate={isActive ? {
          height: [4, 16, 8, 14, 4],
        } : { height: 4 }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut",
        }}
        className="w-0.5 bg-pink-500 rounded-full"
      />
    ))}
  </div>
);

// New Rotating Wave Visualizer for the Disc
const DiscVisualizer = ({ isPlaying }) => {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer Pulse Rings */}
      <AnimatePresence>
        {isPlaying && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.4, opacity: [0, 0.4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-pink-400/30"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: [0, 0.2, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
              className="absolute inset-0 rounded-full border border-purple-500/30"
            />
          </>
        )}
      </AnimatePresence>

      {/* Rotating Disc */}
      <motion.div
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="w-36 h-36 rounded-full relative overflow-hidden p-1 bg-gradient-to-br from-pink-500/20 to-purple-500/20 shadow-[0_0_30px_rgba(236,72,153,0.2)]"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-400 via-purple-500 to-pink-600 flex items-center justify-center relative overflow-hidden p-0.5">
          {/* Inner Record Texture */}
          <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center relative">
            <div className="w-full h-full rounded-full border-[10px] border-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                <IoMusicalNote className="text-white text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Static Visualizer Bars around disc */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-[125%] h-[125%] pointer-events-none opacity-40">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <AnimatePresence>
            {[...Array(48)].map((_, i) => (
              <motion.rect
                key={i}
                x="49"
                y="0"
                width="2"
                height={isPlaying ? Math.random() * 8 + 4 : 4}
                fill="url(#grad)"
                rx="1"
                transform={`rotate(${i * (360 / 48)} 50 50)`}
                animate={isPlaying ? {
                  height: [4, 12, 6, 10, 4],
                } : { height: 4 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  );
};

// Controlled Video Component to sync with playback
const VideoAnimation = ({ isPlaying, src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => { });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      className="w-full h-full object-cover transition-opacity duration-700 opacity-80"
    />
  );
};

export default function SongIzhaarInfo() {
  const navigate = useNavigate();
  const userId = useUserId();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  // Carousel and Story State
  const [activeIndex, setActiveIndex] = useState(0);
  const storyAudioRef = useRef(null);
  const [playingStoryId, setPlayingStoryId] = useState(null);
  const [storyProgress, setStoryProgress] = useState({});

  const audioStories = [
    {
      id: 1,
      title: "Midnight Confession",
      genre: "Lo-Fi chill",
      duration: "4:07",
      provider: "AI",
      url: "https://res.cloudinary.com/df5jbm55b/video/upload/v1771829244/%E0%A4%A4%E0%A5%87%E0%A4%B0%E0%A5%87_%E0%A4%A8%E0%A4%BE%E0%A4%AE_%E0%A4%95%E0%A5%80_%E0%A4%A7%E0%A5%81%E0%A4%A8_1_bmy4os.mp3"
    },
    {
      id: 2,
      title: "Enchanted Garden",
      genre: "Orchestral",
      duration: "4:07",
      provider: "AI",
      url: "https://res.cloudinary.com/df5jbm55b/video/upload/v1771829244/%E0%A4%A4%E0%A5%87%E0%A4%B0%E0%A5%87_%E0%A4%A8%E0%A4%BE%E0%A4%AE_%E0%A4%95%E0%A5%80_%E0%A4%A7%E0%A5%81%E0%A4%A8_1_bmy4os.mp3"
    },
    {
      id: 3,
      title: "Moonlit Waltz",
      genre: "Romance",
      duration: "4:07",
      provider: "AI",
      url: "https://res.cloudinary.com/df5jbm55b/video/upload/v1771829244/%E0%A4%A4%E0%A5%87%E0%A4%B0%E0%A5%87_%E0%A4%A8%E0%A4%BE%E0%A4%AE_%E0%A4%95%E0%A5%80_%E0%A4%A7%E0%A5%81%E0%A4%A8_1_bmy4os.mp3"
    },
    {
      id: 4,
      title: "Silent Promises",
      genre: "Acoustic",
      duration: "4:07",
      provider: "AI",
      url: "https://res.cloudinary.com/df5jbm55b/video/upload/v1771829244/%E0%A4%A4%E0%A5%87%E0%A4%B0%E0%A5%87_%E0%A4%A8%E0%A4%BE%E0%A4%AE_%E0%A4%95%E0%A5%80_%E0%A4%A7%E0%A5%81%E0%A4%A8_1_bmy4os.mp3"
    },
    {
      id: 5,
      title: "Eternal Echo",
      genre: "Cinematic",
      duration: "4:07",
      provider: "AI",
      url: "https://res.cloudinary.com/df5jbm55b/video/upload/v1771829244/%E0%A4%A4%E0%A5%87%E0%A4%B0%E0%A5%87_%E0%A4%A8%E0%A4%BE%E0%A4%AE_%E0%A4%95%E0%A5%80_%E0%A4%A7%E0%A5%81%E0%A4%A8_1_bmy4os.mp3"
    }
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/music/requests");
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStory = (story) => {
    const audio = storyAudioRef.current;
    if (!audio) return;

    if (playingStoryId === story.id) {
      audio.pause();
      setPlayingStoryId(null);
    } else {
      setActiveIndex(audioStories.findIndex(s => s.id === story.id));
      setPlayingStoryId(story.id);
      audio.src = story.url;
      audio.play().catch(e => console.log("Story play blocked", e));
    }
  };

  // Stop music when swapping songs
  useEffect(() => {
    const audio = storyAudioRef.current;
    if (audio && playingStoryId !== null) {
      audio.pause();
      setPlayingStoryId(null);
    }
  }, [activeIndex]);

  useEffect(() => {
    const audio = storyAudioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (playingStoryId && audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setStoryProgress(prev => ({ ...prev, [playingStoryId]: progress }));
      }
    };

    const handleEnded = () => {
      setPlayingStoryId(null);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playingStoryId]);

  const handleStatusCheck = () => {
    navigate("/user/song/list");
  };

  const handleGenerate = () => {
    navigate('/user/song/create');
  };

  const handleTrackSong = (req) => {
    navigate("/user/song/preview", {
      state: { requestId: req.id, ...req }
    });
  };


  const getReceiverName = (req) => {
    let details = req.details;
    if (typeof details === 'string') {
      try { details = JSON.parse(details); } catch (e) { }
    }
    const r = details?.receiver;
    return r?.receiverName || r?.name || "Special Someone";
  };

  const pendingRequests = requests.filter(r => r.status !== 'COMPLETED');
  const finishedRequests = requests.filter(r => r.status === 'COMPLETED');

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#070709]">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full font-outfit text-white relative pb-10 overflow-x-hidden overflow-y-auto"
      style={{ background: 'linear-gradient(168deg, #090810 0%, #150D32 49.55%, #1D0B2E 99.09%)' }}
    >
      <audio ref={storyAudioRef} preload="auto" />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[60%] bg-purple-900/30 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[60%] bg-pink-900/20 blur-[150px] rounded-full" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-outfit { font-family: 'Outfit', sans-serif !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Premium Header - Relative matching LetterIzhaar style */}
      <header className="relative z-50 flex flex-col items-center pt-4 pb-2">
        <div className="w-full max-w-xl flex items-center justify-between px-6 mb-2">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/user/dashboard")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 shadow-lg backdrop-blur-md"
          >
            <FiChevronLeft size={22} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInfoModal(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-pink-500/30 bg-gradient-to-tr from-pink-600 to-purple-600 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
          >
            <span className="text-white font-serif italic font-bold select-none">i</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-xl px-2"
        >
          <SongStepProgress currentStep={0} />
        </motion.div>
      </header>

      <div className="relative z-10 pt-4 pb-12 px-6 flex flex-col items-center max-w-lg mx-auto">

        {/* PREMIUM HERO SECTION */}
        <div className="text-center w-full mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative inline-block mb-6 px-8"
          >
            {/* Decorative Ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse" />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <img
                src={songGirl}
                alt="Artist"
                className="w-56 h-auto drop-shadow-[0_0_35px_rgba(236,72,153,0.3)] transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl font-playfair font-black bg-gradient-to-r from-white via-pink-200 to-pink-400 bg-clip-text text-transparent leading-tight"
          >
            Musical Izhaar
          </motion.h1>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] mt-3">Personalized AI Creation</p>
        </div>

        {/* MAIN CTA BUTTONS */}
        <div className="w-full flex flex-col gap-4 mb-10 px-4">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(183,32,153,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            className="relative w-full h-14 rounded-full overflow-hidden bg-gradient-to-r from-pink-600 via-[#B72099] to-purple-600 p-[1px] shadow-2xl group"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-full h-full flex items-center justify-center gap-3 bg-black/10 rounded-full font-black text-[11px] tracking-[0.2em] uppercase">
              <IoSparkles className="text-pink-200 animate-pulse" size={18} />
              <span>Create Your Song</span>
              <motion.div
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg]"
              />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStatusCheck}
            className="w-full h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-lg flex items-center justify-center gap-3 font-bold text-[10px] tracking-[0.2em] uppercase text-white/70"
          >
            <FiMusic className="text-pink-400" />
            My Creations
          </motion.button>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />



        {/* LISTEN TO SAMPLES SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full space-y-12 mt-12 overflow-hidden"
        >
          {/* Animated Header Section */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center gap-2 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500">Listen Sample Songs</span>
            </motion.div>

            <motion.h3
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-playfair font-black text-center text-white italic"
            >
              Musical Love Stories
            </motion.h3>
          </div>

          <div className="relative flex justify-center items-center h-[460px] mt-4">
            <div className="relative w-full h-full flex items-center justify-center">
              {audioStories.map((story, idx) => {
                const isActive = activeIndex === idx;
                const isPlaying = playingStoryId === story.id;

                return (
                  <motion.div
                    key={story.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.x > 50 && activeIndex > 0) setActiveIndex(activeIndex - 1);
                      if (info.offset.x < -50 && activeIndex < audioStories.length - 1) setActiveIndex(activeIndex + 1);
                    }}
                    animate={{
                      scale: isActive ? 1 : 0.85,
                      opacity: isActive ? 1 : 0.4,
                      x: (idx - activeIndex) * (window.innerWidth < 768 ? 240 : 340), // Closer cards to see the 'list'
                      zIndex: isActive ? 40 : 20 - Math.abs(idx - activeIndex),
                      rotateY: isActive ? 0 : (idx < activeIndex ? 20 : -20),
                      filter: isActive ? "blur(0px)" : "blur(1px)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => setActiveIndex(idx)}
                    className={`absolute w-[280px] md:w-[320px] rounded-[3.5rem] transition-all duration-700 p-6 flex flex-col items-center gap-5 backdrop-blur-3xl overflow-hidden ${isActive
                      ? "bg-white/[0.04] border border-white/20 shadow-[0_60px_120px_-30px_rgba(236,72,153,0.2)]"
                      : "bg-transparent border border-white/5 grayscale cursor-pointer"
                      }`}
                  >
                    {/* Top Row */}
                    <div className="w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/50">
                      <div>Lyrics & Vocals by : <span className="text-white">AI</span></div>
                      <div className="px-3 py-1 bg-black/40 rounded-full border border-white/5 text-white/80">
                        {story.genre}
                      </div>
                    </div>

                    {/* Central Rotating Disc */}
                    <DiscVisualizer isPlaying={isPlaying} />

                    {/* Bottom Info & Controls */}
                    <div className="w-full space-y-4">
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-white tracking-wide leading-tight">{story.title}</h4>
                        <p className="text-[10px] text-white/30 uppercase tracking-[2px] mt-0.5">{story.genre}</p>
                      </div>

                      {/* Custom Progress Bar */}
                      <div className="w-full space-y-2">
                        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                            style={{ width: `${storyProgress[story.id] || 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[8px] font-black text-white/20 tracking-tighter">
                          <span>0:00</span>
                          <span>{story.duration}</span>
                        </div>
                      </div>

                      {/* Main Controls */}
                      <div className="flex justify-between items-center px-1">
                        <FiShuffle className="text-white/30 cursor-pointer hover:text-pink-400 transition-colors" size={16} />
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                          <FiSkipBack
                            onClick={(e) => { e.stopPropagation(); if (activeIndex > 0) setActiveIndex(activeIndex - 1); }}
                            className="text-white/60 cursor-pointer hover:text-white" size={22}
                          />
                        </motion.div>
                        <FiRewind className="text-white/60 cursor-pointer hover:text-white" size={18} />

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStory(story);
                          }}
                          className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.4)] group relative"
                        >
                          <div className="absolute inset-0.5 rounded-full bg-black/10 group-hover:bg-transparent transition-all" />
                          <div className="relative z-10 text-white">
                            {isPlaying ? <IoPauseCircle size={44} /> : <IoPlayCircle size={44} />}
                          </div>
                        </motion.button>

                        <FiFastForward className="text-white/60 cursor-pointer hover:text-white" size={18} />
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                          <FiSkipForward
                            onClick={(e) => { e.stopPropagation(); if (activeIndex < audioStories.length - 1) setActiveIndex(activeIndex + 1); }}
                            className="text-white/60 cursor-pointer hover:text-white" size={22}
                          />
                        </motion.div>
                        <FiRepeat className="text-white/30 cursor-pointer hover:text-pink-500 transition-colors" size={16} />
                      </div>
                    </div>

                    {/* Background Ambient Glow */}
                    {isActive && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-purple-500/5 blur-[80px] -z-10" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* DOTS INDICATOR - To see the full list progress */}
          <div className="flex justify-center items-center gap-3 mt-4 mb-2">
            {audioStories.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${activeIndex === idx
                  ? "w-8 bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                  : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>

          <p className="text-center text-[8px] text-white/30 uppercase tracking-[0.3em] font-black">
            Swipe or use dots to explore list
          </p>
        </motion.div>

      </div>

      <ToastContainer />

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#0D0B1F] border border-white/20 rounded-[2.5rem] p-8 relative overflow-hidden active:shadow-pink-500/20"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-playfair font-bold italic text-pink-400">Creation Path</h3>
                <button onClick={() => setShowInfoModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <IoClose size={28} />
                </button>
              </div>

              <div className="space-y-6">
                {[
                  { num: "01", label: "CREATE", desc: "Share your story and feelings for unique lyrics & melody." },
                  { num: "02", label: "PAYMENT", desc: "Secure your slot for a personalized AI musical creation." },
                  { num: "03", label: "GET SONG", desc: "AI produces high-quality vocals and cinematic production." },
                  { num: "04", label: "RECEIVER", desc: "Add details of the special person receiving this Izhaar." },
                  { num: "05", label: "SEND", desc: "Deliver your musical legacy safely to your loved one." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 group/item">
                    <div className="mt-1 w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-[10px] font-black text-pink-500 group-hover/item:bg-pink-500 group-hover/item:text-white transition-all">
                      {item.num}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white tracking-widest">{item.label}</p>
                      <p className="text-[11px] text-white/40 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="mt-10 w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 font-bold tracking-[0.2em] text-[10px] uppercase shadow-xl active:scale-95 transition-all"
              >
                Let’s Begin 🎵
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
