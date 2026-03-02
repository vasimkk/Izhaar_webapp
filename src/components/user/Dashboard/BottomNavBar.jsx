import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotifications } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';

import User from "../../../assets/icons/User.png"
import Reels from "../../../assets/icons/reel.png"
import Chats from "../../../assets/icons/Chatbox.png"
import Confession from "../../../assets/icons/Confession.png"

const BottomNavBar = () => {
  const location = useLocation();
  const activeRoute = location.pathname;
  const { unseenChatCount } = useNotifications();
  const { user } = useAuth();

  // Get profile picture from user object
  const userProfilePic = user?.profile_photo || user?.google_picture;

  const navLinks = [
    { id: 'confession', label: 'Confession', to: '/user/confession', icon: Confession },
    { id: 'Reels', label: 'Reels', to: '/user/reels', icon: Reels },
    { id: 'chat', label: 'Chatbox', to: '/user/chat-interface', icon: Chats, badge: unseenChatCount },
    {
      id: 'profile',
      label: 'Profile',
      to: '/user/profile',
      icon: userProfilePic || User,
      isProfile: true
    },
  ];


  const getActiveLink = (path) => {
    return activeRoute.includes(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5 z-50">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      <nav className="flex justify-around items-center py-2">
        {navLinks.map((link) => {
          const isActive = getActiveLink(link.to);
          return (
            <Link
              key={link.id}
              to={link.to}
              className="flex flex-col items-center gap-1 w-full py-1 transition-all duration-300 hover:scale-110 active:scale-95 relative group"
            >
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#EC4891] to-[#A928ED] animate-pulse" />
              )}

              {/* Icon Container with animated background */}
              <div className={`relative transition-all duration-300 ${isActive ? 'transform -translate-y-1' : ''
                }`}>
                {/* Animated glow background */}
                {isActive && (
                  <div className="absolute inset-0 blur-lg rounded-full bg-gradient-to-r from-[#EC4891]/30 to-[#A928ED]/30 animate-pulse" />
                )}

                <div className={`text-2xl relative z-10 transition-all duration-300 ${isActive ? 'drop-shadow-lg' : ''
                  }`}>
                  {typeof link.icon === 'string' ? (
                    <div className={`transition-all duration-300 rounded-full flex items-center justify-center overflow-hidden ${link.id === 'profile'
                      ? `w-7 h-7 border-2 ${isActive ? 'border-[#EC4891] scale-110 shadow-[0_0_10px_rgba(236,72,145,0.3)]' : 'border-pink-500/50'}`
                      : 'w-7 h-7'
                      }`}>

                      <img
                        src={link.icon}
                        alt={link.label}
                        className={`w-full h-full transition-all duration-300 ${link.id === 'profile' && userProfilePic
                          ? 'object-cover'
                          : 'object-contain'
                          } ${isActive ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}`}
                      />
                    </div>
                  ) : (


                    <span
                      className={`transition-all duration-300 ${isActive ? 'text-[#EC4891]' : 'text-gray-400 group-hover:text-white'
                        }`}
                      style={{
                        filter: isActive
                          ? 'drop-shadow(0 2px 4px rgba(236, 72, 145, 0.4))'
                          : 'none'
                      }}
                    >
                      {link.icon}
                    </span>
                  )}
                  {link.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white/20">
                      {link.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Label with gradient text */}
              <span
                className={`text-xs font-medium transition-all duration-300 ${isActive ? 'font-bold bg-clip-text text-transparent scale-105' : 'text-gray-400 group-hover:text-white'
                  }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, #EC4891 0%, #A928ED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 2px 4px rgba(236, 72, 145, 0.2)'
                } : {}}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavBar;