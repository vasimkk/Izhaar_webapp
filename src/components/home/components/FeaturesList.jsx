import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

// Import Assets
import img1 from "../../../assets/home/img1.png";
import img2 from "../../../assets/home/img2.png";
import img3 from "../../../assets/home/img3.png";
import TC from "../../../assets/home/TC.png";
import SC from "../../../assets/home/SC.png";

const FeaturesList = () => {
    return (
        <section className="mt-10 space-y-20 overflow-hidden">
            {/* True Connect */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="px-6 flex flex-col items-center text-center gap-4"
            >
                <div className="space-y-4 max-w-[340px]">
                    <h2 className="text-[20px] font-semibold leading-none font-['Outfit'] text-white">True connect</h2>
                    <p className="text-white/70 text-[14px] leading-[20px] font-['Outfit']">
                        Find someone who truly matches your mindset. Complete a short compatibility test, and Izhaar connects you with people who share similar interests, values, and relationship goals. Because real connections start with understanding, not just swiping. 💞
                    </p>
                </div>
                <div className="relative aspect-square w-full max-w-[320px] mx-auto mt-4">
                    <div className="absolute inset-x-0 bottom-0 top-[20%] bg-blue-500/20 blur-[100px] rounded-full" />
                    <img src={TC} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                </div>
            </motion.div>

            {/* Secret Crush */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="px-6 flex flex-col items-center text-center gap-3"
            >
                <div className="space-y-4 max-w-[340px]">
                    <h2 className="text-[20px] font-semibold leading-none font-['Outfit'] text-white">Secret Crush</h2>
                    <p className="text-white/70 text-[14px] leading-[20px] font-['Outfit']">
                        Have a crush on someone from school, college, or anywhere but never had the courage to say it? Send a Secret Crush through Izhaar. If they like you back, you both get notified. If not, your identity stays completely anonymous. No regret. Just a chance to know. 💌
                    </p>
                </div>
                <div className="relative w-full max-w-[340px] mx-auto mt-6">
                    <div className="absolute inset-x-0 bottom-0 top-[20%] bg-purple-500/20 blur-[100px] rounded-full" />
                    <img src={SC} className="w-full object-contain relative z-10 drop-shadow-2xl" />
                </div>
            </motion.div>

            {/* Izhaar Love */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="px-6 flex flex-col items-center text-center gap-4"
            >
                <div className="space-y-4 max-w-[340px]">
                    <h2 className="text-[20px] font-semibold leading-none font-['Outfit'] text-white">Izhaar Love</h2>
                    <p className="text-white/70 text-[14px] leading-[20px] font-['Outfit']">
                        A service where Izhaar expresses your feelings to your crush or loved one on your behalf — perfect for those who are shy, fear rejection, or find it hard to say "I like you" directly. Because some feelings are better expressed with a little help. 💌
                    </p>
                </div>
                <div className="relative aspect-square w-full max-w-[320px] mx-auto mt-6">
                    <div className="absolute inset-x-0 bottom-0 top-[20%] bg-pink-500/20 blur-[100px] rounded-full" />
                    <img src={TC} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                </div>
            </motion.div>

            {/* Customize a Song */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="px-6 flex flex-col items-center text-center gap-4"
            >
                <div className="space-y-4 max-w-[340px]">
                    <h2 className="text-[20px] font-semibold leading-none font-['Outfit'] text-white">Customize a song</h2>
                    <p className="text-white/70 text-[14px] leading-[20px] font-['Outfit']">
                        Turn your feelings into a personalized romantic song. Izhaar creates a custom song with your message and sends it to your special person. A unique way to make your confession truly unforgettable. 🎵
                    </p>
                </div>
                <div className="relative aspect-square w-full max-w-[320px] mx-auto mt-6">
                    <div className="absolute inset-x-0 bottom-0 top-[20%] bg-indigo-500/20 blur-[100px] rounded-full" />
                    <img src={TC} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                </div>
            </motion.div>
        </section>
    );
};

export default FeaturesList;
