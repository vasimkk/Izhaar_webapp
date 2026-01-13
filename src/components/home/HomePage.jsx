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
  const [visibleFeatures, setVisibleFeatures] = useState(new Set());
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      id: "step1",
      title: "Rahul’s Hidden Heart",
      desc:
        "Rahul liked Anjali for months, but every time he tried to speak, fear and overthinking stopped him. His feelings stayed quietly in his heart, longing to be heard.",
      image: Step1,
    },
    {
      id: "step2",
      title: "Discovering Izhaar",
      desc:
        "Late one night, scrolling on his phone, Rahul found Izhaar — a safe, thoughtful way to share feelings without awkwardness or pressure.",
      image: Step2,
    },
    {
      id: "step3",
      title: "Pouring His Heart Out",
      desc:"With the help of Izhaar’s smart tools, Rahul turned his unspoken feelings into the right words—honest, respectful, and deeply heartfelt, exactly as he truly felt inside. Every word carried his love, hope, and vulnerability. He took a deep breath… and sent it anonymously.",
      image: Step3,
    },
    {
      id: "step4",
      title: "Anjali Feels the Magic",
      desc:
        "Anjali read the message, surprised and moved. Every word reflected sincerity. Her heart warmed, and a smile spread across her face as she chose to respond, curious to know more. A chat box opens and Rahul gets a chance to impress her and reveal his identity whenever he likes.",
      image: Step4,
    },
    {
      id: "step5",
      title: "A Beautiful Beginning",
      desc:
        "Rahul and Anjali felt the spark and a true connection. With Izhaar’s Safe Date service, they met in a warm, special, and secure way. A new chapter began — built on honesty, courage, and the gentle touch of Izhaar, turning their story into a beautiful reality.",
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

  /* =======================
     FEATURE CARDS OBSERVER
  ======================= */
  useEffect(() => {
    const featureObservers = [];
    
    for (let i = 1; i <= 11; i++) {
      const el = document.getElementById(`feature-${i}`);
      if (!el) continue;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleFeatures(prev => new Set([...prev, i]));
          }
        },
        { threshold: 0.2 }
      );
      
      observer.observe(el);
      featureObservers.push(observer);
    }
    
    return () => featureObservers.forEach(o => o.disconnect());
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

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          .font-vibes { font-family: 'Great Vibes', cursive; }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .slide-in-left {
            animation: slideInLeft 0.8s ease-out forwards;
          }
          
          .slide-in-right {
            animation: slideInRight 0.8s ease-out forwards;
          }
          
          .feature-card {
            opacity: 0;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .feature-card.visible {
            opacity: 1;
          }
          
          .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(45, 27, 78, 0.15);
          }
          
          .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease-in-out, opacity 0.3s ease, margin-top 0.3s ease;
            opacity: 0;
          }
          
          .faq-answer.open {
            max-height: 500px;
            opacity: 1;
            margin-top: 1rem;
          }
          
          .faq-icon {
            transition: transform 0.3s ease;
          }
          
          .faq-icon.rotate {
            transform: rotate(180deg);
          }
        `}
      </style>

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
            <h1 className="text-xl sm:text-6xl font-extrabold mb-6 text-[#2D1B4E] font-serif">
              <span className="gradient-text font-playfair font-bold text-6xl sm:text-7xl">
                Izhaar
              </span>
              <br />
              <span className="ml-2 font-vibes italic font-normal align-baseline text-red-700 pr-5">Love</span>
              <span className="gradient-text font-playfair font-normal text-4xl">
                Deserves a Chance</span>
            </h1>
            <p className="text-2xl text-[#6B5B8E] mb-10 ">
              You express. We deliver. They feel.
            </p>
            <button
              onClick={() => navigate("/user/dashboard")}
              className="px-10 py-4 rounded-full font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              Send Your Feelings ➜
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
            <span className="gradient-text font-serif">How It Works</span>
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
                        className={`max-w-md mx-auto transition-all duration-700 ${isActive
                            ? "opacity-100 scale-100"
                            : "opacity-40 scale-90"
                          }`}
                      >
                        <div className="aspect-[4/5] rounded-3xl glass-effect overflow-hidden flex items-center justify-center  backdrop-blur-md ">
                          <img
                            src={step.image}
                            alt={step.title}
                            className={`w-full h-full object-contain ${isActive
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

        {/* ABOUT US */}
        <section id="about" className="py-28 px-4 md:px-8 bg-gradient-to-br from-[#fff0e8] via-[#ffe8f5] to-[#f0f5ff] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-[#FF6F00] to-[#E91E63] rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-[#3B82F6] to-[#9C27B0] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#2D1B4E]">
                About <span className="gradient-text">Us</span>
              </h2>

              {/* Mission */}
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-[#d4c5e8]/30 shadow-xl mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-[#2D1B4E] mb-6 text-center">
                  <span className="gradient-text">Mission</span>
                </h3>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  Our mission is simple — to help people express feelings they cannot say themselves.
                </p>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  We aim to make confessions, apologies, and emotional communication safe, respectful, and beautifully delivered, so no relationship, bond, or love story breaks because of fear, shyness, hesitation, or overthinking.
                </p>
                <p className="text-lg text-[#2D1B4E] font-semibold leading-relaxed text-center mt-6">
                  Izhaar exists to give every genuine feeling… a genuine chance.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-[#d4c5e8]/30 shadow-xl mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-[#2D1B4E] mb-6 text-center">
                  <span className="gradient-text">Vision</span>
                </h3>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  Our vision is to build India's most trusted emotional-expression platform — a place where anyone can confess, connect, apologize, or reconnect without fear.
                </p>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  A future where:
                </p>
                <ul className="text-lg text-[#6B5B8E] space-y-2 ml-6 mb-4">
                  <li>• Expressing love feels effortless</li>
                  <li>• Relationships get second chances</li>
                  <li>• Feelings are respected, not judged</li>
                  <li>• Safe meetings and guided conversations protect both hearts</li>
                  <li>• Every emotion finds the right path to the right person</li>
                </ul>
                <p className="text-lg text-[#2D1B4E] font-semibold leading-relaxed text-center mt-6">
                  We aim to turn unspoken emotions into unforgettable moments — one confession at a time.
                </p>
              </div>

              {/* Our Story */}
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-[#d4c5e8]/30 shadow-xl mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-[#2D1B4E] mb-6 text-center">
                  <span className="gradient-text">Our Story</span>
                </h3>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  <span className="font-bold text-[#2D1B4E]">Izhaar</span> was born from a simple truth —
                  people feel deeply, but not everyone can express it.
                </p>
                <div className="text-lg text-[#6B5B8E] leading-relaxed mb-4 space-y-2">
                  <p>Some freeze.</p>
                  <p>Some overthink.</p>
                  <p>Some fear rejection.</p>
                  <p>Some fear losing the relationship.</p>
                  <p>And some just don't know how to say it.</p>
                </div>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  We saw countless beautiful connections ending before they even began…
                  not because feelings were missing,
                  but because words were.
                </p>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  So we created <span className="font-bold text-[#2D1B4E]">Izhaar</span> —
                  a platform that speaks for the shy, the scared, the nervous, the emotional, the introverted,
                  and the deeply genuine.
                </p>
                <p className="text-lg text-[#6B5B8E] leading-relaxed mb-4">
                  From anonymous confessions to love-filled surprises,
                  from guided conversations to verified, safe meetings —
                  Izhaar ensures that your heart finally reaches the place it always wanted to.
                </p>
                <div className="text-lg text-[#2D1B4E] font-semibold leading-relaxed text-center mt-6 space-y-2">
                  <p>Because every love story deserves a chance.</p>
                  <p>And every feeling deserves to be expressed.</p>
                </div>
              </div>

              {/* Statistics & CTA */}
              <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
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

                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#2D1B4E] mb-6">
                    Ready to Express Your Heart?
                  </h3>
                  <p className="text-lg text-[#6B5B8E] mb-6 leading-relaxed">
                    Join thousands who found the courage to speak their truth through Izhaar.
                  </p>
                  <button
                    onClick={() => navigate("/user/dashboard")}
                    className="px-10 py-4 rounded-full font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Start Your Izhaar Journey ➜
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="features" className="py-28 px-4 md:px-8 bg-gradient-to-br from-[#e8f0ff] via-[#ffe8f5] to-[#f0e8ff] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-[#2196F3] to-[#00BCD4] rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-[#E91E63] to-[#FF5722] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#2D1B4E]">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>

              <div className="space-y-6">
                {/* FAQ 1 */}
                <div 
                  id="feature-1"
                  className={`feature-card ${visibleFeatures.has(1) ? 'visible slide-in-left' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg`}
                  onClick={() => toggleFaq(1)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2D1B4E]">Q1: What is Izhaar?</h3>
                    <div className={`faq-icon ${openFaq === 1 ? 'rotate' : ''} text-3xl text-[#9C27B0]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className={`faq-answer ${openFaq === 1 ? 'open' : ''}`}>
                    <p className="text-[#6B5B8E] leading-relaxed">
                      <span className="font-semibold text-[#2D1B4E]">A:</span> Izhaar is a platform designed to help you express emotions that are difficult to say out loud, whether it's love, interest, an apology, or asking for a second chance. It provides a safe, thoughtful, and dignified way to communicate your feelings.
                    </p>
                  </div>
                </div>

                {/* FAQ 2 */}
                <div 
                  id="feature-2"
                  className={`feature-card ${visibleFeatures.has(2) ? 'visible slide-in-right' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg`}
                  onClick={() => toggleFaq(2)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2D1B4E]">Q2: Who is Izhaar meant for?</h3>
                    <div className={`faq-icon ${openFaq === 2 ? 'rotate' : ''} text-3xl text-[#9C27B0]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className={`faq-answer ${openFaq === 2 ? 'open' : ''}`}>
                    <p className="text-[#6B5B8E] leading-relaxed">
                      <span className="font-semibold text-[#2D1B4E]">A:</span> Izhaar is for people who hesitate to express love or emotions due to fear, shyness, confusion, or respect for boundaries. If your feelings are real but words feel difficult, Izhaar is for you.
                    </p>
                  </div>
                </div>

                {/* FAQ 3 */}
                <div 
                  id="feature-3"
                  className={`feature-card ${visibleFeatures.has(3) ? 'visible slide-in-left' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg`}
                  onClick={() => toggleFaq(3)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2D1B4E]">Q3: What if I don't have the receiver's contact details?</h3>
                    <div className={`faq-icon ${openFaq === 3 ? 'rotate' : ''} text-3xl text-[#9C27B0]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className={`faq-answer ${openFaq === 3 ? 'open' : ''}`}>
                    <p className="text-[#6B5B8E] leading-relaxed">
                      <span className="font-semibold text-[#2D1B4E]">A:</span> Yes. With Code-Wala Izhaar, your message is sent through a sealed envelope delivered by our trusted partner. The receiver scans the QR code to view your encrypted confession safely, without sharing any contact details.
                    </p>
                  </div>
                </div>

                {/* FAQ 4 */}
                <div 
                  id="feature-4"
                  className={`feature-card ${visibleFeatures.has(4) ? 'visible slide-in-right' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg`}
                  onClick={() => toggleFaq(4)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2D1B4E]">Q4: How does Izhaar help me express my feelings?</h3>
                    <div className={`faq-icon ${openFaq === 4 ? 'rotate' : ''} text-3xl text-[#9C27B0]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className={`faq-answer ${openFaq === 4 ? 'open' : ''}`}>
                    <p className="text-[#6B5B8E] leading-relaxed">
                      <span className="font-semibold text-[#2D1B4E]">A:</span> You share your message inside the Izhaar app. Our Confession Specialists inform the receiver through a call, letting them know that someone has expressed interest and guiding them to view the message through the app or a secure link, without revealing your identity.
                    </p>
                  </div>
                </div>

                {/* FAQ 5 */}
                <div 
                  id="feature-5"
                  className={`feature-card ${visibleFeatures.has(5) ? 'visible slide-in-left' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg`}
                  onClick={() => toggleFaq(5)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2D1B4E]">Q5: How is my message delivered — online or offline?</h3>
                    <div className={`faq-icon ${openFaq === 5 ? 'rotate' : ''} text-3xl text-[#9C27B0]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className={`faq-answer ${openFaq === 5 ? 'open' : ''}`}>
                    <div className="text-[#6B5B8E] leading-relaxed">
                      <p className="mb-3"><span className="font-semibold text-[#2D1B4E]">A:</span> Izhaar delivers your message in two ways depending on whether you have the receiver's contact details:</p>
                      <p className="mb-2"><span className="font-semibold text-[#2D1B4E]">With contact details (Online):</span> The receiver is informed through a call and can access your message via the Izhaar app or a secure link. Messages are fully encrypted and private.</p>
                      <p><span className="font-semibold text-[#2D1B4E]">Without contact details (Offline / Code-Wala Izhaar):</span> A sealed envelope with a QR code is delivered by our trusted partners. The receiver scans the code to safely access your encrypted message via the app or secure link.</p>
                    </div>
                  </div>
                </div>

                {/* FAQ 6 */}
                <div 
                  id="feature-6"
                  className={`feature-card ${visibleFeatures.has(6) ? 'visible slide-in-right' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg`}
                  onClick={() => toggleFaq(6)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2D1B4E]">Q6: What is Guided Chat on Izhaar?</h3>
                    <div className={`faq-icon ${openFaq === 6 ? 'rotate' : ''} text-3xl text-[#9C27B0]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className={`faq-answer ${openFaq === 6 ? 'open' : ''}`}>
                    <p className="text-[#6B5B8E] leading-relaxed">
                      <span className="font-semibold text-[#2D1B4E]">A:</span> Guided Chat uses AI-powered emotional assistance to suggest well-timed, thoughtful replies that fit the moment — helping your messages feel natural, confident, and emotionally appropriate without pressure.
                    </p>
                  </div>
                </div>

                {/* FAQ 7 */}
                <div 
                  id="feature-7"
                  className={`feature-card ${visibleFeatures.has(7) ? 'visible slide-in-left' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg`}
                  onClick={() => toggleFaq(7)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2D1B4E]">Q7: What if I don't know how to chat or express myself properly?</h3>
                    <div className={`faq-icon ${openFaq === 7 ? 'rotate' : ''} text-3xl text-[#9C27B0]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className={`faq-answer ${openFaq === 7 ? 'open' : ''}`}>
                    <p className="text-[#6B5B8E] leading-relaxed">
                      <span className="font-semibold text-[#2D1B4E]">A:</span> Izhaar's Guided Chat helps you communicate clearly and confidently in chat by suggesting responses that match your emotions, while maintaining comfort and boundaries.
                    </p>
                  </div>
                </div>

                {/* FAQ 8 */}
                <div 
                  id="feature-8"
                  className={`feature-card ${visibleFeatures.has(8) ? 'visible slide-in-right' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg`}
                  onClick={() => toggleFaq(8)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2D1B4E]">Q8: Are my messages private and secure?</h3>
                    <div className={`faq-icon ${openFaq === 8 ? 'rotate' : ''} text-3xl text-[#9C27B0]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className={`faq-answer ${openFaq === 8 ? 'open' : ''}`}>
                    <p className="text-[#6B5B8E] leading-relaxed">
                      <span className="font-semibold text-[#2D1B4E]">A:</span> Yes. All messages are encrypted. No one — not even Izhaar — can read your confessions or chats. Your emotions remain completely private.
                    </p>
                  </div>
                </div>

                {/* FAQ 9 */}
                <div 
                  id="feature-9"
                  className={`feature-card ${visibleFeatures.has(9) ? 'visible slide-in-left' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg`}
                  onClick={() => toggleFaq(9)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2D1B4E]">Q9: When is my identity revealed?</h3>
                    <div className={`faq-icon ${openFaq === 9 ? 'rotate' : ''} text-3xl text-[#9C27B0]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className={`faq-answer ${openFaq === 9 ? 'open' : ''}`}>
                    <p className="text-[#6B5B8E] leading-relaxed">
                      <span className="font-semibold text-[#2D1B4E]">A:</span> Your identity stays hidden until you choose to reveal it. This happens only when the receiver shows genuine interest and the timing feels right.
                    </p>
                  </div>
                </div>

                {/* FAQ 10 */}
                <div 
                  id="feature-10"
                  className={`feature-card ${visibleFeatures.has(10) ? 'visible slide-in-right' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg`}
                  onClick={() => toggleFaq(10)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2D1B4E]">Q10: Do you provide help with apologies or reconnecting?</h3>
                    <div className={`faq-icon ${openFaq === 10 ? 'rotate' : ''} text-3xl text-[#9C27B0]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className={`faq-answer ${openFaq === 10 ? 'open' : ''}`}>
                    <p className="text-[#6B5B8E] leading-relaxed">
                      <span className="font-semibold text-[#2D1B4E]">A:</span> Yes. Izhaar supports apologies, patch-ups, and second chances. You share what you want to say, and Izhaar delivers it respectfully and privately, allowing the other person to respond at their own pace.
                    </p>
                  </div>
                </div>

                {/* FAQ 11 */}
                <div 
                  id="feature-11"
                  className={`feature-card ${visibleFeatures.has(11) ? 'visible slide-in-left' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg`}
                  onClick={() => toggleFaq(11)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2D1B4E]">Q11: What if both of us want to meet?</h3>
                    <div className={`faq-icon ${openFaq === 11 ? 'rotate' : ''} text-3xl text-[#9C27B0]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className={`faq-answer ${openFaq === 11 ? 'open' : ''}`}>
                    <p className="text-[#6B5B8E] leading-relaxed">
                      <span className="font-semibold text-[#2D1B4E]">A:</span> If both sides are comfortable, Izhaar can help arrange a Safe Date Meeting at trusted locations, with special focus on privacy and women's safety.
                    </p>
                  </div>
                </div>
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
