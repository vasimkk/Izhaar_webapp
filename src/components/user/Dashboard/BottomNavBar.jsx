import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRegCommentDots, FaUser, FaBell, FaComments } from 'react-icons/fa';

const BottomNavBar = () => {
  const location = useLocation();
  const activeRoute = location.pathname;

  const navLinks = [
    { id: 'confession', label: 'Confession', to: '/user/confession', icon: <FaRegCommentDots /> },
    { id: 'chat', label: 'Chatbox', to: '/user/chat-interface', icon: <FaComments /> },
    { id: 'profile', label: 'Profile', to: '/user/profile', icon: <FaUser /> },
    { id: 'notifications', label: 'Notifications', to: '/user/notifications', icon: <FaBell /> },
  ];

  const getActiveLink = (path) => {
    return activeRoute.includes(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl shadow-lg border-t border-[#d4c5e8]/30 z-50">
      <nav className="flex justify-around items-center py-2">
        {navLinks.map((link) => (
          <Link
            key={link.id}
            to={link.to}
            className={`flex flex-col items-center gap-1 w-full py-1 transition-all ${
              getActiveLink(link.to) ? 'text-purple-500' : 'text-gray-600'
            }`}
          >
            <div className="text-2xl">
              {link.icon}
            </div>
            <span className="text-xs font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavBar;
