import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import bgimg from "../../../assets/images/bg.png";
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
      title: "I want to confess my feelings",
      description: "Express your heartfelt emotions",
      img: confessImg,
    },
    {
      id: 2,
      title: "I received an IZHAAR code",
      description: "Open a confession sent to you",
      img: codeImg,
    },
    {
      id: 3,
      title: "I want to compliment a friend",
      description: "Appreciate someone special",
      img: complimentImg,
    },
    {
      id: 4,
      title: "I want to explore",
      description: "Discover what Izhaar can do",
      img: exploreImg,
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
      // Navigate to dashboard with replace (no back button)
      navigate("/user/dashboard", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save selection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src={bgimg}
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>
      <div className="w-full max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="pt-10 px-5 pb-2 flex flex-col items-center text-center gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
            Welcome to IZHAAR Love
          </h1>
          <p className="text-base md:text-lg text-white/80">Happy to see you here! What inspired your visit?</p>
        </div>
        {/* TEMPLATE OPTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-2">
          {templates.map((template) => (
            <button
              key={template.id}
              className={`group relative flex flex-col rounded-3xl p-4 overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-pink-400/70 scale-[1.02] border-pink-500'
                  : 'hover:scale-[1.02] border-transparent'
              }`}
              onClick={() => handleTemplateSelect(template)}
              disabled={loading}
            >
              <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden rounded-2xl">
                <img src={template.img} alt={template.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4 text-left text-white drop-shadow-lg">
                 
                </div>
              </div>
              <div className="mt-4 w-full text-left flex items-center justify-between">
                <div>
                
                </div>
                {selectedTemplate === template.id && (
                  <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">Selected</span>
                )}
              </div>
              {loading && selectedTemplate === template.id && (
                <div className="absolute inset-0 bg-black/30  flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                </div>
              )}
            </button>
          ))}
        </div>
        {/* INFO TEXT */}
        <p className="text-center text-sm text-white/70 px-6 leading-5">Your selection helps us personalize your Izhaar experience</p>
      </div>
    </div>
  );
}
