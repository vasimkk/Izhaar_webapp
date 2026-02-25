import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import songs from "../../../assets/services/songs.png"
import gift from "../../../assets/services/gift.png"
import letter from "../../../assets/services/letter.png"
import teleparty from "../../../assets/services/teleparty.png"
import crush from "../../../assets/services/crush.png"
import trueconnect from "../../../assets/services/trueconnect.png"
import date from "../../../assets/services/date.png"
import game from "../../../assets/services/game.png"

// Category Icons
import expressloveIcon from "../../../assets/services/expresslove.png"
import discoverIcon from "../../../assets/services/discover&match.png"
import funGiftsIcon from "../../../assets/services/fun&gifts.png"
import dateBondIcon from "../../../assets/services/date&bond.png"
import relationshipHelpIcon from "../../../assets/services/relationshiphelp.png"

const SubServiceCard = ({ title, description, btnText, path, icon, tag, index }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index || 0) * 0.08, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-full"
    >
      <Link
        to={path}
        className="group relative flex flex-col h-full min-h-[150px] xs:min-h-[165px] sm:min-h-[220px] overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] bg-[#2d266e]/30 backdrop-blur-md border border-white/10 transition-all duration-700 hover:border-pink-500/40 hover:bg-[#201a5e] shadow-xl active:scale-[0.98]"
      >
        {/* Luxury Cursor Spotlight Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(183, 32, 153, 0.12), transparent 40%)`
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-4 sm:p-7">
          <div className="flex flex-1 gap-2 items-start relative min-h-0">
            {/* Left Section: Content */}
            <div className="flex-1 flex flex-col h-full relative z-20 pr-4 sm:pr-20">
              {/* Heading */}
              <h4 className="text-[15px] sm:text-[26px] font-semibold text-white transition-colors font-['Poppins'] leading-tight mb-1">
                {title}
              </h4>

              {/* Description */}
              <p className="text-[12px] sm:text-[18px] text-pink-200/60 font-normal leading-tight font-['Poppins'] group-hover:text-white transition-colors mb-2.5 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                {description}
              </p>

              {/* Action Button - Bottom Left */}
              <div className="mt-auto">
                <div className="inline-flex items-center justify-center px-3.5 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#B72099] to-[#801369] rounded-full sm:rounded-lg shadow-lg group-hover:shadow-pink-500/40 transition-all duration-500">
                  <span className="text-[12px] sm:text-[18px] font-medium text-white font-['Poppins'] flex items-center gap-2 sm:gap-3 whitespace-nowrap">
                    {btnText}
                    <motion.span
                      animate={{ x: isHovered ? [0, 4, 0] : 0 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-[13px] sm:text-[20px]"
                    >
                      ➔
                    </motion.span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section: Image */}
            <div className="absolute right-[-10px] bottom-[-5px] sm:right-[-20px] sm:bottom-[-10px] w-[45%] h-[80%] sm:h-[90%] pointer-events-none flex items-end justify-end">
              <img
                src={icon}
                alt=""
                className="w-full h-full object-contain object-right-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


const CategoryHeader = ({ icon, title }) => (
  <div className="flex items-center gap-4 mb-6 mt-12 first:mt-0 relative group">
    <div className="w-10 h-10 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-pink-500/20 blur-lg rounded-full animate-pulse group-hover:scale-150 transition-transform duration-700"></div>
      <img src={icon} alt="" className="w-8 h-8 object-contain relative z-10 filter drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
    </div>
    <div className="flex flex-col">
      <h3 className="text-[16px] font-semibold text-white tracking-tight font-['Poppins'] flex items-center gap-3">
        {title}
        <div className="h-[1px] flex-1 min-w-[60px] sm:min-w-[120px] bg-gradient-to-r from-pink-500 via-pink-500/20 to-transparent"></div>
      </h3>
    </div>
  </div>
);

const OurServices = ({ isSingleMode: propMode, onModeChange }) => {
  const [localMode, setLocalMode] = useState(true);
  const isSingleMode = propMode !== undefined ? propMode : localMode;

  const setIsSingleMode = (val) => {
    if (onModeChange) onModeChange(val);
    setLocalMode(val);
  };

  const categories = isSingleMode ? [
    {
      title: "Express love",
      icon: expressloveIcon,
      services: [
        { title: "Express Feelings", description: "Share your heart out secretly", btnText: "Send Now", path: "/user/letter-izhaar", icon: letter, tag: "Trending" },
        { title: "Customize song", description: "Create a personalized love song.", btnText: "Create", path: "/user/song", icon: songs, tag: "Premium" }
      ]
    },
    {
      title: "Discover & Match",
      icon: discoverIcon,
      services: [
        { title: "Secret Crush", description: "Find out if they like you too.", btnText: "Reveal", path: "/user/secret-crush", icon: crush, tag: "Popular" },
        { title: "True Connect", description: "Chat anonymously with your match.", btnText: "Try Now", path: "/user/true-connection", icon: trueconnect, tag: "Trusted" }
      ]
    },
    {
      title: "Fun & Gifts",
      icon: funGiftsIcon,
      services: [
        { title: "Games", description: "Play and connect whether you're single or together.", btnText: "Play Now", path: "/user/quiz", icon: game, tag: "Trending" },
        { title: "Gifts", description: "Send thoughtful gifts", btnText: "Browse", path: "/gifts", icon: gift, tag: "Popular" }
      ]
    }
  ] : [
    {
      title: "Date & Bond",
      icon: dateBondIcon,
      services: [
        { title: "Safe Date", description: "Verified & Private Meet.\nTrusted by 1000+couples.", btnText: "Book Now", path: "/user/coming-soon", icon: date, tag: "Trusted" },
        { title: "Start Movie Night", description: "Watch & Chat together", btnText: "Watch Now", path: "/user/watch-party", icon: teleparty, tag: "Trending" }
      ]
    },
    {
      title: "Relationship Help",
      icon: relationshipHelpIcon,
      services: [
        { title: "Sorry Message", description: "Send heartfelt apologies", btnText: "Make Amends", path: "/user/letter-izhaar", icon: letter, tag: "Premium" },
        { title: "Customize song", description: "Create a personalized love song.", btnText: "Create", path: "/user/song", icon: songs, tag: "Popular" }
      ]
    },
    {
      title: "Fun & Gifts",
      icon: funGiftsIcon,
      services: [
        { title: "Play together", description: "Break the ice with games.", btnText: "Play Now", path: "/user/quiz", icon: game, tag: "Trending" },
        { title: "Send Surprises", description: "Share love through gifts and surprise your loved one.", btnText: "Send", path: "/gifts", icon: gift, tag: "Trusted" }
      ]
    }
  ];

  return (
    <div className="w-full text-white px-4 mb-20 relative">
      {/* Premium Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-28">
          <h2 className="text-[26px] xs:text-[32px] sm:text-[54px] font-['Playfair_Display'] font-black text-white mb-8 sm:mb-10 tracking-tight leading-tight px-2">
            {isSingleMode ? "Confess with Izhaar ❤️" : "Celebrate with Izhaar ❤️"}
          </h2>

          <div className="flex justify-center px-4">
            <div className="relative flex w-full max-w-[320px] sm:max-w-[440px] bg-[#1e1b4b]/40 backdrop-blur-2xl p-1.5 rounded-full border border-white/10 shadow-2xl overflow-hidden">
              <motion.div
                className="absolute inset-1.5 rounded-full bg-gradient-to-r from-[#B72099] to-[#801369] shadow-lg shadow-pink-500/40"
                initial={false}
                animate={{
                  x: isSingleMode ? 0 : '100%',
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                style={{
                  width: 'calc(50% - 6px)',
                  height: 'calc(100% - 12px)',
                }}
              />

              <button
                onClick={() => setIsSingleMode(true)}
                className={`flex-1 relative z-10 py-3 sm:py-4 rounded-full text-[14px] font-medium font-['Poppins'] transition-colors duration-500 ${isSingleMode ? 'text-white' : 'text-white/30'}`}
              >
                Single
              </button>

              <button
                onClick={() => setIsSingleMode(false)}
                className={`flex-1 relative z-10 py-3 sm:py-4 rounded-full text-[14px] font-medium font-['Poppins'] transition-colors duration-500 ${!isSingleMode ? 'text-white' : 'text-white/30'}`}
              >
                Commited
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSingleMode ? 'single' : 'committed'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-12 sm:space-y-20"
          >
            {categories.map((cat, idx) => (
              <div key={idx} className="relative">
                <CategoryHeader icon={cat.icon} title={cat.title} />
                <div className="grid grid-cols-2 gap-2 sm:gap-10 lg:gap-12 items-stretch">
                  {cat.services.map((service, sIdx) => (
                    <SubServiceCard key={sIdx} index={sIdx + idx * 2} {...service} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OurServices;