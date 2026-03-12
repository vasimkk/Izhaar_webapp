import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const testimonials = [
    {
        text: '"It was an excellent experience to work with Izhaar. The team delivered our project on time and helped us express our feelings beautifully. Looking forward to work with them again."',
        name: "Rahul Sharma",
        role: "Software Engineer",
        initials: "RS",
    },
    {
        text: '"Izhaar platform has completely changed how I express my feelings. Professional, well organized and creative team that helped me convey my emotions perfectly. Highly satisfied!"',
        name: "Priya Verma",
        role: "Marketing Manager",
        initials: "PV",
    },
    {
        text: '"Got my message delivered beautifully through Izhaar. Very creative and innovative work done with professional approach. I am extremely pleased with the service. Terrific job!"',
        name: "Arjun Kapoor",
        role: "Business Owner",
        initials: "AK",
    },
    {
        text: '"Izhaar made expressing my emotions so much easier. The platform is intuitive and the delivery was perfect. My loved one was touched beyond words. Thank you!"',
        name: "Neha Khan",
        role: "Designer",
        initials: "NK",
    }
];

const Testimonials = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slidesToShow = 1;
    const maxSlide = testimonials.length - 1;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(interval);
    }, [maxSlide]);

    return (
        <section className="px-6 mb-24 overflow-hidden">
            <div className="text-center mb-10">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase mb-2"
                >
                    Testimonials
                </motion.p>
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-white flex flex-col"
                >
                    What They Say <span className="text-[#EC4891]">About Us</span>
                </motion.h3>
            </div>

            <div className="relative">
                <div className="overflow-hidden">
                    <motion.div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="min-w-full px-1">
                                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 h-full flex flex-col items-center text-center backdrop-blur-xl">
                                    <p className="text-white/80 text-[14px] leading-relaxed mb-8 flex-grow italic">
                                        {t.text}
                                    </p>
                                    <div className="pt-6 border-t border-white/5 w-full flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EC4891] to-[#A928ED] p-[2px] mb-4">
                                            <div className="w-full h-full rounded-full bg-[#1A1025] flex items-center justify-center">
                                                <span className="text-lg font-bold text-white">{t.initials}</span>
                                            </div>
                                        </div>
                                        <h4 className="text-[16px] font-bold text-white">{t.name}</h4>
                                        <p className="text-[12px] text-white/40">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`h-2 rounded-full transition-all ${currentSlide === i ? "bg-[#EC4891] w-6" : "bg-white/20 w-2"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
