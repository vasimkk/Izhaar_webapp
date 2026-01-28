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
    { id: "Izhaar_Tracker", label: "Izhaar_Tracker", to: "/user/izhaar_tracker", icon: Tracker },
    { id: "profile", label: "Profile", to: "/user/profile", icon: User },
  ];

  const mobileMenuLinks = [
    { id: "letter", label: "Izhaar Letter", to: "/user/letter-izhaar", icon: FaEnvelope },
    { id: "song", label: "Izhaar Song", to: "/user/song", icon: FaMusic },
    { id: "watch", label: "Watch Together", to: "/user/watch-party", icon: FaVideo },
    { id: "Gifts", label: "Gift", to: "/gifts", icon: FaGift },
    { id: "game", label: "Game", to: "/user/quiz", icon: FaGamepad },
    { id: "magazine", label: "Magazine", to: "/magazine", icon: FaBook },
    { id: "safe-date", label: "Safe Date", to: "/user/safe-date", icon: FaHeart },

  ];

  const getActiveLink = (path) => {
    if (path === "/") return activeRoute === "/";
    if (path === "/user/dashboard") return activeRoute === "/user/dashboard";
    return activeRoute.includes(path);
  };

  return (
    <>
      {/* Mobile Top Bar - Hamburger, Logo, and Notification */}
      <div className="md:hidden bg-white/70 backdrop-blur-xl rounded-2xl border border-[#d4c5e8]/30 shadow-lg shadow-[#2D1B4E]/10 py-3 px-4 flex justify-between items-center m-3 mb-0">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl text-gray-700">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <Link to="/user/dashboard" className="flex items-center">
          <img src={logoImg} alt="Logo" className="h-8" />
        </Link>

        <Link to="/user/notifications" className="text-2xl text-gray-700 relative">
          <img src={Notification} alt="Logo" className="h-10" />
          {unseenNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow-lg">
              {unseenNotificationCount > 99 ? '99+' : unseenNotificationCount}
            </span>
          )}
        </Link>
      </div>

      {/* Main Header - Hidden on Mobile */}
      <header className="hidden md:flex bg-white/70 backdrop-blur-xl rounded-2xl border border-[#d4c5e8]/30 shadow-lg shadow-[#2D1B4E]/10 py-2 px-4 md:px-6 justify-between items-center m-3 mt-2 md:mt-3 relative">
        {/* Logo and Location Section */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/user/dashboard">
            <img src={logoImg} alt="Logo" className="h-10" />
          </Link>
          <div className="relative">
            <div
              className="flex items-center bg-purple-100 px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img src={Location} alt="location" className="h-5 w-5 mr-2" />
              <span className="text-purple-700 font-medium text-sm">{location.code}, {location.name}</span>
              <i className="fas fa-chevron-down ml-2 text-purple-500"></i>
            </div>
            {showDropdown && (
              <ul className="absolute bg-white shadow-md rounded-lg mt-2 w-full z-20">
                {locations.map((loc, index) => (
                  <li
                    key={index}
                    onClick={() => handleLocationChange(loc)}
                    className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-sm"
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
            className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="flex items-center gap-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.id}
              to={link.to}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${getActiveLink(link.to) ? "bg-purple-100 text-purple-500" : "text-gray-700"
                }`}
            >
              <div className="h-8 w-8 flex items-center justify-center relative">
                {typeof link.icon === 'string' ? <img src={link.icon} alt={link.label} className="h-full w-full" /> : link.icon}
                {link.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </div>
              <span className="text-sm">{link.label}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile Menu Sidebar */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-br from-white to-purple-50 shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-purple-600 p-4 flex justify-between items-center shadow-md">
              <h4 className="text-xl font-bold text-white">Menu</h4>
              <button onClick={() => setIsMenuOpen(false)} className="text-2xl text-white hover:scale-110 transition">
                <FaTimes />
              </button>
            </div>

            {/* Menu Sections */}
            <div className="p-4">
              {/* Izhaar Services Section */}
              <div className="mb-6">
                <h5
                  className="text-xs font-bold uppercase tracking-wider mb-3 px-2"
                  style={{
                    background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Izhaar Services
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-105 ${isActive
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-purple-100 shadow-sm"
                          }`}
                      >
                        {isActive ? (
                          <IconComponent className="text-2xl text-white" />
                        ) : (
                          <IconComponent className="text-2xl text-pink-400" />
                        )}
                        <span
                          className={`text-base font-medium ${isActive ? 'text-white' : 'text-gray-700'
                            }`}
                        >
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Access Section */}
              <div>
                <h5
                  className="text-xs font-bold uppercase tracking-wider mb-3 px-2"
                  style={{
                    background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Quick Access
                </h5>
                <nav className="flex flex-col gap-2">
                  {sidebarLinks.filter(link => link.id !== "notifications").map((link) => (
                    <Link
                      key={link.id}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-105 ${getActiveLink(link.to)
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-purple-100 shadow-sm"
                        }`}
                    >
                      <div className="h-6 w-6 flex items-center justify-center">
                        {typeof link.icon === 'string' ? (
                          <img
                            src={link.icon}
                            alt={link.label}
                            className="h-full w-full object-contain"
                            style={{
                              filter: getActiveLink(link.to)
                                ? 'brightness(0) invert(1)'
                                : 'brightness(0) saturate(100%) invert(16%) sepia(94%) saturate(2555%) hue-rotate(326%) brightness(103%) contrast(104%)'
                            }}
                          />
                        ) : (
                          <link.icon
                            className={`text-2xl ${getActiveLink(link.to) ? 'text-white' : 'text-pink-500'}`}
                          />
                        )}
                      </div>
                      <span
                        className={`text-base font-medium ${getActiveLink(link.to) ? 'text-white' : 'text-gray-700'
                          }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}