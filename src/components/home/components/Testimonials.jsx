import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";

// Import local assets
import user1 from "../../../assets/testimonials/User1.png";
import user2 from "../../../assets/testimonials/User2.png";
import user3 from "../../../assets/testimonials/User3.png";
import user4 from "../../../assets/testimonials/User4.png";

const testimonials = [
  {
    id: 1,
    name: "Priya",
    text: "I was too nervous to tell my crush how I felt. IZHAAR helped me send an anonymous message, and now we're together! 💕",
    img: user1,
  },
  {
    id: 2,
    name: "Rahul",
    text: "I liked her for years but never had the courage to say it. Izhaar helped me finally express it.",
    img: user2,
  },
  {
    id: 3,
    name: "Hasini",
    text: "I received a secret confession and it made my day. I never knew someone liked me.",
    img: user3,
  },
  {
    id: 4,
    name: "Jagadeesh",
    text: "I had a crush on her since college but never had the courage to say it. Izhaar’s Secret Crush feature helped me finally express my feelings without fear. Best decision ever.",
    img: user4,
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeT = testimonials[activeIndex];

  return (
    <section className="px-5 mb-18 flex flex-col items-center">
      {/* Real Stories Heading */}
      <div className="text-center mb-12">
        <h2 className="text-[22px] font-bold text-white font-['Poppins'] leading-none">
          Real Stories
        </h2>
        <div className="w-16 h-[3.5px] bg-[#EC4891] mx-auto mt-2 rounded-full" />
      </div>

      {/* Testimonial Card */}
      <div className="relative w-full max-w-[400px] h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-[280px] mt-20 rounded-[32px] overflow-visible flex flex-col relative"
              style={{
                background: "linear-gradient(180deg, rgba(74, 3, 48, 1) 0%, rgba(42, 5, 77, 1) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              {/* Full Image Container - Floating style */}
              <div className="absolute -top-16 left-6 flex items-end gap-8 z-30">
                <div className="w-[140px] h-[180px] rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.6)] border-2 border-white/20 relative">
                  <img
                    src={activeT.img}
                    alt={activeT.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Decorative Element */}
                  <div className="absolute bottom-2 right-2 w-7 h-7 bg-[#EC4891] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/10">
                    <FaHeart size={10} />
                  </div>
                </div>

                <div className="mb-2">
                  <h4 className="text-[24px] font-[1000] text-white font-['Outfit'] tracking-tight leading-none mb-2">
                    {activeT.name}
                  </h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaHeart key={i} className="text-[#FEC007] text-[10px]" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Part */}
              <div className="mt-36 px-8 pb-8 flex flex-col gap-3 relative z-20">
                <p className="text-white/80 text-[14px] leading-relaxed font-['Poppins'] italic">
                  "{activeT.text}"
                </p>
              </div>

              {/* Subtle Background Icon */}
              <div className="absolute top-4 right-8 opacity-5">
                <FaHeart size={80} className="text-white" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${activeIndex === i ? "w-4 bg-[#EC4891]" : "w-1 bg-white/20"
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;