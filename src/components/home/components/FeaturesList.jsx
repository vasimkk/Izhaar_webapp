import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import Assets from Service folder
import letterImg from "../../../assets/Service/letter.webp";
import songImg from "../../../assets/Service/song.webp";
import connectImg from "../../../assets/Service/connect.webp";
import crushImg from "../../../assets/Service/crush.webp";

const features = [
    {
        id: 1,
        title: "True Connect",
        description: "Find someone who truly matches your mindset. Complete a short compatibility test, and Izhaar connects you with people who share similar interests, values, and relationship goals. Because real connections start with understanding, not just swiping. 💞",
        img: connectImg,
        shadowColor: "#4A3AA7"
    },
    {
        id: 2,
        title: "Secret Crush",
        description: "Have a crush on someone from school, college, or anywhere but never had the courage to say it? Send a Secret Crush through Izhaar. If they like you back, you both get notified. If not, your identity stays completely anonymous. No regret. Just a chance to know. 💌",
        img: crushImg,
        shadowColor: "#B02683"
    },
    {
        id: 3,
        title: "Izhaar Love",
        description: "A service where Izhaar expresses your feelings to your crush or loved one on your behalf — perfect for those who are shy, fear rejection, or find it hard to say \"I like you\" directly. Because some feelings are better expressed with a little help. 💌",
        img: letterImg,
        shadowColor: "#4A3AA7"
    },
    {
        id: 4,
        title: "Customize a song",
        description: "Turn your feelings into a personalized romantic song. Izhaar creates a custom song with your message and sends it to your special person. A unique way to make your confession truly unforgettable. 🎵",
        img: songImg,
        shadowColor: "#B02683"
    }
];

const FeaturesList = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 for next, -1 for back
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    useEffect(() => {
        // Preload images
        features.forEach((feature) => {
            const img = new Image();
            img.src = feature.img;
        });

        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setDirection(1);
            setActiveIndex((prev) => (prev + 1) % features.length);
        }, 5000); // Increased speed to 5s
        return () => clearInterval(interval);
    }, [activeIndex, isAutoPlay]);

    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % features.length);
    };

    const handleBack = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    };

    const handleDotClick = (index) => {
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
    };

    const activeFeature = features[activeIndex];

    return (
        <section
            className="mt-10 px-6 overflow-hidden flex flex-col items-center justify-center relative min-h-[720px]"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
            onTouchStart={() => setIsAutoPlay(false)}
            onTouchEnd={() => setIsAutoPlay(true)}
        >
            {/* Navigation Arrows */}
            <button
                onClick={handleBack}
                className="absolute left-2 md:left-6 z-40 p-3.5   text-white/70 hover:text-white  hover:scale-110 active:scale-90 transition-all group shadow-xl"
                aria-label="Previous slide"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            <button
                onClick={handleNext}
                className="absolute right-2 md:right-6 z-40 p-3.5 text-white/70 hover:text-white  hover:scale-110 active:scale-90 transition-all  group shadow-xl"
                aria-label="Next slide"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>

            <div className="relative w-full h-full flex-1 flex items-center justify-center min-h-[600px]">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={activeFeature.id}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                            opacity: 0,
                            x: direction * -100
                        }}
                        transition={{
                            duration: 0.5,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        className="flex flex-col items-center text-center gap-6 w-full py-10 px-6 justify-center z-10"
                    >
                        {/* Shadow move inside for better sync with animation */}
                        <div
                            className="absolute left-1/2 top-[75%] -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full opacity-60 pointer-events-none transition-all duration-700 -z-10"
                            style={{
                                background: `linear-gradient(0deg, ${activeFeature.shadowColor}, ${activeFeature.shadowColor})`,
                                filter: "blur(60px)"
                            }}
                        />

                        <div className="space-y-4 max-w-[340px]">
                            <h2 className="text-[24px] font-bold leading-none font-['Outfit'] text-white">
                                {activeFeature.title}
                            </h2>
                            <p className="text-white/70 text-[14px] leading-[22px] font-['Outfit']">
                                {activeFeature.description}
                            </p>
                        </div>

                        <div className="relative w-full max-w-[360px] mx-auto mt-6 h-[400px] flex items-center justify-center">
                            <img
                                src={activeFeature.img}
                                className="w-full h-full object-contain relative z-10"
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            <div className="flex gap-2.5 mb-10 z-20">
                {features.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-1 rounded-full transition-all duration-500 ${activeIndex === index
                            ? "w-6 bg-white"
                            : "w-1 bg-white/20 hover:bg-white/40"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturesList;
