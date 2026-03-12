import React from "react";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Import Assets
import coupleImg from "../../../assets/home/couple.png";

const HeroSection = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const phrases = [
        { text: "Got a Crush?", id: 0, initialX: -100 },
        { text: "Like Someone?", id: 1, initialX: 100 },
        { text: "Too Scared to say it?", id: 2, initialX: -100 }
    ];

    return (
        <section className="px-6 flex flex-col items-center">
            <div className="text-center mb-2 space-y-3 overflow-visible w-full min-h-[120px] flex flex-col justify-center px-2">
                {phrases.map((phrase) => (
                    <motion.h1
                        key={phrase.id}
                        initial={{ opacity: 0, x: phrase.initialX }}
                        whileInView={{ opacity: 1, x: 0 }}
                        animate={{
                            scale: activeIndex === phrase.id ? 1.1 : 1,
                            opacity: activeIndex === phrase.id ? 1 : 0.6,
                        }}
                        transition={{
                            x: { duration: 0.8, ease: "easeOut" },
                            scale: { duration: 0.5 },
                            opacity: { duration: 0.5 }
                        }}
                        viewport={{ once: false }}
                        className={`font-bold leading-tight font-['Poppins'] transition-all duration-500 ${phrase.id === 2 ? 'text-[22px]' : 'text-[28px]'} ${activeIndex === phrase.id ? 'gradient-text-animated' : 'text-white'
                            }`}
                        style={{
                            WebkitTextFillColor: activeIndex === phrase.id ? 'transparent' : 'white'
                        }}
                    >
                        {phrase.text}
                    </motion.h1>
                ))}
            </div>

            {/* Illustration Section */}
            <div className="relative w-full h-[350px] flex items-end justify-center px-4 mb-6">
                {/* Background Shades - Intense & Darker */}
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    <div className="absolute left-[-15%] w-[70%] h-[90%] bg-[#B02683]/40 blur-[90px] rounded-full" />
                    <div className="absolute right-[-15%] w-[70%] h-[90%] bg-[#4A3AA7]/40 blur-[90px] rounded-full" />
                </div>


                <motion.img
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    viewport={{ once: false }}
                    src={coupleImg}
                    className="w-full max-w-[340px] h-[320px] object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                />
            </div>

            <div className="w-full flex flex-col items-center space-y-6">
                <motion.h4
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: false }}
                    className="text-[22px] font-bold text-center leading-none font-['Outfit'] flex items-center gap-2"
                >
                    <motion.span
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        We Can Help You
                    </motion.span>
                    <motion.span
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut"
                        }}
                        className="text-[#FF1EAD] inline-block"
                    >
                        ❤️
                    </motion.span>
                </motion.h4>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: false }}
                    onClick={() => navigate("/user/dashboard")}
                    style={{
                        background: "linear-gradient(90deg, #EC4891 -12.18%, #A928ED 76.79%)",
                        width: "250px",
                        height: "44px",
                        borderRadius: "33.6px"
                    }}
                    className="flex items-center justify-center gap-[11.2px] text-[16px] font-bold tracking-wide shadow-[0_0_20px_rgba(236,72,145,0.4)] active:scale-95 transition-all relative overflow-hidden"
                >
                    {/* Shimmer Light Effect */}
                    <motion.div
                        animate={{
                            left: ["-100%", "200%"]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 1
                        }}
                        className="absolute top-0 bottom-0 w-[50px] bg-white/30 skew-x-[-20deg] blur-md pointer-events-none"
                    />

                    <motion.span
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="font-bold relative z-10"
                    >
                        Join Now
                    </motion.span>
                    <div className="h-10 w-6 flex items-center justify-center relative z-10">
                        <FaUser className="text-white text-[10px]" />
                    </div>
                </motion.button>
            </div>
        </section>
    );
};

export default HeroSection;
