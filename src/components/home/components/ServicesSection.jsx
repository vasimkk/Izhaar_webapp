import React from "react";
import { motion } from "framer-motion";

const services = [
    {
        id: 1,
        title: "Secret crush",
        icon: "🤫",
    },
    {
        id: 2,
        title: "Anonymous Message",
        icon: "✉️",
    },
    {
        id: 3,
        title: "Gift Box",
        icon: "🎁",
    },
    {
        id: 4,
        title: "Date Request",
        icon: "❤️",
    }
];

const ServicesSection = () => {
    return (
        <section className="px-6 mb-12">
            <div
                className="w-full p-8 flex flex-col items-center text-center"

            >
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-2xl font-bold text-white mb-4 font-['Poppins']"
                >
                    Explore Izhaar Services
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-sm text-white/60 mb-8 leading-relaxed max-w-[280px] font-['Outfit']"
                >
                    Different ways Izhaar helps you express your feelings and build real connections
                </motion.p>

                <div className="grid grid-cols-4 gap-4 w-full">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl shadow-inner border border-white/5 backdrop-blur-sm">
                                {service.icon}
                            </div>
                            {/* Title is hidden in the Figma screenshot but good to have for accessibility/future */}
                            {/* <span className="text-[10px] text-white/40 font-medium">{service.title}</span> */}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
