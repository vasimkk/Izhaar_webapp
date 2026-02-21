import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import secretImg from '../../assets/secret.png';

const testimonials = [
    { name: "Priya A.", text: "It felt safe and exciting to see who liked me.", img: "72" },
    { name: "Rahul K.", text: "It was genuine and supportive ❤️", img: "22" },
    { name: "Sneha R.", text: "The secrecy makes it so much more fun! 🤫", img: "44" },
    { name: "Amit S.", text: "Finally a way to confess without the awkwardness.", img: "33" },
    { name: "Ananya M.", text: "Found out my best friend has a crush on me! ✨", img: "45" },
    { name: "Vikram P.", text: "Super premium experience. Highly recommended.", img: "11" }
];

const IzhaarMoment = () => {
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % (testimonials.length / 2));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#1A0536] text-white font-sans overflow-x-hidden relative flex flex-col items-center">
            {/* 100% Match Background with Requested Gradient */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, #000 34.47%, #640638 166.74%)' }}
                />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#B72099_0%,transparent_70%)] opacity-20" />
            </div>

            {/* 1. Top Marquee Heading - Increased Height */}
            <div className="w-full bg-[#B72099]/15 backdrop-blur-xl border-b border-white/10 py-4 overflow-hidden whitespace-nowrap relative z-50">
                <div className="flex animate-marquee text-[11px] font-black uppercase tracking-[0.4em] text-white/50">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-12 px-5 shrink-0">
                            <span className="flex items-center gap-3">Someone has a <span className="text-[#B72099]">Secret Crush</span> on you 💗</span>
                            <span className="text-white/20">✦</span>
                            <span className="flex items-center gap-3 text-pink-400">Reveal your Secret Admirer 💌</span>
                            <span className="text-white/20">✦</span>
                            <span className="flex items-center gap-3">100% Private & Anonymous 🤫</span>
                            <span className="text-white/20">✦</span>
                            <span className="flex items-center gap-3">Could it be you? ✨</span>
                            <span className="text-white/20">✦</span>
                        </div>
                    ))}
                </div>
            </div>

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 w-full max-w-[430px] px-6 pt-10 pb-40 flex flex-col items-center text-center"
            >
                {/* 1. Header Pill - Premium Glassmorphism */}
                <div className="w-full mb-10 px-2">
                    <div className="relative rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden group">
                        {/* Internal Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />

                        <div className="flex items-center gap-4 px-4 py-3 relative z-10">
                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-white/20 to-white/5 border border-white/30 flex items-center justify-center shadow-xl shrink-0">
                                <span className="text-2xl filter drop-shadow-md">💌</span>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#B72099] rounded-full flex items-center justify-center border-2 border-[#1A0536] text-[10px] shadow-lg animate-bounce">❤️</div>
                            </div>

                            <div className="text-left">
                                <h4 className="text-[14px] font-black tracking-tight text-white mb-0.5">
                                    You Have a Secret Crush <span className="text-[#B72099]">💗</span>
                                </h4>
                                <p className="text-[10px] text-white/50 font-bold tracking-wide uppercase">
                                    Someone has secretly confessed 🤫
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Welcome Messaging - Responsive Single Line Heading */}
                <div className="mb-8 w-full px-2">
                    <h1 className="text-[22px] xs:text-[26px] sm:text-[32px] md:text-[38px] font-serif font-black tracking-tighter flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap bg-gradient-to-r from-white via-[#B72099] to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(183,32,153,0.4)] animate-pulse-slow">
                        Welcome to Izhaar
                        <img src={Logo} alt="" className="h-8 xs:h-9 sm:h-11 md:h-14 w-auto drop-shadow-[0_4px_15px_rgba(0,0,0,0.4)] shrink-0 filter brightness-110" />
                    </h1>
                    <p className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed max-w-[320px] mx-auto font-bold opacity-100 italic mt-4">
                        Someone has secretly confesse message from someone who has feelings for you. ❤️
                    </p>
                </div>

                {/* 3. Hero Image - Further Decreased Size & Centered */}
                <div className="relative mb-6 w-full flex items-center justify-center">
                    <div className="absolute w-36 h-36 bg-[#B72099]/40 blur-[40px] rounded-full animate-pulse" />
                    <img
                        src={secretImg}
                        alt="Secret Moments"
                        className="w-36 h-auto relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] animate-float"
                    />
                </div>

                <div className="mb-14">
                    <div className="inline-flex items-center gap-2.5 px-8 py-2.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-30 pointer-events-none" />
                        <span className="text-[14px] text-yellow-300 relative z-10">✦</span>
                        <span className="text-[12px] font-black uppercase tracking-[0.25rem] text-white relative z-10">Could it be your Secret Crush? <span className="text-[#B72099] ml-1">💗</span></span>
                    </div>
                </div>

                {/* 5. Trust Container */}
                <div className="w-full mb-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] flex-1 bg-white/10" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Why Should You Check?</span>
                        <div className="h-[1px] flex-1 bg-white/10" />
                    </div>

                    <div className="p-9 rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-7 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-40 pointer-events-none" />
                        {[
                            { color: "bg-green-500", label: "100% Private:", desc: "Only you can see their message." },
                            { color: "bg-[#B72099]", label: "Verified Sender:", desc: "Matches are genuine & verified." },
                            { color: "bg-orange-500", label: "Safe & Respectful:", desc: "No spam, no pressure." }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-5 text-left group relative z-10">
                                <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center shrink-0 border border-white/10 shadow-lg`}>
                                    <span className="text-[10px] text-white">✔</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[14px] leading-tight">
                                        <span className="font-[1000] text-white pr-2">{item.label}</span>
                                        <span className="font-semibold text-white/50">{item.desc}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. Testimonials Section - Dynamic Slider */}
                <div className="w-full mb-20">
                    <div className="flex items-center justify-center mb-10">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-30 pointer-events-none" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white relative z-10">What People Say</span>
                        </div>
                    </div>

                    <div className="p-10 rounded-[3rem] border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.4)] relative overflow-hidden h-[280px] flex flex-col justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-40 pointer-events-none" />

                        <div className="relative z-10 h-full">
                            <motion.div
                                key={activeSlide}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-2 gap-8"
                            >
                                {testimonials.slice(activeSlide * 2, (activeSlide * 2) + 2).map((user, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="mb-4">
                                            <img
                                                src={`https://i.pravatar.cc/120?u=${user.img}`}
                                                className="w-16 h-16 rounded-full border-2 border-[#B72099]/40 object-cover shadow-lg"
                                                alt=""
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[12px] font-[1000] uppercase text-white tracking-[0.15em] mb-1.5">{user.name}</p>
                                            <div className="flex justify-center gap-0.5 text-yellow-500 mb-2.5">
                                                {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-[10px]">⭐</span>)}
                                            </div>
                                            <p className="text-[11px] text-white/50 font-medium leading-relaxed italic px-1 line-clamp-2">
                                                "{user.text}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        <div className="flex items-center gap-3 justify-center relative z-10 mt-6">
                            {[0, 1, 2].map((dot) => (
                                <div
                                    key={dot}
                                    onClick={() => setActiveSlide(dot)}
                                    className={`h-2 transition-all duration-500 rounded-full cursor-pointer ${activeSlide === dot ? 'w-8 bg-[#FED700] shadow-[0_0_12px_rgba(254,215,0,0.5)]' : 'w-2 bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 7. Action Button - Resized & Shine Effect */}
                <div className="fixed bottom-8 left-6 right-6 z-50 max-w-[400px] mx-auto">
                    <button
                        onClick={() => navigate('/entry')}
                        className="group relative w-full h-[68px] flex flex-col items-center justify-center rounded-full bg-gradient-to-r from-[#B72099] via-[#312E81] to-[#B72099] bg-[length:200%_auto] hover:bg-right transition-all duration-700 shadow-[0_12px_35px_rgba(0,0,0,0.5)] border-t border-white/20 active:scale-95 overflow-hidden"
                    >
                        {/* Lighting Shine Effect - Now Default (not just hover) */}
                        <div className="absolute inset-0 w-full h-full">
                            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] animate-shine pointer-events-none" />
                        </div>

                        <div className="flex items-center gap-3 relative z-10">

                            <span className="text-[17px] font-[1000] uppercase tracking-tighter text-white drop-shadow-lg">Reveal Your Secret Admirer </span>
                        </div>
                    </button>
                    <div className="absolute left-[20%] bottom-[-10px] w-[60%] h-12 bg-[#B72099]/20 blur-2xl -z-10" />
                </div>
            </motion.main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
                
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    display: flex;
                    animation: marquee 35s linear infinite;
                    width: fit-content;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 200%; }
                }
                .animate-shine {
                    animation: shine 1.5s ease-in-out infinite;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; filter: drop-shadow(0 0 15px rgba(183,32,153,0.4)); }
                    50% { opacity: 0.85; filter: drop-shadow(0 0 25px rgba(183,32,153,0.6)); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default IzhaarMoment;
