import React from 'react';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';

const OfferSection = () => {
    const prices = [
        { title: "Digital Letter", price: "99", originalPrice: "199", tag: "BEST SELLER", color: "#EC4891" },
        { title: "Personalized Song", price: "499", originalPrice: "999", tag: "POPULAR", color: "#A928ED" },
    ];

    // Multiply items for a smooth infinite loop since we only have two
    const loopedPrices = [...prices, ...prices, ...prices, ...prices];

    return (
        <div className="w-full mt-4 mb-16 overflow-hidden">
            {/* Heading */}
            <div className="flex items-center justify-between mb-4 px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <HiSparkles className="text-pink-500 text-lg drop-shadow-[0_0_8px_rgba(236,72,145,0.6)]" />
                    <h2
                        className="text-white tracking-[0.1em]"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '16px' }}
                    >
                        Premium Offers
                    </h2>
                </div>
                <button className="text-[10px] font-black text-pink-500 uppercase tracking-widest hover:text-white transition-colors">
                    View All
                </button>
            </div>

            {/* Infinite Marquee Section */}
            <div className="relative flex items-center">
                <motion.div
                    className="flex gap-4 py-2"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ width: "max-content" }}
                >
                    {loopedPrices.map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileTap={{ scale: 0.98 }}
                            className="relative p-3 w-[240px] md:w-[280px] rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden flex items-center justify-between shrink-0 group"
                        >
                            {/* Status Tag */}
                            <div
                                className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg text-[6px] md:text-[7px] font-black tracking-widest text-white shadow-lg z-10"
                                style={{ backgroundColor: item.color }}
                            >
                                {item.tag}
                            </div>

                            <div className="relative z-10 flex flex-col">
                                <h4 className="text-white/40 text-[8px] font-bold uppercase tracking-widest mb-0.5">{item.title}</h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-black text-white">₹{item.price}</span>
                                    <span className="text-[9px] text-white/20 line-through font-medium">₹{item.originalPrice}</span>
                                    <span className="text-[8px] text-emerald-400 font-bold ml-1">SAVE {(100 - (parseInt(item.price) / parseInt(item.originalPrice) * 100)).toFixed(0)}%</span>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <button
                                    className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all bg-white text-black hover:bg-pink-500 hover:text-white shadow-lg"
                                >
                                    Claim
                                </button>
                            </div>

                            {/* Background Decoration */}
                            <div
                                className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full blur-[20px] opacity-10"
                                style={{ backgroundColor: item.color }}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Side Fades for Marquee */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#000] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#000] to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
};

export default OfferSection;
