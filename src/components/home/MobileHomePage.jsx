import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import Sub-components
import HomeHeader from "./components/HomeHeader";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import FeaturesList from "./components/FeaturesList";
import HowItWorks from "./components/HowItWorks";
import StatsSection from "./components/StatsSection";
import Testimonials from "./components/Testimonials";
import HomeFooter from "./components/HomeFooter";

const MobileHomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden">

      {/* Header */}
      <HomeHeader setIsMenuOpen={setIsMenuOpen} />

      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <HeroSection />

        {/* About / Info Section */}
        <AboutSection />

        {/* Services Section */}
        <ServicesSection />

        {/* Feature List (Zigzag) */}
        <FeaturesList />




        {/* Footer */}
        <HomeFooter />
      </main>

      {/* Side Menu Placeholder (Can be extracted to its own component later) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-8 right-8 text-3xl"
              onClick={() => setIsMenuOpen(false)}
            >
              ×
            </button>
            <nav className="flex flex-col items-center gap-8 text-2xl font-bold">
              <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
              <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#how" onClick={() => setIsMenuOpen(false)}>How it Works</a>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // Add navigation logic here if needed
                }}
              >
                Join Now
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileHomePage;