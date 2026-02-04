import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/logo.png";
import Step1 from "../../assets/images/Fear.png";
import Step2 from "../../assets/images/izhaar_explore.png";
import Step3 from "../../assets/images/Male.png";
import Step4 from "../../assets/images/Female.png";
import Step5 from "../../assets/images/Couples.png";

// ✅ CLOUDINARY VIDEO URL
const VIDEO_URL =
  "https://res.cloudinary.com/df5jbm55b/video/upload/q_auto,f_auto/v1770212374/bgvidieo_uakxfl.mp4";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = React.useRef(null);

  /* =======================
     VIDEO SYNC WITH SCROLL
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

      const startOffset = viewportHeight * 0.3;

      let activeScroll = scrollY - sectionTop - startOffset;
      let totalScrollableHeight = sectionHeight - viewportHeight - startOffset;

      if (totalScrollableHeight <= 0) totalScrollableHeight = 1;

      let progress = activeScroll / totalScrollableHeight;
      progress = Math.max(0, Math.min(1, progress));

      if (video.duration) {
        if (!video._raf) {
          video._raf = requestAnimationFrame(() => {
            video.currentTime = video.duration * progress;
            video._raf = null;
          });
        }
      }

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
      desc:
        "Rahul liked Anjali for months, but fear and overthinking held him back. His feelings stayed quietly in his heart.",
      image: Step1,
    },
    {
      id: "step2",
      title: "Discovering Izhaar",
      desc:
        "One late night, Rahul discovered Izhaar — a safe way to express feelings anonymously.",
      image: Step2,
    },
    {
      id: "step3",
      title: "Pouring His Heart Out",
      desc: (
        <>
          Rahul shared his emotions using{" "}
          <strong>AI-powered emotional assistance</strong>.
          <br /><br />
          Confession specialists reached Anjali while keeping Rahul’s{" "}
          <strong>identity private</strong>.
        </>
      ),
      image: Step3,
    },
    {
      id: "step4",
      title: "Anjali Feels the Magic",
      desc: (
        <>
          Anjali read the message and felt its warmth.
          <br /><br />
          She clicked <strong>“Curious to Know”</strong> and the conversation began.
        </>
      ),
      image: Step4,
    },
    {
      id: "step5",
      title: "A Beautiful Beginning",
      desc: (
        <>
          Rahul revealed himself.
          <br /><br />
          Through <strong>Izhaar Safe Date</strong>, they met securely and started a new chapter.
        </>
      ),
      image: Step5,
    },
  ];

  return (
    <div className="relative w-full bg-black text-white">

      {/* SCROLL PROGRESS */}
      <div
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 z-[100]"
        style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
      />

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          .font-vibes { font-family: 'Great Vibes', cursive; }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          
          @keyframes glow {
             0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.2); border-color: rgba(255,255,255,0.1); }
             50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.4); border-color: rgba(236, 72, 153, 0.5); }
          }
          .animate-glow { animation: glow 3s infinite alternate; }
        `}
      </style>

      {/* JOURNEY - MAIN CONTAINER */}
      <section id="journey" className="relative w-full">
        {/* FIXED VIDEO BACKGROUND */}
        <div className="fixed top-0 left-0 w-full h-[100dvh] z-0 overflow-hidden">
          <video
            ref={videoRef}
            src={VIDEO_URL}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10">

          {/* HERO — REDUCED TO 70vh */}
          <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-7xl font-black drop-shadow-lg leading-tight">
                Got a Crush? <br />
                <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Too Scared to Say It?
                </span>
              </h1>
              <h3 className="text-xl md:text-4xl font-bold drop-shadow-md">We’ve Got You 💗</h3>

              <button
                onClick={() => navigate("/user/dashboard")}
                className="px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:scale-105 transition shadow-xl border border-white/20 text-sm md:text-base"
              >
                Confess Now 💌
              </button>
            </div>
          </div>

          {/* STEPS — ALL 70vh */}
          {steps.map((step, index) => (
            <div
              key={step.id}
              id={step.id}
              className={`min-h-[70vh] flex items-center justify-center perspective-1000 p-2 md:p-4 transition-all duration-1000 ${activeStep === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
            >
              <div
                className={`max-w-4xl w-[90%] md:w-full text-center relative transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform
                 ${activeStep === index
                    ? "translate-y-0 rotate-x-0 scale-100 opacity-100"
                    : "translate-y-24 rotate-x-12 scale-90 opacity-0"
                  }`}
              >
                {/* Modern Glass Card */}
                <div className={`bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-14 shadow-2xl relative overflow-hidden group ${activeStep === index ? 'animate-float animate-glow' : ''}`}>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"></div>

                  {/* Decorative Top Line */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-20 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-70"></div>

                  <h3
                    className={`text-3xl md:text-7xl font-extrabold mb-4 md:mb-8 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent font-vibes drop-shadow-sm transition-all duration-1000 delay-100 transform ${activeStep === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  >
                    {step.title}
                  </h3>
                  <div
                    className={`text-base md:text-2xl leading-relaxed text-white/95 font-medium tracking-wide drop-shadow-md transition-all duration-1000 delay-300 transform ${activeStep === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  >
                    {step.desc}
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
};

export default HomePage;
