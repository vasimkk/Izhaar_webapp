import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotifications } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import {
  HiHome,
  HiOutlineHome,
  HiOutlineUser,
  HiUser,
  HiOutlineViewGrid,
  HiViewGrid
} from 'react-icons/hi';
import {
  HiOutlineChatBubbleOvalLeft,
  HiChatBubbleOvalLeft,
  HiOutlineSparkles,
  HiSparkles
} from 'react-icons/hi2';
import {
  BiMoviePlay,
  BiSolidMoviePlay
} from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';

const BottomNavBar = () => {
  const location = useLocation();
  const activeRoute = location.pathname;
  const { unseenChatCount } = useNotifications();
  const { user } = useAuth();

  const userProfilePic = user?.profile_photo || user?.google_picture;

  const navLinks = [
    {
      id: 'home',
      label: 'Home',
      to: '/user/dashboard',
      icon: HiOutlineHome,
      activeIcon: HiHome
    },
    {
      id: 'reels',
      label: 'Reels',
      to: '/user/reels',
      icon: BiMoviePlay,
      activeIcon: BiSolidMoviePlay
    },
    {
      id: 'center',
      label: 'Izhaar',
      to: '/user/letter-izhaar', // Confession
      isCenter: true
    },
    {
      id: 'chat',
      label: 'Chat',
      to: '/user/chat-interface',
      icon: HiOutlineChatBubbleOvalLeft,
      activeIcon: HiChatBubbleOvalLeft,
      badge: unseenChatCount
    },
    {
      id: 'ai-coach',
      label: 'Coach',
      to: '/user/ai-coach',
      icon: HiOutlineSparkles,
      activeIcon: HiSparkles
    },
  ];

  const getActiveLink = (path) => {
    if (path === '/user/dashboard') return activeRoute === '/user/dashboard';
    return activeRoute.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50">
      {/* Main Bar Container */}
      <div className="relative flex items-center justify-between bg-black/40 backdrop-blur-3xl px-6 py-2 rounded-t-[32px] border-t border-x border-white/10 shadow-[0_-10px_50px_rgba(0,0,0,0.5)] h-[80px] pb-5">

        {navLinks.map((link) => {
          if (link.isCenter) {
            return (
              <div key={link.id} className="relative -top-6 flex flex-col items-center">
                <Link
                  to={link.to}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#EC4891] via-[#D946EF] to-[#A928ED] flex items-center justify-center shadow-[0_8px_20px_rgba(236,72,145,0.4)] border-4 border-[#120C18] relative z-10 transition-transform active:scale-90"
                >
                  <FaHeart className="text-white text-2xl" />
                </Link>
                {/* Glow effect behind center button */}
                <div className="absolute -inset-1 bg-pink-500/20 blur-2xl rounded-full -z-0" />
              </div>
            );
          }

          const isActive = getActiveLink(link.to);
          const Icon = isActive ? link.activeIcon : link.icon;

          return (
            <Link
              key={link.id}
              to={link.to}
              className="relative flex flex-col items-center justify-center p-2 group transition-all duration-300"
            >
              <div className="relative">
                {/* Special Multi-Color Animation for AI Coach */}
                {link.id === 'ai-coach' && (
                  <motion.div
                    className="absolute inset-0 blur-lg rounded-full"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.2, 0.5, 0.2],
                      backgroundColor: [
                        "rgba(168, 85, 247, 0.3)", // Purple
                        "rgba(236, 72, 153, 0.3)", // Pink
                        "rgba(6, 182, 212, 0.3)",  // Cyan
                        "rgba(168, 85, 247, 0.3)"  // Back to Purple
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                )}

                <motion.div
                  animate={link.id === 'ai-coach' && !isActive ? {
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                    color: [
                      "rgba(255, 255, 255, 0.6)",
                      "rgba(168, 85, 247, 1)",
                      "rgba(236, 72, 153, 1)",
                      "rgba(34, 211, 238, 1)",
                      "rgba(255, 255, 255, 0.6)"
                    ]
                  } : {}}
                  transition={link.id === 'ai-coach' && !isActive ? {
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  } : {}}
                >
                  <Icon
                    className={`text-2xl transition-all duration-300 ${isActive
                      ? 'text-[#EC4891] drop-shadow-[0_0_8px_rgba(236,72,145,0.6)]'
                      : 'text-white/50 group-hover:text-white/80'
                      }`}
                  />
                </motion.div>

                {link.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-[#120C18]">
                    {link.badge}
                  </span>
                )}
              </div>

              {/* Active Indicator Underline */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#EC4891]"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  />
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      {/* Reflection/Inner Shadow removed for docked look */}
    </div>
  );
};

export default BottomNavBar;