import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Step1 from "../../assets/images/Fear.png";
import Step2 from "../../assets/images/izhaar_explore.png";
import Step3 from "../../assets/images/Male.png";
import Step4 from "../../assets/images/Female.png";
import Step5 from "../../assets/images/Couples.png";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

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
    <div className="relative w-full bg-[#0a0e1a] text-white overflow-x-hidden">
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
            }}
          />
        ))}
      </div>

      {/* =======================
         STYLES
      ======================= */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) scale(0.6) rotate(-45deg);
            opacity: 0;
          }
          20% { opacity: 0.6; }
          100% {
            transform: translateY(-120vh) scale(1) rotate(-45deg);
            opacity: 0;
          }
        }

        @keyframes softZoom {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .heart {
          position: absolute;
          bottom: -20px;
          width: 14px;
          height: 14px;
          background: rgba(255, 77, 109, 0.45);
          transform: rotate(-45deg);
          animation-name: floatUp;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .heart::before,
        .heart::after {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          background: rgba(255, 77, 109, 0.45);
          border-radius: 50%;
        }

        .heart::before {
          top: -7px;
          left: 0;
        }

        .heart::after {
          left: 7px;
          top: 0;
        }

        .glass-effect {
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .gradient-text {
          background: linear-gradient(135deg, #ff4d6d, #ce72ff, #9dd1ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* =======================
         CONTENT (ABOVE HEARTS)
      ======================= */}
      <div className="relative z-10">
        {/* HERO */}
        <section className="min-h-screen flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">
              <span className="gradient-text">Izhaar</span>
              <br />We Speak on Your Behalf
            </h1>
            <p className="text-xl text-white/80 mb-10">
              You express. We deliver. They feel.
            </p>
            <button
              onClick={() => navigate("/user/dashboard")}
              className="px-10 py-5 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg"
            >
              Start Your Izhaar
            </button>
          </div>
        </section>

        {/* JOURNEY */}
        <section id="journey" className="py-28 px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-24">
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
                    <h3 className="text-3xl md:text-4xl font-bold mb-6">
                      {step.title}
                    </h3>
                    <p className="text-white/80 text-lg leading-relaxed">
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
                      <div className="aspect-[4/5] rounded-3xl glass-effect overflow-hidden flex items-center justify-center">
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
        </section>

        {/* PROMISE */}
        <section className="py-24 text-center">
          <p className="text-3xl md:text-4xl font-bold">
            Love begins with{" "}
            <span className="gradient-text">expression</span>.
            <br />
            And lives forever with{" "}
            <span className="gradient-text">Izhaar</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
