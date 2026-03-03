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
  HiChatBubbleOvalLeft
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
      to: '/user/confession', // Confession
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
      id: 'more',
      label: 'More',
      to: '/user/coming-soon',
      icon: HiOutlineViewGrid,
      activeIcon: HiViewGrid
    },
  ];

  const getActiveLink = (path) => {
    if (path === '/user/dashboard') return activeRoute === '/user/dashboard';
    return activeRoute.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
      {/* Main Bar Container */}
      <div className="relative flex items-center justify-between bg-black/40 backdrop-blur-2xl px-6 py-2 rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-[70px]">

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
                <Icon
                  className={`text-2xl transition-all duration-300 ${isActive
                    ? 'text-[#EC4891] drop-shadow-[0_0_8px_rgba(236,72,145,0.6)]'
                    : 'text-white/50 group-hover:text-white/80'
                    }`}
                />

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

      {/* Reflection/Inner Shadow for premium look */}
      <div className="absolute inset-0 rounded-[32px] pointer-events-none border border-white/5 shadow-inner" />
    </div>
  );
};

export default BottomNavBar;