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

const SubServiceCard = ({ title, description, btnText, path, icon, tag }) => (
  <Link
    to={path}
    className="group relative flex flex-col min-h-[190px] xs:min-h-[210px] sm:min-h-[280px] md:min-h-[340px] overflow-hidden rounded-[1.5rem] bg-[#1a144e] border border-white/10 transition-all duration-500 hover:border-pink-500/40 hover:bg-[#201a5e] shadow-2xl active:scale-[0.98]"
  >
    {/* Animated Glow Backdrop */}
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:to-purple-500/10 transition-all duration-700 pointer-events-none" />

    <div className="relative z-10 flex flex-col h-full p-3 xs:p-4 sm:p-7">
      {/* 1. Top Section: Tag & Heading */}
      <div className="mb-2 sm:mb-4">
        {tag && (
          <div className="mb-1.5 sm:mb-2.5">
            <span className={`text-[7px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-[3px] uppercase tracking-wider shadow-lg ${tag === 'Trusted'
              ? 'bg-[#facc15] text-[#1a144e]'
              : 'bg-gradient-to-r from-[#FF1E6D] to-[#FF458A] text-white'
              }`}
            >
              {tag}
            </span>
          </div>
        )}
        <h4 className="text-[15px] xs:text-[18px] sm:text-[24px] md:text-[28px] font-black text-white group-hover:text-pink-300 transition-colors tracking-tight leading-tight uppercase font-['Playfair_Display']">
          {title}
        </h4>
      </div>

      {/* 2 & 3. Middle Section: Description & Image */}
      <div className="flex flex-1 items-center gap-3 sm:gap-8 min-h-0">
        <div className="flex-[1.5] sm:flex-[1.3]">
          <p className="text-[10px] xs:text-[11.5px] sm:text-[15px] md:text-[17px] text-white/50 font-medium leading-tight group-hover:text-white/80 transition-colors line-clamp-2">
            {description}
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src={icon}
            alt=""
            className="w-full h-auto max-h-[90px] sm:max-h-[200px] object-contain drop-shadow-[0_12px_25px_rgba(0,0,0,0.6)] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3"
          />
        </div>
      </div>

      {/* 4. Bottom Section: Action Button */}
      <div className="mt-3 sm:mt-8">
        <div className="w-full flex items-center justify-center py-2 sm:py-4 bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/5 transition-all duration-500 group-hover:bg-[#B72099] group-hover:border-transparent group-hover:shadow-[0_0_25px_rgba(183,32,153,0.4)]">
          <span className="text-[10px] sm:text-[14px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-1.5 sm:gap-2">
            {btnText}
            <span className="text-[11px] sm:text-[16px] group-hover:translate-x-1 transition-transform">➔</span>
          </span>
        </div>
      </div>
    </div>
  </Link>
);

const CategoryHeader = ({ icon, title }) => (
  <div className="flex items-center gap-4 mb-6 mt-12 first:mt-0 relative group">
    <div className="w-10 h-10 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-pink-500/20 blur-lg rounded-full animate-pulse group-hover:scale-150 transition-transform duration-700"></div>
      <img src={icon} alt="" className="w-8 h-8 object-contain relative z-10 filter drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
    </div>
    <div className="flex flex-col">
      <h3 className="text-xl font-black text-white tracking-tight font-['Playfair_Display'] flex items-center gap-3">
        {title}
        <div className="h-[1px] flex-1 min-w-[60px] sm:min-w-[120px] bg-gradient-to-r from-pink-500 via-pink-500/20 to-transparent"></div>
      </h3>
      <span className="text-[9px] font-black text-pink-500/60 uppercase tracking-[0.3em] mt-0.5">Premium Service Tier</span>
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
        { title: "Customize song", description: "Create a personalized song.", btnText: "Create", path: "/user/song", icon: songs, tag: "Premium" }
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
        { title: "Safe Date", description: "Verified & Private Meet. Trusted by 1000+couples.", btnText: "Book Now", path: "/user/coming-soon", icon: date, tag: "Trusted" },
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
            {isSingleMode ? "Confess with Izhaar" : "Celebrate with Izhaar"}
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

              {/* Premium Animated SVG Arrows - Non-Overlapping */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                animate={{
                  x: isSingleMode ? -40 : 54, // Responsive offset to clear 'Committed'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  animate={{
                    rotate: isSingleMode ? 180 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex items-center justify-center relative"
                >
                  <motion.div
                    animate={{
                      x: [0, 4, 0],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "easeInOut"
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                      <path d="M6 17L11 12L6 7M13 17L18 12L13 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </motion.div>
              </motion.div>

              <button
                onClick={() => setIsSingleMode(true)}
                className={`flex-1 relative z-10 py-3 sm:py-4 rounded-full text-[12px] sm:text-[14px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isSingleMode ? 'text-white' : 'text-white/30'}`}
              >
                Single
              </button>

              <button
                onClick={() => setIsSingleMode(false)}
                className={`flex-1 relative z-10 py-3 sm:py-4 rounded-full text-[12px] sm:text-[14px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${!isSingleMode ? 'text-white' : 'text-white/30'}`}
              >
                Committed
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
                <CategoryHeader icon={cat.icon} title={cat.title} color={cat.color} />
                <div className="grid grid-cols-2 gap-3 sm:gap-10 lg:gap-12 items-stretch">
                  {cat.services.map((service, sIdx) => (
                    <SubServiceCard key={sIdx} {...service} />
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