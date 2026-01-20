import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRegCommentDots, FaUser, FaBell, FaComments, FaPlay } from 'react-icons/fa';
import User from "../../../assets/icons/User.png"
import Reels from "../../../assets/icons/reel.png"
import Chats from "../../../assets/icons/Chatbox.png"
import Confession from "../../../assets/icons/Confession.png"

const BottomNavBar = () => {
  const location = useLocation();
  const activeRoute = location.pathname;

  const navLinks = [
    { id: 'confession', label: 'Confession', to: '/user/confession', icon: Confession },
    { id: 'Reels', label: 'Reels', to: '/user/reels', icon: Reels},
    { id: 'chat', label: 'Chatbox', to: '/user/chat-interface', icon: Chats },
    { id: 'profile', label: 'Profile', to: '/user/profile', icon: User },
  ];

  const getActiveLink = (path) => {
    return activeRoute.includes(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl shadow-lg border-t border-[#d4c5e8]/30 z-50">
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
                <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#E91E63] to-[#9C27B0] animate-pulse" />
              )}
              
              {/* Icon Container with animated background */}
              <div className={`relative transition-all duration-300 ${
                isActive ? 'transform -translate-y-1' : ''
              }`}>
                {/* Animated glow background */}
                {isActive && (
                  <div className="absolute inset-0 blur-lg rounded-full bg-gradient-to-r from-[#E91E63]/30 to-[#9C27B0]/30 animate-pulse" />
                )}
                
                <div className={`text-2xl relative z-10 transition-all duration-300 ${
                  isActive ? 'drop-shadow-lg' : ''
                }`}>
                  {typeof link.icon === 'string' ? (
                    <img 
                      src={link.icon} 
                      alt={link.label} 
                      className={`w-7 h-7 object-contain transition-all duration-300 ${
                        isActive ? 'brightness-110' : 'opacity-70 group-hover:opacity-100'
                      }`}
                      style={{
                        filter: isActive 
                          ? 'drop-shadow(0 4px 8px rgba(233, 30, 99, 0.5)) drop-shadow(0 2px 4px rgba(156, 39, 176, 0.3))'
                          : 'grayscale(20%)'
                      }}
                    />
                  ) : (
                    <span 
                      className={`transition-all duration-300 ${
                        isActive ? 'text-[#E91E63]' : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                      style={{
                        filter: isActive 
                          ? 'drop-shadow(0 2px 4px rgba(233, 30, 99, 0.4))'
                          : 'none'
                      }}
                    >
                      {link.icon}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Label with gradient text */}
              <span 
                className={`text-xs font-medium transition-all duration-300 ${
                  isActive ? 'font-bold bg-clip-text text-transparent scale-105' : 'text-gray-500 group-hover:text-gray-700'
                }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 2px 4px rgba(233, 30, 99, 0.1)'
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