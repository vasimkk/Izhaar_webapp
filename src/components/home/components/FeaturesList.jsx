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
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const activeFeature = features[activeIndex];

    return (
        <section className="mt-10 px-6 overflow-hidden flex items-center justify-center relative min-h-[700px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeFeature.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ 
                        opacity: 0, 
                        x: -20,
                        transition: { duration: 0.5, ease: "easeIn" } 
                    }}
                    transition={{ 
                        duration: 1.5, 
                        ease: [0.22, 1, 0.36, 1] 
                    }}
                    className="flex flex-col items-center text-center gap-6 w-full py-10 px-6 justify-center z-10 relative"
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
        </section>
    );
};

export default FeaturesList;
