import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import Assets from Service folder
const letterImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Service/letter?_a=BAMAOGeA0";
const songImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Service/song?_a=BAMAOGeA0";
const connectImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Service/connect?_a=BAMAOGeA0";
const crushImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Service/crush?_a=BAMAOGeA0";

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

    useEffect(() => {
        // Preload images to prevent "late arrival"
        features.forEach((feature) => {
            const img = new Image();
            img.src = feature.img;
        });

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const activeFeature = features[activeIndex];

    return (
        <section className="mt-10 px-6 overflow-hidden min-h-[550px] flex items-center justify-center relative">
            {/* Dynamic Centered Shadow */}
            <div
                className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 w-[142px] h-[142px] rounded-full opacity-100 pointer-events-none transition-all duration-700"
                style={{
                    background: `linear-gradient(0deg, ${activeFeature.shadowColor}, ${activeFeature.shadowColor})`,
                    filter: "blur(56.4px)"
                }}
            />

            <AnimatePresence>
                <motion.div
                    key={activeFeature.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col items-center text-center gap-6 w-full absolute inset-0 py-10 px-6 justify-center"
                >
                    <div className="space-y-4 max-w-[340px]">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-[24px] font-bold leading-none font-['Outfit'] text-white"
                        >
                            {activeFeature.title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="text-white/70 text-[14px] leading-[22px] font-['Outfit']"
                        >
                            {activeFeature.description}
                        </motion.p>
                    </div>

                    <div className="relative w-full max-w-[280px] mx-auto mt-4 aspect-square flex items-center justify-center">
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
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
