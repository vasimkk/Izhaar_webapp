import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/logo.png";
import Step1 from "../../assets/images/Fear.png";
import Step2 from "../../assets/images/izhaar_explore.png";
import Step3 from "../../assets/images/Male.png";
import Step4 from "../../assets/images/Female.png";
import Step5 from "../../assets/images/Couples.png";
import mypage from "../../assets/video/mypage.mp4";

const MyPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      id: "step1",
      title: "Rahul’s Hidden Heart",
      desc:"Rahul liked Anjali for months, but every time he tried to speak, fear and overthinking held him back. His feelings remained quietly in his heart, waiting for a moment to be heard.",
      image: Step1,
    },
    {
      id: "step2",
      title: "Discovering Izhaar",
      desc:"One late night, while scrolling on his phone, Rahul discovered Izhaar. It offered a safe and thoughtful way to express his feelings without revealing his identity",
      image: Step2,
    },
{
  id: "step3",
  title: "Pouring His Heart Out",
  desc: (
    <>
      After signing up on Izhaar, Rahul shared his emotions through the{" "}
      <strong>AI-powered emotional assistance </strong>, which helped him shape his thoughts into respectful and heartfelt words.
      <br/><br/>
     <strong>Confession Specialists </strong>then reached out to Anjali to let her know that someone had expressed interest, while keeping Rahul’s <strong>Identity private.</strong> Every message was fully <strong>Encrypted</strong> and kept entirely <strong>Secure.</strong>
    </>
  ),
  image: Step3,
}
,
   {
  id: "step4",
  title: "Anjali Feels the Magic",
  desc: (
    <>
      Anjali read Rahul’s message at her own pace, taking in its warmth and sincerity. His honesty brought a gentle smile to her face.
      <br />
      <br />
      Wanting to know who had sent it, she clicked <strong>"Curious to Know"</strong>, and their conversation began, giving Rahul a chance to introduce himself with confidence and clarity.
    </>
  ),
  image: Step4,
}
,
   {
  id: "step5",
  title: "A Beautiful Beginning",
  desc: (
    <>
      When the interest became mutual, Rahul chose to<strong> Reveal himself</strong>. Rahul and Anjali felt a genuine spark and a meaningful connection.
      <br />
      <br />
      Through the <strong>Izhaar Safe Date</strong> service, they met in a secure and well-arranged date. It marked the beginning of a new chapter built on honesty, courage, and the trusted guidance of Izhaar, leading to a lasting bond.
    </>
  ),
  image: Step5,
}

  ];

  return (
    <div className="relative w-full text-[#2D1B4E] overflow-x-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover"
        style={{ 
          zIndex: 0,
          opacity: 0.6,
          filter: 'brightness(1.2)'
        }}
        onError={(e) => console.error('Video failed to load:', e)}
        onLoadedData={() => console.log('Video loaded successfully')}
      >
        <source src={mypage} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

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

          .floating-whatsapp {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #25D366;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 100;
            transition: transform 0.3s;
          }

          .floating-whatsapp:hover {
            transform: scale(1.1);
          }

          .animated-whatsapp {
            animation: bounce 2s infinite;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>

      {/* =======================
         CONTENT (ABOVE VIDEO)
      ======================= */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* HERO */}
        <section className="min-h-screen flex items-center justify-center text-center px-4 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-xl sm:text-6xl font-extrabold mb-6 text-[#2D1B4E] font-serif">
              <span className="gradient-text font-playfair font-bold text-6xl sm:text-7xl">
                Izhaar
              </span>
              <br />
              <span className="ml-2 font-vibes italic font-normal align-baseline text-red-700 pr-5 text-4xl sm:text-5xl md:text-6xl">Love</span>
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
        <section id="journey" className="py-28 px-4 md:px-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-24 text-[#2D1B4E]">
            <span className="gradient-text font-serif">How It Works</span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-16">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-[#d4c5e8]/30 shadow-xl"
                >
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#2D1B4E] text-center">
                    {step.title}
                  </h3>
                  <div className="text-[#6B5B8E] text-lg leading-relaxed text-center">
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROMISE */}
        <section className="py-28 px-4 md:px-8 relative overflow-hidden">
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
        <section id="about" className="py-28 px-4 md:px-8 relative overflow-hidden">
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
        <section id="features" className="py-28 px-4 md:px-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#2D1B4E]">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>

              <div className="space-y-6">
                {/* FAQ 1 */}
                <div 
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-[#d4c5e8]/30 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                  <li><a href="https://www.instagram.com/izhaar.official7/?igsh=MWJjNDlic2U4djU2eg%3D%3D" className="hover:text-white transition">Instagram</a></li>
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

        {/* Floating WhatsApp Icon */}
        <a
          href="https://wa.me/917075871167?text=Hi%20Izhaar,%20I%20want%20to%20know%20more%20about%20your%20app!"
          className="floating-whatsapp animated-whatsapp"
          target="_blank"
          title="Chat with us on WhatsApp"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default MyPage;