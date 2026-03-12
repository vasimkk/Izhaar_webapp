import React from "react";
import { motion } from "framer-motion";

// Import Assets
const safedateImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Website/safedate?_a=BAMAOGeA0";
const telepartyImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Website/teleparty?_a=BAMAOGeA0";
const letterImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Website/letter?_a=BAMAOGeA0";
const crushImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Website/crush?_a=BAMAOGeA0";
const songsImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Website/songs?_a=BAMAOGeA0";
const playImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Website/play%20togethrr?_a=BAMAOGeA0";
const magazineImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Website/magazines?_a=BAMAOGeA0";
const connectImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Website/trueconnect?_a=BAMAOGeA0";

const services = [
    { id: 1, title: "Safe Date", img: safedateImg },
    { id: 2, title: "Watch together", img: telepartyImg },
    { id: 3, title: "Izhaar Love", img: letterImg },
    { id: 4, title: "Secret Crush", img: crushImg },
    { id: 5, title: "Shared Songs", img: songsImg },
    { id: 6, title: "Play Together", img: playImg },
    { id: 7, title: "Magazines", img: magazineImg },
    { id: 8, title: "True Connect", img: connectImg },
];

const ServicesSection = () => {
    // Duplicate services for seamless loop
    const allServices = [...services, ...services];

    return (
        <section className="px-4 mb-12 flex justify-center w-full overflow-hidden">
            <div
                className="w-full max-w-[380px] h-auto min-h-[255px] p-6 flex flex-col items-center text-center relative rounded-[16px] backdrop-blur-lg border border-white/10"
                style={{
                    background: "linear-gradient(89.21deg, rgba(123, 5, 75, 0.8) 0.61%, rgba(53, 4, 101, 0.8) 99.27%), linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
                    gap: "20px",
                }}
            >
                <div className="flex flex-col items-center gap-1 mb-2">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-[18px] font-bold text-white font-['Poppins'] leading-tight"
                    >
                        Explore Izhaar Services
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-[11px] text-white/60 leading-tight max-w-[260px] font-['Outfit']"
                    >
                        Different ways Izhaar helps you express your feelings and build real connections
                    </motion.p>
                </div>

                {/* Marquee Container */}
                <div className="relative w-full overflow-hidden py-2">
                    <motion.div
                        className="flex gap-4 w-fit"
                        animate={{
                            x: [0, -100 * services.length - 16 * services.length]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {allServices.map((service, index) => (
                            <div
                                key={`${service.id}-${index}`}
                                style={{ background: "rgba(255, 255, 255, 0.05)" }}
                                className="w-[110px] h-[130px] rounded-[16px] py-3 px-1 flex flex-col items-center justify-between border border-white/5 shadow-lg backdrop-blur-sm shrink-0"
                            >
                                <div className="w-full h-[75px] flex items-center justify-center overflow-hidden">
                                    <img
                                        src={service.img}
                                        alt={service.title}
                                        className="w-[85%] h-full object-contain drop-shadow-[0_8px_15px_rgba(0,0,0,0.3)]"
                                    />
                                </div>
                                <span className="text-[10px] font-semibold text-white/90 font-['Outfit'] mt-2 text-center">
                                    {service.title}
                                </span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Fade Edges for smoother marquee */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#5a0558]/30 to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#350465]/30 to-transparent pointer-events-none z-10" />
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
