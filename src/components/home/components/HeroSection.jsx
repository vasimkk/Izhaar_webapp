import React from "react";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Import Assets
import boyImg from "../../../assets/home/boy.png";
import girlImg from "../../../assets/home/girl.png";

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="px-6 flex flex-col items-center">
            <div className="text-center mb-6 space-y-3 overflow-hidden">
                <motion.h1
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-[28px] font-bold text-[#E80977] leading-none font-['Poppins']"
                >
                    Got a Crush?
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-[28px] font-bold text-white leading-none font-['Poppins']"
                >
                    Like Someone?
                </motion.h2>

                <motion.h3
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-[24px] font-bold text-white leading-none font-['Poppins']"
                >
                    Too Scared to say it?
                </motion.h3>
            </div>

            {/* Illustration Section */}
            <div className="relative w-full h-[320px] flex items-end justify-center px-4 mb-6">
                {/* Background Shades - Intense & Darker */}
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    <div className="absolute left-[-15%] w-[70%] h-[90%] bg-[#B02683]/40 blur-[90px] rounded-full" />
                    <div className="absolute right-[-15%] w-[70%] h-[90%] bg-[#4A3AA7]/40 blur-[90px] rounded-full" />
                </div>

                <motion.img
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    viewport={{ once: true }}
                    src={boyImg}
                    className="w-[48%] h-[270px] object-contain relative z-10 drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)]"
                />

                <motion.img
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    viewport={{ once: true }}
                    src={girlImg}
                    className="w-[48%] h-[270px] object-contain relative z-10 drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)]"
                />
            </div>

            <div className="w-full flex flex-col items-center space-y-6">
                <motion.h4
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-[22px] font-bold text-center leading-none font-['Outfit']"
                >
                    We Can Help You <span className="text-[#FF1EAD]">❤️</span>
                </motion.h4>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    onClick={() => navigate("/user/dashboard")}
                    style={{
                        background: "linear-gradient(90deg, #EC4891 -12.18%, #A928ED 76.79%)",
                        width: "250px",
                        height: "40px",
                        borderRadius: "33.6px"
                    }}
                    className="flex items-center justify-center gap-[11.2px] text-[16px] font-bold tracking-wide shadow-2xl active:scale-95 transition-transform"
                >
                    <span className="font-bold">Join Now</span>
                    <div className="h-10 w-6 flex items-center justify-center">
                        <FaUser className="text-white text-[10px]" />
                    </div>
                </motion.button>
            </div>
        </section>
    );
};

export default HeroSection;
