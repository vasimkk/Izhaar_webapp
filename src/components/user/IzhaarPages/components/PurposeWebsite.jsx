import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiHeart, HiStar, HiPlay } from 'react-icons/hi';

const PurposeWebsite = ({ data, ytId, isMuted }) => {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Instrument_Serif'] selection:bg-rose-900/40">
            {/* Cinematic Sticky Hero */}
            <section className="h-screen sticky top-0 flex items-center justify-center overflow-hidden">
                <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
                    <img
                        src="/proposal_hero.webp"
                        className="w-full h-full object-cover grayscale-[10%] brightness-[0.7] motion-safe:animate-slow-zoom"
                        alt="Romantic Scene"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />
                </motion.div>

                <div className="relative z-10 text-center space-y-12 px-6 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, letterSpacing: "0.5em" }}
                        animate={{ opacity: 1, letterSpacing: "1.5em" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="text-rose-500/60 text-[10px] md:text-xs font-black uppercase"
                    >
                        The Beginning of Forever
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl sm:text-7xl md:text-[14rem] font-black italic tracking-tighter leading-[0.8] text-glow-rose drop-shadow-[0_0_80px_rgba(244,63,94,0.3)]">
                            {data.title}
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 2 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <HiHeart size={30} className="text-rose-500 animate-pulse" />
                        <p className="text-[9px] uppercase tracking-[1em] text-white/30">Scroll to Explore</p>
                    </motion.div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 flex flex-col items-center gap-4">
                    <span className="text-[9px] uppercase tracking-[1em]">Scroll if you agree</span>
                    <div className="w-[1px] h-12 bg-white animate-bounce" />
                </div>
            </section>

            {/* The Vows Section */}
            <section className="relative z-10 min-h-screen pt-[100vh]">
                <div className="max-w-6xl mx-auto px-6 py-20 md:py-40">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                        className="space-y-32 md:space-y-60"
                    >
                        {/* The Letter Card - Advanced Glassmorphism */}
                        <div className="bg-white/[0.03] backdrop-blur-[100px] border border-white/10 p-10 md:p-40 rounded-[3rem] md:rounded-[6rem] shadow-[0_80px_150px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                            {/* Decorative Glows */}
                            <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-500/10 blur-[120px] rounded-full group-hover:bg-rose-500/20 transition-all duration-[3s]" />
                            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/5 blur-[120px] rounded-full group-hover:bg-pink-500/15 transition-all duration-[3s]" />

                            <HiHeart className="text-rose-500/5 absolute -top-10 md:top-10 -right-10 md:right-10 w-40 h-40 md:w-[300px] md:h-[300px]" />

                            <div className="relative z-10 space-y-10 md:space-y-16">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-12 h-[1px] bg-rose-500" />
                                    <span className="text-[10px] font-black tracking-[1em] text-rose-500 uppercase">A Sacred Letter</span>
                                </motion.div>

                                <p className="text-2xl md:text-7xl italic leading-[1.3] text-rose-50/90 font-light tracking-tighter decoration-rose-500/10 underline underline-offset-[10px] md:underline-offset-[20px]">
                                    "{data.message}"
                                </p>

                                <div className="pt-10 md:pt-20 border-t border-white/10 flex flex-col items-end">
                                    <span className="text-[10px] font-black tracking-[1em] text-white/20 uppercase mb-2 md:mb-4">ETERNALLY YOURS</span>
                                    <h3 className="text-4xl md:text-8xl italic text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600 drop-shadow-2xl">{data.from_name}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Timeline - Artistic */}
                        <div className="space-y-32">
                            <div className="text-center space-y-4">
                                <h3 className="text-[10px] uppercase tracking-[2em] text-white/20">The Odyssey of Us</h3>
                                <div className="h-[1px] w-20 bg-rose-500 mx-auto" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
                                {data.timeline.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="relative group pt-12 border-t border-white/5"
                                    >
                                        <div className="absolute -top-[1px] left-0 w-0 group-hover:w-full h-[1px] bg-rose-500 transition-all duration-1000" />
                                        <span className="text-rose-500 text-xs font-black tracking-widest uppercase block mb-4 md:mb-6">{item.date}</span>
                                        <p className="text-2xl md:text-4xl font-black italic tracking-tighter text-white/90 group-hover:text-white transition-colors">{item.event}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="max-w-7xl mx-auto px-6 py-40">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
                    {data.photos.map((url, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -20, rotate: i % 2 === 0 ? 2 : -2 }}
                            className="bg-white/5 p-4 rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden"
                        >
                            <img src={url} className="w-full h-auto rounded-[2.2rem] opacity-60 hover:opacity-100 transition-all duration-700" alt="Moment" />
                        </motion.div>
                    ))}
                </div>
            </section>

            <style>{`
                .text-glow-rose {
                    text-shadow: 0 0 50px rgba(244, 63, 94, 0.4);
                }

                @keyframes slow-zoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.2); }
                }
                .animate-slow-zoom { animation: slow-zoom 30s linear forwards; }

                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 4px;
                }
                ::-webkit-scrollbar-track {
                    background: #050505;
                }
                ::-webkit-scrollbar-thumb {
                    background: #f43f5e;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default PurposeWebsite;
