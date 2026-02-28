import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import {
  IoMusicalNotes, IoPersonCircleOutline, IoInformationCircle, IoClose, IoPerson,
  IoMusicalNote, IoSparkles, IoWalletOutline, IoPersonOutline,
  IoCreateOutline, IoOptionsOutline, IoPaperPlaneOutline, IoPulseOutline
} from "react-icons/io5";
import {
  FiChevronLeft, FiPlay, FiPause, FiClock, FiCheckCircle, FiChevronRight, FiMusic
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
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut"
        }}
        className="w-1 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]"
      />
    ))}
  </div>
);

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

  // Story Playback State
  const [playingStoryId, setPlayingStoryId] = useState(null);
  const [storyProgress, setStoryProgress] = useState({});
  const storyAudioRef = useRef(null);

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
      setPlayingStoryId(story.id);
      audio.src = story.url;
      audio.play().catch(e => console.log("Story play blocked", e));
    }
  };

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

  const audioStories = [
    {
      id: 1,
      title: "Midnight Confession",
      genre: "Lo-Fi chill",
      duration: "4:07",
      url: "https://res.cloudinary.com/df5jbm55b/video/upload/v1771829244/%E0%A4%A4%E0%A5%87%E0%A4%B0%E0%A5%87_%E0%A4%A8%E0%A4%BE%E0%A4%AE_%E0%A4%95%E0%A5%80_%E0%A4%A7%E0%A5%81%E0%A4%A8_1_bmy4os.mp3"
    },
    {
      id: 2,
      title: "Proposal",
      genre: "Romance",
      duration: "4:17",
      url: "https://res.cloudinary.com/df5jbm55b/video/upload/v1771829244/%E0%A4%A4%E0%A5%87%E0%A4%B0%E0%A5%87_%E0%A4%A8%E0%A4%BE%E0%A4%AE_%E0%A4%95%E0%A5%80_%E0%A4%A7%E0%A5%81%E0%A4%A8_1_bmy4os.mp3"
    }
  ];

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
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-playfair font-bold text-white/90">Premium Samples</h3>
            <SimpleVisualizer isActive={playingStoryId !== null} />
          </div>

          <div className="space-y-4">
            {audioStories.map((story) => (
              <motion.div
                key={story.id}
                className={`relative overflow-hidden rounded-[2.5rem] bg-white/[0.04] border transition-all duration-500 ${playingStoryId === story.id ? 'border-pink-500/40 shadow-[0_0_30px_rgba(236,72,153,0.1)]' : 'border-white/10'
                  }`}
              >
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-black/40">
                        <VideoAnimation isPlaying={playingStoryId === story.id} src={songBgVideo} />
                        <button
                          onClick={() => toggleStory(story)}
                          className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-all text-white"
                        >
                          {playingStoryId === story.id ? <FiPause size={20} /> : <FiPlay size={20} className="ml-1" />}
                        </button>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm group-hover:text-pink-400 transition-colors uppercase tracking-tight">{story.title}</h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{story.genre}</p>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-white/20">{story.duration}</div>
                  </div>

                  {playingStoryId === story.id && (
                    <div className="px-2 pb-2">
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                          style={{ width: `${storyProgress[story.id] || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

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
