// --- CANVA-STYLE LETTER EDITOR (MODERN SINGLE PAGE) ---
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config/config";
import { useLetter } from "../../../context/LetterContext";
import bg1 from '../../../assets/temp/letter_01.jpeg';
import bg2 from '../../../assets/temp/letter_02.jpeg';
import bg3 from '../../../assets/temp/letter_03.jpeg';
import bg4 from '../../../assets/temp/letter_04.jpeg';

const TEMPLATES = [
  { id: "1", title: "Romantic Pink", bg: bg1, border: "border-[#ffb6b9]" },
  { id: "2", title: "Rose Love", bg: bg2, border: "border-[#e75480]" },
  { id: "3", title: "Cute Couple", bg: bg3, border: "border-[#a3d8f4]" },
  { id: "4", title: "Classic Letter", bg: bg4, border: "border-[#deb887]" },
];

export default function WritePromptScreen() {
  const { setLetter } = useLetter();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    senderName: "",
    receiverName: "",
    tone: "Love letter ❤️",
    attributes: "",
    moment: ""
  });

  const [selectedTemplate, setSelectedTemplate] = useState("1");
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    if (!formData.receiverName.trim()) {
      alert("Please enter receiver's name");
      return;
    }

    setLoading(true);

    try {
      const fullPrompt = `
Write a ${formData.tone} letter.

Language rules:
- Use ONLY ONE language
- If the user's input is English, write fully in English
- If the input contains Hinglish/Hindi, write fully in Hinglish
- Do NOT mix languages

Sender: ${formData.senderName || "Anonymous"}
Receiver: ${formData.receiverName}

What I love about them:
${formData.attributes}

Special memory:
${formData.moment}

Writing rules:
- Maximum 120 words
- Sound like a real human, not a poem or AI
- Avoid dramatic openings like "My Dearest"
- No forced poetry, shayari, or jokes
- Emotion should feel natural and personal
- Emojis are optional (max 2) only if they feel natural
- Flow like a handwritten letter or WhatsApp message
- Simple, warm, emotionally honest language

The letter must feel genuine, personal, and real.
`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: fullPrompt }],
          },
        ],
      };

      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.finalLetter) {
        alert("AI could not generate a letter.");
        setLoading(false);
        return;
      }

      setGeneratedLetter(data.finalLetter);
      setLetter(data.finalLetter);
      setShowPreview(true);
      setLoading(false);
    } catch (err) {
      alert("Failed to generate letter.");
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate(`/user/LetterIzhaar/final?templateId=${selectedTemplate}&letter=${encodeURIComponent(generatedLetter || "")}`);
  };

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate);

  // PREVIEW SCREEN
  if (showPreview && generatedLetter) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {[...Array(30)].map((_, i) => {
            const colors = ['#E91E63', '#9C27B0', '#3B82F6', '#FF5722', '#EC407A'];
            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const duration = Math.random() * 4 + 3;
            const delay = Math.random() * 2;
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: `${top}%`,
                  background: colors[Math.floor(Math.random() * colors.length)],
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  boxShadow: `0 0 ${size * 2}px ${colors[Math.floor(Math.random() * colors.length)]}`,
                  animation: `floatParticle ${duration}s linear infinite`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}
        </div>

        <style jsx>{`
          @keyframes floatParticle {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
            25% { transform: translate(10px, -20px) scale(1.2); opacity: 1; }
            50% { transform: translate(-5px, -40px) scale(0.8); opacity: 0.6; }
            75% { transform: translate(15px, -25px) scale(1.1); opacity: 0.9; }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)' }}>
          <div className="w-full max-w-2xl" style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center italic bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
              Your Letter ✨
            </h2>

            {/* Letter Preview */}
            <div className="bg-white/95 rounded-2xl p-8 md:p-10 shadow-2xl mb-6 border-2 border-[#E91E63]/30 min-h-96">
              <img src={currentTemplate.bg} alt="Template" className="w-full h-64 object-cover rounded-lg mb-6" />
              <p
                className="text-[#2D1B4E] text-base md:text-lg leading-relaxed whitespace-pre-line"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {generatedLetter}
              </p>
            </div>

            {/* Template Selector (post-generation) */}
            <div className="bg-white/95 rounded-2xl p-6 shadow-2xl border-2 border-[#E91E63]/20 mb-6">
              <h4 className="text-lg font-semibold mb-4 text-center text-[#2D1B4E]">Pick a style</h4>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTemplate === template.id
                        ? 'border-[#E91E63] bg-[#E91E63]/10 shadow-lg scale-105'
                        : 'border-[#9C27B0]/30 hover:border-[#9C27B0]/60 bg-white/80'
                    }`}
                  >
                    <div
                      className="w-full h-28 rounded-md mb-2 bg-cover bg-center"
                      style={{ backgroundImage: `url(${template.bg})` }}
                    />
                    <div className="text-xs md:text-sm font-semibold text-[#2D1B4E] text-center truncate">
                      {template.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setGeneratedLetter(null);
                }}
                className="flex-1 rounded-xl px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                  boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)'
                }}
              >
                ← Edit Letter
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 rounded-xl px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                  boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)'
                }}
              >
                Continue → 
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN EDITOR SCREEN
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background with Gradient */}
      <div style={{ background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)' }} className="fixed inset-0" />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => {
          const colors = ['#E91E63', '#9C27B0', '#3B82F6', '#FF5722', '#EC407A'];
          const size = Math.random() * 8 + 4;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const duration = Math.random() * 4 + 3;
          const delay = Math.random() * 2;
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                background: colors[Math.floor(Math.random() * colors.length)],
                borderRadius: '50%',
                pointerEvents: 'none',
                boxShadow: `0 0 ${size * 2}px ${colors[Math.floor(Math.random() * colors.length)]}`,
                animation: `floatParticle ${duration}s linear infinite`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          25% { transform: translate(10px, -20px) scale(1.2); opacity: 1; }
          50% { transform: translate(-5px, -40px) scale(0.8); opacity: 0.6; }
          75% { transform: translate(15px, -25px) scale(1.1); opacity: 0.9; }
        }
        @keyframes fadeInLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-stretch justify-center px-4 sm:px-6 lg:px-8">
        {/* FORM INPUTS ONLY (template selection happens after generation) */}
        <div className="w-full max-w-xl mx-auto bg-white/95 rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-[#E91E63]/20" style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 italic bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#3B82F6] bg-clip-text text-transparent">
              Letter Details
            </h2>
            <p className="text-sm text-[#6B5B8E] mb-6">Fill in the details to generate your letter</p>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Sender Name */}
              <div>
                <label className="block text-sm font-semibold text-[#2D1B4E] mb-2">
                  Your Name <span className="text-xs text-[#9C27B0]">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Your name or Anonymous"
                  value={formData.senderName}
                  onChange={(e) => handleInputChange('senderName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#E91E63]/20 focus:border-[#E91E63] focus:bg-white/95 outline-none transition text-[#2D1B4E] placeholder-[#9C27B0]/50"
                />
              </div>

              {/* Receiver Name */}
              <div>
                <label className="block text-sm font-semibold text-[#2D1B4E] mb-2">
                  Their Name <span className="text-xs text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah, My Love..."
                  value={formData.receiverName}
                  onChange={(e) => handleInputChange('receiverName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#E91E63]/20 focus:border-[#E91E63] focus:bg-white/95 outline-none transition text-[#2D1B4E] placeholder-[#9C27B0]/50"
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-semibold text-[#2D1B4E] mb-2">
                  Letter Tone
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#E91E63]/20 focus:border-[#E91E63] focus:bg-white/95 outline-none transition text-[#2D1B4E] bg-white"
                >
                  <option>Love letter ❤️</option>
                  <option>Funny letter 😂</option>
                  <option>Flirty letter 😉</option>
                  <option>Sorry letter</option>
                </select>
              </div>

              {/* Attributes */}
              <div>
                <label className="block text-sm font-semibold text-[#2D1B4E] mb-2">
                  What do you love about them?
                </label>
                <textarea
                  placeholder="e.g. Their smile, kindness, patience..."
                  value={formData.attributes}
                  onChange={(e) => handleInputChange('attributes', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#E91E63]/20 focus:border-[#E91E63] focus:bg-white/95 outline-none transition text-[#2D1B4E] placeholder-[#9C27B0]/50 min-h-20 resize-none"
                />
              </div>

              {/* Special Memory */}
              <div>
                <label className="block text-sm font-semibold text-[#2D1B4E] mb-2">
                  Special Memory to Include
                </label>
                <textarea
                  placeholder="e.g. Our first meeting, late-night talks..."
                  value={formData.moment}
                  onChange={(e) => handleInputChange('moment', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#E91E63]/20 focus:border-[#E91E63] focus:bg-white/95 outline-none transition text-[#2D1B4E] placeholder-[#9C27B0]/50 min-h-20 resize-none"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-8 rounded-xl px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)'
              }}
            >
              {loading ? "✨ Writing Your Letter..." : "Generate Letter ✨"}
            </button>
          </div>
      </div>
    </div>
  );
}
