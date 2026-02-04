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
     VIDEO SYNC WITH SCROLL
  ======================= */
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const handleVideoSync = () => {
      if (!video.duration) return;
      const stepCount = steps.length;
      const segmentDuration = video.duration / stepCount;
      // Target time is the start of the segment corresponding to the active step
      const targetTime = activeStep * segmentDuration;

      // Tolerance to avoid jitter
      if (Math.abs(video.currentTime - targetTime) < 0.5) return;

      if (targetTime > video.currentTime) {
        // Play forward smoothly
        video.play().catch(() => { }); // catch interrupt errors
        const checkTime = () => {
          if (video.currentTime >= targetTime) {
            video.pause();
            video.removeEventListener("timeupdate", checkTime);
          }
        };
        video.addEventListener("timeupdate", checkTime);
      } else {
        // Rewind instantly (seeking backward is hard to animate smoothly)
        video.currentTime = targetTime;
      }
    };

    // Attempt sync immediately and also ensure metadata is loaded
    if (video.readyState >= 1) {
      handleVideoSync();
    } else {
      video.onloadedmetadata = handleVideoSync;
    }
  }, [activeStep]);



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
    <div className="relative w-full text-[#2D1B4E]">

      <header className="fixed top-4 left-0 right-0 z-50 px-4">
        <div
          className="
      max-w-7xl mx-auto
      flex items-center justify-between
      px-6 py-4
      rounded-2xl
      bg-white/20
      backdrop-blur-xl
      border border-white/30
      shadow-lg shadow-black/10
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
            <a href="#about" className="hover:text-pink-200 transition">About Us</a>
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
        bg-black/60
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
            <a href="#about" className="block hover:text-pink-200" onClick={() => setMenuOpen(false)}>About Us</a>
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
        <div className="fixed top-0 left-0 w-full h-[100dvh] overflow-hidden z-0">
          <video
            ref={videoRef}
            src={bgVideo}
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark Overlay (Gradient: Clear at top, Darker at bottom for text) */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

          {/* Fixed Background Elements (Optional decorative blurs) */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        {/* SCROLLING CONTENT TRACK - Scrolls OVER the fixed video */}
        <div className="relative z-10">
          <div className="w-full">

            {/* BLOCK 1: HERO TEXT */}
            <div className="min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-700">
              <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up text-center">
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight drop-shadow-2xl font-serif leading-tight">
                  Got a Crush? <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">Too Scared to Say It?</span>
                </h1>
                <h3 className="text-3xl md:text-5xl font-bold text-white mt-4 drop-shadow-lg">
                  We’ve Got You 💗
                </h3>

                <button
                  onClick={() => navigate("/user/dashboard")}
                  className="mt-12 px-14 py-6 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white text-xl font-bold rounded-full shadow-[0_0_40px_rgba(233,30,99,0.5)] hover:scale-105 transition-all border-2 border-white/20 mx-auto flex items-center gap-3"
                >
                  <span>Confess Now</span>
                  <span className="text-2xl">💌</span>
                </button>
              </div>
            </div>


            {/* BLOCK 3+: SCROLL STEPS */}
            {steps.map((step, index) => (
              <div
                key={step.id}
                id={step.id}
                className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-700 ${activeStep === index ? "opacity-100 blur-none scale-100" : "opacity-20 blur-sm scale-90"
                  }`}
              >
                <h3 className="text-4xl md:text-7xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 drop-shadow-2xl font-vibes text-center">
                  {step.title}
                </h3>
                <div className="text-xl md:text-3xl text-white font-medium leading-relaxed drop-shadow-md max-w-3xl mx-auto text-center">
                  {step.desc}
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