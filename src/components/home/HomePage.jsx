import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/logo.png";
import Step1 from "../../assets/images/Fear.png";
import Step2 from "../../assets/images/izhaar_explore.png";
import Step3 from "../../assets/images/Male.png";
import Step4 from "../../assets/images/Female.png";
import Step5 from "../../assets/images/Couples.png";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const steps = [
    {
      id: "step1",
      title: "Fear & Confusion",
      desc:
        "He wants to confess… but fear, hesitation, and overthinking stop him. His feelings stay locked inside his heart.",
      image: Step1,
    },
    {
      id: "step2",
      title: "Discovering Izhaar",
      desc:
        "Late at night, scrolling on his phone, he discovers Izhaar — a safe and anonymous way to express emotions.",
      image: Step2,
    },
    {
      id: "step3",
      title: "Pouring His Heart Out",
      desc:
        "He writes from the depths of his soul. Every emotion flows—his love, hope, and vulnerability. With one final breath, he sends it.",
      image: Step3,
    },
    {
      id: "step4",
      title: "She Receives The Magic",
      desc:
        "She reads words she never thought she'd hear. The sincerity moves her deeply. With trembling fingers, she accepts.",
      image: Step4,
    },
    {
      id: "step5",
      title: "A New Journey Begins",
      desc:
        "Two hearts finally meet. A beautiful story begins — made possible by courage, honesty, and IzhaarLove.",
      image: Step5,
    },
  ];

  /* =======================
     INTERSECTION OBSERVER
  ======================= */
  useEffect(() => {
    const observers = [];

    steps.forEach((step, index) => {
      const el = document.getElementById(step.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActiveStep(index),
        { threshold: 0.5 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="relative w-full bg-gradient-to-br from-[#f5f1f8] via-[#f0e8f8] to-[#e8dff5] text-[#2D1B4E] overflow-x-hidden">
      <header className="fixed top-4 left-0 right-0 z-50 px-4">
  <div
    className="
      max-w-7xl mx-auto
      flex items-center justify-between
      px-6 py-4
      rounded-2xl
      bg-white/70
      backdrop-blur-xl
      border border-[#d4c5e8]/30
      shadow-lg shadow-[#2D1B4E]/10
    "
  >
    {/* LOGO */}
    <h1 className="text-2xl font-extrabold">
      <img
        src={Logo}
        alt="Izhaar"
        className="h-10 w-auto drop-shadow-sm"
      />
    </h1>

    {/* DESKTOP NAV */}
    <nav className="hidden md:flex gap-10 text-[#6B5B8E] font-bold">
      <a href="#home" className="hover:text-[#2D1B4E] transition">Home</a>
      <a href="#journey" className="hover:text-[#2D1B4E] transition">How It Works</a>
      <a href="#features" className="hover:text-[#2D1B4E] transition">Features</a>
      <a href="#about" className="hover:text-[#2D1B4E] transition">About Us</a>
    </nav>

    {/* MOBILE HAMBURGER */}
    <button
      className="md:hidden text-2xl text-[#2D1B4E]"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Toggle menu"
    >
      ☰
    </button>
  </div>

  {/* MOBILE MENU (GLASS STYLE) */}
  {menuOpen && (
    <div
      className="
        md:hidden
        mt-4 mx-4
        rounded-2xl
        bg-white/70
        backdrop-blur-xl
        border border-[#d4c5e8]/30
        shadow-lg shadow-[#2D1B4E]/10
        px-6 py-6
        space-y-4
        text-[#6B5B8E]
      "
    >
      <a href="#home" className="block hover:text-[#2D1B4E]" onClick={() => setMenuOpen(false)}>Home</a>
      <a href="#journey" className="block hover:text-[#2D1B4E]" onClick={() => setMenuOpen(false)}>How It Works</a>
      <a href="#features" className="block hover:text-[#2D1B4E]" onClick={() => setMenuOpen(false)}>Features</a>
      <a href="#about" className="block hover:text-[#2D1B4E]" onClick={() => setMenuOpen(false)}>About Us</a>
    </div>
  )}
</header>

      
      
      {/* =======================
         FULL SCREEN HEART BG
      ======================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              opacity: 0.15,
            }}
          />
        ))}
      </div>


      {/* =======================
         CONTENT (ABOVE HEARTS)
      ======================= */}
      <div className="relative z-10">
        {/* HERO */}
        <section className="min-h-screen flex items-center justify-center text-center px-4 bg-gradient-to-br from-[#fff0e8] via-[#ffe8f5] to-[#f0f5ff] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#E91E63] to-[#FF6F00] rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-[#9C27B0] to-[#3F51B5] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-[#2D1B4E]">
              <span className="gradient-text">Izhaar</span>
              <br />We Speak on Your Behalf
            </h1>
            <p className="text-xl text-[#6B5B8E] mb-10">
              You express. We deliver. They feel.
            </p>
            <p className="text-base text-[#6B5B8E] mb-6">
              Log in with us and start your Izhaar form today.
            </p>
             <button
                  onClick={() => navigate("/user/dashboard")}
                  className="px-10 py-4 rounded-full font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  Join Our Community
                </button>
          </div>
        </section>

        {/* JOURNEY */}
        <section id="journey" className="py-28 px-4 md:px-8 bg-gradient-to-br from-[#ffe8f5] via-[#f5e8ff] to-[#e8f0ff] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#E91E63] to-[#9C27B0] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#2196F3] to-[#3B82F6] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-24 text-[#2D1B4E]">
            The <span className="gradient-text">Izhaar Journey</span>
          </h2>

          <div className="max-w-6xl mx-auto space-y-36">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.id}
                  id={step.id}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  {/* TEXT */}
                  <div className={isEven ? "" : "md:order-2"}>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#2D1B4E]">
                      {step.title}
                    </h3>
                    <p className="text-[#6B5B8E] text-lg leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* IMAGE */}
                  <div className={isEven ? "" : "md:order-1"}>
                    <div
                      className={`max-w-md mx-auto transition-all duration-700 ${
                        isActive
                          ? "opacity-100 scale-100"
                          : "opacity-40 scale-90"
                      }`}
                    >
                      <div className="aspect-[4/5] rounded-3xl glass-effect overflow-hidden flex items-center justify-center  backdrop-blur-md ">
                        <img
                          src={step.image}
                          alt={step.title}
                          className={`w-full h-full object-contain ${
                            isActive
                              ? "animate-[softZoom_6s_ease-in-out_infinite]"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </section>

        {/* PROMISE */}
        <section className="py-28 px-4 md:px-8 bg-gradient-to-br from-[#ffe8f5] via-[#f5e8ff] to-[#e8f0ff] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-[#E91E63] to-[#9C27B0] rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-[#3B82F6] to-[#2196F3] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="backdrop-blur-xl  p-12 md:p-16">
              <p className="text-3xl md:text-5xl font-extrabold text-center leading-relaxed">
                <span className="text-[#2D1B4E]">Love begins with </span>
                <span className="gradient-text">expression</span>
                <span className="text-[#2D1B4E]">.</span>
                <br />
                <span className="text-[#2D1B4E]">And lives forever with </span>
                <span className="gradient-text">Izhaar</span>
                <span className="text-[#2D1B4E]">.</span>
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-28 px-4 md:px-8 bg-gradient-to-br from-[#e8f0ff] via-[#ffe8f5] to-[#f0e8ff] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-[#2196F3] to-[#00BCD4] rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-[#E91E63] to-[#FF5722] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#2D1B4E]">
              Why Choose <span className="gradient-text">Izhaar</span>?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Complete Anonymity</h3>
                <p className="text-[#6B5B8E]">Your identity is always protected. Express yourself freely without worry.</p>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg">
                <div className="text-4xl mb-4">💝</div>
                <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Multiple Formats</h3>
                <p className="text-[#6B5B8E]">Express through letters, songs, videos, or simple text messages.</p>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Safe Delivery</h3>
                <p className="text-[#6B5B8E]">Your message reaches safely, creating beautiful connections that last.</p>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* ABOUT US */}
        <section id="about" className="py-28 px-4 md:px-8 bg-gradient-to-br from-[#fff0e8] via-[#ffe8f5] to-[#f0f5ff] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-[#FF6F00] to-[#E91E63] rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-[#3B82F6] to-[#9C27B0] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#2D1B4E]">
              About <span className="gradient-text">Izhaar</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-[#6B5B8E] mb-6 leading-relaxed">
                  <span className="font-bold text-[#2D1B4E]">Izhaar</span> was born from a simple yet powerful idea: love should have no barriers. We believe that everyone deserves a safe, beautiful way to express their deepest emotions.
                </p>
                <p className="text-lg text-[#6B5B8E] mb-6 leading-relaxed">
                  In a world where silence often wins and hearts go unheard, we created Izhaar as a platform where vulnerability is celebrated, anonymity is protected, and connections are genuine.
                </p>
                <p className="text-lg text-[#6B5B8E] mb-6 leading-relaxed">
                  Whether it's a confession, a declaration, or simply heartfelt words that have been waiting to be said — Izhaar is here to help you speak.
                </p>
                <button
                  onClick={() => navigate("/user/dashboard")}
                  className="px-10 py-4 rounded-full font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  Join Our Community
                </button>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-[#d4c5e8]/30 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
                    <p className="text-[#6B5B8E]">Happy Users</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
                    <p className="text-[#6B5B8E]">Messages Sent</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">5K+</div>
                    <p className="text-[#6B5B8E]">Connections Made</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
                    <p className="text-[#6B5B8E]">Support Available</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 bg-white/60 backdrop-blur-md rounded-3xl p-12 border border-[#d4c5e8]/30">
              <h3 className="text-2xl md:text-3xl font-bold text-[#2D1B4E] mb-8 text-center">Our Mission</h3>
              <p className="text-lg text-[#6B5B8E] text-center leading-relaxed max-w-3xl mx-auto">
                At Izhaar, our mission is to create a world where emotions flow freely, hearts are heard, and love knows no boundaries. We're committed to providing a safe, anonymous, and beautiful platform where people can express themselves authentically and build meaningful connections.
              </p>
            </div>
          </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gradient-to-r from-[#2D1B4E] to-[#4A3088] text-white py-12 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-bold mb-4 gradient-text">Izhaar</h4>
                <p className="text-white/70 text-sm">Speak your heart. Express your love. Build connections.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="#home" className="hover:text-white transition">Home</a></li>
                  <li><a href="#journey" className="hover:text-white transition">How It Works</a></li>
                  <li><a href="#features" className="hover:text-white transition">Features</a></li>
                  <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Follow Us</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="#" className="hover:text-white transition">Instagram</a></li>
                  <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                  <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 pt-8 text-center text-white/70 text-sm">
              <p>&copy; 2026 Izhaar. All rights reserved. Made with <span className="text-pink-400">❤️</span> for love.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
