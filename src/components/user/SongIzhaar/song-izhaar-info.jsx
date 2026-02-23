import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useUserId } from "../../../hooks/useUserId";
import api from "../../../utils/api";
import songGirl from "../../../assets/images/song-girl.png";
import { IoMusicalNotes, IoPersonCircleOutline, IoInformationCircle, IoClose, IoPerson, IoMusicalNote } from "react-icons/io5";
import { FiChevronLeft, FiPlay, FiPause } from "react-icons/fi";

export default function SongIzhaarInfo() {
  const navigate = useNavigate();
  const userId = useUserId();
  const [showInfo, setShowInfo] = useState(false);

  // Story Playback State
  const [playingStoryId, setPlayingStoryId] = useState(null);
  const [storyProgress, setStoryProgress] = useState({});
  const storyAudioRef = useRef(null);

  const stopAllStories = () => {
    if (storyAudioRef.current) {
      storyAudioRef.current.pause();
    }
    setPlayingStoryId(null);
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

  const handleGenerate = async () => {
    try {
      const res = await api.get("/razorpay/payment-status", {
        params: { userId, service: 'song' }
      });
      if (!res.data) {
        navigate('/user/song/payment-subscription', { replace: true });
        return;
      }
      const hasPayment = !!res.data.payment_amount;
      const paymentAmountNumber = Number(res.data.payment_amount);
      const creditStatus = res.data.credit_status;

      if (hasPayment && paymentAmountNumber >= 499 && creditStatus === 'SUCCESS') {
        navigate('/user/receiver', { replace: true, state: { from: '/user/song' } });
      } else {
        navigate('/user/song/payment-subscription', { replace: true });
      }
    } catch (err) {
      console.error("Payment status error:", err);
      toast.error("Could not check payment status.");
    }
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
    },
    {
      id: 3,
      title: "First Sight",
      genre: "Acoustic",
      duration: "4:58",
      url: "https://res.cloudinary.com/df5jbm55b/video/upload/v1771829244/%E0%A4%A4%E0%A5%87%E0%A4%B0%E0%A5%87_%E0%A4%A8%E0%A4%BE%E0%A4%AE_%E0%A4%95%E0%A5%80_%E0%A4%A7%E0%A5%81%E0%A4%A8_1_bmy4os.mp3"
    },
  ];

  const steps = [
    { num: "01", title: "Share Your Story", desc: "Tell us about your feelings, memories, or a special message you want to convey." },
    { num: "02", title: "AI Magic", desc: "Our AI processes your emotions to compose unique lyrics and a soulful melody." },
    { num: "03", title: "Vocals & Production", desc: "The song is recorded with high-quality AI vocals and professional-grade music production." },
    { num: "04", title: "Deliver the Love", desc: "Get a personalized link to share your musical Izhaar with that special someone." }
  ];

  return (
    <div
      className="min-h-screen w-full text-white relative overflow-x-hidden font-sans selection:bg-pink-500/30"
      style={{ background: 'var(--customize-song, linear-gradient(168deg, #090810 0%, #150D32 49.55%, #260D35 99.09%))' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Story Playback Audio */}
      <audio ref={storyAudioRef} preload="auto" />

      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/user/dashboard")}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-xl"
        >
          <FiChevronLeft size={24} />
        </motion.button>

        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInfo(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-lg cursor-pointer transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
            }}
          >
            <span className="text-white font-bold text-xl italic font-serif">i</span>
          </motion.div>
        </div>
      </header>

      <div className="relative z-10 pt-24 pb-12 px-6 flex flex-col items-center max-w-4xl mx-auto">

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h1
            className="font-playfair bg-clip-text text-transparent mb-4"
            style={{
              fontWeight: 700,
              fontSize: '32px',
              lineHeight: '100%',
              backgroundImage: 'linear-gradient(90deg, #EC4899 0%, #A855F7 100%)',
              textAlign: 'center'
            }}
          >
            Customize a song
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-sm mx-auto leading-relaxed">
            AI creates a personalized song from your story, emotions, and memories.
          </p>
        </motion.div>

        {/* Central Illustration - Decreased Size */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full max-w-[240px] md:max-w-[280px] aspect-square flex items-center justify-center mb-8"
        >
          {/* Main PNG */}
          <motion.img
            src={songGirl}
            alt="Song Girl"
            className="w-full h-auto z-10"

          />
        </motion.div>

        {/* Action Buttons */}
        {/* Action Buttons - Decreased Size */}
        <div className="w-full max-w-[280px] flex flex-col gap-4 mb-16 px-2">
          {/* Create a Song Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            className="relative w-full py-3 px-6 rounded-full flex items-center justify-center gap-3 font-bold text-white shadow-lg overflow-hidden group"
            style={{
              background: 'linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%)',
              height: '52px'
            }}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <IoMusicalNotes size={22} />
                <motion.div
                  animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 text-white"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                </motion.div>
              </div>
              <span className="text-lg">Create a song</span>
            </div>
          </motion.button>

          {/* My Song List Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStatusCheck}
            className="relative w-full rounded-full p-[2px] transition-all duration-300 shadow-md"
            style={{
              background: 'linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%)',
              height: '52px'
            }}
          >
            {/* Inner div with matching page background to create the "hollow" look */}
            <div
              className="w-full h-full rounded-full flex items-center justify-center gap-3"
              style={{ background: 'linear-gradient(168deg, #090810 0%, #150D32 49.55%, #260D35 99.09%)' }}
            >
              <div
                className="flex items-center gap-2 bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%)' }}
              >
                <div className="relative flex items-center">
                  <svg width="0" height="0" className="absolute">
                    <linearGradient id="btn-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </svg>
                  <div className="relative">
                    <IoPerson size={24} style={{ fill: 'url(#btn-gradient)' }} />
                    <IoMusicalNote
                      size={14}
                      className="absolute -bottom-1 -right-1"
                      style={{ fill: 'url(#btn-gradient)' }}
                    />
                  </div>
                </div>
                <span className="text-lg font-bold">
                  My song List
                </span>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Slider Section */}
        <div className="w-full mt-12 mb-20">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-white/90 px-2"
          >
            Listen to AI-Created Love Stories
          </motion.h2>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar px-2 -mx-2">
            {audioStories.map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ y: -8 }}
                className={`flex-shrink-0 w-[220px] md:w-[260px] bg-gradient-to-b from-white/10 to-transparent backdrop-blur-3xl border rounded-[24px] p-4 snap-center relative group shadow-2xl transition-all duration-500 ${playingStoryId === story.id ? 'border-pink-500/60 shadow-pink-500/20 bg-white/5' : 'border-white/5 shadow-black'
                  }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
                      Lyrics & Vocals by : <span className="text-white">AI</span>
                    </p>
                  </div>
                  <div className="px-2 py-0.5 bg-black/40 rounded-full text-[9px] font-bold border border-white/5 text-purple-300">
                    {story.genre}
                  </div>
                </div>

                <div className="relative aspect-square w-full flex items-center justify-center mb-4 scale-90">
                  {/* Waveform Mockup */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-full aspect-square border-2 border-dashed rounded-full animate-spin-slow transition-all duration-700 ${playingStoryId === story.id ? 'border-pink-500/40 scale-110' : 'border-white/5 scale-100'
                      }`}></div>
                  </div>

                  {/* Visualizer bars circular */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(60)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-[1.2px] rounded-full origin-bottom transition-all duration-500 ${playingStoryId === story.id ? 'bg-gradient-to-t from-pink-500 to-purple-500 opacity-100 shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'bg-white/10 opacity-40'
                          }`}
                        style={{
                          transform: `rotate(${i * 6}deg) translateY(-65px)`,
                          height: playingStoryId === story.id ? `${8 + Math.random() * 20}px` : '8px'
                        }}
                        animate={playingStoryId === story.id ? {
                          height: [8 + Math.random() * 20, 25 + Math.random() * 10, 8 + Math.random() * 20]
                        } : {}}
                        transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity }}
                      />
                    ))}
                  </div>

                  {/* Play/Pause Button */}
                  <div className="relative z-20">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStory(story);
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-black shadow-2xl transition-all duration-500 ${playingStoryId === story.id ? 'bg-pink-500 text-white shadow-pink-500/50' : 'bg-white text-black hover:bg-pink-50'
                        }`}
                    >
                      {playingStoryId === story.id ? <FiPause size={20} /> : <FiPlay size={20} className="ml-1" />}
                    </motion.button>

                    {playingStoryId === story.id && (
                      <motion.div
                        animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-pink-500 rounded-full -z-10"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-bold text-base transition-colors duration-300 ${playingStoryId === story.id ? 'text-pink-400' : 'text-white/90'
                      }`}>{story.title}</h4>
                    {playingStoryId === story.id && (
                      <span className="flex gap-0.5">
                        {[1, 2, 3].map(i => (
                          <motion.div key={i} animate={{ height: [3, 10, 3] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} className="w-0.5 bg-pink-400 rounded-full" />
                        ))}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-md">
                      <motion.div
                        animate={{ width: `${storyProgress[story.id] || 0}%` }}
                        transition={{ duration: 0.5, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_12px_rgba(236,72,153,0.6)]"
                      ></motion.div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                      <span className={playingStoryId === story.id ? 'text-pink-400' : ''}>
                        {playingStoryId === story.id ? 'Playing...' : '0:00'}
                      </span>
                      <span>{story.duration}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#150D32]/90 border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <IoClose size={28} />
              </button>

              <h3 className="font-playfair text-3xl font-bold mb-8 italic bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                How it works
              </h3>

              <div className="space-y-8">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <span className="text-2xl font-black text-pink-500/30 font-playfair">{step.num}</span>
                    <div>
                      <h4 className="font-bold text-lg text-white mb-1">{step.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInfo(false)}
                className="w-full mt-10 py-4 rounded-full bg-white/5 border border-white/10 font-bold hover:bg-white hover:text-black transition-all"
              >
                Got it!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation Styles */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-reverse-spin-slow {
          animation: reverse-spin-slow 15s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
