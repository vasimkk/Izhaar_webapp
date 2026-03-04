import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiStar, HiCake, HiGift, HiHeart, HiLightningBolt } from 'react-icons/hi';
import confetti from 'canvas-confetti';

const BirthdayWebsite = ({ data, ytId, isMuted }) => {
    const handleConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    useEffect(() => {
        handleConfetti();
    }, []);

    return (
        <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-['Outfit'] selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
            {/* Ultra-Premium Hero */}
            <section className="min-h-[100dvh] md:h-[100dvh] flex flex-col md:flex-row relative">
                {/* Left Side Content */}
                <div className="w-full md:w-[45%] min-h-[50dvh] md:h-full p-8 md:p-24 flex flex-col justify-center relative z-20 bg-white/40 backdrop-blur-xl border-b md:border-b-0 md:border-r border-stone-200/50">
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                        className="space-y-10"
                    >
                        <div className="space-y-4">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: 60 }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="h-[2px] bg-amber-500"
                            />
                            <span className="text-[10px] font-black tracking-[0.5em] text-amber-600 uppercase block">THE SIGNATURE COLLECTION</span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-stone-900 leading-[0.85] tracking-tighter">
                            HAPPY<br />
                            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600">
                                BIRTHDAY
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 1, duration: 1.5, ease: "circOut" }}
                                    className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-1 md:h-2 bg-amber-400/20 origin-left"
                                />
                            </span>
                        </h1>

                        <p className="text-stone-500 font-serif italic text-lg md:text-3xl leading-snug max-w-md opacity-80 decoration-amber-500/20 underline underline-offset-4 md:underline-offset-8">
                            "{data.quote}"
                        </p>

                        <div className="flex flex-wrap gap-6 pt-10">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleConfetti}
                                className="group bg-stone-900 text-white px-10 py-5 rounded-2xl font-black text-xs tracking-widest flex items-center gap-4 shadow-3xl transition-all"
                            >
                                <HiGift size={20} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                                UNLEASH MAGIC
                            </motion.button>

                            <div className="flex -space-x-3 items-center">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-4 border-white bg-amber-${i + 1}00 flex items-center justify-center text-[10px] font-bold shadow-sm`}>
                                        <HiStar className="text-amber-600" />
                                    </div>
                                ))}
                                <span className="pl-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Premium Edition</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Decorative Background Text */}
                    <div className="absolute -bottom-10 md:-bottom-20 -left-10 md:-left-20 text-[10rem] md:text-[20rem] font-black text-stone-100 -z-10 pointer-events-none select-none">
                        B-DAY
                    </div>
                </div>

                {/* Right Side Visual */}
                <div className="w-full md:flex-1 h-[50dvh] md:h-full relative">
                    <motion.div
                        initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
                        animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                        transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
                        className="h-full w-full"
                    >
                        <img
                            src="/birthday_hero.png"
                            className="w-full h-full object-cover scale-110 motion-safe:animate-slow-pan"
                            alt="Birthday Celebration"
                        />
                    </motion.div>

                    {/* Glassmorphic Overlay Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-6 md:bottom-12 right-6 md:right-12 p-6 md:p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] md:rounded-[2.5rem] max-w-[280px] md:max-w-xs shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40">
                                <HiHeart className="text-white" />
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">For {data.to_name}</span>
                        </div>
                        <p className="text-white/80 text-sm italic font-serif leading-relaxed line-clamp-3">
                            "{data.message}"
                        </p>
                    </motion.div>

                    <div className="absolute inset-0 bg-stone-900/5 pointer-events-none" />
                </div>

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute top-12 right-12 w-20 h-20 bg-amber-100/30 backdrop-blur-md rounded-full border border-white/20 z-30"
                />
            </section>

            {/* Wishes Grid */}
            <section className="max-w-7xl mx-auto px-6 py-20 md:py-40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                    <div className="col-span-full mb-8 md:mb-12 flex items-center gap-4 md:gap-6">
                        <div className="h-[2px] w-12 md:w-20 bg-amber-400" />
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight italic">THE BIRTHDAY <span className="text-amber-500">LEGACY</span></h2>
                    </div>

                    <motion.div
                        whileHover={{ y: -15, scale: 1.02 }}
                        className="bg-white/80 backdrop-blur-3xl p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.05)] border border-white flex flex-col gap-8 md:gap-10 h-fit relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-amber-200/50 transition-all duration-700" />
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-stone-900 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-amber-400 shadow-2xl rotate-3 group-hover:rotate-12 transition-transform">
                            <HiCake className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <p className="text-xl md:text-2xl text-stone-800 font-serif italic leading-relaxed relative z-10">
                            "{data.message}"
                        </p>
                        <div className="pt-8 md:pt-10 border-t border-stone-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black tracking-widest text-stone-400 uppercase mb-1">WITH ALL MY LOVE,</p>
                                <p className="text-2xl md:text-3xl font-serif italic text-stone-900">{data.from_name}</p>
                            </div>
                            <HiHeart className="text-rose-500/20 w-12 h-12 md:w-[60px] md:h-[60px]" />
                        </div>
                    </motion.div>

                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                        {data.photos.map((url, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2 }}
                                whileHover={{ y: -10, rotate: i % 2 === 0 ? 3 : -3 }}
                                className="aspect-[4/5] bg-stone-100 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-[8px] md:border-[12px] border-white group relative"
                            >
                                <img src={url} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="Moment" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-6 md:p-8 flex flex-col justify-end">
                                    <span className="text-white font-black italic tracking-tighter">MOMENT #{i + 1}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Timeline Section */}
            <section className="max-w-5xl mx-auto px-6 py-20 md:py-40">
                <div className="bg-stone-900 rounded-[3rem] md:rounded-[5rem] p-10 md:p-40 text-center text-white relative overflow-hidden shadow-[0_100px_150px_rgba(0,0,0,0.3)]">
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-500/10 blur-[150px] rounded-full animate-drift" />
                    <div className="relative z-10 space-y-12 md:y-20">
                        <div className="space-y-4 md:space-y-6">
                            <HiStar className="mx-auto text-amber-500 animate-[spin_10s_linear_infinite] w-10 h-10 md:w-16 md:h-16" />
                            <h3 className="text-4xl md:text-8xl font-black tracking-tighter italic leading-none">THE JOURNEY<br /><span className="text-amber-500">SO FAR</span></h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-[15px] left-0 w-full h-[1px] bg-white/10" />

                            {data.timeline.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="relative space-y-4"
                                >
                                    <div className="w-8 h-8 rounded-full bg-amber-500 mx-auto relative z-10 shadow-[0_0_30px_rgba(245,158,11,0.5)] border-4 border-stone-900" />
                                    <div className="space-y-2">
                                        <span className="text-amber-400 font-black text-[10px] tracking-[0.4em] uppercase">{item.date}</span>
                                        <p className="text-2xl font-serif italic text-white/90">{item.event}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 15s linear infinite; }
                
                @keyframes slow-pan {
                    0% { transform: scale(1.1) translateX(0); }
                    50% { transform: scale(1.15) translateX(-2%); }
                    100% { transform: scale(1.1) translateX(0); }
                }
                .animate-slow-pan { animation: slow-pan 20s ease-in-out infinite; }

                @keyframes scroll-down {
                    0% { transform: scaleY(0); transform-origin: top; }
                    50% { transform: scaleY(1); transform-origin: top; }
                    50.1% { transform: scaleY(1); transform-origin: bottom; }
                    100% { transform: scaleY(0); transform-origin: bottom; }
                }
                .animate-scroll-down { animation: scroll-down 2s infinite ease-in-out; }
            `}</style>
        </div>
    );
};

export default BirthdayWebsite;
