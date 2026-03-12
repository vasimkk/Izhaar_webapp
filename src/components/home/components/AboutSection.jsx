import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaHeart, FaHandHoldingHeart } from "react-icons/fa";

const AboutSection = () => {
    return (
        <section id="about" className="mt-8 px-6 text-center overflow-hidden">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6 }}
                className="text-[22px] font-bold mb-4 leading-none font-['Poppins']"
            >
                We've all been there...
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-white/40 text-[13px] leading-relaxed mb-12 px-6"
            >
                You like someone. You think about them all the time. But when it comes to saying how you feel, the words just don't come out.
            </motion.p>

            <div className="flex justify-center gap-[10px] mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {[
                    { label: "Sign Up", icon: <FaUser />, initial: { opacity: 0, x: -50 } },
                    { label: "Confess", icon: <FaHandHoldingHeart />, initial: { opacity: 0, y: -50 } },
                    { label: "Connect", icon: <FaHeart />, initial: { opacity: 0, x: 50 } }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={item.initial}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ background: "linear-gradient(89.21deg, rgba(123, 5, 75, 0.15) 0.61%, rgba(53, 4, 101, 0.15) 99.27%)" }}
                        className="w-[85px] h-[85px] border border-white/10 rounded-[16px] p-3 flex flex-col items-center justify-center gap-2 shadow-xl shrink-0"
                    >
                        <div className="text-3xl text-white/80">{item.icon}</div>
                        <span className="text-[11px] font-bold uppercase tracking-tight text-white/60">{item.label}</span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default AboutSection;
