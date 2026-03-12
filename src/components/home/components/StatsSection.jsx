import React from "react";
import { motion } from "framer-motion";

const stats = [
    { value: "10K+", label: "Happy Users" },
    { value: "50K+", label: "Messages Sent" },
    { value: "5K+", label: "Connections Made" },
    { value: "24/7", label: "Support Available" },
];

const StatsSection = () => {
    return (
        <section className="px-6 mb-20 relative">
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-2 gap-4 max-w-[400px] mx-auto">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl text-center space-y-1"
                    >
                        <h2 className="text-[28px] font-black tracking-tight text-white leading-none">
                            {stat.value}
                        </h2>
                        <h3 className="text-[11px] font-medium text-white/50 uppercase tracking-wider leading-none">
                            {stat.label}
                        </h3>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default StatsSection;
