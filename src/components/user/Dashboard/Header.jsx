import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../../../context/NotificationContext";
import logoImg from "../../../assets/images/logo.png";
import { FaGift, FaBars, FaTimes, FaEnvelope, FaMusic, FaHeart, FaGamepad, FaVideo, FaBook } from "react-icons/fa";
import Truck from "../../../assets/images/Truck.png"
import Location from "../../../assets/images/location.png"
import User from "../../../assets/icons/User.png"
import Reels from "../../../assets/icons/reel.png"
import Chats from "../../../assets/icons/Chatbox.png"
import Confession from "../../../assets/icons/Confession.png"
import Notification from '../../../assets/icons/Notification.png'
import Tracker from "../../../assets/icons/Tracker.png"
import Couple_Hug from "../../../assets/images/Couple_Hug.png";

export default function Header({ activeRoute = "" }) {
  const [location, setLocation] = useState({
    name: "Hyderabad",
    code: "500060",
    flag: "🇮🇳",
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { unseenNotificationCount, unseenChatCount } = useNotifications();

  const locations = [
    { name: "Hyderabad", code: "500060", flag: "🇮🇳" },
    { name: "New Delhi", code: "110001", flag: "🇮🇳" },
    { name: "Mumbai", code: "400001", flag: "🇮🇳" },
    { name: "Chennai", code: "600001", flag: "🇮🇳" },
    { name: "Kolkata", code: "700001", flag: "🇮🇳" },
  ];

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    setShowDropdown(false);
  };

  const sidebarLinks = [
    { id: "notifications", label: "Notifications", to: "/user/notifications", icon: Notification, badge: unseenNotificationCount },
    { id: "chat", label: "Chatbox", to: "/user/chat-interface", icon: Chats, badge: unseenChatCount },
    { id: "Izhaar_Tracker", label: "Tracker", to: "/user/izhaar_tracker", icon: Tracker },
    { id: "profile", label: "Profile", to: "/user/profile", icon: User },
  ];

  const mobileMenuLinks = [
    { id: "letter", label: "Izhaar Letter", to: "/user/letter-izhaar", icon: FaEnvelope },
    { id: "song", label: "Izhaar Song", to: "/user/song", icon: FaMusic },
    { id: "watch", label: "Watch Together", to: "/user/watch-party", icon: FaVideo },
    { id: "Gifts", label: "Gift", to: "/gifts", icon: FaGift },
    { id: "game", label: "Game", to: "/user/quiz", icon: FaGamepad },
    { id: "magazine", label: "Magazine", to: "/magazine", icon: FaBook },
    { id: "safe-date", label: "Safe Date", to: "/user/coming-soon", icon: FaHeart },

  ];

  const getActiveLink = (path) => {
    if (path === "/") return activeRoute === "/";
    if (path === "/user/dashboard") return activeRoute === "/user/dashboard";
    return activeRoute.includes(path);
  };

  return (
    <>
      {/* Mobile Top Bar - Hamburger, Logo, and Notification */}
      <div className="md:hidden bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg shadow-black/10 py-3 px-4 flex justify-between items-center m-3 mb-0 z-50 relative">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl text-white">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <Link to="/user/dashboard" className="flex items-center">
          <img src={logoImg} alt="Logo" className="h-8 drop-shadow-lg" />
        </Link>

        <Link to="/user/notifications" className="text-2xl text-white relative">
          <img src={Notification} alt="Logo" className="h-7 w-7 object-contain brightness-0 invert" style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }} />
          {unseenNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce shadow-lg border border-white/20">
              {unseenNotificationCount > 99 ? '99+' : unseenNotificationCount}
            </span>
          )}
        </Link>
      </div>

      {/* Main Header - Hidden on Mobile */}
      <header className="hidden md:flex bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg shadow-black/10 py-2 px-4 md:px-6 justify-between items-center m-3 mt-2 md:mt-3 relative z-30">
        {/* Logo and Location Section */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/user/dashboard">
            <img src={logoImg} alt="Logo" className="h-10 drop-shadow-md" />
          </Link>
          <div className="relative">
            <div
              className="flex items-center bg-white/5 px-4 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all border border-white/10 group"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img src={Location} alt="location" className="h-5 w-5 mr-2 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="text-white/90 group-hover:text-white font-medium text-sm transition-colors">{location.code}, {location.name}</span>
              <i className="fas fa-chevron-down ml-2 text-white/50 group-hover:text-white/80 transition-colors"></i>
            </div>
            {showDropdown && (
              <ul className="absolute bg-[#2d2d44] border border-white/10 shadow-xl rounded-lg mt-2 w-full z-20 overflow-hidden">
                {locations.map((loc, index) => (
                  <li
                    key={index}
                    onClick={() => handleLocationChange(loc)}
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm text-gray-200 hover:text-white transition-colors border-b border-white/5 last:border-0"
                  >
                    <span className="mr-2">{loc.flag}</span>
                    {loc.code}, {loc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center flex-1 mx-6 px-4">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none text-white placeholder-white/30 focus:bg-black/30 focus:border-white/20 transition-all shadow-inner"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="flex items-center gap-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.id}
              to={link.to}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${getActiveLink(link.to) ? "bg-white/10 text-white shadow-lg border border-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
            >
              <div className="h-6 w-6 flex items-center justify-center relative">
                {typeof link.icon === 'string' ? (
                  <img
                    src={link.icon}
                    alt={link.label}
                    className="h-full w-full object-contain"
                    style={{
                      filter: getActiveLink(link.to)
                        ? 'drop-shadow(0 0 5px rgba(233,30,99,0.5))'
                        : 'opacity(0.8)'
                    }}
                  />
                ) : (
                  <link.icon className={`text-xl ${getActiveLink(link.to) ? 'text-pink-400' : 'text-gray-400'}`} />
                )}
                {link.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white/20">
                    {link.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile Menu Sidebar */}
      {/* Mobile Menu Sidebar */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>

          <div
            className="absolute left-0 top-0 bottom-0 w-80 bg-gray-900 shadow-2xl overflow-y-auto border-r border-white/10 flex flex-col z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#2d2d44] p-4 flex justify-between items-center border-b border-white/10 z-10 shadow-md">
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="Logo" className="h-8" />
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-xl text-white/70 hover:text-white bg-white/10 rounded-full p-2 transition-all active:scale-95">
                <FaTimes />
              </button>
            </div>



            {/* Menu Sections */}
            <div className="p-4 space-y-6 flex-1">
              {/* Izhaar Services Section */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider mb-3 px-2 text-white/40">
                  Services
                </h5>
                <nav className="flex flex-col gap-2">
                  {mobileMenuLinks.map((link) => {
                    const IconComponent = link.icon;
                    const isActive = getActiveLink(link.to);

                    return (
                      <Link
                        key={link.id}
                        to={link.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white shadow-lg shadow-pink-500/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                          <IconComponent className="text-lg text-[#B72099] group-hover:opacity-80" />
                        </div>
                        <span className="text-sm font-medium">
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Access Section */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider mb-3 px-2 text-white/40">
                  Quick Access
                </h5>
                <nav className="flex flex-col gap-2">
                  {sidebarLinks.filter(link => link.id !== "notifications" && link.id !== "profile").map((link) => (
                    <Link
                      key={link.id}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${getActiveLink(link.to)
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${getActiveLink(link.to) ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                        {typeof link.icon === 'string' ? (
                          <img
                            src={link.icon}
                            alt={link.label}
                            className={`h-4 w-4 object-contain ${getActiveLink(link.to) ? 'drop-shadow-[0_0_5px_rgba(233,30,99,0.5)]' : 'opacity-70 group-hover:opacity-100'}`}
                          />
                        ) : (
                          <link.icon className={`text-lg ${getActiveLink(link.to) ? 'text-white' : 'text-gray-400 group-hover:text-pink-300'}`} />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* User Profile Mini Card in Sidebar */}
            <div className="p-4 mt-auto border-t border-white/10 bg-[#252538]">
              <Link
                to="/user/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white border-2 border-transparent group-hover:border-pink-500 transition-all">
                  <img src={User} className="w-6 h-6 object-contain invert" alt="U" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold group-hover:text-pink-400 transition-colors">My Profile</p>
                  <p className="text-xs text-white/50">View Account</p>
                </div>
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}