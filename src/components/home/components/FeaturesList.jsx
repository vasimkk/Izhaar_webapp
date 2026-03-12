import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import Assets from Service folder
import letterImg from "../../../assets/Service/letter.png";
import songImg from "../../../assets/Service/song.png";
import connectImg from "../../../assets/Service/connect.png";
import crushImg from "../../../assets/Service/crush.png";

const features = [
    {
        id: 1,
        title: "True Connect",
        description: "Find someone who truly matches your mindset. Complete a short compatibility test, and Izhaar connects you with people who share similar interests, values, and relationship goals. Because real connections start with understanding, not just swiping. 💞",
        img: connectImg,

    },
    {
        id: 2,
        title: "Secret Crush",
        description: "Have a crush on someone from school, college, or anywhere but never had the courage to say it? Send a Secret Crush through Izhaar. If they like you back, you both get notified. If not, your identity stays completely anonymous. No regret. Just a chance to know. 💌",
        img: crushImg,

    },
    {
        id: 3,
        title: "Izhaar Love",
        description: "A service where Izhaar expresses your feelings to your crush or loved one on your behalf — perfect for those who are shy, fear rejection, or find it hard to say \"I like you\" directly. Because some feelings are better expressed with a little help. 💌",
        img: letterImg,

    },
    {
        id: 4,
        title: "Customize a song",
        description: "Turn your feelings into a personalized romantic song. Izhaar creates a custom song with your message and sends it to your special person. A unique way to make your confession truly unforgettable. 🎵",
        img: songImg,

    }
];

const FeaturesList = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const activeFeature = features[activeIndex];

    return (
        <section className="mt-10 px-6 overflow-hidden min-h-[600px] flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeFeature.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center text-center gap-6 w-full"
                >
                    <div className="space-y-4 max-w-[340px]">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-[24px] font-bold leading-none font-['Outfit'] text-white"
                        >
                            {activeFeature.title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/70 text-[14px] leading-[22px] font-['Outfit']"
                        >
                            {activeFeature.description}
                        </motion.p>
                    </div>

                    <div className="relative w-full max-w-[380px] mx-auto mt-4 aspect-square flex items-center justify-center">
                        <motion.div
                            key={`glow-${activeFeature.id}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.1, opacity: 0.4 }}
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: activeFeature.color,
                                filter: "blur(56.4px)"
                            }}
                        />
                        <motion.img
                            initial={{ scale: 0.9, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            src={activeFeature.img}
                            className="w-full h-full object-contain relative z-10"
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        </section>
    );
};

export default FeaturesList;
