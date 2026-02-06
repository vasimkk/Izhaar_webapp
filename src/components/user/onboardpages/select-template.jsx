import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import codeImg from "../../../assets/images/welcome/code.png";
import complimentImg from "../../../assets/images/welcome/compliment.png";
import confessImg from "../../../assets/images/welcome/confess.png";
import exploreImg from "../../../assets/images/welcome/explore.png";

export default function SelectTemplate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      title: "Confess Feelings",
      description: "Express your heartfelt emotions",
      img: confessImg,
      buttonText: "Confess Now ➜"
    },
    {
      id: 2,
      title: "Got a Code?",
      description: "Open a confession sent to you",
      img: codeImg,
      buttonText: "Open Code ➜"
    },
    {
      id: 3,
      title: "Compliment",
      description: "Appreciate someone special",
      img: complimentImg,
      buttonText: "Send Love ➜"
    },
    {
      id: 4,
      title: "Explore",
      description: "Discover what Izhaar can do",
      img: exploreImg,
      buttonText: "Start Exploring ➜"
    },
  ];

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template.id);
    try {
      setLoading(true);
      const response = await api.post("/user/template-selection", {
        templateId: template.id,
        templateTitle: template.title,
      });
      navigate("/user/dashboard", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save selection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-10"
      style={{
        background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
        backgroundAttachment: 'fixed'
      }}>

      {/* Animation Styles */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(110vh) translateX(0) scale(0.8); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translateY(50vh) translateX(20px) scale(1.1); }
          100% { transform: translateY(-10vh) translateX(-20px) scale(0.8); opacity: 0; }
        }
        @keyframes sparkle-blink {
          0%, 100% { opacity: 0.3; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .love-icon {
          position: absolute;
          z-index: 0;
          filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.5));
        }
      `}</style>

      {/* Animated Background Icons (Hearts, Letters, Rings) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden fixed h-full w-full">
        {/* Floating Icons with negative delay */}
        {[...Array(20)].map((_, i) => {
          const iconType = i % 4; // 0: Heart, 1: Letter, 2: Ring, 3: Star
          return (
            <div
              key={`icon-${i}`}
              className="love-icon"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 30 + 20}px`,
                animation: `float-up ${Math.random() * 15 + 10}s linear infinite -${Math.random() * 15}s`,
                opacity: Math.random() * 0.5 + 0.3,
                color: ['#fb7185', '#e879f9', '#60a5fa', '#fcd34d'][Math.floor(Math.random() * 4)] // Pink, Purple, Blue, Gold
              }}
            >
              {iconType === 0 && (
                // Heart
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
              {iconType === 1 && (
                // Envelope/Letter
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              )}
              {iconType === 2 && (
                // Ring/Circle
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              )}
              {iconType === 3 && (
                // Star/Sparkle
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                </svg>
              )}
            </div>
          );
        })}

        {/* Twinkling Stars Background */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white rounded-full z-0"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2}px`,
              height: `${Math.random() * 2}px`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `sparkle-blink ${Math.random() * 4 + 3}s ease-in-out infinite -${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="pt-6 md:pt-10 px-4 md:px-5 pb-8 md:pb-12 flex flex-col items-center text-center gap-2">
          <h3 className="text-2xl md:text-3xl lg:text-4xl text-white font-bold drop-shadow-md">
            What inspired your visit?
          </h3>
          <p className="text-purple-200 text-sm md:text-base">Select an option to personalize your experience</p>
        </div>

        {/* TEMPLATE OPTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full px-2 md:px-4">
          {templates.map((template) => (
            <div key={template.id} className="flex flex-col gap-4 group">
              {/* Card */}
              <div
                className="relative overflow-hidden rounded-3xl transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(233,30,99,0.3)] shadow-xl border border-white/10 bg-white/5 backdrop-blur-md"
              >
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <img
                    src={template.img}
                    alt={template.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/90 via-transparent to-transparent" />

                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-bold text-xl mb-1 drop-shadow-lg">{template.title}</h4>
                    <p className="text-purple-200 text-xs opacity-90">{template.description}</p>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => handleTemplateSelect(template)}
                disabled={loading && selectedTemplate === template.id}
                className={`relative w-full flex justify-center items-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm md:text-base shadow-lg transition-all duration-300 overflow-hidden ${selectedTemplate === template.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white ring-2 ring-pink-400 scale-[1.02]'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md hover:scale-[1.02]'
                  }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading && selectedTemplate === template.id ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : selectedTemplate === template.id ? (
                    <>Selected ✓</>
                  ) : (
                    template.buttonText
                  )}
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* INFO TEXT */}
        <p className="text-center text-xs md:text-sm text-purple-300/80 mt-10 md:mt-12 px-4 md:px-6 leading-relaxed">
          Your selection helps us personalize your Izhaar experience
        </p>
      </div>
    </div>
  );
}