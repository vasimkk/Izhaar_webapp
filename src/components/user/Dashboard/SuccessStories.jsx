import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ValentineLiveFeed from './ValentineLiveFeed';

// Import Testimonial Assets
import Babitha from '../../../assets/Add/Babitha.png';
import Divya from '../../../assets/Add/Divya.png';
import Preethi from '../../../assets/Add/Preethi.png';
import RohanImg from '../../../assets/Add/Rohan.png';
import Saniya from '../../../assets/Add/Saniya.png';
import Venkat from '../../../assets/Add/Venkat.png';

const SuccessStories = ({ isSingleMode }) => {
    const stories = isSingleMode ? [
        {
            id: 1,
            name: "Pranick & Sneha",
            tag: "Secret Crush",
            story: "I added my college crush silently. She got a hint and added me back! We are dating now. ❤️",
            color: "#FF71CF",
            img: Babitha
        },
        {
            id: 2,
            name: "Rohan & Riya",
            tag: "Izhaar Letter",
            story: "The anonymous letter gave me the courage to be honest. It changed everything for us. ✨",
            color: "#A78BFA",
            img: RohanImg
        },
        {
            id: 3,
            name: "Ananya & K.",
            tag: "Secret Match",
            story: "Never thought a digital nudge could lead to a real lunch date. Izhaar is magic! 🌹",
            color: "#60A5FA",
            img: Divya
        }
    ] : [
        {
            id: 1,
            name: "Vikram & Soniya",
            tag: "Safe Date",
            story: "Verified privacy made our first meet so comfortable. We felt safe throughout.",
            color: "#818CF8",
            img: Venkat
        },
        {
            id: 2,
            name: "Arjun & Priya",
            tag: "Watch Together",
            story: "Distance was killing us until we found the synced movie nights. It's our ritual now! 🍿",
            color: "#F87171",
            img: Saniya
        },
        {
            id: 3,
            name: "Megha & Rahul",
            tag: "Send Surprises",
            story: "The sudden gift delivery with a personalized song made her cry with joy. Best service! 🎁",
            color: "#FBBF24",
            img: Preethi
        }
    ];

    const [topIndex, setTopIndex] = useState(0);

    const nextCard = () => {
        setTopIndex((prev) => (prev + 1) % stories.length);
    };

    return (
        <div className="mt-16 mb-20 px-4 relative flex flex-col items-center">
            <div className="w-full max-w-[400px] mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-[2px] w-8 bg-gradient-to-r from-pink-500 to-transparent"></div>
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-pink-500/80">Real Connection</span>
                </div>
                <h3 className="text-3xl font-['Playfair_Display'] font-black text-white italic">Success Stories</h3>
            </div>

            <div className="relative w-full max-w-[340px] h-[360px] flex items-center justify-center perspective-[1000px] mb-16">
                <AnimatePresence>
                    {stories.map((story, index) => {
                        const isTop = index === topIndex;
                        const offset = (index - topIndex + stories.length) % stories.length;

                        if (offset > 2) return null; // Only show 3 cards deep

                        return (
                            <motion.div
                                key={story.id}
                                style={{ zIndex: stories.length - offset }}
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{
                                    opacity: 1 - offset * 0.2,
                                    scale: 1 - offset * 0.05,
                                    y: offset * -20,
                                    rotateZ: offset * (index % 2 === 0 ? 2 : -2)
                                }}
                                exit={{ opacity: 0, x: 200, rotateZ: 20, transition: { duration: 0.4 } }}
                                drag={isTop ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(_, info) => {
                                    if (Math.abs(info.offset.x) > 100) nextCard();
                                }}
                                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                            >
                                <div
                                    className="w-full h-full rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden relative border border-white/10 shadow-2xl backdrop-blur-3xl"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                        boxShadow: `inset 0 0 40px ${story.color}15, 0 10px 40px rgba(0,0,0,0.5)`
                                    }}
                                >
                                    {/* Top Light Shine */}
                                    <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                                    {/* Glass Tint Glow */}
                                    <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[60px]" style={{ backgroundColor: `${story.color}30` }} />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1 rounded-full border border-white/20 bg-white/5">
                                                    <img src={story.img} className="w-12 h-12 rounded-full object-cover" alt="" />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-bold text-white leading-none mb-1">{story.name}</p>
                                                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-black">{story.tag}</span>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                                <span className="text-[8px] font-bold text-pink-400">VERIFIED</span>
                                            </div>
                                        </div>

                                        <p className="text-[17px] sm:text-[19px] font-medium text-white/90 leading-relaxed italic font-['Poppins']">
                                            "{story.story}"
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>
                                        <div className="flex items-center gap-2 group/btn" onClick={nextCard}>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover/btn:text-white transition-colors">Swipe for next story</span>
                                            <motion.span
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className="text-white/30 group-hover/btn:text-white transition-colors"
                                            >➔</motion.span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <ValentineLiveFeed />

            {/* Marquee CTA */}
            <div className="mt-16 -mx-4 w-[110%] overflow-hidden bg-white/5 py-5 border-y border-white/5 backdrop-blur-sm">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-20 px-10">
                            <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.5em] flex items-center gap-6">
                                Ready to make your story? <span className="text-pink-500">Confess Now</span>
                            </span>
                            <span className="text-white/20 text-2xl">✦</span>
                            <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.5em] flex items-center gap-6">
                                Success Stories <span className="text-blue-400">Izhaar</span>
                            </span>
                            <span className="text-white/20 text-2xl">✦</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuccessStories;
