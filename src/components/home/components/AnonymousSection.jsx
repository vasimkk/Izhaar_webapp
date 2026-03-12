import React from "react";
import { motion } from "framer-motion";

// Import local assets
import img1 from "../../../assets/Vectos/1.png"; // Hidden Identity
import img2 from "../../../assets/Vectos/2.png"; // Heart Lock
import img3 from "../../../assets/Vectos/3.png"; // Shield
import img4 from "../../../assets/Vectos/4.png"; // Until You're ready
import img5 from "../../../assets/Vectos/5.png"; // Mask

const AnonymousSection = () => {
    return (
        <section className="relative py-16 px-6 bg-black flex flex-col items-center">

            {/* Section Heading */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-[22px] font-bold font-['Poppins'] text-white/90 mb-10 text-center leading-normal"
            >
                Why Izhaar
            </motion.h2>

            {/* Box Layout Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative shadow-2xl flex flex-col items-center justify-center p-8"
                style={{
                    width: "412px",
                    height: "397px",
                    maxWidth: "100%"
                }}
            >
                {/* Decorative Background Glows inside the box */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-[#EC4891]/10 blur-[100px] rounded-full pointer-events-none" />

                {/* Center Content Group */}
                <div className="relative z-20 flex flex-col items-center gap-3">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-[24px] font-[900] font-['Outfit'] text-[#EC4899CC] text-center leading-[100%] tracking-tight uppercase"
                    >
                        Anonymous First
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "60px" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="h-[2px] bg-gradient-to-r from-transparent via-[#EC4891] to-transparent"
                    />
                </div>

                {/* Floating Elements with Synchronized Entry and Smooth Rhythm Loops */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 pointer-events-none"
                >
                    {/* 1. Hidden Identity (Top Left) */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            x: [0, 5, 0]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-[12%] left-[8%] w-[85px] z-10 pointer-events-auto"
                    >
                        <img src={img1} alt="Hidden Identity" className="w-full h-auto drop-shadow-[0_5px_15px_rgba(236,72,145,0.3)]" />
                    </motion.div>

                    {/* 2. Heart Lock (Top Right) */}
                    <motion.div
                        animate={{
                            y: [0, -12, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{
                            duration: 5.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-[6%] right-[12%] w-[75px] z-10 pointer-events-auto"
                    >
                        <img src={img2} alt="Heart Lock" className="w-full h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                    </motion.div>

                    {/* 3. Shield (Middle Left) */}
                    <motion.div
                        animate={{
                            x: [0, -8, 0],
                            y: [0, 10, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-[48%] left-[2%] w-[60px] z-10 pointer-events-auto"
                    >
                        <img src={img3} alt="Shield" className="w-full h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                    </motion.div>

                    {/* 4. Until You're ready (Bottom Center) */}
                    <motion.div
                        animate={{
                            y: [0, 12, 0]
                        }}
                        transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[130px] z-10 pointer-events-auto"
                    >
                        <img src={img4} alt="Until You're ready" className="w-full h-auto drop-shadow-[0_5px_15px_rgba(236,72,145,0.3)]" />
                    </motion.div>

                    {/* 5. Mask (Middle Right) */}
                    <motion.div
                        animate={{
                            x: [0, 8, 0],
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 4.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-[48%] right-[2%] w-[80px] z-10 pointer-events-auto"
                    >
                        <img src={img5} alt="Mask" className="w-full h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                    </motion.div>
                </motion.div>
            </motion.div>

        </section>
    );
};

export default AnonymousSection;
