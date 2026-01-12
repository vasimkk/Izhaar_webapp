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
      desc:
        "With courage, Rahul wrote from the heart. Every word carried his love, hope, and vulnerability. He took a deep breath… and sent it.",
      image: Step3,
    },
    {
      id: "step4",
      title: "Anjali Feels the Magic",
      desc:
        "Anjali read the message, surprised and moved. Every word reflected sincerity. Her heart warmed, and a smile spread across her face as she chose to respond.",
      image: Step4,
    },
    {
      id: "step5",
      title: "A Beautiful Beginning",
      desc:
        "Rahul and Anjali connected. A new chapter began — built on honesty, courage, and the gentle touch of Izhaar.",
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
    
    for (let i = 1; i <= 9; i++) {
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
          }
          
          .feature-card.visible {
            opacity: 1;
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

        {/* FEATURES */}
        <section id="features" className="py-28 px-4 md:px-8 bg-gradient-to-br from-[#e8f0ff] via-[#ffe8f5] to-[#f0e8ff] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-[#2196F3] to-[#00BCD4] rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-[#E91E63] to-[#FF5722] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#2D1B4E]">
                Why Choose <span className="gradient-text">Us</span>
              </h2>

              <div className="space-y-8">
                {/* Feature 1 */}
                <div 
                  id="feature-1"
                  className={`feature-card ${visibleFeatures.has(1) ? 'visible slide-in-left' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">1️⃣</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">We Speak When You Can't</h3>
                      <p className="text-[#6B5B8E] leading-relaxed">
                        Not everyone can confess directly — fear, shyness, or overthinking can stop you.
                        Izhaar becomes your voice and expresses your feelings exactly the way your heart wants.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div 
                  id="feature-2"
                  className={`feature-card ${visibleFeatures.has(2) ? 'visible slide-in-right' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">2️⃣</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">100% Safe & Anonymous</h3>
                      <p className="text-[#6B5B8E] leading-relaxed">
                        Your identity stays hidden until you choose to reveal it.
                        One blurred photo, partial details, and complete encryption protect your privacy at every step.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div 
                  id="feature-3"
                  className={`feature-card ${visibleFeatures.has(3) ? 'visible slide-in-left' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">3️⃣</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Cinematic & Emotional Delivery</h3>
                      <p className="text-[#6B5B8E] leading-relaxed">
                        From digital messages to real expression,
                        from beautiful templates to heartfelt delivery —
                        Izhaar makes your feelings real when you can't express them yourself.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 4 */}
                <div 
                  id="feature-4"
                  className={`feature-card ${visibleFeatures.has(4) ? 'visible slide-in-right' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">4️⃣</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Unique Code-Wala Izhaar</h3>
                      <p className="text-[#6B5B8E] leading-relaxed mb-3">
                        For anyone who likes someone but has no way to reach them — Izhaar opens the way.
                        We deliver a premium sealed envelope physically with a unique code.
                      </p>
                      <p className="text-[#6B5B8E] leading-relaxed">
                        The receiver sees your confession in a heart-touching way — a moment they'll never forget.
                        After that, both of you can chat safely without sharing personal details, and when the time feels right, you can reveal your identity.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 5 */}
                <div 
                  id="feature-5"
                  className={`feature-card ${visibleFeatures.has(5) ? 'visible slide-in-left' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">5️⃣</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Guided Chat That Builds Real Connection</h3>
                      <p className="text-[#6B5B8E] leading-relaxed mb-3">
                        Once your confession is sent and the receiver clicks "Curious to Know," the chat opens 
                        where you can express your true emotions in a fantasy-inspired guided world, with our in-built tools bringing every feeling to life.
                      </p>
                      <ul className="text-[#6B5B8E] space-y-2 ml-4">
                        <li>• Poems and songs</li>
                        <li>• Perfectly written replies</li>
                        <li>• Emotion-guiding suggestions</li>
                        <li>• Suggested and impressive daily messages</li>
                        <li>• Effortless, natural conversations</li>
                      </ul>
                      <p className="text-[#6B5B8E] leading-relaxed mt-3">
                        Your feelings find their voice, allowing you to connect deeply and meaningfully, in a safe and enchanting way.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 6 */}
                <div 
                  id="feature-6"
                  className={`feature-card ${visibleFeatures.has(6) ? 'visible slide-in-right' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">6️⃣</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Verified & Safe Meetings</h3>
                      <p className="text-[#6B5B8E] leading-relaxed">
                        If both sides are comfortable, Izhaar arranges secure meetings at trusted cafés — especially
                        designed for women's safety.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 7 */}
                <div 
                  id="feature-7"
                  className={`feature-card ${visibleFeatures.has(7) ? 'visible slide-in-left' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">7️⃣</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Impressed Meter System</h3>
                      <p className="text-[#6B5B8E] leading-relaxed mb-3">
                        A live emotional meter in the chat reveals how much the receiver is deeply impressed.
                        As it rises, you can sense their interest in real time, knowing exactly when your feelings are making a meaningful impact.
                      </p>
                      <p className="text-[#6B5B8E] leading-relaxed">
                        When it hits 100%, you have the opportunity to reveal your identity, at the perfect moment, as the other person is genuinely impressed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 8 */}
                <div 
                  id="feature-8"
                  className={`feature-card ${visibleFeatures.has(8) ? 'visible slide-in-right' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">8️⃣</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Built for Love, Apologies & Second Chances</h3>
                      <p className="text-[#6B5B8E] leading-relaxed">
                        Whether it's a confession, a sorry message, or a patch-up, we help you express emotions in a dignified and heartfelt way.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 9 */}
                <div 
                  id="feature-9"
                  className={`feature-card ${visibleFeatures.has(9) ? 'visible slide-in-left' : ''} bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#d4c5e8]/30 shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">9️⃣</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">We Protect Your Heart</h3>
                      <ul className="text-[#6B5B8E] space-y-2">
                        <li>• No harassment.</li>
                        <li>• No pressure.</li>
                        <li>• No awkward situations.</li>
                        <li>• No random messages.</li>
                      </ul>
                      <p className="text-[#6B5B8E] leading-relaxed mt-3">
                        Just pure intentions, respectful communication, and safe connection.
                      </p>
                    </div>
                  </div>
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
