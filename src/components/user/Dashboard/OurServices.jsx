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

const SubServiceCard = ({ title, description, btnText, path, icon }) => (
  <Link
    to={path}
    className="group relative flex flex-col h-full min-h-[160px] sm:min-h-[280px] overflow-hidden rounded-[1.5rem] sm:rounded-[3rem] bg-indigo-950/30 border border-white/5 backdrop-blur-2xl transition-all duration-700 hover:-translate-y-1.5 active:scale-[0.98] shadow-2xl"
  >
    {/* Animated Shine Effect */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full z-10" />

    <div className="p-3 sm:p-8 flex flex-col h-full relative z-10 items-center text-center">
      {/* Title & Description */}
      <h4 className="text-[12px] sm:text-[22px] font-black text-white group-hover:text-pink-300 transition-colors tracking-tight leading-tight uppercase font-['Playfair_Display'] mb-1 sm:mb-3">
        {title}
      </h4>
      <p className="text-[8px] sm:text-[14px] text-gray-500 font-medium line-clamp-1 sm:line-clamp-2 max-w-[90%] mb-2 sm:mb-4">
        {description}
      </p>

      {/* Large Central Icon */}
      <div className="flex-1 flex items-center justify-center w-full my-1 sm:my-4">
        <div className="relative w-16 h-16 sm:w-36 sm:h-36 flex items-center justify-center">
          <div className="absolute inset-0 bg-pink-500/10 blur-2xl rounded-full scale-150 group-hover:bg-pink-500/20 transition-all duration-700"></div>
          <img
            src={icon}
            alt={title}
            className="w-14 h-14 sm:w-28 sm:h-28 object-contain relative z-10 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3 drop-shadow-[0_8px_15px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>

      {/* Modern Action Button */}
      <div className="mt-auto w-full flex justify-center pt-2">
        <div className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-6 sm:py-2.5 bg-white/5 rounded-full border border-white/10 text-[8px] sm:text-[12px] font-black text-white group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-700 transition-all duration-500 shadow-xl">
          <span className="uppercase tracking-widest">{btnText}</span>
          <span className="group-hover:translate-x-1.5 transition-transform duration-300">➔</span>
        </div>
      </div>
    </div>
  </Link>
);

const CategoryHeader = ({ icon, title }) => (
  <div className="flex items-center gap-4 mb-6 mt-12 first:mt-0 relative">
    <div className="w-10 h-10 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-pink-500/20 blur-lg rounded-full animate-pulse"></div>
      <img src={icon} alt="" className="w-8 h-8 object-contain relative z-10 filter drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
    </div>
    <div className="flex flex-col">
      <h3 className="text-xl font-black text-white tracking-tight font-['Playfair_Display'] flex items-center gap-3">
        {title}
        <span className="h-[1px] w-20 bg-gradient-to-r from-pink-500/50 to-transparent"></span>
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
        { title: "Express Feelings", description: "Share your heart out secretly", btnText: "Send Now", path: "/user/letter-izhaar", icon: letter },
        { title: "Customize song", description: "Create a personalized song.", btnText: "Create", path: "/user/song", icon: songs }
      ]
    },
    {
      title: "Discover & Match",
      icon: discoverIcon,
      services: [
        { title: "Secret Crush", description: "Find out if they like you too.", btnText: "Reveal", path: "/user/secret-crush", icon: crush },
        { title: "True Connect", description: "Chat anonymously with your match.", btnText: "Try Now", path: "/user/true-connection", icon: trueconnect }
      ]
    },
    {
      title: "Fun & Gifts",
      icon: funGiftsIcon,
      services: [
        { title: "Games", description: "Play and connect whether you're single or together.", btnText: "Play Now", path: "/user/quiz", icon: game },
        { title: "Gifts", description: "Send thoughtful gifts", btnText: "Browse", path: "/gifts", icon: gift }
      ]
    }
  ] : [
    {
      title: "Date & Bond",
      icon: dateBondIcon,
      services: [
        { title: "Safe Date", description: "Verified & Private Meet. Trusted by 1000+couples.", btnText: "Book Now", path: "/user/coming-soon", icon: date },
        { title: "Start Movie Night", description: "Watch & Chat together", btnText: "Watch Now", path: "/user/watch-party", icon: teleparty }
      ]
    },
    {
      title: "Relationship Help",
      icon: relationshipHelpIcon,
      services: [
        { title: "Sorry Message", description: "Send heartfelt apologies", btnText: "Make Amends", path: "/user/letter-izhaar", icon: letter },
        { title: "Customize song", description: "Create a personalized love song.", btnText: "Create", path: "/user/song", icon: songs }
      ]
    },
    {
      title: "Fun & Gifts",
      icon: funGiftsIcon,
      services: [
        { title: "Play together", description: "Break the ice with games.", btnText: "Play Now", path: "/user/quiz", icon: game },
        { title: "Send Surprises", description: "Share love through gifts and surprise your loved one.", btnText: "Send", path: "/gifts", icon: gift }
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