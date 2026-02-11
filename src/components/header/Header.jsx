
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();



  return (
    <header className="w-full flex items-center justify-between bg-white/60 backdrop-blur-md rounded-2xl mt-8 px-4 py-2 md:px-12 md:py-4 shadow-lg max-w-6xl mx-auto relative z-20">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-12 h-12 md:w-16 md:h-16" />
      </div>
      {/* Desktop nav */}
      <nav className="hidden md:flex gap-6 lg:gap-12 text-black font-medium text-base lg:text-lg">
        <a href="#home" className="hover:text-pink-500 transition-colors">HOME</a>
        <a href="#features" className="hover:text-pink-500 transition-colors">FEATURES</a>
        <a href="#how-it-works" className="hover:text-pink-500 transition-colors">HOW IT WORKS</a>
        <a href="#about-us" className="hover:text-pink-500 transition-colors">ABOUT US</a>
        <a href="#prices" className="hover:text-pink-500 transition-colors">PRICES</a>

      </nav>
      {/* Hamburger icon for mobile */}
      <button
        className="md:hidden flex items-center justify-center ml-2 p-2 rounded hover:bg-gray-200 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open menu"
      >
        <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Side menu for mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="relative ml-auto w-64 max-w-[80vw] h-full bg-white shadow-lg flex flex-col p-6 gap-6 animate-slide-in-right">
            <button
              className="absolute top-4 right-4 p-2 rounded"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="flex flex-col gap-6 mt-10 text-black font-medium text-lg">
              <a href="#home" className="hover:text-pink-500 transition-colors" onClick={() => setMenuOpen(false)}>HOME</a>
              <a href="#features" className="hover:text-pink-500 transition-colors" onClick={() => setMenuOpen(false)}>FEATURES</a>
              <a href="#how-it-works" className="hover:text-pink-500 transition-colors" onClick={() => setMenuOpen(false)}>HOW IT WORKS</a>
              <a href="#about-us" className="hover:text-pink-500 transition-colors" onClick={() => setMenuOpen(false)}>ABOUT US</a>
              <a href="#prices" className="hover:text-pink-500 transition-colors" onClick={() => setMenuOpen(false)}>PRICES</a>
              {/* <button
                className="bg-black text-white rounded-lg px-5 py-2 font-semibold text-base hover:bg-pink-500 transition-colors mt-4"
                onClick={handleSignUpLogin}
              >
               Get Started
              </button> */}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
