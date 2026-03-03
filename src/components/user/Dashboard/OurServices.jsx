import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

// Premium 3D High-Fidelity Icons
import songs from "../../../assets/services/songs.png"
import gift from "../../../assets/services/gift.png"
import letter from "../../../assets/services/letter.png"
import teleparty from "../../../assets/services/teleparty.png"
import crush from "../../../assets/services/crush.png"
import trueconnect from "../../../assets/services/trueconnect.png"
import date from "../../../assets/services/date.png"
import game from "../../../assets/services/game.png"
import magazine from "../../../assets/services/magazine.png"

const ServiceIcon = ({ icon, title }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-60, 60], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-60, 60], [-15, 15]), { stiffness: 300, damping: 30 });
  const translateZ = useSpring(0, { stiffness: 300, damping: 30 });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
    translateZ.set(50);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    translateZ.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className="relative w-full aspect-square flex items-center justify-center"
    >
      <motion.img
        src={icon}
        alt={title}
        style={{ translateZ: translateZ }}
        className="w-[85%] h-[85%] object-contain filter brightness-110 saturate-[1.2] drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      />

      {/* Dynamic Glow Shadow */}
      <motion.div
        style={{
          translateZ: -20,
          opacity: useTransform(translateZ, [0, 50], [0, 0.3])
        }}
        className="absolute inset-4 bg-pink-500/20 blur-2xl rounded-full"
      />
    </motion.div>
  );
};
const OurServices = () => {
  const [index, setIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const services = [
    { title: "Express Feelings", desc: "Share your heart out secretly", path: "/user/letter-izhaar", icon: letter, color: "#EC4891", badge: "RECOMMENDED", cta: "Send Now", category: "Express Love" },
    { title: "Customize Song", desc: "Create a personalized song.", path: "/user/song", icon: songs, color: "#06b6d4", cta: "Create", category: "Express Love" },
    { title: "Secret Crush", desc: "Find out if they like you too.", path: "/user/secret-crush", icon: crush, color: "#8b5cf6", badge: "MOST USED", cta: "Reveal", category: "Discover & Match" },
    { title: "True Connect", desc: "Chat anonymously with your match.", path: "/user/true-connection", icon: trueconnect, color: "#10b981", badge: "PREMIUM", cta: "Try Now", category: "Discover & Match" },
    { title: "Safe Date", desc: "Verified & Private Meet.", path: "/user/coming-soon", icon: date, color: "#f43f5e", cta: "Meet", category: "Discover & Match" },
    { title: "Games", desc: "Play and connect with others.", path: "/user/quiz", icon: game, color: "#f59e0b", cta: "Play Now", category: "Fun & Together" },
    { title: "Gifts", desc: "Send thoughtful gifts", path: "/gifts", icon: gift, color: "#ec4899", cta: "Browse", category: "Fun & Together" },
    { title: "Movie Night", desc: "Watch & Chat together", path: "/user/watch-party", icon: teleparty, color: "#3b82f6", cta: "Start", category: "Fun & Together" },
    { title: "Play Together", desc: "Break the ice with games.", path: "/magazine", icon: magazine, color: "#6366f1", cta: "Open", category: "Fun & Together" }
  ];

  const nextService = () => setIndex((prev) => (prev + 1) % services.length);
  const prevService = () => setIndex((prev) => (prev - 1 + services.length) % services.length);

  // AUTOMATIC SLIDING LOGIC
  useEffect(() => {
    const interval = setInterval(nextService, 4000);
    return () => clearInterval(interval);
  }, [index]);

  const leftIdx = (index - 1 + services.length) % services.length;
  const centerIdx = index;
  const rightIdx = (index + 1) % services.length;

  const items = [
    { ...services[leftIdx], position: 'left' },
    { ...services[centerIdx], position: 'center' },
    { ...services[rightIdx], position: 'right' }
  ];

  const filteredServices = selectedCategory === "All"
    ? services
    : services.filter(service => {
      const title = service.title.toLowerCase();
      if (selectedCategory === "Single") {
        return ["crush", "connect", "song", "games", "play"].some(key => title.includes(key));
      }
      if (selectedCategory === "Committed") {
        return ["feelings", "date", "movie", "gift", "play"].some(key => title.includes(key));
      }
      return true;
    });

  return (
    <div className="w-full relative pt-0 pb-4 px-2 bg-transparent overflow-hidden selection:bg-pink-500 flex flex-col items-center">

      {/* COLORFUL BOUTIQUE HEADING */}
      <div className="w-full max-w-4xl pt-4 mb-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-1 h-1 bg-pink-500 shadow-[0_0_8px_#EC4891]" />
          <h2 className="dashboard-head-text text-sm md:text-base tracking-[0.1em]">
            Explore Izhaar
          </h2>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 via-pink-500/20 to-transparent ml-8" />
      </div>

      {/* THE DIRECT VECTOR TRIPLET (Ultra-Compact Height) */}
      <div className="relative w-full max-w-4xl h-[100px] md:h-[130px] flex items-center justify-center perspective-1000 z-10">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => {
            const isCenter = item.position === 'center';
            const isLeft = item.position === 'left';
            const isRight = item.position === 'right';

            return (
              <motion.div
                key={`${item.title}-${item.position}`}
                initial={{ opacity: 0, x: isLeft ? -40 : isRight ? 40 : 0, scale: 0.5 }}
                animate={{
                  opacity: isCenter ? 1 : 0.6,
                  x: isLeft ? (window.innerWidth < 768 ? -90 : -200) : isRight ? (window.innerWidth < 768 ? 90 : 220) : 0,
                  scale: isCenter ? 1.2 : 0.6,
                  zIndex: isCenter ? 30 : 10,
                  filter: isCenter ? "blur(0px)" : "blur(0.5px)"
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 350, damping: 45 }}
                className="absolute select-none"
              >
                <div className="relative flex flex-col items-center">
                  {isCenter ? (
                    <Link to={item.path} className="relative w-24 h-24 md:w-36 md:h-36 flex items-center justify-center p-1 cursor-pointer">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        src={item.icon}
                        alt={item.title}
                        className="w-full h-full object-contain filter brightness-110 saturate-[1.3] drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                        style={{ mixBlendMode: 'screen' }}
                      />
                    </Link>
                  ) : (
                    <div
                      onClick={isLeft ? prevService : nextService}
                      className="relative w-24 h-24 md:w-36 md:h-36 flex items-center justify-center p-1 cursor-pointer"
                    >
                      <img
                        src={item.icon}
                        alt={item.title}
                        className="w-full h-full object-contain opacity-70 filter brightness-100 saturate-[1.1]"
                        style={{ mixBlendMode: 'screen' }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* SELECTION LABEL (Ultra-Compact) */}
      <div className="mt-1 min-h-[60px] flex flex-col items-center z-20">
        <motion.h3
          key={`title-${index}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="dashboard-head-text text-lg md:text-2xl italic leading-none"
        >
          {services[index].title}
        </motion.h3>
        <motion.p
          key={`desc-${index}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] md:text-sm text-white/50 mt-1 max-w-[280px] text-center leading-tight"
        >
          {services[index].desc}
        </motion.p>
        <motion.div
          layoutId="underline"
          className="h-[1px] mt-2 shadow-[0_0_8px_white]"
          style={{ width: '20px', backgroundColor: services[index].color }}
        />
      </div>


    </div>
  );
};

export default OurServices;