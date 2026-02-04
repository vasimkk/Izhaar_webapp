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

      {/* JOURNEY */}
      <section id="journey" className="relative w-full">

        {/* FIXED VIDEO */}
        <div className="fixed inset-0 z-0">
          <video
            ref={videoRef}
            src={VIDEO_URL}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10">

          {/* HERO — REDUCED TO 70vh */}
          <div className="min-h-[70vh] flex items-center justify-center text-center px-6">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-7xl font-black">
                Got a Crush? <br />
                <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Too Scared to Say It?
                </span>
              </h1>
              <h3 className="text-2xl md:text-4xl font-bold">We’ve Got You 💗</h3>

              <button
                onClick={() => navigate("/user/dashboard")}
                className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:scale-105 transition"
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
              className={`min-h-[70vh] flex items-center justify-center transition-all duration-700 ${activeStep === index
                  ? "opacity-100 scale-100"
                  : "opacity-30 scale-95"
                }`}
            >
              <div className="max-w-4xl text-center px-6">
                <h3 className="text-4xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
                  {step.title}
                </h3>
                <div className="text-xl md:text-3xl leading-relaxed">
                  {step.desc}
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
