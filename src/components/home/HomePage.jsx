import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLock, FaShieldAlt, FaUserSecret, FaHeart,
  FaPaperPlane, FaArrowRight, FaBars, FaTimes,
  FaRobot, FaRegCheckCircle, FaUser, FaEnvelope
} from "react-icons/fa";
import MobileHomePage from "./MobileHomePage";

// Import Assets
import boyImg from "../../assets/home/boy.png";
import girlImg from "../../assets/home/girl.png";
import img1 from "../../assets/home/img1.png";
import img2 from "../../assets/home/img2.png";
import img3 from "../../assets/home/img3.png";
import iphone15 from "../../assets/home/iPhone 15.png";
import group2707 from "../../assets/home/Group 2707.png";

const Logo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/logo?_a=BAMAOGeA0";

const HomePage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (isMobile) {
    return <MobileHomePage />;
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const services = [
    { title: "Confession", icon: <FaPaperPlane />, color: "from-pink-500 to-rose-500" },
    { title: "Crush List", icon: <FaHeart />, color: "from-purple-500 to-indigo-500" },
    { title: "Safe Date", icon: <FaShieldAlt />, color: "from-blue-500 to-cyan-500" },
    { title: "AI Helper", icon: <FaRobot />, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0F071F] text-white font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0F071F]/80 backdrop-blur-xl border-b border-white/10 py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <img src={Logo} alt="Izhaar Logo" className="h-8 md:h-10 cursor-pointer" onClick={() => navigate("/")} />

          <nav className="hidden md:flex items-center gap-8">
            <a href="#hero" className="text-sm font-medium hover:text-pink-400 transition-colors">Home</a>
            <a href="#about" className="text-sm font-medium hover:text-pink-400 transition-colors">About</a>
            <a href="#services" className="text-sm font-medium hover:text-pink-400 transition-colors">Services</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-pink-400 transition-colors">How it works</a>
          </nav>

          <button
            onClick={() => navigate("/user/dashboard")}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-sm font-bold hover:scale-105 transition-transform"
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="relative z-10 pt-32 px-6">
        {/* Hero Section */}
        <section id="hero" className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.h1
            initial="hidden" whileInView="visible" variants={fadeIn}
            className="text-5xl md:text-8xl font-black tracking-tight mb-4"
          >
            Got a Crush? <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Too Scared to say it?
            </span>
          </motion.h1>

          <div className="mt-12 relative flex items-end justify-center w-full max-w-4xl h-[450px]">
            <div className="absolute inset-0 bg-pink-500/10 blur-[100px] rounded-full" />
            <motion.img
              initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}
              src={boyImg} className="w-[30%] h-[420px] object-contain drop-shadow-2xl"
            />
            <motion.img
              animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}
              src={group2707} className="w-24 mb-40 mx-10"
            />
            <motion.img
              initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}
              src={girlImg} className="w-[30%] h-[420px] object-contain drop-shadow-2xl"
            />
          </div>

          <div className="mt-12 space-y-6">
            <h3 className="text-3xl font-bold">We Can Help You 💗</h3>
            <button
              onClick={() => navigate("/user/dashboard")}
              className="px-10 py-4 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] rounded-full text-xl font-extrabold flex items-center gap-3 mx-auto shadow-2xl hover:scale-110 transition-transform"
            >
              Join Now <FaUser className="text-lg" />
            </button>
          </div>
        </section>

        {/* Info Cards */}
        <section id="about" className="py-32 max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">We've all been there...</h2>
          <p className="text-white/40 mb-16 max-w-xl mx-auto">
            You like someone. You think about them all the time. But when it comes to saying how you feel, the words just don't come out.
          </p>

          <div className="grid grid-cols-3 gap-8 px-10">
            {[
              { icon: <FaUser />, label: "Sign Up", color: "bg-white/5" },
              { icon: <FaEnvelope />, label: "Confess", color: "bg-white/5" },
              { icon: <FaHeart />, label: "Connect", color: "bg-white/5" },
            ].map((item, i) => (
              <div key={i} className={`p-10 rounded-[40px] border border-white/10 ${item.color} backdrop-blur-3xl hover:border-pink-500/50 transition-colors group cursor-pointer`}>
                <div className="text-5xl text-white/50 group-hover:text-pink-500 transition-colors mb-6 flex justify-center">{item.icon}</div>
                <h4 className="text-2xl font-bold">{item.label}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-32 max-w-7xl mx-auto px-10 bg-[#1A0B2E] rounded-[60px] border border-white/5">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold mb-4">Explore Izhaar Services</h2>
            <p className="text-white/40">Different ways Izhaar helps you express your feelings and build real connections</p>
          </div>
          <div className="flex justify-center gap-12">
            {[img1, img2, img3, iphone15].map((img, i) => (
              <div key={i} className="w-40 h-40 rounded-full border border-white/10 p-2 bg-black/40 hover:border-pink-500 transition-all cursor-pointer">
                <img src={img} className="w-full h-full object-cover rounded-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section id="how-it-works" className="py-40 max-w-7xl mx-auto space-y-40">
          {[
            { title: "Your Crush?", desc: "Select your crush and let us handle the magic.", img: img1, rev: false },
            { title: "Secret Love?", desc: "Express yourself without reveal until you're ready.", img: img2, rev: true },
          ].map((step, i) => (
            <div key={i} className={`flex items-center gap-20 ${step.rev ? "flex-row-reverse" : ""}`}>
              <div className="flex-1 space-y-6">
                <span className="text-pink-500 font-bold uppercase tracking-widest text-sm">Step {i + 1}</span>
                <h3 className="text-7xl font-black">{step.title}</h3>
                <p className="text-xl text-white/60">{step.desc}</p>
                <button className="flex items-center gap-2 text-pink-500 font-bold text-lg">Learn More <FaArrowRight /></button>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-pink-500/10 blur-[100px] rounded-full" />
                <img src={step.img} className="relative z-10 w-full rounded-[40px] drop-shadow-2xl" />
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-white/5 opacity-50 text-center">
          <img src={Logo} className="h-8 mx-auto mb-8" />
          <p>&copy; 2026 Izhaar. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;
