import React, { useState, useRef, useEffect } from 'react';
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
import website from "../../../assets/services/website.png"

// Tab Icons
import { FaArrowRight } from 'react-icons/fa';
import AllServicesDrawer from './AllServicesDrawer';

const AllServices = () => {
    const [scrollIndex, setScrollIndex] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const scrollRef = useRef(null);

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
        { title: "Letter", desc: "Share your heart out secretly", path: "/user/letter-izhaar", icon: letter, color: "#EC4891", category: "Explore Love" },
        { title: "Song", desc: "Create a personalized song.", path: "/user/song", icon: songs, color: "#06b6d4", category: "Explore Love" },
        { title: "Secret Crush", desc: "Find out if they like you too.", path: "/user/secret-crush", icon: crush, color: "#8b5cf6", category: "Discover & Match" },
        { title: "True Connect", desc: "Chat anonymously with your match.", path: "/user/true-connection", icon: trueconnect, color: "#10b981", category: "Discover & Match" },
        { title: "Safe Date", desc: "Verified & Private Meet.", path: "/user/coming-soon", icon: date, color: "#f43f5e", category: "Discover & Match" },
        { title: "Games", desc: "Play and connect with others.", path: "/user/quiz", icon: game, color: "#f59e0b", category: "Fun & Together" },
        { title: "Gifts", desc: "Send thoughtful gifts", path: "/gifts", icon: gift, color: "#ec4899", category: "Fun & Together" },
        { title: "Movie Night", desc: "Watch & Chat together", path: "/user/watch-party", icon: teleparty, color: "#3b82f6", category: "Fun & Together" },
        { title: "Create Website", desc: "Premium single-page moments.", path: "/user/izhaar-pages/create", icon: website, color: "#f43f5e", category: "Explore Love" },
        { title: "Magazine", desc: "Break the ice with games.", path: "/magazine", icon: magazine, color: "#6366f1", category: "Fun & Together" }
    ];

    // Helper function to render horizontal scrollable services list
    const renderServices = (serviceList) => (
        <div className="relative group/scroll">
            <motion.div
                ref={scrollRef}
                layout
                onScroll={handleScroll}
                className="flex overflow-x-auto scrollbar-hide gap-2 pb-2 items-start relative w-full"
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
                                className="flex flex-col items-center justify-start text-center group cursor-pointer min-w-[70px] md:min-w-[85px]"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="mb-3 flex items-center justify-center relative overflow-visible shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(236,72,145,0.5)]"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '30px',
                                        background: 'linear-gradient(90deg, #EC4891 -12.18%, #A928ED 76.79%)',
                                        padding: '2px'
                                    }}
                                >
                                    <div className="w-full h-full rounded-full bg-[#0A0A1F] flex items-center justify-center overflow-hidden">
                                        <motion.img
                                            animate={
                                                service.title === "Express Feelings" ? { rotate: [-5, 5, -5] } :
                                                    service.title === "Customize Song" ? { scale: [1, 1.1, 1] } :
                                                        service.title === "Secret Crush" ? { scale: [1, 1.15, 1], filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] } :
                                                            service.title === "Games" ? { rotate: [0, 10, -10, 0] } :
                                                                service.title === "Gifts" ? { y: [0, -4, 0] } :
                                                                    service.title === "Create Website" ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } :
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
                                            loading="lazy"
                                            decoding="async"
                                            className="w-[65%] h-[65%] object-contain filter brightness-110 saturate-[1.2] transition-transform duration-500 group-hover:scale-110"
                                            style={{ mixBlendMode: 'screen' }}
                                        />
                                    </div>
                                </motion.div>
                                <h4 className="text-white/70 text-[10px] md:text-[11px] mb-1 leading-tight tracking-wide group-hover:text-white transition-colors whitespace-nowrap px-1" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
                                    {service.title}
                                </h4>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );

    return (
        <div className="w-full bg-transparent pt-1">
            <div className="w-full px-4">
                {/* RESPONSIVE HEADING */}
                <div className="w-full mb-6 flex items-center justify-between z-10 gap-x-2">
                    <div className="flex items-center min-w-0">
                        <h2 className="dashboard-head-text flex items-center gap-2 whitespace-nowrap">
                            <span className="shrink-0 text-base">✨</span>
                            <span className="truncate">Confess with Izhaar</span>
                        </h2>
                    </div>

                    <motion.button
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setIsDrawerOpen(true)}
                        className="flex items-center gap-1.5 transition-all group shrink-0"
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#F6F6F6',
                            lineHeight: '100%',
                            letterSpacing: '0px',
                            textTransform: 'none'
                        }}
                    >
                        View All <FaArrowRight style={{ fontSize: '10px', color: '#F6F6F6' }} className="mt-0.5 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                </div>

                <div className="">
                    {renderServices(services)}
                </div>

                {/* Minimalist White Scroll Indicator Dots */}
                <div className="flex justify-center items-center gap-1 mt-2 pb-4">
                    {[0, 1, 2, 3].map((dot) => (
                        <motion.div
                            key={dot}
                            initial={false}
                            animate={{
                                width: scrollIndex === dot ? 12 : 5,
                                backgroundColor: scrollIndex === dot ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)',
                                shadow: 'none'
                            }}
                            className="h-1 rounded-full transition-all duration-300"
                        />
                    ))}
                </div>
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
