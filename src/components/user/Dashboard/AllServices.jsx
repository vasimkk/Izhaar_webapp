import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Premium 3D High-Fidelity Icons
import songs from "../../../assets/services/songs.png"
import gift from "../../../assets/services/gift.png"
import letter from "../../../assets/services/letter.png"
import teleparty from "../../../assets/services/teleparty.png"
import crush from "../../../assets/services/crush.png"
import trueconnect from "../../../assets/services/trueconnect.png"
import date from "../../../assets/services/date.png"
import game from "../../../assets/services/game.png"
import magazine from "../../../assets/services/magazine.png"

// Tab Icons
import { MdOutlineWidgets } from 'react-icons/md';
import { AiOutlineHeart } from 'react-icons/ai';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { BiParty } from 'react-icons/bi';

const AllServices = () => {
    const [scrollIndex, setScrollIndex] = useState(0);

    const handleScroll = (e) => {
        const container = e.target;
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
            // Divide into 4 logical sections for 4 dots
            const index = Math.min(3, Math.floor((scrollLeft / maxScroll) * 4));
            setScrollIndex(index);
        }
    };

    const services = [
        { title: "Express Feelings", desc: "Share your heart out secretly", path: "/user/letter-izhaar", icon: letter, color: "#EC4891", badge: "RECOMMENDED", category: "Explore Love" },
        { title: "Customize Song", desc: "Create a personalized song.", path: "/user/song", icon: songs, color: "#06b6d4", category: "Explore Love" },
        { title: "Secret Crush", desc: "Find out if they like you too.", path: "/user/secret-crush", icon: crush, color: "#8b5cf6", badge: "MOST USED", category: "Discover & Match" },
        { title: "True Connect", desc: "Chat anonymously with your match.", path: "/user/true-connection", icon: trueconnect, color: "#10b981", badge: "PREMIUM", category: "Discover & Match" },
        { title: "Safe Date", desc: "Verified & Private Meet.", path: "/user/coming-soon", icon: date, color: "#f43f5e", category: "Discover & Match" },
        { title: "Games", desc: "Play and connect with others.", path: "/user/quiz", icon: game, color: "#f59e0b", category: "Fun & Together" },
        { title: "Gifts", desc: "Send thoughtful gifts", path: "/gifts", icon: gift, color: "#ec4899", category: "Fun & Together" },
        { title: "Movie Night", desc: "Watch & Chat together", path: "/user/watch-party", icon: teleparty, color: "#3b82f6", category: "Fun & Together" },
        { title: "Magazine", desc: "Break the ice with games.", path: "/magazine", icon: magazine, color: "#6366f1", category: "Fun & Together" }
    ];

    const renderServices = (serviceList) => (
        <div
            onScroll={handleScroll}
            className="flex overflow-x-auto scrollbar-hide gap-6 pt-3 pb-4 items-start"
        >
            {serviceList.map((service, idx) => (
                <Link
                    key={idx}
                    to={service.path}
                    className="flex flex-col items-center justify-start text-center group cursor-pointer min-w-[90px] md:min-w-[130px]"
                >
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 md:w-14 md:h-14 mb-2 relative"
                    >
                        <img
                            src={service.icon}
                            alt={service.title}
                            className="w-full h-full object-contain filter brightness-110 saturate-[1.2] drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-300"
                            style={{ mixBlendMode: 'screen' }}
                        />
                        {service.badge && (
                            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[6px] md:text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-wider shadow-lg">
                                {service.badge.split(' ')[0]}
                            </span>
                        )}
                    </motion.div>
                    <h4 className="text-white font-medium text-[10px] md:text-xs mb-1 leading-tight tracking-wide group-hover:text-pink-400 transition-colors whitespace-nowrap px-2">
                        {service.title}
                    </h4>
                </Link>
            ))}
        </div>
    );

    return (
        <div className="w-full bg-transparent pt-4">
            <div className="w-full px-4 md:px-8">
                {/* COLORFUL BOUTIQUE HEADING */}
                <div className="w-full max-w-4xl mb-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <h2
                            className="text-white tracking-[0.1em]"
                            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '18px' }}
                        >
                            Confess With Izhaar
                        </h2>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 via-pink-500/20 to-transparent ml-8" />
                </div>

                <div className="mb-4">
                    {renderServices(services)}
                </div>
                {/* Scroll Indicator Dots */}
                <div className="flex justify-center items-center gap-1.5 pb-2 transition-all duration-500">
                    {[0, 1, 2, 3].map((dot) => (
                        <div
                            key={dot}
                            className={`transition-all duration-300 rounded-full ${scrollIndex === dot
                                ? "w-2 h-2 bg-pink-500 shadow-[0_0_8px_rgba(236,72,145,0.6)]"
                                : "w-1 h-1 bg-white/20"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllServices;
