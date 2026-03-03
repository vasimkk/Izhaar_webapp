import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ValentineLiveFeed from './ValentineLiveFeed';

// Import Testimonial Assets
import Babitha from '../../../assets/Add/Babitha.png';
import Divya from '../../../assets/Add/Divya.png';
import Preethi from '../../../assets/Add/Preethi.png';
import RohanImg from '../../../assets/Add/Rohan.png';
import Saniya from '../../../assets/Add/Saniya.png';
import Venkat from '../../../assets/Add/Venkat.png';

const SpotlightCard = ({ children, color, className = "" }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className={`relative group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:bg-white/[0.07] ${className}`}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                style={{
                    background: useTransform(
                        [mouseX, mouseY],
                        ([x, y]) => `radial-gradient(250px circle at ${x}px ${y}px, ${color}25, transparent 80%)`
                    ),
                }}
            />
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};

const SuccessStories = ({ isSingleMode }) => {
    const stories = [
        {
            id: 1,
            name: "Pranick & Sneha",
            tag: "Secret Crush",
            story: "I added my college crush silently. She got a hint and added me back! We are dating now. ❤️",
            color: "#FF71CF",
            img: Babitha,
            size: "large"
        },
        {
            id: 2,
            name: "Vikram & Soniya",
            tag: "Safe Date",
            story: "Verified privacy made our first meet so comfortable. We felt safe throughout.",
            color: "#818CF8",
            img: Venkat,
            size: "normal"
        },
        {
            id: 3,
            name: "Arjun & Priya",
            tag: "Watch Together",
            story: "Distance was killing us until we found the synced movie nights. ritually! 🍿",
            color: "#F87171",
            img: Saniya,
            size: "normal"
        }
    ];

    const stats = [
        { label: "Matches Made", value: "5.2K+", color: "#10B981" },
        { label: "Letters Sent", value: "12K+", color: "#F59E0B" }
    ];

    return (
        <div className="mt-8 mb-20 px-4 flex flex-col items-center">
            {/* Header Section */}
            <div className="w-full max-w-[500px] mb-8 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-pink-500 to-transparent"></div>
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#EC4891]/80">Real Connections</span>
                </div>
                <h3 className="dashboard-head-text text-3xl md:text-4xl italic leading-tight">
                    Our <span className="italic">Success Stories</span>
                </h3>

                {/* Unified Trust Bar */}
                <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: stat.color }}></div>
                            <span className="text-[14px] font-black text-white">{stat.value}</span>
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</span>
                        </div>
                    ))}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md">
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">100% Privacy</span>
                    </div>
                </div>
            </div>
            <ValentineLiveFeed />
            {/* Bento Grid layout */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 w-full max-w-[500px] mb-12">
                {/* Featured Large Story */}
                <SpotlightCard
                    color={stories[0].color}
                    className="col-span-2 p-6 flex flex-col justify-between min-h-[200px]"
                >
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-0.5 rounded-full border border-white/20 bg-white/10">
                                    <img src={stories[0].img} className="w-10 h-10 rounded-full object-cover" alt="" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white leading-none mb-1">{stories[0].name}</p>
                                    <span className="text-[8px] text-white/40 uppercase tracking-widest font-black">{stories[0].tag}</span>
                                </div>
                            </div>
                            <div className="px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-green-400"></div>
                                <span className="text-[8px] font-bold text-green-400">SUCCESS</span>
                            </div>
                        </div>
                        <p className="dashboard-subtext text-base md:text-lg leading-relaxed italic">
                            "{stories[0].story}"
                        </p>
                    </div>
                </SpotlightCard>

                {/* Story 2 */}
                <SpotlightCard
                    color={stories[1].color}
                    className="p-5 flex flex-col justify-between min-h-[160px]"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <img src={stories[1].img} className="w-8 h-8 rounded-full border border-white/20 object-cover" alt="" />
                        <span className="text-[10px] font-bold text-white/80">{stories[1].tag}</span>
                    </div>
                    <p className="dashboard-subtext text-[12px] md:text-[14px] italic leading-snug">
                        "{stories[1].story}"
                    </p>
                </SpotlightCard>

                {/* Story 3 */}
                <SpotlightCard
                    color={stories[2].color}
                    className="p-5 flex flex-col justify-between min-h-[160px]"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <img src={stories[2].img} className="w-8 h-8 rounded-full border border-white/20 object-cover" alt="" />
                        <span className="text-[10px] font-bold text-white/80">{stories[2].tag}</span>
                    </div>
                    <p className="dashboard-subtext text-[12px] md:text-[14px] italic leading-snug">
                        "{stories[2].story}"
                    </p>
                </SpotlightCard>
            </div>



            {/* Marquee CTA */}
            <div className="mt-8 -mx-4 w-[120%] overflow-hidden bg-white/[0.03] py-6 border-y border-white/5 backdrop-blur-sm relative group">
                {/* Animating Background Glows */}
                <div className="absolute top-0 left-1/4 w-32 h-full bg-pink-500/5 blur-[40px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-32 h-full bg-blue-500/5 blur-[40px] animate-pulse delay-1000"></div>

                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-16 px-8">
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] flex items-center gap-4">
                                Start Your Story <span className="text-[#EC4891] animate-pulse">●</span> <span className="text-white/60">Confess Now</span>
                            </span>
                            <span className="text-white/10 text-xl font-light">|</span>
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] flex items-center gap-4">
                                Real Matches <span className="text-blue-400">Izhaar</span>
                            </span>
                            <span className="text-white/10 text-xl font-light">|</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuccessStories;
