import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { HiHeart, HiVolumeUp, HiVolumeOff, HiCamera, HiPlay, HiStar, HiX } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

// Import New Premium Components
import BirthdayWebsite from './components/BirthdayWebsite';
import PurposeWebsite from './components/PurposeWebsite';
import SorryWebsite from './components/SorryWebsite';

const Decor = ({ style }) => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {style === 'romantic' && [...Array(20)].map((_, i) => (
                <motion.div
                    key={`petal-${i}`}
                    initial={{ y: -50, x: `${Math.random() * 100}%`, rotate: Math.random() * 360 }}
                    animate={{ y: '110vh', rotate: 720, x: `${(Math.random() - 0.5) * 20 + (i * 5)}%` }}
                    transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 10 }}
                    className="absolute opacity-40"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ff4d6d" />
                    </svg>
                </motion.div>
            ))}
            {style === 'modern' && [...Array(40)].map((_, i) => (
                <motion.div
                    key={`gold-${i}`}
                    initial={{ y: `${Math.random() * 100}%`, x: `${Math.random() * 100}%`, opacity: 0 }}
                    animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.2, 0.5] }}
                    transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
                    className="absolute w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_10px_#fbbf24] blur-[0.5px]"
                />
            ))}
            {style === 'midnight' && [...Array(60)].map((_, i) => (
                <motion.div
                    key={`star-${i}`}
                    initial={{ opacity: Math.random(), scale: Math.random() }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
                    transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
                    className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"
                    style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                />
            ))}
        </div>
    );
};


// --- END LAYOUT COMPONENTS ---

// --- END LAYOUT COMPONENTS ---

const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const PublicIzhaarPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [pageData, setPageData] = useState(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [loading, setLoading] = useState(true);
    const audioRef = useRef(null);

    const { scrollYProgress } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    const ytId = pageData ? getYoutubeId(pageData.music_url) : null;

    useEffect(() => {
        // Mocking data based on slug for 3 distinct styles
        setTimeout(() => {
            const mockData = {
                title: slug === 'demo-proposal' ? "Will You Marry Me?" :
                    slug === 'demo-modern' ? "Golden Birthday" :
                        "A Deep Apology",
                message: slug === 'demo-proposal' ? "From the first day we met, I knew you were the one. You are the missing piece of my soul, the light in my darkest nights. Will you make me the happiest person and be mine forever?" :
                    slug === 'demo-modern' ? "Celebrating another year of your incredible life. You bring so much joy to everyone around you. May this year be as bright and beautiful as your smile. Happy Birthday!" :
                        "I am deeply sorry for the pain I've caused. You mean the world to me, and losing your smile is my greatest fear. Please forgive me and let us start a new chapter together.",
                quote: slug === 'demo-proposal' ? "In all the world, there is no heart for me like yours." :
                    slug === 'demo-modern' ? "The best is yet to come." :
                        "To err is human, to forgive is divine.",
                timeline: [
                    { date: "Oct 2023", event: "The first hello" },
                    { date: "Jan 2024", event: "Our first trip" },
                    { date: "Today", event: "The beginning of forever" }
                ],
                to_name: slug === 'demo-proposal' ? "Aisha" : slug === 'demo-modern' ? "Sarah" : "Elena",
                from_name: slug === 'demo-proposal' ? "Rohan" : slug === 'demo-modern' ? "David" : "Vikram",
                yt_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                theme: slug === 'demo-proposal' ? "Rose" : slug === 'demo-modern' ? "Modern" : "Midnight",
                style: slug === 'demo-proposal' ? 'romantic' : slug === 'demo-modern' ? 'modern' : 'midnight',
                layout: slug === 'demo-proposal' ? 'classic' : 'immersive',
                hero_img: slug === 'demo-proposal' ? "/proposal_hero.png" :
                    slug === 'demo-modern' ? "/birthday_hero.png" :
                        "/sorry_hero.png",
                photos: [
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
                    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
                    "https://images.unsplash.com/photo-1519225497282-14c12615437a?w=800",
                    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
                    "https://images.unsplash.com/photo-1516589174184-c685265142ec?w=800",
                    "https://images.unsplash.com/photo-1522673607200-1648483749e2?w=800"
                ]
            };
            setPageData(mockData);
            setLoading(false);
        }, 1500);
    }, [slug]);

    const handleReveal = () => {
        setIsRevealed(true);
        if (audioRef.current && !ytId) {
            audioRef.current.play().catch(e => console.log("Autoplay blocked"));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 1, 0.3],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-pink-500/50"
                >
                    <HiHeart size={80} />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-black text-white selection:bg-pink-500/30 overflow-x-hidden font-romantic">
            {pageData.music_url && !ytId && (
                <audio ref={audioRef} loop src={pageData.music_url} />
            )}

            {/* Close Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="fixed top-8 left-8 z-[100] p-4 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 text-white/80 hover:bg-white/10 transition-colors shadow-2xl"
            >
                <HiX size={24} />
            </motion.button>

            <AnimatePresence>
                {!isRevealed ? (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0508]"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,77,109,0.08)_0%,transparent_70%)]" />

                        <div className="relative text-center px-6 max-w-lg">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-12"
                            >
                                <div className="space-y-4">
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="w-24 h-24 bg-gradient-to-tr from-pink-500/20 to-rose-500/20 rounded-full flex items-center justify-center mx-auto border border-white/10 backdrop-blur-xl mb-6 shadow-[0_0_50px_rgba(255,77,109,0.2)]"
                                    >
                                        <HiHeart size={40} className="text-pink-600" />
                                    </motion.div>
                                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tight font-serif">For {pageData.to_name}</h1>
                                    <p className="text-white/40 text-sm tracking-[0.2em] font-medium uppercase font-romantic">A curated moment just for you</p>
                                </div>

                                <button
                                    onClick={handleReveal}
                                    className="group relative px-12 py-5 rounded-full font-bold text-lg overflow-hidden transition-all active:scale-95 shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-drift"
                                >
                                    <div className="absolute inset-0 bg-white" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <span className="relative z-10 text-black group-hover:text-white transition-colors flex items-center gap-3 uppercase tracking-widest text-[10px] font-black">
                                        BEHOLD THE MAGIC <HiPlay size={18} />
                                    </span>
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.main
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                        className={`relative z-10 min-h-screen ${pageData.style === 'modern' ? 'bg-[#faf9f6]' : 'bg-black text-white'}`}
                    >
                        {/* Audio Element */}
                        <audio ref={audioRef} src={pageData.music_url} loop muted={isMuted} />

                        {/* Layout Switcher */}
                        {pageData.style === 'romantic' && (
                            <PurposeWebsite data={pageData} ytId={ytId} isMuted={isMuted} />
                        )}
                        {pageData.style === 'modern' && (
                            <BirthdayWebsite data={pageData} ytId={ytId} isMuted={isMuted} />
                        )}
                        {pageData.style === 'midnight' && (
                            <SorryWebsite data={pageData} ytId={ytId} isMuted={isMuted} />
                        )}

                        {/* Shared Controls: Mute & Back */}
                        <div className="fixed top-4 md:top-8 right-4 md:right-8 z-[100] flex gap-2 md:gap-4">
                            <button
                                onClick={() => {
                                    const newMute = !isMuted;
                                    setIsMuted(newMute);
                                    if (audioRef.current) audioRef.current.muted = newMute;
                                }}
                                className={`p-3 md:p-4 rounded-full backdrop-blur-xl border transition-all pointer-events-auto ${pageData.style === 'modern' ? 'bg-black/5 border-black/10 text-stone-600 hover:bg-black/10' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}`}
                            >
                                {isMuted ? <HiVolumeOff className="w-5 h-5 md:w-6 md:h-6" /> : <HiVolumeUp className="w-5 h-5 md:w-6 md:h-6" />}
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className={`p-3 md:p-4 rounded-full backdrop-blur-xl border transition-all pointer-events-auto ${pageData.style === 'modern' ? 'bg-black/5 border-black/10 text-stone-600 hover:bg-black/10' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}`}
                            >
                                <HiX className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>



                        {/* Footer Section (Shared Info) */}
                        <footer className={`py-40 text-center relative overflow-hidden border-t ${pageData.style === 'modern' ? 'bg-stone-50 border-stone-100 text-stone-900' : 'bg-black border-white/5 text-white'}`}>
                            <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-12">
                                <div className="space-y-4">
                                    <p className="text-[10px] tracking-[1.5em] opacity-30 uppercase font-black">EXCLUSIVELY CRAFTED FOR</p>
                                    <h4 className="text-4xl sm:text-5xl md:text-8xl font-black font-serif italic text-pink-500 tracking-tighter">{pageData.to_name}</h4>
                                    <p className="text-xs italic opacity-40">By {pageData.from_name}</p>
                                </div>
                                <div className="pt-20 border-t border-current/5">
                                    <span className="text-[10px] font-black tracking-[0.5em] block uppercase opacity-30 leading-none">IZHAARLOVE</span>
                                </div>
                            </div>
                        </footer>
                    </motion.main>
                )}

                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;900&family=Playfair+Display:ital,wght@0,400;0,900;1,400;1,900&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;700;900&display=swap');
                
                :root {
                    --fluid-title: clamp(2.5rem, 12vw, 10rem);
                    --fluid-text: clamp(1rem, 2.5vw, 1.5rem);
                }

                body {
                    background-color: #050505;
                    margin: 0;
                    padding: 0;
                    font-family: 'Poppins', sans-serif;
                    overflow-x: hidden;
                }

                .font-romantic { font-family: 'Poppins', sans-serif; }
                .font-serif { font-family: 'Playfair Display', serif; }

                .fluid-title { 
                    font-size: var(--fluid-title);
                    line-height: 1.1;
                }
                .fluid-text { 
                    font-size: var(--fluid-text);
                    line-height: 1.6;
                }

                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

                @keyframes drift {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, -50px) rotate(2deg); }
                    66% { transform: translate(-20px, 20px) rotate(-1deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }

                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                .animate-spin-slow { animation: spin-slow 20s linear infinite; }
                .animate-spin-slow-reverse { animation: spin-slow-reverse 25s linear infinite; }
                .animate-drift { animation: drift 15s ease-in-out infinite; }

                .text-glow {
                    text-shadow: 0 0 30px rgba(255, 77, 109, 0.3);
                }

                input::selection, div::selection, span::selection {
                    background: rgba(236, 72, 153, 0.3);
                }
            `}</style>
            </AnimatePresence>
        </div>
    );
};

export default PublicIzhaarPage;
