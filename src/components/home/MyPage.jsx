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
  const [scrollProgress, setScrollProgress] = useState(0);
  const videoRef = React.useRef(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Scroll-based video control
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const progress = scrollPosition / documentHeight;
      
      setScrollProgress(progress);

      // Control video playback based on scroll position
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Pause the video (we control it via scroll)
        video.pause();
        
        // Calculate video time based on scroll progress
        // Video will scrub through its duration as user scrolls
        const videoDuration = video.duration;
        if (videoDuration) {
          video.currentTime = videoDuration * progress;
        }

        // Get active section for visual effects
        const sections = document.querySelectorAll('section');
        let activeIndex = 0;
        
        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            activeIndex = index;
          }
        });

        // Apply different video effects based on active section
        const effects = [
          { opacity: 1.0, brightness: 1.0, blur: 0 },      // Hero
          { opacity: 1.0, brightness: 1.0, blur: 0 },      // Journey
          { opacity: 1.0, brightness: 1.0, blur: 0 },      // Promise
          { opacity: 1.0, brightness: 1.0, blur: 0 },      // About
          { opacity: 1.0, brightness: 1.0, blur: 0 },      // FAQ
        ];

        const effect = effects[activeIndex] || effects[0];
        video.style.opacity = effect.opacity;
        video.style.filter = `brightness(${effect.brightness}) blur(${effect.blur}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial setup
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="relative w-full text-[#2D1B4E] overflow-x-hidden" style={{ minHeight: '500vh' }}>
      {/* Video Background - Changes effects based on scroll */}
      <div className="pointer-events-none fixed inset-0 z-0 will-change-transform">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ 
            willChange: 'transform, filter, opacity',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            transition: 'opacity 0.5s ease, filter 0.5s ease',
            opacity: 1.0,
            filter: 'brightness(1.0)'
          }}
          onError={(e) => console.error('Video failed to load:', e)}
          onLoadedData={() => {
            console.log('Video loaded successfully');
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
          }}
        >
          <source src={mypage} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <header className="fixed top-4 left-0 right-0 z-50 px-4">
        <div
          className="
      max-w-7xl mx-auto
      flex items-center justify-between
      px-6 py-4
      rounded-2xl
      bg-white/90
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
        bg-white/90
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
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-32 text-[#2D1B4E] drop-shadow-2xl">
              How It Works
            </h2>

            <div className="max-w-6xl mx-auto space-y-32">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="text-center transition-all duration-500 hover:transform hover:scale-105"
                >
                  <h3 className="text-3xl md:text-5xl font-bold mb-10 text-[#2D1B4E] drop-shadow-2xl">
                    {step.title}
                  </h3>
                  <div className="text-[#6B5B8E] text-xl md:text-2xl leading-relaxed drop-shadow-2xl max-w-4xl mx-auto font-light">
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-32">
              <button
                onClick={() => navigate("/user/dashboard")}
                className="px-10 py-4 rounded-full font-bold bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                Start Your Izhaar Journey ➜
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black/70 backdrop-blur-lg border-t border-white/10 text-white py-12 px-4 md:px-8 mt-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-bold mb-4 text-white">Izhaar</h4>
                <p className="text-white/70 text-sm">Speak your heart. Express your love. Build connections.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="#home" className="hover:text-white transition">Home</a></li>
                  <li><a href="#journey" className="hover:text-white transition">How It Works</a></li>
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