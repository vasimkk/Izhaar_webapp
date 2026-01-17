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
    { id: "Izhaar_Tracker", label: "Izhaar_Tracker", to: "/user/izhaar-tracker", icon: Truck },
    { id: "Izhaar_Tracker", label: "Izhaar_Tracker", to: "/user/izhaar-tracker", icon: Truck },
    { id: "profile", label: "Profile", to: "/user/profile", icon: <FaUser /> },

];

  const getActiveLink = (path) => {
    if (path === "/") return activeRoute === "/";
    if (path === "/user/dashboard") return activeRoute === "/user/dashboard";
    return activeRoute.includes(path);
  };

  return (
    <header className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#d4c5e8]/30 shadow-lg shadow-[#2D1B4E]/10 py-2 px-4 md:px-6 flex justify-between items-center m-3 relative">
      {/* Logo and Location Section */}
      <div className="flex items-center gap-4 md:gap-8">
        <Link to="/user/dashboard">
          <img src={logoImg} alt="Logo" className="h-10" />
        </Link>
        <div className="relative hidden md:block">
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
      <div className="hidden md:flex items-center flex-1 mx-6 px-4">
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none"
        />
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-2">
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

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl text-gray-700">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

     
    </header>
  );
}