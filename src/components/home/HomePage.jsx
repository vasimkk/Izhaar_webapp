import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/logo.png";
import Step1 from "../../assets/images/Fear.png";
import Step2 from "../../assets/images/izhaar_explore.png";
import Step3 from "../../assets/images/Male.png";
import Step4 from "../../assets/images/Female.png";
import Step5 from "../../assets/images/Couples.png";


import bgVideo from "../../assets/bgvidieo.mp4";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = React.useRef(null);


  /* =======================
     VIDEO SYNC WITH SCROLL (SCRUBBING)
  ======================= */
  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return;
      const video = videoRef.current;
      const section = document.getElementById("journey");
      if (!section) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.scrollHeight;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // DELAY: Minimal scroll delay (matched to 120vh Hero)
      const startOffset = viewportHeight * 0.5;

      // Calculate progress
      let activeScroll = scrollY - sectionTop - startOffset;
      let totalScrollableHeight = sectionHeight - viewportHeight - startOffset;

      if (totalScrollableHeight <= 0) totalScrollableHeight = 1;

      let progress = activeScroll / totalScrollableHeight;
      progress = Math.max(0, Math.min(1, progress));

      // Map progress to video duration (Frame-by-Frame Control)
      if (video.duration) {
        video.currentTime = video.duration * progress;
      }

      // Update active step based on DOM position (Physical Scroll)
      // This handles variable step heights correctly
      const centerLine = scrollY + viewportHeight / 2;
      let foundStep = 0;

      for (let i = 0; i < steps.length; i++) {
        const el = document.getElementById(steps[i].id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (centerLine >= offsetTop && centerLine < offsetTop + offsetHeight) {
            foundStep = i;
            break;
          }
        }
      }
      setActiveStep(foundStep);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const steps = [
    {
      id: "step1",
      title: "Rahul’s Hidden Heart",
      desc: "Rahul liked Anjali for months, but every time he tried to speak, fear and overthinking held him back. His feelings remained quietly in his heart, waiting for a moment to be heard.",
      image: Step1,
    },
    {
      id: "step2",
      title: "Discovering Izhaar",
      desc: "One late night, while scrolling on his phone, Rahul discovered Izhaar. It offered a safe and thoughtful way to express his feelings without revealing his identity",
      image: Step2,
    },
    {
      id: "step3",
      title: "Pouring His Heart Out",
      desc: (
        <>
          After signing up on Izhaar, Rahul shared his emotions through the{" "}
          <strong>AI-powered emotional assistance </strong>, which helped him shape his thoughts into respectful and heartfelt words.
          <br /><br />
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
      image: Step5, // Fixed image reference from earlier context if needed, or keep Step4. Assuming Step4 is correct.

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
    },
    {
      id: "step6",
      title: "play game",
      desc: (
        <>
          When the interest became mutual, Rahul chose to<strong> Reveal himself</strong>. Rahul and Anjali felt a genuine spark and a meaningful connection.
          <br />
          <br />
          Through the <strong>Izhaar Safe Date</strong> service, they met in a secure and well-arranged date. It marked the beginning of a new chapter built on honesty, courage, and the trusted guidance of Izhaar, leading to a lasting bond.
        </>
      ),
      image: Step5,
    },
    {
      id: "step7",
      title: "New Mobiew",
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

  /* =======================
     INTERSECTION OBSERVER
  ======================= */



  return (
    <div className="relative w-full text-[#2D1B4E] bg-black">

      {/* SCROLL PROGRESS BAR */}
      <div
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 z-[100] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(236,72,153,0.7)]"
        style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
      />

      <header className="fixed top-4 left-0 right-0 z-50 px-4">
        <div
          className="
      max-w-7xl mx-auto
      flex items-center justify-between
      px-6 py-4
      rounded-2xl
      bg-white/10
      backdrop-blur-xl
      border border-white/20
      shadow-lg shadow-black/20
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

          {/* DESKTOP NAV - Updated text color for visibility on video */}
          <nav className="hidden md:flex gap-10 text-white font-bold drop-shadow-md">
            <a href="#home" className="hover:text-pink-200 transition">Home</a>
            <a href="#journey" className="hover:text-pink-200 transition">How It Works</a>
            <a href="#features" className="hover:text-pink-200 transition">Features</a>
            <a href="/about-us" className="hover:text-pink-200 transition">About Us</a>
          </nav>

          {/* MOBILE HAMBURGER - updated color */}
          <button
            className="md:hidden text-2xl text-white"
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
        bg-black/80
        backdrop-blur-xl
        border border-white/20
        shadow-lg
        px-6 py-6
        space-y-4
        text-white
      "
          >
            <a href="#home" className="block hover:text-pink-200" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#journey" className="block hover:text-pink-200" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#features" className="block hover:text-pink-200" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="/about-us" className="block hover:text-pink-200" onClick={() => setMenuOpen(false)}>About Us</a>
          </div>
        )}
      </header>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          .font-vibes { font-family: 'Great Vibes', cursive; }
          
        `}
      </style>





      {/* JOURNEY */}
      {/* JOURNEY - MAIN CONTAINER */}
      <section id="journey" className="relative w-full">
        {/* FIXED VIDEO BACKGROUND: Covers entire screen */}
        <div className="fixed top-0 left-0 w-full h-[100dvh] overflow-hidden z-0 bg-black">
          <video
            ref={videoRef}
            src={bgVideo}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark Overlay (Solid semi-transparent black for text visibility) */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Fixed Background Elements (Optional decorative blurs) */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        {/* SCROLLING CONTENT TRACK - Scrolls OVER the fixed video */}
        <div className="relative z-10">
          <div className="w-full">

            {/* BLOCK 1: HERO TEXT */}
            <div className="min-h-[120vh] relative">
              <div className="sticky top-0 h-screen flex flex-col items-center justify-center p-6 z-20">
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up text-center">
                  <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight drop-shadow-md font-serif leading-tight">
                    Got a Crush? <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">Too Scared to Say It?</span>
                  </h1>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mt-2 drop-shadow-sm">
                    We’ve Got You 💗
                  </h3>

                  <button
                    onClick={() => navigate("/user/dashboard")}
                    className="mt-8 px-10 py-4 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white text-lg font-bold rounded-full shadow-[0_10px_20px_rgba(233,30,99,0.4)] hover:scale-105 transition-all border-2 border-white/50 mx-auto flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Confess Now</span>
                    <span className="text-xl group-hover:scale-110 transition-transform">💌</span>
                  </button>
                </div>
              </div>
            </div>


            {/* BLOCK 3+: SCROLL STEPS */}
            {steps.map((step, index) => (
              <div
                key={step.id}
                id={step.id}
                className={`relative transition-all duration-700 min-h-[120vh] ${activeStep === index
                  ? "opacity-100 blur-none scale-100"
                  : "opacity-20 blur-sm scale-90"
                  }`}
              >
                <div className="sticky top-0 h-screen flex flex-col items-center justify-center p-6 z-10 w-full max-w-4xl mx-auto">
                  <h3 className="text-4xl md:text-7xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 drop-shadow-2xl font-vibes text-center">
                    {step.title}
                  </h3>
                  <div className="text-xl md:text-3xl text-white font-medium leading-relaxed drop-shadow-md max-w-3xl mx-auto text-center">
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>




    </div>

  );
};

export default HomePage;