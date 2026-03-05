import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
import { HiOutlineUserGroup, HiSparkles } from 'react-icons/hi';
import { BiParty } from 'react-icons/bi';
import { FaArrowRight } from 'react-icons/fa';
import AllServicesDrawer from './AllServicesDrawer';

const AllServices = () => {
    const [scrollIndex, setScrollIndex] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleScroll = (e) => {
        const container = e.target;
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
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
        { title: "Izhaar Pages", desc: "Premium single-page moments.", path: "/user/izhaar-pages/create", icon: magazine, color: "#f43f5e", badge: "NEW", category: "Explore Love" },
        { title: "Magazine", desc: "Break the ice with games.", path: "/magazine", icon: magazine, color: "#6366f1", category: "Fun & Together" }
    ];

    const categories = ["Single", "All", "Committed"];

    const renderServices = (serviceList) => (
        <motion.div
            layout
            onScroll={handleScroll}
            className="flex overflow-x-auto scrollbar-hide gap-6 pt-3 pb-4 items-start"
        >
            <AnimatePresence mode="popLayout">
                {serviceList.map((service, idx) => (
                    <motion.div
                        layout
                        key={service.title}
                        initial={{ opacity: 0, scale: 0.5, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: idx * 0.05
                        }}
                    >
                        <Link
                            to={service.path}
                            className="flex flex-col items-center justify-start text-center group cursor-pointer min-w-[85px] md:min-w-[110px]"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-full border border-white/10 bg-[#0A0A1F] flex items-center justify-center relative overflow-visible shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-pink-500/50 group-hover:shadow-[0_0_20px_rgba(236,72,145,0.3)]"
                            >
                                <motion.img
                                    animate={
                                        service.title === "Express Feelings" ? { rotate: [-5, 5, -5] } :
                                            service.title === "Customize Song" ? { scale: [1, 1.1, 1] } :
                                                service.title === "Secret Crush" ? { scale: [1, 1.15, 1], filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] } :
                                                    service.title === "Games" ? { rotate: [0, 10, -10, 0] } :
                                                        service.title === "Gifts" ? { y: [0, -4, 0] } :
                                                            { y: [0, -3, 0] }
                                    }
                                    transition={{
                                        duration: service.title === "Secret Crush" ? 1.5 : 3,
                                        repeat: Infinity,
                                        delay: idx * 0.2,
                                        ease: "easeInOut"
                                    }}
                                    src={service.icon}
                                    alt={service.title}
                                    className="w-[65%] h-[65%] object-contain filter brightness-110 saturate-[1.2] transition-transform duration-500 group-hover:scale-110"
                                    style={{ mixBlendMode: 'screen' }}
                                />
                                {service.badge && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        className="absolute -top-1 -right-1 bg-pink-500 text-white text-[6px] md:text-[7px] font-black px-1.5 py-0.5 rounded-full tracking-wider shadow-lg"
                                    >
                                        {service.badge.split(' ')[0]}
                                    </motion.span>
                                )}
                            </motion.div>
                            <h4 className="text-white/70 font-bold text-[10px] md:text-[11px] mb-1 leading-tight tracking-wide group-hover:text-white transition-colors whitespace-nowrap px-1">
                                {service.title}
                            </h4>
                        </Link>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <div className="w-full bg-transparent pt-4">
            <div className="w-full px-4 md:px-8">
                {/* COLORFUL BOUTIQUE HEADING matching reference image */}
                <div className="w-full max-w-4xl mb-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 15, -15, 0],
                                filter: ["drop-shadow(0 0 2px #facc15)", "drop-shadow(0 0 8px #facc15)", "drop-shadow(0 0 2px #facc15)"]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <HiSparkles className="text-yellow-400 text-xl" />
                        </motion.div>

                        <h2
                            className="text-white tracking-tight flex"
                            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '20px' }}
                        >
                            {"Confess with Izhaar".split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        color: ["#ffffff", "#EC4891", "#A855F7", "#06b6d4", "#ffffff"],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 4,
                                        delay: i * 0.1,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </h2>
                    </div>

                    <motion.button
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setIsDrawerOpen(true)}
                        className="flex items-center gap-2 text-purple-400 text-[11px] font-bold uppercase tracking-widest hover:text-white transition-all group"
                    >
                        View All <FaArrowRight className="text-[9px] transition-transform group-hover:translate-x-1" />
                    </motion.button>
                </div>



                <div className="mb-4">
                    {renderServices(services)}
                </div>
                {/* Scroll Indicator Dots */}
                {/* <div className="flex justify-center items-center gap-1.5 pb-2 transition-all duration-500">
                    {[0, 1, 2, 3].map((dot) => (
                        <div
                            key={dot}
                            className={`transition-all duration-300 rounded-full ${scrollIndex === dot
                                ? "w-2 h-2 bg-pink-500 shadow-[0_0_8px_rgba(236,72,145,0.6)]"
                                : "w-1 h-1 bg-white/20"
                                }`}
                        />
                    ))}
                </div> */}
            </div>

            {/* Bottom Sheet Drawer for All Services */}
            <AllServicesDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                services={services}
            />
        </div>
    );
};

export default AllServices;
