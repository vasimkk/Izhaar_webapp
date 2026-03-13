import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

const Counter = ({ value, duration = 2 }) => {
    const numericValue = parseInt(value);
    const count = useMotionValue(100);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(100);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, numericValue, {
                duration: duration,
                ease: "easeOut",
            });
            return controls.stop;
        }
    }, [isInView, numericValue, count, duration]);

    useEffect(() => {
        return rounded.onChange((latest) => {
            setDisplayValue(latest);
        });
    }, [rounded]);

    return <span ref={ref}>{displayValue}{value.includes("+") ? "+" : ""}</span>;
};

const stats = [
    {
        value: "10000+",
        label: "People on Izhaar",
        desc: "People are already sharing their feelings and starting new connections on Izhaar."
    },
    {
        value: "5000+",
        label: "Matches made",
        desc: "Thousands of confessions have already turned into beautiful connections."
    },
    {
        value: "2000+",
        label: "Happy Couples",
        desc: "Love stories that started with a confession on Izhaar."
    }
];

const StatsSection = () => {
    return (
        <section className="px-6  mb-20 flex flex-col items-center">

            {/* Main Stats Box */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[380px] rounded-[16px] p-[24px] flex flex-col items-center border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative"
                style={{
                    background: "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(359.27deg, #7B054B 0.62%, #350465 99.38%)",
                    minHeight: "395px"
                }}
            >
                {/* Subtle Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <div className="flex flex-col h-full items-center justify-between py-6 z-10 w-full">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center w-full">
                            <div className="flex flex-col items-center text-center px-4">
                                <h2 className="text-[36px] font-[900] font-['Outfit'] text-white leading-none mb-1 drop-shadow-lg">
                                    <Counter value={stat.value} />
                                </h2>
                                <h3 className="text-[14px] font-bold font-['Poppins'] text-white/90 mb-2 leading-tight uppercase tracking-[0.1em]">
                                    {stat.label}
                                </h3>
                                <p className="text-[12px] font-normal font-['Poppins'] text-white/50 leading-relaxed max-w-[280px]">
                                    {stat.desc}
                                </p>
                            </div>

                            {/* Dotted Separator */}
                            {i < stats.length - 1 && (
                                <div className="w-[85%] border-b border-dashed border-white/10 mt-6" />
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

        </section>
    );
};

export default StatsSection;
