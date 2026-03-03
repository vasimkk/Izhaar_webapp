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
    const services = [
        { title: "Express Feelings", desc: "Share your heart out secretly", path: "/user/letter-izhaar", icon: letter, color: "#EC4891", badge: "RECOMMENDED", cta: "Send Now", category: "Explore Love" },
        { title: "Customize Song", desc: "Create a personalized song.", path: "/user/song", icon: songs, color: "#06b6d4", cta: "Create", category: "Explore Love" },
        { title: "Secret Crush", desc: "Find out if they like you too.", path: "/user/secret-crush", icon: crush, color: "#8b5cf6", badge: "MOST USED", cta: "Reveal", category: "Discover & Match" },
        { title: "True Connect", desc: "Chat anonymously with your match.", path: "/user/true-connection", icon: trueconnect, color: "#10b981", badge: "PREMIUM", cta: "Try Now", category: "Discover & Match" },
        { title: "Safe Date", desc: "Verified & Private Meet.", path: "/user/coming-soon", icon: date, color: "#f43f5e", cta: "Meet", category: "Discover & Match" },
        { title: "Games", desc: "Play and connect with others.", path: "/user/quiz", icon: game, color: "#f59e0b", cta: "Play Now", category: "Fun & Together" },
        { title: "Gifts", desc: "Send thoughtful gifts", path: "/gifts", icon: gift, color: "#ec4899", cta: "Browse", category: "Fun & Together" },
        { title: "Movie Night", desc: "Watch & Chat together", path: "/user/watch-party", icon: teleparty, color: "#3b82f6", cta: "Start", category: "Fun & Together" },
        { title: "Play Together", desc: "Break the ice with games.", path: "/magazine", icon: magazine, color: "#6366f1", cta: "Open", category: "Fun & Together" }
    ];

    const categories = ["Explore Love", "Discover & Match", "Fun & Together"];
    const tabList = ["All", ...categories];

    const categoryIcons = {
        "All": <MdOutlineWidgets className="w-6 h-6 md:w-8 md:h-8" />,
        "Explore Love": <AiOutlineHeart className="w-6 h-6 md:w-8 md:h-8" />,
        "Discover & Match": <HiOutlineUserGroup className="w-6 h-6 md:w-8 md:h-8" />,
        "Fun & Together": <BiParty className="w-6 h-6 md:w-8 md:h-8" />
    };

    const [activeCategory, setActiveCategory] = useState("All");

    const renderServices = (serviceList) => (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {serviceList.map((service, idx) => (
                <Link
                    key={idx}
                    to={service.path}
                    className="flex flex-col items-center justify-start text-center group cursor-pointer"
                >
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 md:w-24 md:h-24 mb-2 relative"
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
                    <h4 className="text-white font-medium text-[10px] md:text-sm mb-1 leading-tight tracking-wide group-hover:text-pink-400 transition-colors">
                        {service.title}
                    </h4>
                </Link>
            ))}
        </div>
    );

    return (
        <div className="w-full bg-transparent border-t border-white/10 pt-4">
            {/* Horizontal Scrollable Tabs */}
            <div className="w-full px-4 md:px-8 py-4 overflow-x-auto scrollbar-hide z-10 bg-transparent">
                <div className="flex items-center justify-start min-w-max gap-8 md:gap-16 pb-2">
                    {tabList.map((category) => (
                        <div
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`flex flex-col items-center justify-center cursor-pointer gap-2 relative transition-all duration-300 ${activeCategory === category ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <div className="flex items-center justify-center">
                                {categoryIcons[category]}
                            </div>
                            <span className="text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap uppercase">
                                {category === "All" ? "All" : category.split(' ')[0]}
                            </span>
                            {activeCategory === category && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute -bottom-2 left-0 right-0 h-[4px] bg-pink-500 rounded-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Services Content */}
            <div className="w-full px-4 md:px-8 py-4 md:py-6">
                {activeCategory === "All" ? (
                    <div className="mb-12">
                        {renderServices(services)}
                    </div>
                ) : (
                    <div className="mb-12">
                        {renderServices(services.filter(s => s.category === activeCategory))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllServices;
