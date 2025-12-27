import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function SelectTemplate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      title: "I want to confess my feelings",
      color: "#FFB3BA",
      emoji: "💕",
      description: "Express your heartfelt emotions",
    },
    {
      id: 2,
      title: "I received an IZHAAR code",
      color: "#BAA5FF",
      emoji: "🔐",
      description: "Open a confession sent to you",
    },
    {
      id: 3,
      title: "I want to compliment a friend",
      color: "#AED8FF",
      emoji: "🎉",
      description: "Appreciate someone special",
    },
    {
      id: 4,
      title: "I want to explore",
      color: "#FFE4A3",
      emoji: "🌟",
      description: "Discover what Izhaar can do",
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-xl mx-auto">
        {/* HEADER */}
        <div className="pt-16 px-5 pb-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome to Izhaar 💕</h1>
          <p className="text-base text-gray-600 text-center">Choose what you'd like to do</p>
        </div>
        {/* TEMPLATE OPTIONS */}
        <div className="flex flex-col gap-4 px-5">
          {templates.map((template) => (
            <button
              key={template.id}
              className={`relative flex items-center justify-between rounded-2xl p-6 min-h-[100px] shadow-md transition-all border-2 ${selectedTemplate === template.id ? 'border-pink-500' : 'border-transparent'}`}
              style={{ backgroundColor: template.color }}
              onClick={() => handleTemplateSelect(template)}
              disabled={loading}
            >
              <div className="flex-1 mr-4 text-left">
                <div className="text-lg font-bold text-gray-900 mb-1">{template.title}</div>
                <div className="text-sm text-gray-700 leading-5">{template.description}</div>
              </div>
              <div className="text-4xl">{template.emoji}</div>
              {loading && selectedTemplate === template.id && (
                <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                </div>
              )}
            </button>
          ))}
        </div>
        {/* INFO TEXT */}
        <p className="text-center text-sm text-gray-400 mt-8 px-10 leading-5">Your selection helps us personalize your Izhaar experience 💖</p>
      </div>
    </div>
  );
}

