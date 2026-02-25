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

const SubServiceCard = ({ title, description, btnText, path, icon, tag, index, color = "#B72099", imgScale = 1, cardBg }) => {
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
      className="relative w-full"
    >
      <Link
        to={path}
        className="group relative flex flex-col w-full aspect-[16/10] sm:aspect-[16/9] rounded-[1.1rem] sm:rounded-[1.85rem] active:scale-[0.98] transition-all duration-700 p-[1px] overflow-visible shadow-2xl"
      >
        {/* Animated SVG Border Trace (Example 5 Style) */}
        <svg className="card-border-svg overflow-visible px-[2px]">
          {/* Static Hairline Border */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            stroke={color}
            strokeWidth="0.5"
            style={{ opacity: 0.25 }}
          />
          {/* Animating traces */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            stroke={color}
            strokeWidth="0.1"
            className="animate-trace"
            style={{
              opacity: isHovered ? 1 : 0.7,
              filter: `drop-shadow(0 0 2px ${color})`,
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          />
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            stroke={color}
            strokeWidth="0.1"
            className="animate-trace"
            style={{
              animationDelay: '-4s',
              opacity: isHovered ? 1 : 0.7,
              filter: `drop-shadow(0 0 2px ${color})`,
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          />
        </svg>

        {/* Inner Card Body and Clipping */}
        <div
          className="absolute inset-[1px] overflow-hidden rounded-[1rem] sm:rounded-[1.75rem] backdrop-blur-3xl transition-all duration-700 shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]"
          style={{
            background: cardBg || (isHovered ? `${color}20` : 'rgba(255, 255, 255, 0.03)'),
            border: `1px solid ${color}40`,
            boxShadow: `inset 0 0 20px ${color}10`
          }}
        >
          {/* Glass Top Shine Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          {/* Dynamic Shaders for Premium Depth - Refined for User Image Match */}
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000"
            style={{
              background: `linear-gradient(135deg, ${color}40 0%, transparent 60%)`,
            }}
          />

          {/* Top-Right Corner Light Beam (Matches User Image) */}
          <div className="absolute -top-12 -right-12 w-48 h-48 blur-[50px] opacity-50 transition-all duration-1000 group-hover:opacity-80 group-hover:scale-110 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${color}60 0%, transparent 70%)` }} />

          {/* Luxury Cursor Spotlight Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${color}25, transparent 40%)`
            }}
          />

          {/* Top-Right Corner Shader (User Requested) */}
          <div className="absolute -top-10 -right-10 w-32 h-32 blur-[40px] opacity-40 transition-opacity duration-1000 group-hover:opacity-70 pointer-events-none"
            style={{ background: `radial-gradient(circle, #D824EB40 0%, transparent 70%)` }} />
        </div>

        {/* Content Layout: 2-Column Split for Stable Alignment */}
        <div className="relative z-10 flex flex-row h-full p-2.5 xs:p-3 sm:p-7 pt-3 xs:pt-4 sm:pt-8 w-full overflow-visible">

          {/* Left Side: Content Column */}
          <div className="flex-[1.8] sm:flex-[2] flex flex-col h-full justify-between min-w-0 z-40 relative">
            <div className="flex flex-col gap-0.5 sm:gap-1">
              {tag && (
                <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                  <span
                    className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[6px] xs:text-[7px] sm:text-[9px] font-bold uppercase tracking-widest leading-none font-['Poppins'] ${tag === 'RECOMMENDED' ? 'bg-[#FBBF24] text-black' : tag === 'MOST USED' ? 'bg-[#EF4444] text-white' : tag === 'PREMIUM' ? 'bg-[#A855F7] text-white' : 'bg-[#FFD700] text-[#1e1b4b]'} rounded-sm`}
                  >
                    {tag}
                  </span>
                </div>
              )}
              <h4 className="text-[11px] xs:text-[13px] sm:text-[20px] font-bold text-white transition-colors font-['Poppins'] leading-tight sm:leading-tight">
                {title}
              </h4>
              <p className="text-[7.5px] xs:text-[9px] sm:text-[13px] text-white/40 font-normal leading-tight font-['Poppins'] group-hover:text-white/70 transition-colors whitespace-pre-line pr-1 line-clamp-2 sm:line-clamp-none">
                {description}
              </p>
            </div>

            {/* Button at bottom of left column */}
            <div className="mt-auto">
              <div
                className="inline-flex items-center justify-center px-2.5 py-1 sm:px-5 sm:py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full sm:rounded-xl shadow-2xl transition-all duration-500 group-hover:border-transparent"
                style={{
                  backgroundColor: isHovered ? `${color}60` : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <span className="text-[9px] xs:text-[11px] sm:text-[16px] font-medium text-white font-['Poppins'] flex items-center gap-1 sm:gap-2.5 whitespace-nowrap">
                  {btnText}
                  <motion.span
                    animate={{ x: isHovered ? [0, 3, 0] : 0 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-[10px] xs:text-[12px] sm:text-[18px]"
                  >
                    ➔
                  </motion.span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Image Column */}
          <div className="flex-1 relative h-full pointer-events-none z-10">
            <div className="absolute right-[-8px] bottom-[-12px] xs:right-[-10px] xs:bottom-[-15px] sm:right-[-25px] sm:bottom-[-35px] w-[130%] h-[120%] sm:h-[135%] flex items-end justify-end">
              <motion.img
                src={icon}
                alt=""
                className="max-w-none w-full h-full object-contain object-right-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-1000 group-hover:scale-115 opacity-95 group-hover:opacity-100"
                style={{
                  transform: `scale(${imgScale})`,
                  transformOrigin: 'bottom right'
                }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              />
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
};


const CategoryHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-6 mt-4 sm:mt-10 first:mt-0 relative group">
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      className="w-8 h-8 flex items-center justify-center relative"
    >
      <motion.img
        src={icon}
        alt=""
        className="w-full h-full object-contain relative z-10"
        animate={{
          y: [0, -3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="absolute inset-0 bg-pink-500/20 blur-lg rounded-full animate-pulse" />
    </motion.div>
    <div className="flex flex-col flex-1">
      <h3 className="text-[18px] sm:text-[22px] font-bold text-white tracking-tight font-['Poppins'] flex items-center gap-4">
        {title}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          className="h-[2px] flex-1 min-w-[60px] sm:min-w-[150px] bg-gradient-to-r from-pink-500/60 via-pink-500/10 to-transparent"
        ></motion.div>
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
        { title: "Express Feelings", description: "Share your heart\nout secretly", btnText: "Send Now", path: "/user/letter-izhaar", icon: letter, color: "#D824EB", tag: "RECOMMENDED", imgScale: 1.4, cardBg: 'linear-gradient(135deg, #6B21A850 0%, #4C1D9580 100%)' },
        { title: "Customize song", description: "Create a personalized\nlove song.", btnText: "Create", path: "/user/song", icon: songs, color: "#A78BFA", tag: "NEW", imgScale: 1.2, cardBg: 'linear-gradient(135deg, #1E1B4B60 0%, #312E8190 100%)' }
      ]
    },
    {
      title: "Discover & Match",
      icon: discoverIcon,
      services: [
        { title: "Secret Crush", description: "Find out if they\nlike you too.", btnText: "Reveal", path: "/user/secret-crush", icon: crush, color: "#F472B6", tag: "MOST USED", imgScale: 1.5, cardBg: 'linear-gradient(135deg, #9D174D60 0%, #83184390 100%)' },
        { title: "True Connect", description: "Chat anonymously\nwith match.", btnText: "Try Now", path: "/user/true-connection", icon: trueconnect, color: "#34D399", tag: "PREMIUM", imgScale: 1.35, cardBg: 'linear-gradient(135deg, #0F172A60 0%, #1E1B4B90 100%)' }
      ]
    },
    {
      title: "Fun & Gifts",
      icon: funGiftsIcon,
      services: [
        { title: "Games", description: "Play and connect  whether\nyou're single or together.", btnText: "Play Now", path: "/user/quiz", icon: game, color: "#FBBF24", imgScale: 1.8, cardBg: 'linear-gradient(135deg, #1E1B4B 0%, #1E3A8A60 100%)' },
        { title: "Gifts", description: "Send thoughtful\ngifts", btnText: "Browse", path: "/gifts", icon: gift, color: "#F87171", imgScale: 1.4, cardBg: 'linear-gradient(135deg, #450A0A50 0%, #88133760 100%)' }
      ]
    }
  ]
    : [
      {
        title: "Date & Bond",
        icon: dateBondIcon,
        services: [
          { title: "Safe Date", description: "Verified & Private Meet.\nTrusted by 1000+ couples.", btnText: "Book Now", path: "/user/coming-soon", icon: date, color: "#818CF8", tag: "TRUSTED", imgScale: 1.25, cardBg: 'linear-gradient(135deg, #1E1B4B60 0%, #312E8190 100%)' },
          { title: "Start Movie Night", description: "Watch & Chat\ntogether", btnText: "Watch Now", path: "/user/watch-party", icon: teleparty, color: "#E879F9", tag: "TRENDING", imgScale: 1.3, cardBg: 'linear-gradient(135deg, #1E1B4B60 0%, #312E8190 100%)' }
        ]
      },
      {
        title: "Relationship Help",
        icon: relationshipHelpIcon,
        services: [
          { title: "Sorry Message", description: "Send heartfelt\napologies", btnText: "Make Amends", path: "/user/letter-izhaar", icon: letter, color: "#E72B53", tag: "TRENDING", imgScale: 1.4, cardBg: 'linear-gradient(135deg, #450A0A50 0%, #7F1D1D80 100%)' },
          { title: "Customize song", description: "Create a personalized\nlove song.", btnText: "Create", path: "/user/song", icon: songs, color: "#A78BFA", imgScale: 1.2, cardBg: 'linear-gradient(135deg, #1E1B4B60 0%, #312E8190 100%)' }
        ]
      },
      {
        title: "Fun & Gifts",
        icon: funGiftsIcon,
        services: [
          { title: "Play together", description: "Break the ice\nwith games.", btnText: "Play Now", path: "/user/quiz", icon: game, color: "#A3E635", tag: "NEW", imgScale: 1.8, cardBg: 'linear-gradient(135deg, #1E1B4B 0%, #1E3A8A60 100%)' },
          { title: "Send Surprises", description: "Share love through gifts\nand surprise your loved one", btnText: "Send", path: "/gifts", icon: gift, color: "#FB923C", imgScale: 1.5, cardBg: 'linear-gradient(135deg, #451A0350 0%, #7C2D1260 100%)' }
        ]
      }
    ];

  return (
    <div className="w-full text-white px-4 mb-20 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="pt-4 pb-12 sm:pt-8 sm:pb-20">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-[22px] xs:text-[28px] sm:text-[42px] font-['Playfair_Display'] font-semibold text-white mb-2 sm:mb-3 tracking-tight leading-tight px-2">
            {isSingleMode ? "Confess with Izhaar" : "Celebrate with Izhaar"}
          </h2>



          <div className="flex justify-center px-4">
            <div className="relative flex w-full max-w-[240px] sm:max-w-[360px] bg-[#1e1b4b]/40 backdrop-blur-2xl p-0.5 rounded-full border border-white/10 shadow-2xl overflow-hidden">
              <motion.div
                className="absolute inset-0.5 rounded-full bg-gradient-to-r from-[#B72099] to-[#801369] shadow-lg shadow-pink-500/40"
                initial={false}
                animate={{
                  x: isSingleMode ? 0 : '100%',
                }}
                transition={{
                  type: "spring", stiffness: 300, damping: 30
                }}
                style={{
                  width: 'calc(50% - 2px)',
                  height: 'calc(100% - 4px)',
                }}
              />

              <button onClick={() => setIsSingleMode(true)} className={`flex-1 relative z-10 py-1 sm:py-1.5 rounded-full text-[13px] font-medium font-['Poppins'] transition-colors duration-500 ${isSingleMode ? 'text-white' : 'text-white/30'}`}>Single</button>
              <button onClick={() => setIsSingleMode(false)} className={`flex-1 relative z-10 py-1 sm:py-1.5 rounded-full text-[13px] font-medium font-['Poppins'] transition-colors duration-500 ${!isSingleMode ? 'text-white' : 'text-white/30'}`}>Commited</button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isSingleMode ? 'single' : 'committed'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6 sm:space-y-12"
          >
            {categories.map((cat, idx) => (
              <div key={idx} className="relative">
                <CategoryHeader icon={cat.icon} title={cat.title} />
                <div className="grid grid-cols-2 gap-2.5 sm:gap-10 lg:gap-12 items-stretch">
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