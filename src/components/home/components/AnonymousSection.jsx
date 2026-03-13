import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import local assets from Vectos
import img1 from "../../../assets/Vectos/1.png";
import img2 from "../../../assets/Vectos/2.png";
import img3 from "../../../assets/Vectos/3.png";
import img4 from "../../../assets/Vectos/4.png";
import img5 from "../../../assets/Vectos/5.png";
import img6 from "../../../assets/Vectos/6.png";
import img7 from "../../../assets/Vectos/7.png";
import img8 from "../../../assets/Vectos/8.png";
import img9 from "../../../assets/Vectos/9.png";
import img10 from "../../../assets/Vectos/10.png";
import img11 from "../../../assets/Vectos/11.png";
import img12 from "../../../assets/Vectos/12.png";
import img13 from "../../../assets/Vectos/13.png";

const sections = [
    {
        id: "anonymous",
        title: "Anonymous First",
        vectors: [
            { src: img1, alt: "Hidden Identity", pos: "top-[8%] left-[6%]", size: "w-[85px]", delay: 0.6, rotate: -5 },
            { src: img2, alt: "Heart Lock", pos: "top-[4%] right-[8%]", size: "w-[75px]", delay: 0.8, rotate: 10 },
            { src: img3, alt: "Shield", pos: "top-[45%] left-[1%]", size: "w-[60px]", delay: 1.0, rotate: -15 },
            { src: img4, alt: "Ready", pos: "bottom-[5%] left-1/2 -translate-x-1/2", size: "w-[130px]", delay: 1.2, rotate: 0 },
            { src: img5, alt: "Mask", pos: "top-[45%] right-[1%]", size: "w-[80px]", delay: 1.4, rotate: 12 }
        ]
    },
    {
        id: "deliver",
        title: "We Deliver Your Feelings",
        vectors: [
            { src: img6, alt: "Deliver 1", pos: "top-[10%] left-[10%]", size: "w-[100px]", delay: 0.6, rotate: -8 },
            { src: img7, alt: "Deliver 2", pos: "top-[6%] right-[8%]", size: "w-[95px]", delay: 0.8, rotate: 12 },
            { src: img8, alt: "Deliver 3", pos: "bottom-[12%] left-[12%]", size: "w-[90px]", delay: 1.0, rotate: -5 },
            { src: img9, alt: "Deliver 4", pos: "bottom-[8%] right-[10%]", size: "w-[100px]", delay: 1.2, rotate: 15 }
        ]
    },
    {
        id: "connections",
        title: "Real Connections",
        vectors: [
            { src: img10, alt: "Connection 1", pos: "top-[12%] left-[15%]", size: "w-[110px]", delay: 0.6, rotate: -10 },
            { src: img11, alt: "Connection 2", pos: "top-[8%] right-[12%]", size: "w-[115px]", delay: 0.8, rotate: 5 },
            { src: img12, alt: "Connection 3", pos: "bottom-[18%] left-[8%]", size: "w-[110px]", delay: 1.0, rotate: -15 },
            { src: img13, alt: "Connection 4", pos: "bottom-[10%] right-[15%]", size: "w-[125px]", delay: 1.2, rotate: 10 }
        ]
    }
];

const AnonymousSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (isPaused) return;

        const timer = setTimeout(() => {
            handleNext();
        }, 5000);

        return () => clearTimeout(timer);
    }, [activeIndex, isPaused]);

    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % sections.length);
    };

    const handleBack = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + sections.length) % sections.length);
    };

    const handleSegmentClick = (index) => {
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
    };

    const activeSection = sections[activeIndex];

    return (
        <section className="relative py-12 px-6  flex flex-col items-center overflow-hidden min-h-[600px] selection:bg-[#EC4891]/30">
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EC4891]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A928ED]/5 blur-[120px] rounded-full" />
            </div>

            {/* Section Heading */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-6 relative z-10"
            >

                <h3 className="text-[24px] md:text-[32px] font-[900] font-['Poppins'] text-white leading-tight">
                    Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4891] to-[#A928ED]">Izhaar?</span>
                </h3>
            </motion.div>

            {/* Main Interactive Container */}
            <div
                className="relative w-full max-w-[420px] h-[380px] group mb-6"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {/* Visual Frame */}
                <div className="absolute inset-0 overflow-hidden">
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-6"
                        >
                            {/* Inner Glow - Stays static to prevent flashing */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-gradient-to-br from-[#EC4891]/5 to-[#A928ED]/5 blur-[60px] rounded-full pointer-events-none" />

                            {/* Heading Animation Group */}
                            <div className="relative z-30 flex flex-col items-center gap-3">
                                <motion.h4
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-[22px] md:text-[28px] font-[1000] font-['Outfit'] text-center leading-tight tracking-tight px-4"
                                    style={{ color: 'rgba(236, 72, 153, 0.9)' }}
                                >
                                    {activeSection.title}
                                </motion.h4>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "40px" }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="h-[1.5px] bg-[#EC4891]/40 rounded-full"
                                />
                            </div>

                            {/* Floating Vector Icons */}
                            <div className="absolute inset-0 pointer-events-none">
                                {activeSection.vectors.map((vector, idx) => (
                                    <motion.div
                                        key={`${activeIndex}-${idx}`}
                                        initial={{
                                            opacity: 0,
                                            scale: 0.8,
                                            y: 20
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: 0,
                                            transition: {
                                                delay: 0.3 + idx * 0.1,
                                                duration: 0.5
                                            }
                                        }}
                                        className={`absolute ${vector.pos} ${vector.size} z-20`}
                                    >
                                        <motion.div
                                            animate={{
                                                y: [0, -8, 0],
                                                rotate: [vector.rotate, vector.rotate + 3, vector.rotate],
                                            }}
                                            transition={{
                                                duration: 6 + idx,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="w-full h-auto flex items-center justify-center p-1"
                                        >
                                            <img
                                                src={vector.src}
                                                alt={vector.alt}
                                                className="w-full h-auto drop-shadow-2xl object-contain"
                                            />
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>


                {/* Tap Zones for Navigation */}
                <div className="absolute inset-0 z-30 flex">
                    <div className="w-1/3 h-full cursor-w-resize" onClick={handleBack} />
                    <div className="w-2/3 h-full cursor-e-resize" onClick={handleNext} />
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex gap-1.5 mb-6 z-20">
                {sections.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleSegmentClick(index)}
                        className={`h-1 rounded-full transition-all duration-500 ${activeIndex === index
                            ? "w-4 bg-white"
                            : "w-1 bg-white/20 hover:bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default AnonymousSection;