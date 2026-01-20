import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../../../assets/images/logo.png";
import { FaRegCommentDots, FaUser, FaBell, FaComments, FaBars, FaTimes } from "react-icons/fa";
import Truck from "../../../assets/images/Truck.png"
import Location from "../../../assets/images/location.png"

export default function Header({ activeRoute = "" }) {
  const [location, setLocation] = useState({
    name: "Hyderabad",
    code: "500060",
    flag: "🇮🇳",
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    { id: "notifications", label: "Notifications", to: "/user/notifications", icon: <FaBell /> },
    { id: "chat", label: "Chatbox", to: "/user/chat-interface", icon: <FaComments /> },
    { id: "Izhaar_Tracker", label: "Izhaar_Tracker", to: "/user/izhaar_tracker", icon: Truck },
    { id: "profile", label: "Profile", to: "/user/profile", icon: <FaUser /> },
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
          <FaBell />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
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
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                getActiveLink(link.to) ? "bg-purple-100 text-purple-500" : "text-gray-700"
              }`}
            >
              <div className="h-8 w-8 flex items-center justify-center">
                {typeof link.icon === 'string' ? <img src={link.icon} alt={link.label} className="h-full w-full" /> : link.icon}
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
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-purple-700">Menu</h3>
              <button onClick={() => setIsMenuOpen(false)} className="text-2xl">
                <FaTimes />
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              {sidebarLinks.filter(link => link.id !== "notifications").map((link) => (
                <Link
                  key={link.id}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    getActiveLink(link.to) ? "bg-purple-100 text-purple-500" : "text-gray-700"
                  }`}
                >
                  <div className="h-6 w-6 flex items-center justify-center">
                    {typeof link.icon === 'string' ? <img src={link.icon} alt={link.label} className="h-full w-full" /> : link.icon}
                  </div>
                  <span className="text-base">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}