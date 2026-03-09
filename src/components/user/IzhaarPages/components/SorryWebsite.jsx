import React from 'react';
import { motion } from 'framer-motion';
import { HiStar, HiSparkles, HiChatAlt } from 'react-icons/hi';

const SorryWebsite = ({ data, ytId, isMuted }) => {
    return (
        <div className="min-h-screen bg-[#080808] text-stone-200 selection:bg-rose-950/40 selection:text-white font-['Instrument_Serif']">
            {/* Soft Intimacy Hero */}
            <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-500/10 blur-[150px] rounded-full -mr-60 -mt-60" />

                <motion.div
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.15 }}
                    transition={{ duration: 5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src="/sorry_hero.webp"
                        className="w-full h-full object-cover grayscale brightness-50 contrast-125"
                        alt="Sincere Scene"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
                </motion.div>

                <div className="relative z-10 max-w-4xl text-center space-y-16">
                    <motion.div
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "1.5em" }}
                        transition={{ duration: 2.5 }}
                        className="opacity-40 text-[10px] uppercase font-black tracking-[1.5em]"
                    >
                        A Sincere Apology
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 2 }}
                        className="space-y-8"
                    >
                        <h1 className="text-5xl sm:text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-[0.85] text-white/90 drop-shadow-[0_0_60px_rgba(255,255,255,0.1)]">
                            Forgive me,<br /><span className="text-indigo-400/80">{data.to_name}</span>
                        </h1>
                        <p className="text-xl md:text-3xl font-serif font-light text-white/40 leading-relaxed italic max-w-2xl mx-auto">
                            "{data.quote}"
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        transition={{ delay: 3, duration: 2 }}
                        className="flex flex-col items-center gap-4 md:gap-6"
                    >
                        <div className="w-[1px] h-20 md:h-32 bg-gradient-to-b from-white to-transparent" />
                        <span className="text-[9px] uppercase tracking-[1em]">Deep Silence</span>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-32 md:py-60">
                <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
                    className="bg-white/[0.01] backdrop-blur-[120px] border border-white/5 p-10 md:p-40 rounded-[4rem] md:rounded-[8rem] shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative group overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                    <HiSparkles className="text-indigo-500/5 absolute -bottom-20 -right-20" size={400} />

                    <div className="relative z-10 space-y-20">
                        <div className="flex justify-center gap-6 opacity-30">
                            <HiStar size={10} /><HiStar size={18} /><HiStar size={10} />
                        </div>

                        <p className="text-2xl md:text-6xl font-serif italic text-white/80 leading-[1.6] font-light text-center decoration-white/5 underline underline-offset-[20px] md:underline-offset-[30px]">
                            "{data.message}"
                        </p>

                        <div className="pt-20 md:pt-32 border-t border-white/5 text-center">
                            <span className="text-[9px] font-black tracking-[1.5em] text-white/10 uppercase block mb-4 md:mb-6">WITH ALL MY REGRET,</span>
                            <h3 className="text-5xl md:text-7xl italic font-serif text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 to-indigo-600">{data.from_name}</h3>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Gallery of Remembrance */}
            <section className="max-w-6xl mx-auto px-6 py-40">
                <div className="flex flex-col items-center mb-24 opacity-30">
                    <h2 className="text-[10px] font-black tracking-[1.5em] uppercase">Moments that Matter</h2>
                    <div className="h-[1px] w-20 bg-white mt-4" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {data.photos.map((url, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ opacity: 1, scale: 1.05 }}
                            className="aspect-[4/5] bg-white/5 overflow-hidden rounded-[2rem] opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
                        >
                            <img src={url} className="w-full h-full object-cover" alt="Moment" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Simple Silent Footer */}
            <footer className="py-40 text-center opacity-10">
                <span className="text-[10px] uppercase font-black tracking-[3em]">IZHAAR</span>
            </footer>
        </div>
    );
};

export default SorryWebsite;
